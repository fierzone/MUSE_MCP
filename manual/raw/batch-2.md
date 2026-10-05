## Batch 2

**Q:**
Tiếp, trả lời ngắn gọn từng câu:
6. Biên tập video: cắt, ghép, đổi thứ tự, thay cảnh được không?
7. Hiệu ứng: transition, animation, zoom, camera motion, filter/màu — gồm những gì?
8. Chèn lớp phủ: logo, chữ/text, sticker, số liệu lên video được không?
9. Có tạo phụ đề/caption tự động và đốt vào video không?
10. Mình có thể yêu cầu sửa/redo video đã tạo (đổi chi tiết) không?

**A (Muse):**
Được hết — cắt, ghép, đổi thứ tự, thay cảnh: tôi biên tập file video trực tiếp trên máy bằng ffmpeg.
Lúc tạo video (mô tả trong prompt): có thể yêu cầu camera motion, zoom, chuyển động máy quay — nhưng là gợi ý cho AI, không đảm bảo chính xác.
Hậu kỳ (chắc chắn làm được): transition (fade/xfade), zoom/pan kỹ thuật số, chỉnh màu/filter, thay đổi tốc độ.
Được — chèn logo (PNG), chữ/text, số liệu, nhãn dán lên video bằng hậu kỳ.
Chữ do AI "vẽ" trực tiếp trong lúc tạo video thì hay sai chính tả — nên chèn hậu kỳ cho chắc.
Có — tôi chuyển âm thanh thành văn bản, tạo file phụ đề rồi đốt cứng vào video.
Phụ đề tự động theo giọng nói trong video; độ chính xác phụ thuộc chất lượng âm thanh.
Được, 2 cách:
Tạo lại với prompt chỉnh sửa (mỗi lần là một video mới, không sửa từng chi tiết như Photoshop).
Nối tiếp cùng ngữ cảnh video trước qua snapshot để giữ mạch hình ảnh.
Chi tiết nhỏ (màu chữ, vị trí logo, cắt cảnh) thì sửa trực tiếp trên file đã có.
