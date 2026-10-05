# Đo thực tế (ffprobe) — file do Muse tạo

Ngày: 2026-09-30 · Cách làm: `muse-cli --media --download` → `ffprobe`.

## Video (9:16, text→video)
- **704×1248** · H.264 (yuv420p) · **24 fps** · **10.000 s** · AAC mono 24 kHz · MP4 · **~2.9 MB** (~2.3 Mbps)
- Lần khác (ảnh→video): **640×1200** · 24 fps · 10.000 s · ~2.4 MB → **độ phân giải dao động**.

## Ảnh
- 1:1 → **1600×1600** · webp · ~0.45 MB
- 9:16 → **1152×2048** · webp · ~0.36 MB
- Poster của video (jpg): 704×1248
- Tối đa **4 ảnh / lần**.

## Kết luận
- **Video:** 10s cố định, ~704×1248 (**dưới 720p**), 24fps, H.264+AAC, ~2.9 MB/10s. Không chọn được độ phân giải; 1080p chưa từng thấy.
- **Ảnh:** 1:1 = 1600×1600, 9:16 = 1152×2048, mặc định webp.
- Muse tự khai "720×1280" cho video → **sai**; dùng số đo ở trên.
