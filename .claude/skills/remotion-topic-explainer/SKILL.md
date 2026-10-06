---
name: remotion-topic-explainer
description: Tạo video ngắn 50-60s dạng video dọc (9:16, 1080x1920 @ 30fps) giải thích bất kỳ chủ đề lập trình/công nghệ nào bằng Remotion. Kết hợp giọng đọc AI Voiceover tự nhiên từ edge-tts-universal (.env), căn giữa nội dung trực quan, huy hiệu thương hiệu kênh phía trên và phụ đề 1 dòng gãy gọn.
---

# Remotion Topic Explainer Skill for Claude (50-60s Explainer Videos)

Kỹ năng này giúp Claude tự động tạo các video ngắn 50–60 giây (tỷ lệ dọc 9:16, chuẩn 1080x1920 @ 30fps cho TikTok, YouTube Shorts, Facebook Reels) từ bất kỳ chủ đề lập trình hay công nghệ nào bằng **Remotion**.

---

## 1. Các Tính năng Cốt lõi
1. **Visual Engine**: Remotion + TailwindCSS + Spring Physics (`spring()`) + Clamping Interpolations.
2. **AI Voiceover**: Thư viện `edge-tts-universal` (không cần API key), cấu hình giọng đọc tiếng Việt/Anh linh hoạt qua `.env`.
3. **Đồng bộ Thời lượng Frame-Accurate**: Script tự động đo độ dài MP3 và tính toán số frame chính xác (`durationInFrames`) cho từng phân cảnh.
4. **Bố cục Chuẩn Mobile**:
   - **Thương hiệu kênh**: Huy hiệu `⚡ [CHANNEL_NAME]` ở đỉnh giữa (`top: 150px`), tránh thanh tìm kiếm của TikTok/Shorts.
   - **Khối trung tâm**: Toàn bộ thẻ trích dẫn, sơ đồ luồng, biểu đồ so sánh nằm ở **chính giữa màn hình**.
   - **Phụ đề 1 dòng (Single-Line Caption)**: Nằm thoáng đãng phía dưới (`mt-64`), tự động tách 5–7 từ/lần, đồng bộ chuyển cụm từ theo nhịp phát âm.
   - **Chuyển cảnh dồn dập (Snappy Transition)**: Buffer chỉ `+3 frames` giữa các phân cảnh giúp video liên tục, cuốn hút.

---

## 2. Cấu hình Môi trường & Quy chuẩn Đường dẫn Tệp (Directory Conventions)

### 2.1 Quy chuẩn Đường dẫn Tệp
- **Ảnh & Tệp đính kèm Upload**: Tất cả ảnh/file được tải lên từ giao diện Web Studio hoặc Prompt Chat BẮT BUỘC lưu đồng thời vào `remotion-fierzone-template-main/src/uploads` và `./uploads` để các component Remotion trong `src/` truy cập trực tiếp.
- **Video & File Đầu Ra (Downloads)**: Tất cả video MP4 và file media sinh ra từ hệ thống tự động xuất và lưu tập trung duy nhất tại thư mục `./downloads/` (ví dụ: `./downloads/TwoSumHashMapExplainer.mp4`).

### 2.2 Biến môi trường (.env)
Đảm bảo file `.env` tại thư mục gốc có các biến sau:
```env
EDGE_TTS_VOICE=vi-VN-HoaiMyNeural
EDGE_TTS_RATE=+10%
EDGE_TTS_PITCH=+0Hz
EDGE_TTS_VOLUME=+0%
EDGE_TTS_OUTPUT_DIR=public/audio
CHANNEL_NAME="FierZone"
```

---

## 3. Cấu trúc Kịch bản 6 Phân cảnh (50-60s / 1200-1800 frames)

| Phân cảnh | Vai trò | Mục tiêu & Bố cục Visual |
| :--- | :--- | :--- |
| **Scene 1: Hook** | Mở đầu giật gân (0s - 5s) | Tiêu đề lớn (`text-8xl font-black`), câu hỏi tò mò, icon 3D/SVG nổi bật. |
| **Scene 2: Pain Point** | Nỗi đau / Bối cảnh (5s - 12s) | Thẻ trích dẫn tâm lý (`text-5xl`), so sánh Local vs Server / Trước vs Sau. |
| **Scene 3: Solution Part 1** | Giải pháp cốt lõi (12s - 20s) | Card Container / Hộp đóng gói linh kiện, hiệu ứng spring trồi vào. |
| **Scene 4: Solution Part 2** | Quy trình hoạt động (20s - 30s) | Sơ đồ luồng dọc 3 bước (VD: Dockerfile -> Image -> Container) kèm mũi tên. |
| **Scene 5: Benefits** | Lợi ích vượt trội (30s - 40s) | 3 thẻ so sánh thông số (Tốc độ 10x, Tiết kiệm tài nguyên, Deploy mọi nơi). |
| **Scene 6: Outro & CTA** | Đúc kết & Kêu gọi (40s - 50s) | Thẻ tổng kết phát sáng, 2 nút CTA (Thả tim & Follow kênh đón xem video mới). |

---

## 4. Quy trình Tạo Video Khi Người Dùng Yêu Cầu

Khi nhận lệnh: *"Tạo video giải thích về [Chủ đề X]"*, Claude thực hiện tuần tự 5 bước:

### Bước 1: Soạn kịch bản Voiceover 6 cảnh
Soạn 6 câu thoại súc tích, tự nhiên, đánh trúng tâm lý người xem (mỗi câu 15-25 từ).

### Bước 2: Sinh Voiceover với `edge-tts-universal`
Tạo một script TypeScript (hoặc chạy qua `generate-tts.ts`) để tạo audio vào `public/audio/<TopicName>/`:
```typescript
import { generateTopicVoices } from "./scripts/generate-tts";

const scenes = [
  { id: "scene1_hook", text: "..." },
  { id: "scene2_problem", text: "..." },
  { id: "scene3_container", text: "..." },
  { id: "scene4_flow", text: "..." },
  { id: "scene5_benefits", text: "..." },
  { id: "scene6_outro", text: "..." },
];

await generateTopicVoices("<TopicName>", scenes);
```

### Bước 3: Tạo thư mục Component `src/srcVideo/<TopicName>/`
Tạo cấu trúc component động đầy đủ 6 phân cảnh, bao gồm cả file `scenes.json` và thư mục `audio/` tự đóng gói toàn bộ tài nguyên:
```text
src/srcVideo/<TopicName>/
├── <TopicName>.tsx          # Composition chính, chứa BrandHeader và Series 6 phân cảnh
├── audioData.ts             # Lưu metadata frame & audioPath sinh ra từ manifest.json
├── scenes.json              # Lưu kịch bản phân cảnh JSON của video này (dễ quản lý)
├── audio/                   # Thư mục chứa các file voiceover .mp3 & manifest.json của video
└── scenes/
    ├── Scene1Hook.tsx       # Phân cảnh 1: Hook gây chú ý
    ├── Scene2Problem.tsx    # Phân cảnh 2: Thách thức / Nỗi đau
    ├── Scene3Solution.tsx   # Phân cảnh 3: Giải pháp cốt lõi
    ├── Scene4Flow.tsx       # Phân cảnh 4: Quy trình vận hành
    ├── Scene5Benefits.tsx   # Phân cảnh 5: Giá trị vượt trội
    └── Scene6Outro.tsx      # Phân cảnh 6: Tổng kết & Follow
```

### Bước 4: Nguyên tắc Code Remotion
1. **Spring Animation**: Luôn dùng `spring({ frame, fps, config: { damping: 12, stiffness: 100 } })`.
2. **Clamped Interpolation**: Luôn có `{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }`.
3. **Căn giữa nội dung**: `<AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white">`.
4. **Phụ đề**: Đặt `<SubtitleBox text="..." durationInFrames={d} className="mt-64" />` ngay dưới khối trung tâm.
5. **Thời lượng cảnh**: `const d1 = audioManifest.scenes[0].durationInFrames + 3;` (Buffer snappy `+3 frames`).

### Bước 5: Đăng ký Composition vào `src/Root.tsx`
Thêm `<Composition>` vào `src/Root.tsx` với `width={1080}`, `height={1920}`, `fps={30}` và tổng `durationInFrames`.

---

## 5. Lệnh Kiểm tra & Render (Quản lý Đầu Ra Tập Trung)

- **Xem trước trong Remotion Studio**: `npm run dev` -> Mở [http://localhost:3000](http://localhost:3000).
- **Kiểm tra ảnh tĩnh (Still)**: `npx remotion still src/index.ts <TopicName> out/preview.png --frame 200`.
- **Render video MP4 xuất vào `downloads/`**:
  ```bash
  npx remotion render src/index.ts <TopicName> ../downloads/<TopicName>.mp4
  ```
  *(Lưu ý: Video xuất ra luôn được lưu vào thư mục `downloads/` ở gốc workspace để dễ dàng quản lý).*

