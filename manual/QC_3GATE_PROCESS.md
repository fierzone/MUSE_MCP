# Quy trình 3 QC duyệt — CaloTrack UGC (Muse)

Duyệt video/ảnh **chỉ khi 3/3 gate PASS**. FAIL bất kỳ gate nào → **REWORK**, ghi vào
`calotrack_asset_run_registry.json`. Không gọi output là "final/best/approved" khi chưa PASS cả 3.

---

## QC1 — IDENTITY (Gate 1, cứng nhất — làm trước)

**Điều kiện PASS:**
- Mặt khớp Lai Đức: mắt hơi mí, mũi tròn, quai hàm mềm, má đầy, râu nhẹ, da vàng ấm có texture.
- Kính gọng trong (clear) **lớn chữ nhật**, luôn đeo.
- Tóc side-part / **curtain-main**, gọn, không dựng ngược/helmet.
- So ≥3 khung với 3 ảnh ref đã duyệt.

**FAIL =** mặt khác người / bỏ kính / tóc sai / beautify thành idol.
→ Ghi `REJECTED_IDENTITY_FAIL`. Sai mặt = unusable, kể cả UI/ánh sáng đẹp.

> ⚠️ Muse (text→video + ref) chỉ cho **"vibe match"**, KHÔNG khóa mặt tuyệt đối → với UGC mặt thật,
> phải dùng **footage thật** (Source quay) hoặc pipeline giữ-mặt (face-composite) mới PASS QC1.

---

## QC2 — CONTENT & CHỮ

**Điều kiện PASS:**
- Lời thoại đúng kịch bản; nhấn âm tiếng Việt tự nhiên.
- Chữ overlay: **tiếng Việt ĐÚNG DẤU**, phrase-only (KHÔNG phải phụ đề đầy đủ).
- **Không có chữ do AI vẽ** trong raw (chữ chỉ ở hậu kỳ).
- Safe zone: hook trên · caption giữa-dưới · CTA **không dưới y=1600**; không đè mắt/miệng/tay/điện thoại.
- Product proof xuất hiện **trước** CTA.
- Claim guardrail: **không** hứa giảm cân / chẩn đoán y tế. Zalo: không ngụ ý hợp tác chính thức.

**FAIL =** chữ sai dấu, chữ AI vẽ, đè mặt/điện thoại, thiếu proof, claim sai.
→ Ghi `REJECTED_CONTENT_FAIL`.

---

## QC3 — TECHNICAL / SPEC

**Điều kiện PASS:**
- 9:16 dọc, ≥ **704×1248** (Muse ra ~704×1248 hoặc 720×1280), **24 fps**.
- Định dạng **MP4 / H.264 + AAC**, mở được, có tiếng Việt rõ.
- Thời lượng đúng mục tiêu (±1s), không watermark, không lỗi frame.

**FAIL =** sai tỉ lệ/độ phân giải, mất tiếng, file hỏng, có watermark.
→ Ghi `REJECTED_TECH_FAIL`.

---

## Verdict

| Kết quả | Ghi registry |
|---|---|
| 3/3 PASS | `APPROVED` |
| QC1 FAIL | `REJECTED_IDENTITY_FAIL` |
| QC2 FAIL | `REJECTED_CONTENT_FAIL` |
| QC3 FAIL | `REJECTED_TECH_FAIL` |

**Evidence bắt buộc mỗi lần duyệt:** reviewer · file đã review · bộ ref đã dùng · frames/contact sheet · ngày.

Chạy QC kỹ thuật (ffprobe + trích khung): `node manual/qc-video.mjs <video> [outDir]`
