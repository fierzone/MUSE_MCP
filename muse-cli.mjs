#!/usr/bin/env node
/**
 * muse-cli.mjs — fast command-line access to Meta Muse via the local OpenAI shim.
 *
 *   node muse-cli.mjs "Explain X"                 # streams the reply to stdout
 *   echo "<file contents>" | node muse-cli.mjs -s "You are a code reviewer"
 *   node muse-cli.mjs --json "hi"                 # full OpenAI JSON instead
 *
 * It talks to the OpenAI shim (default http://127.0.0.1:8787/v1). If nothing is
 * listening, it auto-starts `muse-server.mjs --serve-only` and shuts it down after.
 * Set MUSE_CLI_AUTOSTART=0 to disable that.
 *
 * Options:
 *   -s, --system <text>     system prompt
 *   -m, --model <id>        model id (default muse-spark-1.3)
 *   -t, --timeout <ms>      request timeout (default 180000)
 *       --new-thread        start a fresh Muse thread first
 *       --no-stream         wait for the full reply, then print it
 *       --json              print the raw OpenAI response JSON
 *       --base <url>        shim base url (default env MUSE_SHIM_URL or .../v1)
 *   -h, --help              show this help
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SERVER = path.join(__dirname, 'muse-server.mjs')

const argv = process.argv.slice(2)
const opt = { model: 'muse-spark-1.3', timeout: 180000, stream: true, json: false, newThread: false, system: '', files: [], chat: undefined, listChats: false, read: undefined, query: undefined, media: undefined, download: false, dir: undefined }
const positional = []
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '-h' || a === '--help') { printHelp(); process.exit(0) }
  else if (a === '-s' || a === '--system') opt.system = argv[++i] || ''
  else if (a === '-m' || a === '--model') opt.model = argv[++i] || opt.model
  else if (a === '-t' || a === '--timeout') opt.timeout = Number(argv[++i]) || opt.timeout
  else if (a === '--new-thread') opt.newThread = true
  else if (a === '--no-stream') opt.stream = false
  else if (a === '--json') opt.json = true
  else if (a === '-f' || a === '--file' || a === '--image') opt.files.push(argv[++i])
  else if (a === '--chat') opt.chat = argv[++i]
  else if (a === '--list-chats') opt.listChats = true
  else if (a === '--query') opt.query = argv[++i]
  else if (a === '--media') { const nxt = argv[i + 1]; if (nxt && !nxt.startsWith('-')) { opt.media = nxt; i++ } else opt.media = '' }
  else if (a === '--download') opt.download = true
  else if (a === '--dir') opt.dir = argv[++i]
  else if (a === '--read') { const nxt = argv[i + 1]; if (nxt && !nxt.startsWith('-')) { opt.read = nxt; i++ } else opt.read = '' }
  else if (a === '--base') opt.base = argv[++i]
  else if (a === '--') positional.push(...argv.slice(i + 1)), (i = argv.length)
  else positional.push(a)
}

function printHelp() {
  process.stdout.write(
    'Usage: muse-cli [options] "prompt"\n' +
      '       echo "prompt" | muse-cli [options]\n\n' +
      'Options: -s/--system, -m/--model, -t/--timeout, --new-thread, --no-stream, --json, --base\n' +
      '         -f/--file <path|url>   attach an image/video/file (repeatable)\n' +
      '         --chat <name|index|url>  send to a specific Muse chat (default: main chat)\n' +
      '         --list-chats           list Muse chats and exit\n' +
      '         --query <text>         filter --list-chats by title\n' +
      '         --read [<name|index|url>]  read a chat (current chat if omitted) and exit\n' +
      '         --media [<name|index|url>]  list media links in a chat and exit\n' +
      '         --download [--dir <dir>]    with --media, download the media to disk\n',
  )
}

const BASE = (opt.base || process.env.MUSE_SHIM_URL || 'http://127.0.0.1:8787/v1').replace(/\/$/, '')
const ORIGIN = BASE.replace(/\/v1$/, '')

async function readStdin() {
  if (process.stdin.isTTY) return ''
  const chunks = []
  for await (const c of process.stdin) chunks.push(c)
  return Buffer.concat(chunks).toString('utf8')
}

async function healthy() {
  try {
    const r = await fetch(ORIGIN + '/health', { signal: AbortSignal.timeout(1500) })
    return r.ok
  } catch {
    return false
  }
}

let child = null
async function ensureShim() {
  if (await healthy()) return
  if (process.env.MUSE_CLI_AUTOSTART === '0') {
    throw new Error(`No shim at ${BASE}. Start it: node muse-server.mjs --serve-only`)
  }
  process.stderr.write(`[muse-cli] starting shim (${SERVER}) ...\n`)
  child = spawn(process.execPath, [SERVER, '--serve-only'], { cwd: __dirname, stdio: 'ignore' })
  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    if (await healthy()) return
    await new Promise((r) => setTimeout(r, 400))
  }
  throw new Error('shim did not become ready in 30s')
}

function cleanup() { if (child) { try { child.kill() } catch {} child = null } }

async function main() {
  // Session reading / media modes (no prompt).
  if (opt.listChats || opt.read !== undefined || opt.media !== undefined) {
    await ensureShim()
    if (opt.listChats) {
      const u = BASE + '/muse/chats' + (opt.query ? '?query=' + encodeURIComponent(opt.query) : '')
      const d = await (await fetch(u)).json()
      for (let i = 0; i < (d.chats || []).length; i++) process.stdout.write(`${i}\t${d.chats[i].active ? '*' : ' '}\t${d.chats[i].title}\n`)
    }
    if (opt.read !== undefined) {
      const u = BASE + '/muse/chat' + (opt.read ? '?target=' + encodeURIComponent(opt.read) : '')
      const d = await (await fetch(u)).json()
      if (opt.json) process.stdout.write(JSON.stringify(d, null, 2) + '\n')
      else for (const m of d.messages || []) process.stdout.write(`[${m.role}] ${m.text}\n`)
    }
    if (opt.media !== undefined) {
      const qs = []
      if (opt.media) qs.push('target=' + encodeURIComponent(opt.media))
      if (opt.download) qs.push('download=1')
      if (opt.dir) qs.push('dir=' + encodeURIComponent(opt.dir))
      const d = await (await fetch(BASE + '/muse/media' + (qs.length ? '?' + qs.join('&') : ''))).json()
      if (opt.json) process.stdout.write(JSON.stringify(d, null, 2) + '\n')
      else {
        for (const u of d.urls || []) process.stdout.write(u + '\n')
        if (d.downloads) for (const s of d.downloads.saved || []) process.stdout.write((s.file ? `saved ${s.file}` : `FAIL ${s.url} ${s.error}`) + '\n')
      }
    }
    return
  }

  let prompt = positional.join(' ').trim()
  if (!prompt) prompt = (await readStdin()).trim()
  if (!prompt && !opt.files.length) { printHelp(); process.exit(2) }

  await ensureShim()

  const messages = []
  if (opt.system) messages.push({ role: 'system', content: opt.system })
  messages.push({ role: 'user', content: prompt })

  const headers = { 'content-type': 'application/json' }
  if (opt.newThread) headers['x-muse-thread'] = 'new'
  headers['x-muse-timeout-ms'] = String(opt.timeout)

  const res = await fetch(BASE + '/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: opt.model, messages, stream: opt.stream, files: opt.files.length ? opt.files : undefined, chat: opt.chat !== undefined ? opt.chat : undefined }),
  })

  if (!opt.stream) {
    const j = await res.json()
    if (j.error) { process.stderr.write('muse error: ' + JSON.stringify(j.error) + '\n'); process.exit(1) }
    const msg = j.choices?.[0]?.message
    if (opt.json) process.stdout.write(JSON.stringify(j, null, 2) + '\n')
    else process.stdout.write((typeof msg?.content === 'string' ? msg.content : JSON.stringify(msg)) + '\n')
    return
  }

  const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = ''
  let text = ''
  while (true) {
    const { done, value } = await reader.read(); if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split('\n'); buf = lines.pop()
    for (const l of lines) {
      if (!l.startsWith('data:')) continue
      const d = l.slice(5).trim(); if (d === '[DONE]') continue
      try {
        const j = JSON.parse(d); const c = j.choices?.[0]
        if (c?.delta?.content) { text += c.delta.content; if (!opt.json) process.stdout.write(c.delta.content) }
      } catch {}
    }
  }
  if (opt.json) process.stdout.write(JSON.stringify({ model: opt.model, content: text }) + '\n')
  else process.stdout.write('\n')
}

main()
  .catch((e) => { process.stderr.write('[muse-cli] ' + (e && e.message ? e.message : String(e)) + '\n'); process.exitCode = 1 })
  .finally(() => { cleanup(); setTimeout(() => process.exit(process.exitCode || 0), 50) })
