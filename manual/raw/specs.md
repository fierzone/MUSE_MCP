Đã test thật: tạo 2 ảnh (1:1 và 9:16) + 1 video 9:16, rồi đo bằng ffprobe. Kết quả dưới đây phân rõ phần đo thực tế và phần chưa test.

A. VIDEO

1. Độ dài clip

✅ Đo thực tế: đúng 10.00 giây, không chọn được (5s/8s không có). Tài liệu ghi rõ độ dài không chỉnh được.

2. Tổng thời lượng khi ghép

❓ Không công bố giới hạn. Ghép thủ công bằng ffmpeg nên về kỹ thuật không có trần cố định — nhưng chưa test video dài (vd 5–10 phút).

3. Tỉ lệ khung

✅ Test 9:16 → ra đúng 720×1280 chuẩn dọc.
❓ 16:9, 1:1, 4:5, 3:4...: chỉ mô tả trong prompt, chưa test từng tỉ lệ.

4. Độ phân giải

✅ Đo thực tế: 720×1280 (720p dọc). Không chọn được độ phân giải.
❓ Chưa từng thấy bản 1080p từ công cụ — nhiều khả năng không có.

5. FPS / codec

✅ Đo thực tế: 24 fps, container MP4, video H.264 (yuv420p), audio AAC mono 24 kHz.

6. Dung lượng / upscale

✅ Đo thực tế: 1 clip 10s ≈ 4.06 MB (~3.2 Mbps).
Upscale AI tích hợp: không có. Phóng lên 1080p/4K hậu kỳ được nhưng không thêm chi tiết thật.
B. ẢNH

7. Độ phân giải

✅ Đo thực tế: vuông 1600×1600; dọc 9:16 1152×2048.
Không chọn số pixel trực tiếp — độ phân giải thay đổi theo tỉ lệ yêu cầu.

8. Tỉ lệ / định dạng / dung lượng

✅ Test 1:1 và 9:16 đều ra đúng tỉ lệ. Định dạng mặc định webp; có thể yêu cầu png/jpg/jpeg.
✅ Dung lượng đo được: ~443 KB (1152×2048), ~747 KB (1600×1600).

9. Số lượng / upscale

✅ Tối đa 4 ảnh mỗi lần yêu cầu (giới hạn công cụ).
Upscale AI tích hợp: không có.

Tóm lại cho tài liệu của bạn: số liệu video (10s / 720p / 24fps / H.264+AAC / ~4MB) và ảnh (1600², 1152×2048, webp, tối đa 4 ảnh/lượt) là chắc chắn. Các tỉ lệ video khác ngoài 9:16 và khả năng 1080p là cần test thêm — báo mình nếu cần chạy test bổ sung.