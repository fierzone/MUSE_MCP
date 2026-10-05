<div align="center">

# 🔴 Muse-Chat-MCP

<p align="center">
  <a href="https://github.com/fierzone/MUSE_MCP"><img src="https://img.shields.io/badge/MUSE-MCP-ff2e4c.svg?style=for-the-badge&logo=github&logoColor=white&color=ff2e4c&labelColor=0d0d11" alt="MUSE-MCP"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-ff2e4c.svg?style=for-the-badge&color=ff2e4c&labelColor=0d0d11" alt="License"/></a>
  <img src="https://img.shields.io/badge/node->=18-ff2e4c.svg?style=for-the-badge&logo=nodedotjs&logoColor=white&color=ff2e4c&labelColor=0d0d11" alt="Node version"/>
  <img src="https://img.shields.io/badge/Theme-Black_%26_Red-ff2e4c.svg?style=for-the-badge&color=ff2e4c&labelColor=0d0d11" alt="Theme"/>
</p>

### **Sử dụng Meta Muse — agent "Hatch" của [muse.ai](https://muse.ai) — từ bất kỳ MCP client hoặc OpenAI-compatible client nào, bằng chính tài khoản và quota của bạn.**

</div>

---

Muse không có API công khai: giao diện chat của nó sử dụng **WebSocket mã hóa** (`wss://hatch.metaaivm.com/v1/noise`, giao thức *Noise* gồm X25519 + HKDF + AES‑GCM + Ed25519). Vì vậy, thay vì phải cài đặt lại giao thức phức tạp này, dự án **điều khiển trình duyệt Chrome thật đang đăng nhập của bạn** thông qua Playwright: ứng dụng web tự xử lý tất cả phần mã hóa, còn dự án sẽ nhập dữ liệu vào ô soạn thảo (composer) và đọc câu trả lời render ra.

Điều này mang lại cho bạn hai cổng kết nối (front doors):

| Cổng kết nối | Bản chất | Dùng cho |
| --- | --- | --- |
| **MCP server** (stdio) | 7 công cụ: `muse_status`, `muse_login`, `muse_new_chat`, `muse_chat`, `muse_read_last`, `muse_dump_dom`, `muse_close` | Claude Desktop, opencode, Cursor, hoặc bất kỳ MCP host nào |
| **OpenAI-compatible shim** (HTTP) | `GET /v1/models`, `POST /v1/chat/completions` (stream + non-stream, gọi tool) | Bất kỳ OpenAI SDK / provider `@ai-sdk/openai-compatible` nào |

Đi kèm một **CLI** nhỏ gọn (`muse-cli.mjs`) giúp sinh phản hồi nhanh từ script.

> [!IMPORTANT]
> Dự án này điều khiển trình duyệt **của bạn** và tài khoản Muse **của bạn**. Dự án **không** chứa thông tin đăng nhập, profile Chrome hay dữ liệu lưu vết nào — bạn tự đăng nhập vào tài khoản Meta của mình ở lần chạy đầu tiên. Xem thêm phần [Tuyên bố miễn trừ trách nhiệm](#tuyên-bố-miễn-trừ-trách-nhiệm).

---

## Feature / Tính năng nổi bật

- **MCP tools qua stdio** — cắm vào sử dụng ngay cho Claude Desktop / opencode / bất kỳ MCP host nào.
- **OpenAI-compatible HTTP shim** hỗ trợ **streaming thực sự** (SSE), đúng `finish_reason` và đối tượng lỗi `/v1` chuẩn.
- **Gọi tool qua Prompt Injection** — truyền các `tools` kiểu OpenAI cho Muse và nhận lại `tool_calls`.
- **Tệp đính kèm (Attachments)** — gửi ảnh/video cùng với prompt (MCP `files`, OpenAI `image_url`, CLI `-f`).
- **Phiên làm việc & Media (Sessions & media)** — liệt kê/mở/đọc/gửi tin nhắn trong bất kỳ chat Muse nào, đồng thời trích xuất ảnh/video do Muse tạo ra (link + tải về).
- **Muse Manual (Sổ tay Muse)** — cẩm nang sống về khả năng tạo video/ảnh/nội dung của Muse tại [`manual/MUSE_MANUAL.md`](manual/MUSE_MANUAL.md), tự cập nhật với `node manual/interview.mjs`.
- **Tái sử dụng đăng nhập có sẵn** qua một profile Chrome riêng biệt, hoặc kết nối tới Chrome đang chạy với `--remote-debugging-port=9222`.
- **Không ngắt trình duyệt người dùng**: khi kết nối qua CDP, tool chỉ *ngắt kết nối* khi đóng chứ không tắt Chrome.
- **Khả năng tự phục hồi**: nếu profile bị khóa do Chrome đang mở, tool sẽ tự động kết nối qua CDP thay vì báo lỗi.
- **Streaming chuẩn xác**: chỉ phát ra văn bản ổn định, liên tục (monotonic), tránh lặp lại văn bản khi Muse tự chỉnh sửa câu trả lời mid-stream.
- Không cần tải thêm trình duyệt — sử dụng Chrome **đã cài đặt sẵn** của bạn qua [`playwright-core`](https://www.npmjs.com/package/playwright-core).

---

## Yêu cầu hệ thống

- **Node.js ≥ 18** (đã test trên v24).
- **Google Chrome** (hoặc Edge) đã cài đặt.
- **Tài khoản Meta** có quyền truy cập Muse.
- Windows / macOS / Linux (đường dẫn ví dụ dùng trên Windows; điều chỉnh cho OS của bạn).

---

## Cài đặt

```bash
git clone https://github.com/fierzone/MUSE_MCP.git
cd Muse-Chat-MCP
npm install
```

`npm install` chỉ tải `playwright-core` (thư viện) — **không** tải xuống trình duyệt mới.

## Khởi chạy lần đầu (Đăng nhập 1 lần)

```bash
npm run selftest          # mở Chrome, in trạng thái login/trình duyệt, sau đó đóng lại
```

Một cửa sổ Chrome sẽ mở ra trang `https://muse.ai`. Hãy đăng nhập bằng tài khoản Meta của bạn. Phiên đăng nhập được lưu trong profile riêng (`.muse-profile/`, đã bị git-ignore) và sẽ được tái sử dụng cho các lần sau. Khi `muse_status` báo `"loggedIn": true`, bạn đã sẵn sàng.

---

## Các lệnh chạy dự án (Running the Project)

| Tác vụ / Task | Lệnh thực thi / Command | Mô tả / Description |
| --- | --- | --- |
| **Mở Chrome Debug Port** | `.\start-chrome-debug.bat` *(hoặc `.\start-chrome-debug.ps1`)* | Chạy Chrome với `--remote-debugging-port=9222` để giữ login và tránh khóa profile. |
| **Kiểm tra đăng nhập & Selftest** | `npm run selftest` | Khởi chạy Chrome, kiểm tra trạng thái login/composer, hiển thị thông số rồi đóng lại. |
| **Chạy MCP Server + OpenAI Shim** | `npm start` *(hoặc `node muse-server.mjs`)* | Chạy MCP server (stdio) đồng thời lắng nghe HTTP OpenAI Shim tại port 8787. |
| **Chạy HTTP Shim độc lập** | `node muse-server.mjs --serve-only` | Chỉ chạy HTTP OpenAI Shim (port 8787), không lắng nghe MCP stdio. |
| **Dump DOM Debugging** | `npm run dump` *(hoặc `node muse-server.mjs --dump-dom`)* | Xuất cấu trúc DOM HTML và đếm phần tử để debug selector. |
| **Chạy CLI một lượt** | `npm run muse -- "prompt"` *(hoặc `node muse-cli.mjs "prompt"`)* | Gửi prompt trực tiếp từ CLI và nhận câu trả lời stream ra terminal. |

---

## Sử dụng như một MCP server

### opencode

Thêm vào `~/.config/opencode/opencode.jsonc`:

```jsonc
{
  "mcp": {
    "muse": {
      "type": "local",
      "command": ["node", "/duong/dan/tuyet/doi/den/Muse-Chat-MCP/muse-server.mjs"],
      "enabled": true,
      "timeout": 300000
    }
  }
}
```

> Tham số `timeout` là thời gian chờ **liệt kê công cụ** lúc khởi động, không phải theo từng cuộc gọi — các cuộc gọi `muse_chat` kéo dài vẫn hoạt động bình thường.

### Claude Desktop

Thêm vào `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "muse": {
      "command": "node",
      "args": ["/duong/dan/tuyet/doi/den/Muse-Chat-MCP/muse-server.mjs"],
      "env": { "MUSE_PROFILE_DIR": "/duong/dan/tuyet/doi/den/Muse-Chat-MCP/.muse-profile" }
    }
  }
}
```

### Các công cụ MCP (MCP Tools)

| Tool | Đối số (Arguments) | Trả về (Returns) |
| --- | --- | --- |
| `muse_status` | – | Trạng thái trình duyệt / đăng nhập / composer |
| `muse_login` | `timeout_sec?` | Chờ quá trình đăng nhập Meta hoàn tất |
| `muse_new_chat` | – | Điều hướng về trang composer chính (trang chủ) |
| `muse_chat` | `prompt`, `timeout_sec?`, `new_thread?`, `files?`, `chat?` | `{ reply, messages, threadUrl, elapsedMs, … }` |
| `muse_read_last` | – | Tin nhắn mới nhất của assistant (không gửi câu mới) |
| `muse_chats` | `query?` | Danh sách chat (Main chat / Channels / Side chats), lọc tiêu đề tùy chọn |
| `muse_open_chat` | `target` | Mở một đoạn chat (bằng tiêu đề, chỉ số index, URL hoặc id) |
| `muse_read_chat` | `chat?`, `max?` | Tin nhắn trong chat (tất cả vai trò, kèm link media) |
| `muse_media` | `chat?`, `download?`, `dir?` | Link ảnh/video/tệp đính kèm từ chat (tùy chọn tải về) |
| `muse_dump_dom` | `max_chars?` | Số lượng phần tử + HTML đoạn chat (dùng để debug selector) |
| `muse_close` | – | Đóng trình duyệt (chỉ ngắt kết nối nếu đính kèm qua CDP) |

Quy trình thông thường: `muse_status` → (nếu cần `muse_login`) → `muse_chat { prompt }`.

### Tệp đính kèm (Ảnh & Video)

`muse_chat` nhận một mảng `files` — đường dẫn tuyệt đối hoặc URL — và đính kèm vào tin nhắn trước khi gửi:

```jsonc
{ "name": "muse_chat", "arguments": { "prompt": "Có gì trong bức ảnh này?", "files": ["C:\\path\\frame.jpg", "https://host/clip.mp4"] } }
```

Muse chấp nhận ảnh, video và tài liệu (file input của composer **không** chặn bộ lọc `accept`). Các file được đặt trực tiếp vào file input ẩn của composer mà không hiện hộp thoại hệ thống OS.

### Phiên làm việc (Nhiều đoạn chat)

Muse có một **Main chat** chính cùng với các **Channels** và **Side chats** (mỗi cuộc trò chuyện có dạng `muse.ai/thread/<id>`). Bạn có thể liệt kê và chỉ định bất kỳ chat nào để đọc hoặc gửi tin:

- **MCP** — `muse_chats`, `muse_open_chat { target }`, `muse_read_chat { chat?, max? }`, và `muse_chat { …, chat }` trong đó target là tiêu đề, index, thread URL hoặc thread id.
- **HTTP** — `GET /v1/muse/chats` (danh sách) và `GET /v1/muse/chat?target=<name|index|url>&max=100` (đọc); gửi tin kèm header `x-muse-chat: <name|index|url>` (hoặc body `chat`).
- **CLI** — `--list-chats`, `--read [<chat>]`, `--chat <chat>`.

> Muse có thể tạo ra ảnh/video **trực tiếp trong đoạn chat** (nó phản hồi kèm link chia sẻ) — dùng công cụ đọc session hoặc công cụ media để lấy dữ liệu.

### Media (Ảnh & Video do Muse tạo)

Khi được yêu cầu, Muse tạo ra media và phản hồi bằng một link chia sẻ (`https://muse.ai/files/<…>/….mp4|.png`). Trích xuất và tải xuống:

- **MCP** — `muse_media { chat?, download?, dir? }`.
- **HTTP** — `GET /v1/muse/media?target=<chat>&download=1&dir=<dir>`.
- **CLI** — `--media [<chat>] [--download] [--dir <dir>]`.

Các liên kết là công khai (bất kỳ ai có link đều xem được) nhưng sẽ hết hạn (~2 ngày) — nên tải về để lưu trữ lâu dài.

---

## Sử dụng OpenAI-compatible Shim

`muse-server.mjs` tự động khởi chạy shim trên **cổng 8787** (tắt bằng cách đặt `MUSE_SHIM_PORT=0`). Nếu chỉ muốn chạy HTTP server mà không dùng MCP, hãy dùng `node muse-server.mjs --serve-only`.

| Route | Mục đích |
| --- | --- |
| `GET /v1/models` | Danh sách model |
| `POST /v1/chat/completions` | Hoàn thành đoạn chat (stream + non-stream, tools) |
| `GET /health` | Trạng thái trình duyệt / đăng nhập |
| `GET /v1/muse/chats` | Danh sách đoạn chat Muse |
| `GET /v1/muse/chat?target=…` | Đọc tin nhắn cuộc trò chuyện (tùy chọn mở trước) |
| `GET /v1/muse/media?target=…` | Link media trong cuộc trò chuyện (thêm `download=1` để tải) |

```bash
curl http://127.0.0.1:8787/v1/models

curl http://127.0.0.1:8787/v1/chat/completions \
  -H "content-type: application/json" \
  -d '{"model":"muse-spark-1.3","messages":[{"role":"user","content":"Tóm tắt Muse là gì trong 2 câu."}]}'
```

### Sử dụng với SDK OpenAI bất kỳ (Python/JS)

```python
from openai import OpenAI
client = OpenAI(base_url="http://127.0.0.1:8787/v1", api_key="muse-local")
r = client.chat.completions.create(
    model="muse-spark-1.3",
    messages=[{"role": "user", "content": "Viết một bài thơ haiku về trình duyệt."}],
    stream=True,
)
for chunk in r:
    print(chunk.choices[0].delta.content or "", end="")
```

### Cấu hình opencode provider

```jsonc
"provider": {
  "muse-local": {
    "npm": "@ai-sdk/openai-compatible",
    "name": "Muse (local shim)",
    "options": { "baseURL": "http://127.0.0.1:8787/v1", "apiKey": "muse-local" },
    "models": {
      "muse-spark-1.3": { "name": "Muse Spark 1.3" },
      "muse": { "name": "Muse" }
    }
  }
}
```

### Cơ chế hoạt động của Shim

- **Real streaming** — Văn bản DOM được phát lại dưới dạng các delta của OpenAI. Chỉ văn bản dạng *mở rộng liên tục (monotonic extension)* và ổn định trong khoảng `MUSE_STREAM_QUIET_MS` (mặc định 600 ms) mới được phát; phần còn lại sẽ được đẩy ra ở cuối. Mỗi stream kết thúc với chính xác 1 `finish_reason`, sau đó là `[DONE]`.
- **Tools** — Gọi công cụ qua prompt-injection. Schema của tool được nhúng kèm quy tắc *chỉ ra quyết định* ("không tự thực thi"), vì vậy Muse trả về `{"tool_calls":[{"name","arguments"}]}` thay vì tự chạy hành động. Trích xuất thành `tool_calls` của OpenAI (`finish_reason: "tool_calls"`). Đây là giải pháp dạng best-effort, không phải native API.
- **Tệp đính kèm** — Gửi ảnh/video qua nội dung đa phương thức OpenAI (`{"type":"image_url","image_url":{"url":…}}`) hoặc mảng `files` ở cấp cao nhất (đường dẫn cục bộ / URL / data-URI). Muse xem chúng như tệp đính kèm chat bình thường.
- **Tin nhắn nguyên bản** — Shim gửi tin nhắn mới nhất của người dùng **nguyên văn**: không thêm nhãn vai trò `### USER/### ASSISTANT` và không thêm wrapper "tiếp tục cuộc trò chuyện". Muse sẽ coi các wrapper dạng roleplay là prompt-injection và từ chối, nên bridge không bao giờ thêm vào. Ngữ cảnh trước đó sẽ lấy từ chính thread của Muse.
- **Phiên làm việc** — Định vị cuộc trò chuyện qua header `x-muse-chat: <title|index|url>` (hoặc body `chat`); đọc đoạn chat qua `GET /v1/muse/chats` và `GET /v1/muse/chat`.
- **Headers bổ sung** — `x-muse-thread: new` (điều hướng đến `/` trước), `x-muse-timeout-ms`.

---

## Sử dụng CLI

`muse-cli.mjs` giao tiếp với shim (tái sử dụng shim đang chạy, hoặc tự động khởi động `--serve-only` rồi tắt sau khi xong).

```bash
node muse-cli.mjs "Giải thích B-tree là gì trong 2 câu."                    # stream ra stdout
node muse-cli.mjs --no-stream -s "Chỉ xuất mã nguồn thô." "Viết ..."        # lấy mã nguồn cuối cùng
node muse-cli.mjs -f ./frame.jpg "Viết caption Facebook cho ảnh này."       # đính kèm ảnh/video
node muse-cli.mjs --list-chats                                            # danh sách chat Muse
node muse-cli.mjs --read "Khả năng tạo video"                              # đọc tin trong 1 chat
node muse-cli.mjs --chat "Trả lời pong" "hi"                              # gửi tin vào 1 chat
echo "<file>" | node muse-cli.mjs -s "Đánh giá file này"                   # đọc prompt từ stdin
npm run muse -- "hello"                                                   # qua package.json
```

Tùy chọn: `-s/--system`, `-m/--model`, `-t/--timeout`, `-f/--file <path|url>` (có thể lặp lại), `--chat <name|index|url>`, `--list-chats`, `--query <text>`, `--read [<chat>]`, `--media [<chat>]`, `--download`, `--dir <dir>`, `--new-thread`, `--no-stream`, `--json`, `--base` (hoặc env `MUSE_SHIM_URL`).

---

## Video Generation Workflow & Commands (Lệnh tạo Video & QC)

Muse (`muse.ai` / Hatch) hỗ trợ tạo video 9:16 dọc (text-to-video, image-to-video). Dưới đây là quy trình và các lệnh để điều khiển tool tạo video, tải media và kiểm tra chất lượng:

### 1. Tạo Video từ CLI (Command-Line)

- **Tạo video từ mô tả chữ (Text-to-Video)**:
  ```bash
  node muse-cli.mjs "Tạo video 9:16 quay cảnh thành phố cyberpunk ban đêm có mưa rơi và đèn neon"
  ```
- **Tạo video từ ảnh mẫu (Image-to-Video / Ref Image)**:
  ```bash
  node muse-cli.mjs -f ./ref_character.jpg "Tạo video 9:16 chuyển động nhân vật trong ảnh đang bước đi"
  ```
- **Tạo video trong 1 chat session cụ thể**:
  ```bash
  node muse-cli.mjs --chat "Video Creation" "Tạo video 9:16 mô tả sản phẩm phong cách cinematic"
  ```

### 2. Tạo Video qua OpenAI-compatible API Shim (HTTP)

```bash
curl http://127.0.0.1:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "muse-spark-1.3",
    "messages": [
      {"role": "user", "content": "Tạo video 9:16 dọc quảng cáo đồ uống mùa hè"}
    ]
  }'
```

### 3. Trích xuất & Tải Video đã tạo (Download Media)

Khi Muse tạo video xong (trả về link share `https://muse.ai/files/...mp4`), sử dụng các lệnh sau để liệt kê và tải về:

- **Liệt kê file media trong chat**:
  ```bash
  node muse-cli.mjs --media
  ```
- **Tải tất cả video/ảnh trong chat về thư mục chỉ định**:
  ```bash
  node muse-cli.mjs --media --download --dir ./downloads
  ```
- **Sử dụng MCP Tool**:
  Gọi tool `muse_media` với tham số `{"download": true, "dir": "./downloads"}`.

### 4. Kiểm tra QC kỹ thuật Video (Video Technical QC)

Công cụ trích xuất thông số kỹ thuật (độ phân giải 9:16, FPS, codec) và tự động chụp 5 frame ảnh đại diện để kiểm duyệt:

```bash
node manual/qc-video.mjs ./downloads/sample_video.mp4 ./downloads/qc_frames
```

- Output: JSON chỉ số kỹ thuật (resolution, ratio_9_16, fps, duration, codecs, size) và 5 ảnh khung hình tại `./downloads/qc_frames/`.

### 5. Khảo sát & Cập nhật Manual khả năng tạo Video của Muse

```bash
node manual/interview.mjs
```
Tự động phỏng vấn Muse qua 18 câu hỏi chi tiết về khả năng dựng video, animation, sub, voiceover và cập nhật vào `manual/raw/`.

---

## Kiến trúc hệ thống (Architecture)

```
MCP client (Claude Desktop / opencode / …)      OpenAI client (SDK / opencode provider)
        │ stdio (JSON-RPC)                                │ HTTP  /v1/*
        ▼                                                  ▼
   muse-server.mjs  ───────────►  muse-openai-shim.mjs  ────┘
        │  (MCP tools)                   (SSE + JSON)
        └──────────────┬──────────────────────────┘
                       ▼
                 muse-driver.mjs        playwright-core
                       ▼
        Chrome (dedicated profile ./.muse-profile)  ──►  https://muse.ai
```

### Tại sao lại dùng browser driver?

Bắt luồng dữ liệu từ một phiên làm việc thực (endpoints + WS frames), chat của Muse **không phải** là REST/SSE:

| Tín hiệu | Giá trị |
| --- | --- |
| Ứng dụng | Next.js trên Vercel, phía trước có Meta `fwdproxy` |
| Xác thực | dựa trên cookie: `POST /api/auth/check` → `{ ok, access_token, viewer_id }` |
| Phiên (Session) | `GET /api/session` → gán VM `wss://<vm_id>.metaaivm.com/` |
| Đánh thức | `POST /api/hatch/vm/wake` |
| Chat transport | WebSocket `wss://hatch.metaaivm.com/v1/noise` — các RPC method `chat.stream`, `chat.history`, `chat.mark_seen` |
| Khung tin nhắn | **Nhị phân mã hóa** (bắt tay Noise), có chữ ký `auth_token`/`notary_token` trong URL WS |
| `/api/falco` | Chỉ dùng đo đạc từ xa (telemetry) — **không phải** nội dung chat |

Do đó, hai giải pháp khả thi nhất là (1) điều khiển trình duyệt thật (dự án này) hoặc (2) cài đặt lại Noise mã hóa ở cấp thấp ([xem roadmap](#lộ-trình-phát-triển)).

### Bộ chọn DOM (Selectors)

| Mục đích | Selector |
| --- | --- |
| Composer root | `[data-hatch-composer-root]` |
| Editor | `[data-hatch-composer-root] textarea` (dự phòng `[data-lexical-editor="true"]`) |
| Gửi | Phím `Enter` |
| Đính kèm | `[data-hatch-composer-root] input[type="file"]` (thẻ ẩn; dùng `setInputFiles`) |
| Danh sách chat | `[data-testid="hatch-thread-row"]` |
| Streaming | `[data-testid="hatch-composer-stop-button"]` |
| Tin nhắn | `[data-message-item]` với `data-message-role="user" \| "assistant"` |
| Báo lỗi | `[data-testid="assistant-response-error-notice"]` |
| Auth probe | page-origin `fetch('/api/auth/check', { method: 'POST' })` |

---

## Tự tái tạo lại dự án này (HAR → Coding agent)

Bạn không cần phải tự đảo ngược mã nguồn (reverse-engineer) bằng tay. Hãy bắt lại toàn bộ lưu lượng trình duyệt thực hiện, sau đó để một AI coding agent đọc tệp đó và viết phần cầu nối giúp bạn.

**Yêu cầu: Google Chrome + một AI coding agent** — Claude Code, OpenAI Codex, opencode, Cursor, Cline, Aider, … bất kỳ agent nào có thể đọc tệp.

1. **Mở ứng dụng.** Trong Chrome, truy cập `https://muse.ai` và đăng nhập tài khoản **của bạn**.
2. **Mở DevTools.** Bấm `F12` → tab **Network** → tích chọn **Preserve log**. Giữ tab mở suốt phiên làm việc để bắt được các khung tin nhắn WebSocket.
3. **Lọc lưu lượng.** Bấm **Fetch/XHR** để xem các cuộc gọi HTTP, và **WS** để xem WebSocket chat. Chat của Muse chạy qua **WebSocket**, không phải REST, nên bạn cần xem *cả hai*.
4. **Gửi một vài prompt** (ví dụ: `hi`, `bạn làm được gì?`) để ghi nhận luồng dữ liệu thực tế.
5. **Xuất tệp HAR.** Nhấp chuột phải vào danh sách yêu cầu → **Save all as HAR with content**. Chọn phiên bản **"with sensitive data"** — vì bản đã lọc sạch sẽ xóa mất cookie và khung WebSocket, làm cho tệp không còn tác dụng.
6. **Đưa tệp cho AI agent.** Thả tệp vào dự án (ví dụ `captures/muse.har`) và đưa prompt dạng như sau:

   ```text
   Analyze captures/muse.har from a web chat app and report:
   1) The chat transport: REST/SSE vs WebSocket. List every relevant endpoint
      (auth, session, wake, chat) and how authentication works (cookies? tokens?).
   2) The WebSocket: URL, subprotocol, and whether frames are encrypted/binary —
      e.g. a Noise handshake (X25519 + HKDF + AES-GCM + Ed25519) — plus the RPC method names.
   3) The most robust way to build a local bridge that exposes this chat as
      (a) an MCP tool and (b) an OpenAI-compatible /v1 endpoint, given there is no official API.
   ```

   Agent sẽ đọc tệp HAR và cho bạn biết chính xác cách xây dựng. Trong tệp HAR của chúng tôi, agent đã tìm ra `POST /api/auth/check`, `GET /api/session`, `POST /api/hatch/vm/wake`, và kết nối WebSocket **mã hóa** `wss://hatch.metaaivm.com/v1/noise` với hàm `chat.stream` — đó là lý do chính xác dự án này **điều khiển trình duyệt thật** thay vì gọi trực tiếp API REST.

> [!WARNING]
> Tệp HAR "with sensitive data" có chứa **session cookies và access tokens** của bạn. Không bao giờ commit tệp này lên git, không dán vào chat công khai, không chia sẻ. Tệp `.gitignore` của dự án đã tự động chặn các tệp `*.har`.

---

## Cấu hình biến môi trường (Environment Variables)

| Biến môi trường | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `MUSE_PROFILE_DIR` | `./.muse-profile` | Thư mục profile Chrome riêng (lưu phiên đăng nhập) |
| `MUSE_URL` | `https://muse.ai/` | URL ứng dụng |
| `MUSE_CHANNEL` | `chrome` | `chrome` hoặc `msedge` |
| `MUSE_HEADLESS=1` | off (tắt) | Chạy ẩn danh không giao diện (cần đăng nhập ở chế độ hiện hình trước) |
| `MUSE_CDP` | – | Kết nối tới Chrome đang chạy tại URL này (vd `http://127.0.0.1:9222`) thay vì mở mới |
| `MUSE_STREAM_QUIET_MS` | `600` | Khung thời gian chờ ổn định văn bản khi streaming |
| `MUSE_LAUNCH_TIMEOUT_MS` | `60000` | Thời gian chờ khởi chạy / điều hướng |
| `MUSE_SHIM_PORT` | `8787` | Cổng HTTP của Shim (`0` để tắt shim) |
| `MUSE_SHIM_HOST` | `127.0.0.1` | Địa chỉ IP lắng nghe của Shim |
| `MUSE_SHIM_TIMEOUT_MS` | `240000` | Thời gian chờ yêu cầu mặc định của Shim |
| `MUSE_SHIM_MODELS` | `muse-spark-1.3,muse-spark-1.3-contributor,muse` | Danh sách tên model quảng bá |
| `MUSE_SHIM_URL` | `http://127.0.0.1:8787/v1` | URL gốc của Shim mà CLI sử dụng |
| `MUSE_CLI_AUTOSTART=0` | off (tắt) | Tắt tính năng CLI tự động khởi động shim |

---

## Xử lý sự cố (Troubleshooting)

- **`loggedIn: false`** → Chạy `muse_login` (hoặc `npm run selftest`) và hoàn tất đăng nhập trong cửa sổ Chrome.
- **`composerReady: false` sau khi login** → Chạy `node muse-server.mjs --dump-dom`; nếu DOM thay đổi, cần cập nhật lại selector trong `SELECTORS` tại `muse-driver.mjs`.
- **Câu trả lời trống / `timedOut`** → Tăng `timeout_sec`; các tác vụ agent phức tạp (lướt web, chạy VM) có thể mất vài phút. `needsApproval: true` nghĩa là Muse đang chờ bạn bấm duyệt (approval) trên giao diện web.
- **Chrome profile locked (Khóa profile)** → Báo lỗi này xảy ra nếu một Chrome khác đang dùng `.muse-profile`. Driver sẽ tự kết nối tới `http://127.0.0.1:9222` nếu có; nếu không hãy đóng cửa sổ đó lại, hoặc khởi động Chrome với `--remote-debugging-port=9222` và đặt `MUSE_CDP`.
- **`npm` bị chặn trong PowerShell** → Chạy lệnh bằng cách gọi `& "C:\Program Files\nodejs\npm.cmd"` thay vì `npm`.

---

## Giới hạn (Limitations)

- **Một cuộc hội thoại chính.** Muse chạy trên một thread duy nhất; nút "new chat" trong web app không hoạt động ổn định. Shim gửi toàn bộ lịch sử mỗi lần gọi; `x-muse-thread: new` sẽ điều hướng về `/` trước (tạo ngữ cảnh mới dạng best-effort).
- **Tuần tự hóa (Serialized)** — Một trình duyệt, các yêu cầu xử lý lần lượt theo hàng chờ (auto-queued).
- **Tool calling là prompt-injected** — Dạng best-effort, không phải native function-calling API.
- **Dựa vào DOM** — Giao diện Muse thay đổi có thể làm hỏng bộ chọn selector; `muse_dump_dom` là công cụ giúp kiểm tra.

---

## Lộ trình phát triển (Roadmap)

- [ ] **Phase 2 — Noise client không giao diện.** Giao tiếp trực tiếp với Muse qua `wss://hatch.metaaivm.com/v1/noise` (X25519 + HKDF + AES‑GCM + Ed25519) với công tắc `MUSE_TRANSPORT=noise|browser`, giữ trình duyệt làm phương án dự phòng.
- [ ] Chuyển tiếp Tool-calling dạng native cho các client hỗ trợ.
- [ ] Hỗ trợ đa luồng trò chuyện khi Muse cung cấp cơ chế chuyển đổi tin cậy.

---

## Tuyên bố miễn trừ trách nhiệm (Disclaimer)

Đây là một công cụ **không chính thức, không liên kết** với Meta. Tool tự động hóa phiên làm việc trên trình duyệt *của chính bạn* và không đóng gói, proxy hay chia sẻ thông tin đăng nhập của bất kỳ ai. Chỉ sử dụng công cụ này với tài khoản mà bạn có quyền sử dụng, đồng thời tuân thủ Điều khoản dịch vụ của Muse / Meta và pháp luật hiện hành. Những người duy trì dự án không chịu trách nhiệm cho việc sử dụng sai mục đích hoặc bất kỳ hậu quả nào từ việc sử dụng phần mềm này. Dự án **không chứa** API key, Chrome profile hay lưu vết lưu lượng nào — bạn tự cung cấp tài khoản của mình.

---

## Giấy phép (License)

[MIT](LICENSE) © 2026 fierzone
