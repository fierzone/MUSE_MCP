#!/usr/bin/env node
/**
 * muse-openai-shim.mjs
 * ------------------------------------------------------------------
 * OpenAI-compatible HTTP shim over the Muse browser driver.
 *
 *   GET  /v1/models              -> model list
 *   POST /v1/chat/completions    -> OpenAI chat completions (stream + non-stream)
 *   GET  /health                 -> browser/login state
 *
 * Why a shim: Muse has no OpenAI-compatible API (encrypted Noise WebSocket),
 * so we translate OpenAI requests into a prompt sent via muse-driver, then
 * translate the reply back into OpenAI JSON / SSE.
 *
 * Patterns (SSE chunk shape, /v1 error objects, stream headers) mirror
 * Chat2API's deepseek-stream.ts + routes/chat.ts.
 *
 * Streaming is real: chatStream() reports incremental DOM text, which we
 * re-emit as OpenAI deltas (first token appears when Muse starts answering).
 *
 * Prompt-injected tool calling (experimental): if `tools` are supplied, their
 * schemas are embedded in the prompt and Muse is asked to answer with either
 * normal text or {"tool_calls":[{"name","arguments"}]}; the latter is parsed
 * into OpenAI tool_calls.
 * ------------------------------------------------------------------
 */
import http from 'node:http'
import { driver } from './muse-driver.mjs'

const PORT = Number(process.env.MUSE_SHIM_PORT || 8787)
const HOST = process.env.MUSE_SHIM_HOST || '127.0.0.1'
const DEFAULT_TIMEOUT_MS = Number(process.env.MUSE_SHIM_TIMEOUT_MS || 240000)
const MODEL_IDS = (process.env.MUSE_SHIM_MODELS || 'muse-spark-1.3,muse-spark-1.3-contributor,muse')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const log = (...a) => console.error('[muse-shim]', ...a)
const rid = () => `chatcmpl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
const now = () => Math.floor(Date.now() / 1000)
const approxTokens = (s) => Math.max(1, Math.ceil((s || '').length / 4))

// ---------------------------------------------------------------- prompt build

function textOf(content) {
  if (content == null) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((p) => (typeof p === 'string' ? p : p && (p.text ?? p.content ?? '')))
      .filter(Boolean)
      .join('\n')
  }
  return String(content)
}

function buildPrompt(body) {
  const messages = Array.isArray(body.messages) ? body.messages : []
  const system = messages.filter((m) => m.role === 'system').map((m) => textOf(m.content)).filter(Boolean).join('\n\n')

  // Send the latest user (or tool-result) message as a plain message. Roleplay-style
  // role markers ("### USER"/"### ASSISTANT") make Muse push back with "that's a fake
  // transcript", and Muse already keeps its own conversation thread.
  let userText = ''
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.role === 'user' || m.role === 'tool') { userText = textOf(m.content); break }
  }

  const parts = []
  if (system) parts.push(system)

  const tools = Array.isArray(body.tools) ? body.tools : []
  if (tools.length && body.tool_choice !== 'none') {
    const schemas = tools.map((t) => t.function || t).map((f) => ({
      name: f.name,
      description: f.description,
      parameters: f.parameters,
    }))
    parts.push(
      [
        'If the request needs a tool, reply with ONLY this JSON and nothing else:',
        '{"tool_calls":[{"name":"<tool name>","arguments":{ ... }}]}',
        'You are only DECIDING whether a tool call should be made — do NOT perform the action,',
        'do NOT browse, do NOT invent results. Otherwise reply normally. Tool schemas:',
        JSON.stringify(schemas),
      ].join('\n'),
    )
  }

  if (userText) parts.push(userText)
  return parts.join('\n\n').trim()
}

function parseToolCalls(text) {
  if (!text) return null
  const trimmed = text.trim()
  // Accept a bare JSON object or one inside a ```json fence.
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fenced ? fenced[1] : trimmed).trim()
  if (!candidate.startsWith('{') || !candidate.endsWith('}')) return null
  let obj
  try { obj = JSON.parse(candidate) } catch { return null }
  const calls = obj && (obj.tool_calls || obj.toolCalls)
  if (!Array.isArray(calls) || !calls.length) return null
  return calls
    .map((c, i) => {
      const name = c.name || c?.function?.name
      if (!name) return null
      const args = c.arguments ?? c?.function?.arguments ?? {}
      return {
        id: `call_${Date.now().toString(36)}${i}`,
        type: 'function',
        function: { name, arguments: typeof args === 'string' ? args : JSON.stringify(args) },
      }
    })
    .filter(Boolean)
}

// Collect attachments from an OpenAI-style request:
//   - body.files: ["C:\\img.png", "https://.../v.mp4", { url } | { path } | { buffer, name, mimeType }]
//   - message.content parts: { type: "image_url", image_url: { url } } | { type: "input_image", image_url }
//   - message.content parts: { type: "file", file: { file_url | file_data, filename, mime_type } }
function collectFiles(body) {
  const out = []
  if (Array.isArray(body.files)) for (const f of body.files) if (f) out.push(f)
  const messages = Array.isArray(body.messages) ? body.messages : []
  for (const m of messages) {
    if (!Array.isArray(m.content)) continue
    for (const part of m.content) {
      if (!part || typeof part === 'string') continue
      const t = part.type
      if ((t === 'image_url' || t === 'input_image') && part.image_url) {
        out.push({ url: typeof part.image_url === 'string' ? part.image_url : part.image_url.url })
      } else if (t === 'file' && part.file) {
        const f = part.file
        if (f.file_url) out.push({ url: f.file_url })
        else if (f.file_data) {
          const d = String(f.file_data)
          if (/^data:/i.test(d)) out.push({ url: d })
          else out.push({ buffer: d, name: f.filename || 'file', mimeType: f.mime_type || 'application/octet-stream' })
        }
      }
    }
  }
  return out
}

// ---------------------------------------------------------------- responses

const sseHeaders = (res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*',
  })
}
const chunk = (id, model, created, delta, finish = null) =>
  `data: ${JSON.stringify({
    id, object: 'chat.completion.chunk', created, model,
    choices: [{ index: 0, delta, finish_reason: finish }],
  })}\n\n`

function sendError(res, status, message, type = 'invalid_request_error', code = null, param = null) {
  const body = JSON.stringify({ error: { message, type, param, code } })
  if (res.headersSent) { try { res.end() } catch {} return }
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(body)
}

// ---------------------------------------------------------------- handler

async function handleChat(req, res, body) {
  if (!body || typeof body !== 'object') return sendError(res, 400, 'Invalid request body')
  if (!body.model) return sendError(res, 400, 'Missing required field: model', 'invalid_request_error', null, 'model')
  if (!Array.isArray(body.messages) || !body.messages.length) {
    return sendError(res, 400, 'Missing required field: messages', 'invalid_request_error', null, 'messages')
  }

  const model = String(body.model)
  const id = rid()
  const created = now()
  const timeoutMs = Number(req.headers['x-muse-timeout-ms']) || DEFAULT_TIMEOUT_MS
  // Default: continue the current Muse thread and rely on the full transcript we send.
  // Send header `x-muse-thread: new` to start a fresh thread instead.
  const newThread = req.headers['x-muse-thread'] === 'new'
  const prompt = buildPrompt(body)
  const wantTools = Array.isArray(body.tools) && body.tools.length > 0 && body.tool_choice !== 'none'
  const stream = body.stream === true
  const files = collectFiles(body)
  let chat = req.headers['x-muse-chat'] !== undefined ? req.headers['x-muse-chat'] : body.chat
  if (typeof chat === 'string') {
    const s = chat.trim()
    if (!s) chat = undefined
    else if (/^\d+$/.test(s)) chat = Number(s)
  }

  log(`chat model=${model} stream=${stream} tools=${wantTools} files=${files.length} target=${chat !== undefined ? chat : 'current'} promptChars=${prompt.length}`)

  try {
    let finishReason = 'stop'
    if (stream) {
      sseHeaders(res)
      let closed = false
      res.on('close', () => { closed = true })
      const write = (s) => { if (!closed) { try { res.write(s) } catch { closed = true } } }
      write(chunk(id, model, created, { role: 'assistant', content: '' }))

      if (wantTools) {
        // Buffer so we can decide tool_calls vs content before emitting.
        const r = await driver.chat(prompt, { timeoutMs, newThread, files, chat })
        if (r.error) throw new Error(r.error)
        const calls = parseToolCalls(r.reply)
        if (calls && calls.length) {
          const deltas = calls.map((c, i) => ({
            index: i, id: c.id, type: 'function',
            function: { name: c.function.name, arguments: c.function.arguments },
          }))
          write(chunk(id, model, created, { tool_calls: deltas }))
          finishReason = 'tool_calls'
        } else {
          const s = r.reply || ''
          for (let i = 0; i < s.length; i += 60) write(chunk(id, model, created, { content: s.slice(i, i + 60) }))
        }
      } else {
        let emitted = ''
        const r = await driver.chatStream(prompt, {
          timeoutMs, newThread, files, chat,
          onDelta: (full) => {
            const next = full.startsWith(emitted) ? full.slice(emitted.length) : full
            emitted = full
            if (next) write(chunk(id, model, created, { content: next }))
          },
        })
        if (r.error && !emitted) throw new Error(r.error)
      }

      write(chunk(id, model, created, {}, finishReason))
      if (body.stream_options && body.stream_options.include_usage) {
        write(`data: ${JSON.stringify({
          id, object: 'chat.completion.chunk', created, model, choices: [],
          usage: { prompt_tokens: approxTokens(prompt), completion_tokens: 0, total_tokens: approxTokens(prompt) },
        })}\n\n`)
      }
      write('data: [DONE]\n\n')
      res.end()
      return
    }

    // Non-streaming
    const r = await driver.chat(prompt, { timeoutMs, newThread, files, chat })
    if (r.error && !r.reply) throw new Error(r.error)
    const calls = wantTools ? parseToolCalls(r.reply) : null

    const message = calls && calls.length
      ? { role: 'assistant', content: null, tool_calls: calls }
      : { role: 'assistant', content: r.reply || '' }

    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({
      id, object: 'chat.completion', created, model,
      choices: [{ index: 0, message, finish_reason: calls && calls.length ? 'tool_calls' : 'stop' }],
      usage: {
        prompt_tokens: approxTokens(prompt),
        completion_tokens: approxTokens(r.reply),
        total_tokens: approxTokens(prompt) + approxTokens(r.reply),
      },
    }))
  } catch (err) {
    log('error:', err && err.message)
    sendError(res, 502, `Muse error: ${err && err.message ? err.message : String(err)}`, 'api_error')
  }
}

// ---------------------------------------------------------------- server

function readBody(req, limit = 8 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => {
      data += c
      if (data.length > limit) { reject(new Error('request body too large')); req.destroy() }
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export function startShim({ port = PORT, host = HOST } = {}) {
  const server = http.createServer(async (req, res) => {
    const url = (req.url || '').split('?')[0]
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': '*',
      })
      return res.end()
    }

    try {
      if (req.method === 'GET' && (url === '/health' || url === '/')) {
        let st = { browserRunning: false, loggedIn: false }
        try { st = await driver.status() } catch {}
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        return res.end(JSON.stringify({ ok: true, ...st, models: MODEL_IDS }))
      }

      if (req.method === 'GET' && url === '/v1/models') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        return res.end(JSON.stringify({
          object: 'list',
          data: MODEL_IDS.map((m) => ({ id: m, object: 'model', created: 0, owned_by: 'muse' })),
        }))
      }

      // Session reading (Muse chats): list chats, or read one chat (optionally opening it first).
      if (req.method === 'GET' && url === '/v1/muse/chats') {
        const params = new URL(req.url, 'http://localhost').searchParams
        const data = await driver.listChats(params.get('query') || undefined)
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        return res.end(JSON.stringify(data))
      }

      if (req.method === 'GET' && url === '/v1/muse/chat') {
        const params = new URL(req.url, 'http://localhost').searchParams
        const target = params.get('target')
        if (target) await driver.openChat(/^\d+$/.test(target) ? Number(target) : target)
        const data = await driver.readChat(Number(params.get('max')) || 100)
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        return res.end(JSON.stringify(data))
      }

      if (req.method === 'GET' && url === '/v1/muse/media') {
        const params = new URL(req.url, 'http://localhost').searchParams
        const target = params.get('target')
        const download = params.get('download') === '1' || params.get('download') === 'true'
        const data = await driver.chatMedia(target || undefined, { download, dir: params.get('dir') || undefined })
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        return res.end(JSON.stringify(data))
      }

      if (req.method === 'POST' && url === '/v1/chat/completions') {
        const raw = await readBody(req)
        let body
        try { body = JSON.parse(raw || '{}') } catch { return sendError(res, 400, 'Invalid JSON body') }
        return handleChat(req, res, body)
      }

      sendError(res, 404, `Unknown route: ${req.method} ${url}`, 'invalid_request_error')
    } catch (err) {
      log('unhandled:', err && err.message)
      sendError(res, 500, String(err && err.message || err), 'internal_error')
    }
  })

  server.listen(port, host, () => {
    log(`OpenAI shim listening on http://${host}:${port}/v1  (models: ${MODEL_IDS.join(', ')})`)
  })
  return server
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1].replace(/\\/g, '/')}`).href
if (isMain || process.argv.includes('--standalone')) {
  startShim()
}
