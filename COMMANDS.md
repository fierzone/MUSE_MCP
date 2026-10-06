# ⚡ SỔ TAY LỆNH & PROMPT MẪU — MUSE-CHAT-MCP

> Tổng hợp lệnh thực thi kèm Prompt mẫu thực tế giúp bạn dễ hình dung và sử dụng ngay.

---

## 🌐 0. GIAO DIỆN WEB STUDIO DASHBOARD (KHÔNG CẦN GÕ LỆNH)

```bash
# Khởi chạy Giao diện Web Dashboard trực quan
npm run web
# Hoặc:
npm start
```
> 🔗 **Mở trình duyệt tại:** [http://localhost:8787](http://localhost:8787)
> Giao diện Web cung cấp đầy đủ các tab: **Remotion Video Studio**, **Muse AI Chat Studio**, **Media & Download Manager**, và **System Status Inspector**.

---

## 1. 🎬 TẠO VIDEO TỰ ĐỘNG (REMOTION + AI VOICE)

### 🔹 Cách 1: Render video từ chủ đề sẵn có
```bash
# Render video mẫu mặc định về Docker
npm run gen-video

# Render video với tên thương hiệu (Brand Header) tùy chỉnh
npm run gen-video -- --channel "FierZone"

# Render video mẫu theo topic DemoTopic
npm run gen-video -- --topic DemoTopic --channel "Thương Hiệu Mới"
```

### 🔹 Cách 2: Truyền Prompt để Muse AI tự viết kịch bản 6 cảnh + Tạo Voiceover + Render MP4
```bash
# Prompt 1: Giải thích chủ đề Công nghệ (Kubernetes)
npm run gen-video -- --prompt "Giải thích khái niệm Kubernetes và lý do tại sao Dev nên dùng trong 6 cảnh ngắn" --channel "FierZone"

# Prompt 2: Giải thích bài học Lập trình (Git & GitHub)
npm run gen-video -- --prompt "Giải thích sự khác nhau giữa Git và GitHub cho người mới học" --channel "FierZone"

# Prompt 3: Chia sẻ mẹo tối ưu Code (Clean Code)
npm run gen-video -- --prompt "Chia sẻ 3 nguyên tắc viết Clean Code quan trọng nhất"
```
> 📁 **Kết quả:** File video `.mp4` sẽ được xuất tự động vào thư mục `./downloads/`.

---

## 2. 💬 CHAT & HỎI ĐÁP QUA DÒNG LỆNH (`muse-cli.mjs`)

### 🔹 Hỏi đáp nhanh với Muse AI
```bash
# Prompt hỏi kiến thức Lập trình
npm run muse -- "Viết một hàm JavaScript kiểm tra một chuỗi có phải là Email hợp lệ không"

# Prompt nhờ tối ưu & giải thích Code
npm run muse -- "Giải thích sự khác nhau giữa Promise.all và Promise.allSettled trong JS"
```

### 🔹 Hỏi đáp kèm File đính kèm (Ảnh / Video)
```bash
# Prompt phân tích giao diện từ ảnh
npm run muse -- -f ./assets/demo-preview.png "Hãy đánh giá bố cục thiết kế và màu sắc của giao diện video trong ảnh này"

# Prompt review file kịch bản / tài liệu
npm run muse -- -f ./README.md "Tóm tắt 3 tính năng quan trọng nhất của dự án này"
```

---

## 3. 🎥 YÊU CẦU MUSE AI TẠO VIDEO TRÊN WEB & TẢI VỀ MÁY

```bash
# Bước 1: Ra lệnh cho Muse AI tạo video 9:16 trên web
npm run muse -- "Tạo video 9:16 hình ảnh một thành phố tương lai rực rỡ đèn neon ban đêm"

# Bước 2: Tải video mà Muse AI vừa tạo về thư mục downloads
node muse-cli.mjs --media --download --dir ./downloads
```

---

## 4. 🌐 GỌI API SANG OPENAI HTTP SHIM (PORT 8787)

### 🔹 Dùng `curl` gửi Prompt từ Terminal khác
```bash
curl http://127.0.0.1:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "muse-spark-1.3",
    "messages": [
      {"role": "user", "content": "Tóm tắt 3 ưu điểm lớn nhất của Docker trong 3 gạch đầu dòng"}
    ]
  }'
```

### 🔹 Dùng Python SDK OpenAI
```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:8787/v1", api_key="muse-local")

response = client.chat.completions.create(
    model="muse-spark-1.3",
    messages=[
        {"role": "user", "content": "Gợi ý 5 tiêu đề video TikTok cực thu hút về chủ đề Docker"}
    ]
)

print(response.choices[0].message.content)
```

---

## 5. 🛠️ CÁC LỆNH QUẢN TRỊ & HỆ THỐNG

```bash
# 1. Khởi động Chrome Debug Port (Tránh bị hỏi login lại)
.\start-chrome-debug.bat

# 2. Kiểm tra trạng thái trình duyệt và login
npm run selftest

# 3. Chạy Server MCP + HTTP Shim
npm start

# 4. Kiểm tra thông số kỹ thuật Video đã render (Resolution 9:16, FPS, Codecs)
node manual/qc-video.mjs ./downloads/DockerExplainer.mp4 ./downloads/qc_frames
```
