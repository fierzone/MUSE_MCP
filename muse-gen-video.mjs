#!/usr/bin/env node
/**
 * muse-gen-video.mjs — Integrates Muse-Chat-MCP with Remotion AI Video Template.
 *
 * Usage:
 *   npm run gen-video                               # Generates demo video DockerExplainer
 *   npm run gen-video -- --topic DockerExplainer    # Render specific topic
 *   npm run gen-video -- --prompt "Giải thích Kubernetes trong 6 cảnh ngắn"
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = __dirname;
const SHIM_URL = process.env.MUSE_SHIM_URL || "http://127.0.0.1:8787/v1";

const args = process.argv.slice(2);
let topicKey = "DockerExplainer";
let promptText = "";
let channelName = process.env.CHANNEL_NAME || "FierZone";
let skipRender = false;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--topic" || a === "-t") {
    topicKey = args[++i] || topicKey;
  } else if (a === "--prompt" || a === "-p") {
    promptText = args[++i] || "";
  } else if (a === "--channel" || a === "-c") {
    channelName = args[++i] || channelName;
  } else if (a === "--no-render") {
    skipRender = true;
  } else if (!a.startsWith("-") && !promptText && i === 0) {
    topicKey = a;
  }
}

console.log("🎬 =========================================================");
console.log("🚀 MUSE AI VIDEO GENERATOR & REMOTION TEMPLATE INTEGRATION");
console.log("🎬 =========================================================\n");

async function askMuseForScript(prompt) {
  console.log(`🤖 Requesting Muse AI to generate script for: "${prompt}"...`);
  const systemPrompt = `Bạn là một biên kịch video ngắn chuyên nghiệp. Hãy viết kịch bản 6 cảnh cho chủ đề được yêu cầu.
Trả về DUY NHẤT một chuỗi JSON array gồm 6 phần tử có cấu trúc như sau, không kèm bất kỳ giải thích nào khác:
[
  {"id": "scene1_hook", "text": "Lời thoại cảnh 1 (gây chú ý)"},
  {"id": "scene2_problem", "text": "Lời thoại cảnh 2 (nêu vấn đề)"},
  {"id": "scene3_container", "text": "Lời thoại cảnh 3 (giải pháp cốt lõi)"},
  {"id": "scene4_image_dockerfile", "text": "Lời thoại cảnh 4 (quy trình hoạt động)"},
  {"id": "scene5_benefits", "text": "Lời thoại cảnh 5 (lợi ích vượt trội)"},
  {"id": "scene6_outro", "text": "Lời thoại cảnh 6 (tổng kết & kêu gọi đăng ký)"}
]`;

  try {
    const res = await fetch(`${SHIM_URL}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: "muse-spark-1.3",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        stream: false,
      }),
    });
    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    const match = rawContent.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Could not parse JSON script from Muse response");
  } catch (err) {
    console.warn("⚠️ Could not fetch script dynamically from Muse AI, using fallback template script.");
    console.warn("Reason:", err.message);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`❌ Template directory not found at: ${TEMPLATE_DIR}`);
    process.exit(1);
  }

  let scenesFile = null;

  if (promptText) {
    const customScenes = await askMuseForScript(promptText);
    if (customScenes && Array.isArray(customScenes)) {
      console.log(`✅ Received ${customScenes.length} scenes from Muse AI.`);
      if (topicKey === "DockerExplainer") {
        const cleanPrompt = promptText.replace(/[^a-zA-Z0-9]/g, "");
        topicKey = (cleanPrompt.slice(0, 15) || "CustomTopic") + "Explainer";
      }

      const topicDir = path.join(TEMPLATE_DIR, "src", "srcVideo", topicKey);
      if (!fs.existsSync(topicDir)) {
        fs.mkdirSync(topicDir, { recursive: true });
      }
      const scenesJsonPath = path.join(topicDir, "scenes.json");
      fs.writeFileSync(
        scenesJsonPath,
        JSON.stringify({ topicKey, scenes: customScenes }, null, 2),
        "utf-8"
      );
      scenesFile = `src/srcVideo/${topicKey}/scenes.json`;
    }
  }

  // 1. Generate Voiceover TTS & Frame sync
  console.log(`\n🎙️ Step 1: Generating Edge TTS voiceovers & manifest for topic: "${topicKey}"...`);
  const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const ttsArgs = scenesFile
    ? ["tsx", "scripts/generate-tts.ts", "--scenesFile", scenesFile]
    : ["tsx", "scripts/generate-docker-audio.ts"];

  const ttsRes = spawnSync(npxCmd, ttsArgs, {
    cwd: TEMPLATE_DIR,
    stdio: "inherit",
    shell: true,
  });

  if (ttsRes.status !== 0) {
    console.error("❌ Failed to generate audio voiceover.");
    process.exit(1);
  }

  if (skipRender) {
    console.log("⏩ Skipping render as requested.");
    return;
  }

  // 2. Render Remotion Video MP4
  console.log(`\n🎥 Step 2: Rendering Remotion Video MP4 for topic: "${topicKey}"...`);
  const outDir = path.join(__dirname, "downloads");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const mp4FileName = `${topicKey}.mp4`;
  const outputMp4Path = path.join(outDir, mp4FileName);

  console.log(`🏷️ Brand Header channel name: "${channelName}"`);
  const renderRes = spawnSync(
    npxCmd,
    ["remotion", "render", topicKey, outputMp4Path, `--props=${JSON.stringify({ channelName })}`],
    {
      cwd: TEMPLATE_DIR,
      stdio: "inherit",
      shell: true,
      env: { ...process.env, CHANNEL_NAME: channelName },
    }
  );

  if (renderRes.status === 0) {
    console.log("\n🎉 =========================================================");
    console.log(`🎉 VIDEO RENDERED SUCCESSFULLY!`);
    console.log(`📁 File saved at: ${outputMp4Path}`);
    console.log("🎉 =========================================================\n");
  } else {
    console.error("❌ Video render failed.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Integration error:", err);
  process.exit(1);
});
