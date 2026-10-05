# Muse Manual — làm video / ảnh / content tốt nhất

> **Phiên bản:** v1 · **Cập nhật:** 2026-09-30
> **Nguồn:** phỏng vấn trực tiếp **Meta Muse** (muse.ai) qua cầu `Muse-Chat-MCP`, hỏi như người dùng thật
> (bộ câu hỏi trong `manual/`, nguyên văn đáp án ở `manual/raw/`).
> **Cập nhật lại:** chạy `node manual/interview.mjs` rồi chỉnh tài liệu này theo đáp án mới.

---

## 0. Tóm tắt nhanh (đọc trước)

Muse là một **agent**, không phải API render. Nó tạo video/ảnh ngay trong chat bằng mô tả,
**biên tập hậu kỳ bằng ffmpeg**, rồi trả **link tải**. Bốn điều quan trọng nhất:

1. **Video = nhiều clip ~10 giây ghép lại.** Mỗi clip dài tối đa ~10s và *không chỉnh được*;
   muốn dài hơn thì tạo từng cảnh rồi ghép. **Không có video→video** (không AI-sửa video có sẵn —
   chỉ cắt/ghép thủ công).
2. **Chữ & logo tiếng Việt: TUYỆT ĐỐI không để AI vẽ.** AI vẽ chữ (nhất là tiếng Việt có dấu) rất
   hay sai/méo dấu. Luôn: tạo nền/khung sạch bằng AI → **composite chữ/logo ở hậu kỳ**.
3. **Khuôn mặt/nhân vật:** ảnh tham chiếu giữ "vibe" tốt, nhưng **không đảm bảo giống tuyệt đối** và
   có thể dao động giữa các lần tạo → **luôn QC từng khung** (đặc biệt với UGC có mặt người thật).
4. **Link tải công khai nhưng có hạn** (Muse báo thời điểm hết hạn, ~vài ngày) → **tải về ngay**.

> 🔢 **Thông số kỹ thuật ĐO THỰC TẾ** (độ phân giải, số giây, fps, dung lượng, định dạng): xem **§10**.
> Lưu ý: Muse tự báo "720×1280" cho video, nhưng **đo thực tế là ~704×1248** — **tin số đo, không tin lời khai**.

---

## 1. Bảng khả năng

| Việc | Muse | Ghi chú |
|---|---|---|
| Text → video | ✅ | mô tả bằng chữ |
| Ảnh → video | ✅ | ảnh làm đầu vào tham chiếu |
| Video → video (sửa video có sẵn) | ❌ | chỉ cắt/ghép thủ công bằng ffmpeg |
| Cắt / ghép / đổi thứ tự / thay cảnh | ✅ | biên tập file trực tiếp (ffmpeg) |
| Transition (fade/xfade), zoom/pan, màu/filter, đổi tốc độ | ✅ | hậu kỳ, chắc chắn |
| Camera motion / zoom **trong lúc tạo** | ⚠️ | chỉ là gợi ý cho AI, không đảm bảo |
| Chèn logo/chữ/số liệu/sticker lên video | ✅ | chèn hậu kỳ |
| Phụ đề (tự động + đốt cứng) | ✅ | audio→text→burn; phụ thuộc chất lượng âm thanh |
| Voiceover tiếng Việt | ✅ (⚠️) | có TTS tiếng Việt, nhưng **tiếng Anh mượt nhất** |
| Nhạc nền | ✅ | nhạc **tổng hợp theo mô tả cảm xúc**; **không dùng bài hát có bản quyền** |
| Tạo ảnh | ✅ | tối đa **4 ảnh/lần** |
| Ảnh từ ảnh tham chiếu (giữ mặt/style) | ✅ (⚠️) | giữ vibe tốt, **không chắc giống mặt tuyệt đối** |
| Chữ/logo trong ảnh do AI vẽ | ❌ | hay sai, nhất là tiếng Việt có dấu → composite |
| Viết caption / script / hashtag / mô tả / SEO | ✅ | tiếng Việt thuần hoặc song ngữ |
| **Xem/nghe** video thành phẩm | ❌ | Muse chỉ "kiểm tra" bằng trích khung hình / audio→text |
| Nhận diện người trong ảnh | ❌ | |

---

## 2. Video

### 2.1 Tạo
- **Dạng:** text→video, ảnh→video. **Không** có video→video.
- **Độ dài clip:** ~**10 giây/clip**, **không chỉnh được**. Muốn video dài → tạo nhiều clip rồi ghép.
- **Tỉ lệ khung:** mô tả trong prompt (`9:16`, `16:9`, `1:1`…). **Không có thông số độ phân giải
  chính thức công bố** — muốn số liệu chính xác thì **phải test thực tế**.
- **Mô tả càng cụ thể càng tốt:** hành động, ánh sáng, bố cục, chuyển động máy quay.

### 2.2 Âm thanh
- **Voiceover (TTS):** có, hỗ trợ tiếng Việt — nhưng **chất lượng tiếng Anh tốt nhất**; tiếng Việt có
  thể kém mượt hơn.
- **Nhạc nền:** tạo bằng **mô tả cảm xúc** (vd "nhạc điện tử sôi động"). **Không** dùng bài hát thật/có bản quyền.
- **Phụ đề:** Muse chuyển âm thanh → văn bản → **đốt cứng (burn-in)** vào video. Độ chính xác phụ thuộc chất lượng audio.

### 2.3 Tham chiếu nhân vật / identity
- Nhận **ảnh tham chiếu** để giữ nhân vật/khuôn mặt; có thể nối tiếp ngữ cảnh video trước qua **snapshot**.
- **Cảnh báo:** output là **thế hệ mới hoàn toàn** — **không đảm bảo giống mặt chính xác tuyệt đối**,
  độ trung thực dao động giữa các lần tạo.
- ➜ Với UGC có mặt người thật: **duyệt từng khung**, chỉ nhận khi identity PASS.

---

## 3. Biên tập & hiệu ứng (hậu kỳ — chắc chắn làm được)

Muse biên tập **file video trực tiếp trên máy bằng ffmpeg**:

- **Cắt, ghép, đổi thứ tự, thay cảnh.**
- **Transition:** fade / xfade.
- **Zoom / pan kỹ thuật số**; **đổi tốc độ** (slow/fast).
- **Chỉnh màu / filter.**
- **Lớp phủ:** logo (PNG), chữ/text, **số liệu**, sticker/nhãn dán.

**Nguyên tắc vàng về chữ:** chữ do AI vẽ trong lúc tạo video **hay sai chính tả** → luôn **chèn chữ ở hậu kỳ**.
Tương tự với ảnh: **tạo nền sạch bằng AI → composite chữ/logo** ⇒ chữ tiếng Việt chuẩn 100%.

**Sửa/redo video đã tạo — 2 cách:**
1. **Tạo lại** với prompt chỉnh sửa (mỗi lần là **một video mới**, không sửa từng chi tiết như Photoshop).
2. **Nối tiếp** cùng ngữ cảnh video trước qua **snapshot** để giữ mạch hình ảnh.
3. Chi tiết nhỏ (màu chữ, vị trí logo, cắt cảnh) → **sửa trực tiếp trên file đã có**.

---

## 4. Ảnh

- **Số lượng:** tối đa **4 ảnh/lần** (muốn thêm thì yêu cầu lượt tiếp theo).
- **Tỉ lệ:** mô tả trong prompt. **Không có thông số độ phân giải chính thức** — thực tế đủ dùng cho ads/feed; muốn chính xác thì test.
- **Giữ mặt/style:** đưa ảnh tham chiếu, hoặc nối tiếp qua **`snapshot_id`** để giữ mặt/style qua nhiều lần.
  Giữ "vibe" tốt, **không đảm bảo giống mặt tuyệt đối** → kiểm tra từng ảnh.
- **Chữ/logo:** **không để AI vẽ** (sai dấu tiếng Việt). Tạo nền AI → **composite** ⇒ chuẩn 100%.

---

## 5. Nội dung / copy

Muse viết được: **caption, script video (kịch bản từng cảnh + lời thoại), hashtag, mô tả sản phẩm,
tiêu đề & thẻ SEO**; **tiếng Việt thuần hoặc song ngữ** tùy yêu cầu.

Dùng tốt cho: brainstorm angle, hook, caption FB/IG/Threads, kịch bản UGC từng beat.

---

## 6. Playbook — quy trình ra video tốt

**Quy trình chuẩn (Muse đề xuất):**
> Ý tưởng → **script từng cảnh (~10s/cảnh)** → tạo ảnh/clip **từng cảnh một** → ghép + chèn
> **chữ/logo/voiceover/phụ đề** → xuất.

**Ví dụ scene (Muse tự đưa):**
- *Cảnh 1 (0–10s):* cận mặt founder cầm điện thoại, Zalo UI hiện số calo — voiceover: "Ăn gì cũng biết bao nhiêu calo".
- *Cảnh 2:* zoom ra, logo CaloTrack + chữ "Tải miễn phí".
- ➜ mỗi cảnh **1 clip 10s**, ghép thành **20s**.

**Luật viết prompt:**
1. **Một cảnh = một clip 10s.** Đừng nhồi nhiều hành động vào 1 clip.
2. **Khai báo tỉ lệ** (`9:16` cho Reels/TikTok, `16:9` YouTube, `1:1` feed).
3. **Mô tả hành động + máy quay + ánh sáng**, đừng dùng tính từ chung chung.
4. **Chữ/logo → hậu kỳ.** Không bao giờ để AI vẽ chữ tiếng Việt.
5. **Mặt người thật:** gửi ảnh tham chiếu + QC từng khung; không nhận nếu sai mặt.
6. **Ghép & hậu kỳ** là nơi tạo chất lượng: transition, nhịp cắt, màu, phụ đề, số liệu, logo.
7. **Tải media về ngay** khi Muse trả link (link có hạn).

---

## 7. Giới hạn & chính sách

**Muse KHÔNG làm được:**
- **AI-sửa video có sẵn** (chỉ cắt/ghép thủ công).
- **Xem/nghe** video — chỉ kiểm tra qua **trích khung hình / audio→text**.
- **Nhận diện người** trong ảnh.
- **Bài hát có bản quyền.**
- **Đảm bảo chữ tiếng Việt do AI vẽ** đúng chính tả.
- Nội dung vi phạm chính sách (bạo lực, khiêu dâm trẻ em…) → **từ chối thẳng**.

**Thời gian (ước lượng, không cam kết):**
- Ảnh: thường **< 1 phút/ảnh**.
- Video: **vài phút / clip 10s** (tùy tải hệ thống).

**Xuất / tải:**
- **Trong chat:** Muse **đính kèm file trực tiếp** → tải ngay trong app.
- **Link công khai:** Muse upload lên bộ nhớ Muse và gửi **link có hạn** (Muse báo kèm thời điểm hết hạn;
  ai có link cũng mở được). Muốn giữ lâu → **tải về máy ngay**.

---

## 8. Dùng qua Muse-Chat-MCP

```powershell
# hỏi Muse (như người dùng thật)
node "E:\AI\Muse MCP\mcp-server\muse-cli.mjs" "Tạo 1 video 9:16, cảnh founder cầm điện thoại Zalo, 10 giây."

# đọc lại chat để lấy lời nhắc + link
node "E:\AI\Muse MCP\mcp-server\muse-cli.mjs" --read "Video creation capability"

# kéo media (ảnh/video) Muse tạo về máy
node "E:\AI\Muse MCP\mcp-server\muse-cli.mjs" --media "Video creation capability" --download --dir "E:\AI\CaloTrack V1\marketing_export\muse_media"
```

> Nhắc lại: link media **công khai nhưng có hạn** → luôn `--media --download` để giữ file.

---

## 9. Phụ lục — nguyên văn trả lời của Muse

Xem `manual/raw/batch-1.md` … `batch-4.md` (lưu nguyên văn, kèm câu hỏi) để đối chiếu và cập nhật.
Đáp án phần thông số kỹ thuật: `manual/raw/specs.md`. Số đo thực tế: `manual/raw/measured-specs.md`.

---

## 10. Thông số kỹ thuật — ĐO THỰC TẾ (ffprobe)

Số liệu dưới đây là **đo trực tiếp** từ file Muse tạo ra (tải bằng `muse-cli --media --download`, rồi `ffprobe`),
**không phải suy đoán**. Muse tự khai "720×1280" cho video nhưng **đo thực tế là ~704×1248** → **tin số đo**.

### Video (dọc 9:16, text→video)
| Thuộc tính | Giá trị ĐO ĐƯỢC |
|---|---|
| Độ phân giải | **704×1248** (≈9:16; lần khác đo được 640×1200 — có dao động) |
| Thời lượng mỗi clip | **10.000 giây — cố định**, KHÔNG chọn được (không có 5s/8s) |
| FPS | **24** |
| Video codec | **H.264 (yuv420p)** |
| Audio | **AAC mono 24 kHz** (~100 kbps) |
| Dung lượng | **~2.9 MB / clip 10s** (~2.3 Mbps) |
| Container | **MP4** |
| Chọn độ phân giải? | ❌ không. **1080p chưa từng thấy** — nhiều khả năng không có |

### Ảnh
| Tỉ lệ | Độ phân giải ĐO ĐƯỢC | Định dạng | Dung lượng |
|---|---|---|---|
| 1:1 | **1600×1600** | webp (mặc định) | ~0.45 MB |
| 9:16 | **1152×2048** | webp | ~0.36 MB |
| — | tối đa **4 ảnh / lần** | webp (có thể xin png/jpg) | — |

> Video/ảnh **inline trong chat dùng `blob:`** (không phải link http). Cầu MCP đã xử lý: `--media --download`
> đọc blob ngay trong trang. Khi Muse **chia sẻ link** trong tin nhắn thì link dạng `muse.ai/files/…` (có hạn).

### Cách tự đo lại
```powershell
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,duration:format=size -of default=nw=1 "<file>"
```

---

## 11. Kết quả test UGC THẬT (founder-led) — 2026-09-30

Test đầu tiên: **UGC có mặt founder (Lai Duc)** + **agent thêm hiệu ứng**. Chạy trong chat
**"Set Lai Duc UGC rules"** (Muse đã có sẵn character + rules), gửi kèm **3 ảnh tham chiếu**.

### 11.1 Ảnh UGC (từ 3 ảnh tham chiếu)
- Kết quả: ảnh **1152×2048** (9:16), webp.
- **Khớp "kiểu" rất tốt** (kính trong gọng lớn, tóc side-part, râu nhẹ, da tàn nhang, má đầy) — **nhưng là mặt mới sinh, KHÔNG khóa giống tuyệt đối** (trẻ/softer hơn, tóc hơi giữa).
- ➜ Theo identity gate CaloTrack: **"vibe pass, exact fail"** → phải soi từng ảnh, hoặc dùng footage thật/face-composite nếu cần khớp chính xác.

### 11.2 Video UGC (image→video)
- **704×1248**, 24fps, **10.000s**, H.264+AAC, **~2.84 MB**.
- **Mặt ổn định trong clip**, chuyển động tự nhiên (nháy mắt, quay đầu, mấp máy nói), camera tĩnh.
- Chưa có voiceover (không yêu cầu ở test này).

### 11.3 Agent hiệu ứng (hậu kỳ) — ✅ CHẠY ĐƯỢC
Yêu cầu "zoom + logo + chữ" → Muse tự làm **hậu kỳ bằng ffmpeg**:
- ✅ **Zoom chậm** đầu clip (cận mặt).
- ✅ **Logo CaloTrack THẬT** (mình gửi kèm) composite **góc trên phải** — không phải AI vẽ.
- ✅ **Chữ tiếng Việt ĐÚNG DẤU**: "Theo dõi bữa ăn ngay trong Zalo" ở cuối, nét trắng đọc rõ.
- Xuất **704×1248, 10s, ~2.94 MB**.

➜ **Đây là đường đi chuẩn:** Muse tạo clip → **hậu kỳ composite chữ/logo** (tránh AI vẽ chữ).

### 11.4 Công thức video ~1 phút (6 clip)
1 phút = **6 clip × 10s**. Vì có **cắt mềm ~1s** giữa các cảnh → mỗi clip **~9s nội dung** + ~1s transition.
➜ **~54s nội dung + ~6s chuyển cảnh** trên timeline 60s; phần còn lại là **hiệu ứng hậu kỳ** (zoom, logo, chữ, màu, phụ đề).

> Artifact test: `E:\AI\CaloTrack V1\marketing_export\muse_ugc_test\` (ảnh, video UGC, video hiệu ứng, frames).

---

## 12. Duyệt 3 QC (bắt buộc trước khi dùng)

| Gate | Kiểm gì | Kết quả |
|---|---|---|
| **QC1 — Identity** | mặt/kính/tóc khớp Lai Đức (so ≥3 khung với 3 ref) | khớp → tiếp; **sai mặt → `REJECTED_IDENTITY_FAIL`** |
| **QC2 — Content & chữ** | lời thoại, chữ Việt **đúng dấu**, phrase-only, safe zone, proof trước CTA, claim guardrail | đạt → tiếp |
| **QC3 — Technical** | 9:16, ≥704×1248, 24fps, H.264+AAC, đúng thời lượng, không watermark | đạt → tiếp |

**Chỉ duyệt khi 3/3 PASS.** FAIL bất kỳ gate → REWORK + ghi `calotrack_asset_run_registry.json`.

- Chạy QC kỹ thuật + trích khung: `node manual/qc-video.mjs <video> [outDir]`
- Ví dụ đã ghi: run `muse-video01-tracking-one-button-2026-09-30` → **REJECTED_IDENTITY_FAIL**
  (Muse chỉ cho "vibe match", KHÔNG phải mặt thật Lai Đức → cần footage thật / face-composite mới PASS QC1).

---

## 13. Giữ đúng mặt founder (KHÔNG để AI sinh lại)

**Vấn đề:** ảnh UGC tĩnh (có mặt bạn) thì OK, nhưng bước Muse **image→video SINH LẠI mặt** → video không còn là mặt bạn.

**Cách đúng (giữ mặt 100%):** lấy ảnh/clip **CÓ mặt thật** làm gốc, rồi chỉ **thêm motion + chữ + logo**, KHÔNG regenerate:
- **Ảnh tĩnh → video motion**: zoom/pan nhẹ (ffmpeg `zoompan`), giữ nguyên từng pixel mặt.
  ```powershell
  ffmpeg -loop 1 -i face.png -t 10 -r 24 -vf "scale=1280:2276,crop=1152:2048,zoompan=z='min(zoom+0.0005,1.06)':d=240:s=1152x2048:fps=24,drawtext=..." -c:v libx264 -pix_fmt yuv420p out.mp4
  ```
- **Footage thật** (`Personal Brading\Source quay`) → cắt/ghép + overlay.

**QC1 phải đổi:** mặt phải **trùng khớp NGUỒN** (so với ảnh/clip gốc) — không chỉ "giống kiểu".
Sai lệch = FAIL, dù đẹp.

**Ví dụ đã chạy:** `muse_ugc_test/face_preserved/FACE_PRESERVED_motion_10s.mp4`
(1152×2048, 24fps, 10s, 1.1MB; mặt = ref, KHÔNG đổi; chữ "TRACK BỮA ĂN" chuẩn).

➜ Vai trò Muse = **script + chữ + biên tập/hiệu ứng**; **mặt thật = lấy từ bạn** (ảnh/footage).

---

## 14. Mẹo chuẩn: đưa ẢNH THẬT → Muse giữ đúng mặt

Khi gửi **ảnh THẬT** (approved ref) và yêu cầu làm video, Muse **tự dùng "ảnh thật + motion"** (KHÔNG sinh lại mặt) → **mặt đúng là mặt bạn** (QC1 PASS). Muse tự báo: *"vì dùng ảnh thật + motion nên không có diễn xuất..."*.

- **Đánh đổi:** bối cảnh = ảnh gốc. Muốn bối cảnh khác → **cung cấp ảnh thật ở đúng bối cảnh**.
- **Pipeline chuẩn:** ảnh thật (đúng bối cảnh) → motion (giữ mặt) → overlay chữ Việt + logo (hậu kỳ) → 20s (ghép 2 clip) → **3 QC**.
- **Ví dụ đạt:** `muse_ugc_test/video10/VIDEO10_muse_720x1280_20s.mp4`
  (720×1280, 24fps, 20s; mặt thật; overlay đúng dấu `INBODY` / `PBF • SMM • BMR` / `ĐỌC INBODY VỚI CALOTRACK`; logo góc trên-phải).

➜ Tóm lại: **cho Muse ảnh thật đúng bối cảnh** ⇒ vừa giữ mặt, vừa ra video có chữ/logo chuẩn.
