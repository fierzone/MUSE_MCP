/**
 * interview.mjs — interview Meta Muse (as a regular user) about its video / editing /
 * effects / image / content capabilities, and save the raw answers.
 *
 * Run:  node manual/interview.mjs
 * Output: manual/raw/batch-1.md ... batch-N.md  (+ a new side chat titled "Muse Manual")
 *
 * Re-run any time to refresh the manual (Muse's capabilities change).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const driverUrl = pathToFileURL(path.join(__dirname, '..', 'muse-driver.mjs')).href
process.env.MUSE_CDP = process.env.MUSE_CDP || 'http://127.0.0.1:9222'
const { driver } = await import(driverUrl)

const RAW_DIR = path.join(__dirname, 'raw')
fs.mkdirSync(RAW_DIR, { recursive: true })

const HEAD = 'Chào Muse, mình đang viết tài liệu hướng dẫn về khả năng của bạn để làm video/nội dung. Trả lời NGẮN GỌN, gạch đầu dòng, lần lượt từng câu hỏi.'

const batches = [
  `${HEAD}\n\n1. Bạn tạo được video ở những dạng nào (text→video, ảnh→video, sửa video có sẵn)?\n2. Mỗi clip dài tối đa bao nhiêu giây? Có ghép nhiều clip thành video dài không, tổng tối đa?\n3. Các tỉ lệ khung (9:16, 16:9, 1:1) và độ phân giải tối đa?\n4. Âm thanh: có giọng nói (voiceover) tiếng Việt không? nhạc nền không? phụ đề không?\n5. Có nhận ảnh/video tham chiếu để giữ đúng nhân vật/khuôn mặt không?`,
  `Tiếp, trả lời ngắn gọn từng câu:\n6. Biên tập video: cắt, ghép, đổi thứ tự, thay cảnh được không?\n7. Hiệu ứng: transition, animation, zoom, camera motion, filter/màu — gồm những gì?\n8. Chèn lớp phủ: logo, chữ/text, sticker, số liệu lên video được không?\n9. Có tạo phụ đề/caption tự động và đốt vào video không?\n10. Mình có thể yêu cầu sửa/redo video đã tạo (đổi chi tiết) không?`,
  `Trả lời ngắn gọn:\n11. Tạo ảnh: chất lượng/độ phân giải, tỉ lệ, mỗi lần tối đa bao nhiêu ảnh?\n12. Tạo ảnh từ ảnh tham chiếu để giữ mặt/style — có không?\n13. Chèn chữ/logo vào ảnh? Chữ tiếng Việt có đúng không (hay phải composite)?`,
  `Cuối cùng:\n14. Bạn viết được content gì: caption, script video, hashtag, mô tả, SEO?\n15. Quy trình tốt nhất để ra video tốt: nên mô tả thế nào, chia bước ra sao? cho 1 ví dụ ngắn.\n16. Giới hạn: điều gì bạn KHÔNG làm được? lưu ý bản quyền/nội dung?\n17. Thời gian tạo 1 video / 1 ảnh thường bao lâu?\n18. Xuất/tải: bạn trả link thế nào, link sống bao lâu, tải ở đâu?`,
]

try {
  await driver.launch()
  await driver.newChat() // fresh side chat
  for (let i = 0; i < batches.length; i++) {
    const n = i + 1
    process.stderr.write(`[interview] batch ${n}/${batches.length} ...\n`)
    const r = await driver.chat(batches[i], { timeoutMs: 300000 })
    const body = `## Batch ${n}\n\n**Q:**\n${batches[i]}\n\n**A (Muse):**\n${(r.reply || '').trim()}\n`
    fs.writeFileSync(path.join(RAW_DIR, `batch-${n}.md`), body, 'utf8')
    process.stderr.write(`[interview] batch ${n} done (${(r.reply || '').length} chars, thread ${r.threadUrl})\n`)
  }
  process.stderr.write('[interview] all batches written to ' + RAW_DIR + '\n')
} catch (e) {
  process.stderr.write('[interview] ERR ' + String((e && e.message) || e) + '\n')
  process.exitCode = 1
} finally {
  await driver.close().catch(() => {})
  process.exit(process.exitCode || 0)
}
