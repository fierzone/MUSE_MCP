/**
 * qc-video.mjs — technical QC for a video (QC3): ffprobe + extract frames for human/vision QC (QC1/QC2).
 * Usage: node manual/qc-video.mjs <video> [outDir]
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const vid = process.argv[2]
if (!vid || !fs.existsSync(vid)) {
  console.error('usage: node manual/qc-video.mjs <video> [outDir]')
  process.exit(2)
}
const outDir = process.argv[3] || path.join(path.dirname(vid), 'qc_frames')
fs.mkdirSync(outDir, { recursive: true })

const ffprobe = process.env.FFPROBE || 'ffprobe'
const ffmpeg = process.env.FFMPEG || 'ffmpeg'

let probe
try {
  probe = JSON.parse(execFileSync(ffprobe, ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate,duration,channels,sample_rate:format=size,bit_rate', '-of', 'json', vid]).toString())
} catch (e) {
  console.error('ffprobe failed (is ffprobe on PATH?)', String(e.message || e))
  process.exit(1)
}
const v = (probe.streams || []).find((s) => s.codec_type === 'video') || {}
const a = (probe.streams || []).find((s) => s.codec_type === 'audio') || {}
const dur = Number(v.duration || 0)
const ratio = v.width && v.height ? (v.width / v.height).toFixed(3) : '?'
const nine16 = v.width && v.height && Math.abs(v.width / v.height - 9 / 16) < 0.03

const tech = {
  file: path.basename(vid),
  resolution: v.width && v.height ? `${v.width}x${v.height}` : '?',
  ratio_9_16: nine16,
  fps: v.r_frame_rate || '?',
  duration_s: dur,
  vcodec: v.codec_name || '?',
  acodec: a.codec_name ? `${a.codec_name} ${a.sample_rate || '?'}Hz ${a.channels || '?'}ch` : 'none',
  size_mb: probe.format && probe.format.size ? +(probe.format.size / 1048576).toFixed(2) : '?',
}
console.log(JSON.stringify(tech, null, 2))

// Extract frames at fractions for QC1 (face) + QC2 (text/safe-zone)
const times = [0.05, 0.25, 0.5, 0.75, 0.95].map((f) => +(dur * f).toFixed(2))
for (const t of times) {
  try {
    execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-ss', String(t), '-i', vid, '-frames:v', '1', path.join(outDir, `qc_t${String(t).replace('.', '_')}.png`)])
  } catch {}
}
console.log('frames -> ' + outDir + ' (' + times.join(', ') + ')')
