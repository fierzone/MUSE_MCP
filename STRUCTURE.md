# 📁 CẤU TRÚC DỰ ÁN & BẢN ĐỒ THƯ MỤC — MUSE-CHAT-MCP

> Tài liệu mô tả chi tiết sơ đồ tổ chức file, chức năng từng thư mục và quy chuẩn lưu trữ tài nguyên trong dự án **Muse-Chat-MCP**.

---

## 🌳 Sơ Đồ Cấu Trúc Tổng Thể

```text
Muse-Chat-MCP/
├── 📄 AGENTS.md               # Quy chuẩn hoạt động & nguyên tắc bất biến cho AI Agent
├── 📄 COMMANDS.md             # Sổ tay lệnh thực thi & prompt mẫu chi tiết
├── 📄 CONTRIBUTING.md         # Hướng dẫn đóng góp mã nguồn cho dự án
├── 📄 README.md               # Tài liệu giới thiệu & hướng dẫn cài đặt chính
├── 📄 STRUCTURE.md            # Bản đồ cấu trúc chi tiết các thư mục (File này)
├── 📄 LICENSE                 # Giấy phép bản quyền MIT
│
├── ⚙️ remotion.config.ts      # Cấu hình render & ffmpeg cho Remotion
├── ⚙️ tsconfig.json           # Cấu hình biên dịch TypeScript
├── ⚙️ eslint.config.mjs       # Cấu hình linter định dạng mã nguồn
├── ⚙️ postcss.config.mjs      # Cấu hình Tailwind CSS / PostCSS
├── ⚙️ package.json            # Quản lý script và gói phụ thuộc dự án
│
├── 🚀 start-chrome-debug.bat  # Script mở Chrome Debug Port 9222 (Windows CMD)
├── 🚀 start-chrome-debug.ps1  # Script mở Chrome Debug Port 9222 (PowerShell)
│
├── 🤖 Core MCP & Shim Drivers (Gốc Repository)
│   ├── muse-driver.mjs        # Điều khiển Chrome Playwright (CDP attach, composer, selector)
│   ├── muse-server.mjs        # MCP Server (7 tools stdio) + Bootstrap OpenAI HTTP Shim (Port 8787)
│   ├── muse-openai-shim.mjs   # OpenAI HTTP Shim API (/v1/models, /v1/chat/completions)
│   ├── muse-cli.mjs           # Công cụ CLI chat & tương tác với Muse AI
│   └── muse-gen-video.mjs     # CLI tự động sinh kịch bản, giọng đọc TTS & render video Remotion
│
├── 🌐 public/                 # Giao diện Web Studio & Tài nguyên tĩnh
│   ├── audio/                 # Giọng đọc AI (.mp3) sinh ra từ Edge-TTS cho từng chủ đề
│   └── web/                   # Mã nguồn Giao diện Dashboard Web (localhost:8787)
│       ├── index.html         # Trang HTML chính của Dashboard
│       ├── app.jsx            # React Dashboard Component (Tabs: Remotion Studio, Muse Chat Studio...)
│       └── styles.css         # Hệ thống Style CSS Dark Red Mascot
│
├── 🎬 src/                    # Mã nguồn Remotion Video Composition
│   ├── index.ts               # Entry point đăng ký Remotion Root
│   ├── index.css              # Style Tailwind/CSS cho các phân cảnh video
│   ├── Root.tsx               # Khai báo danh sách các Composition video
│   ├── uploads/               # Thư mục lưu trữ ảnh & tệp đính kèm do người dùng tải lên
│   ├── ExplainerTemplate/     # Khung Template Video Ngắn 9:16 (Component UI, SubtitleBox...)
│   └── srcVideo/              # Thư mục chứa mã nguồn phân cảnh riêng cho từng video sinh ra
│       ├── DockerExplainer/   # Ví dụ: Các phân cảnh video giải thích Docker
│       └── TwoSumExplainer/   # Ví dụ: Các phân cảnh video giải thích thuật toán Two Sum
│
├── 📦 downloads/              # Thư mục lưu xuất tập trung tất cả Video MP4 & file tải về
├── 📜 scripts/                # Các tiện ích bổ trợ (sinh giọng đọc TTS `generate-tts.ts`...)
└── 🛠️ .agents/skills/        # Thư mục chứa các Skill mở rộng cho AI Coding Assistant
    └── remotion-topic-explainer/
        └── SKILL.md           # Hướng dẫn tạo video explainer 50-60s tự động
```

---

## 📌 Quy Định Vị Trí Lưu Trữ File (Directory Conventions)

1. **Thư mục Đầu Ra Video (`downloads/`)**:
   - Tất cả video render ra từ Remotion (`.mp4`) hoặc media tải về từ Muse AI đều được lưu tập trung tại `./downloads/`.
   - Tránh lưu file video phân tán ra các góc thư mục khác.

2. **Thư mục Tải Lên (`src/uploads/`)**:
   - Khi kéo-thả hoặc đính kèm ảnh/video từ Web Studio Chat, tệp tin sẽ được upload trực tiếp vào `src/uploads/` để vừa phục vụ prompt đính kèm cho Muse AI, vừa cho phép các component Remotion dưới `src/` import / render hình ảnh trực tiếp.

3. **Thư mục Giọng Đọc AI (`public/audio/`)**:
   - Mọi file giọng đọc sinh ra bởi `edge-tts-universal` qua script `scripts/generate-tts.ts` được lưu tự động vào `public/audio/<TopicName>/` kèm theo file `manifest.json` chứa thời lượng frame chính xác cho từng cảnh.

4. **Thư mục Mã Nguồn Phân Cảnh Video (`src/srcVideo/<TopicName>/`)**:
   - Mỗi video explainer mới sẽ tự đóng gói các phân cảnh (`Scene1Hook.tsx`, `Scene2Problem.tsx`,...) và `scenes.json` riêng biệt bên trong `src/srcVideo/<TopicName>/`.

---

## ⚡ Các Lệnh Chạy Chính

| Mục đích | Lệnh thực thi |
| :--- | :--- |
| **Khởi chạy Web Studio Dashboard** | `npm run web` (hoặc `npm start`) |
| **Mở Debug Chrome Port 9222** | `.\start-chrome-debug.bat` |
| **Sinh Video Tự Động từ Prompt** | `npm run gen-video -- --prompt "Giải thích Docker trong 6 cảnh"` |
| **Hỏi Đáp CLI với Muse AI** | `npm run muse -- "Giải thích về Promise trong JS"` |
| **Chạy Kiểm Tra Tự Động** | `npm run selftest` |
