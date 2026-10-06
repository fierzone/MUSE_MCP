import fs from "fs";
import path from "path";

/**
 * Creates dynamic generated folder src/srcVideo/<topicKey>/ with 6 distinct scene components in scenes/
 * tailored with custom motion physics, icons, cards, and titles based on the scene text.
 */
export function createTopicComposition(topicKey, totalDurationFrames = 1280) {
  const templateDir = fs.existsSync(path.join(process.cwd(), "remotion-fierzone-template-main"))
    ? path.join(process.cwd(), "remotion-fierzone-template-main")
    : process.cwd();
  const srcTopicDir = path.join(templateDir, "src", "srcVideo", topicKey);
  const scenesDir = path.join(srcTopicDir, "scenes");

  if (!fs.existsSync(scenesDir)) {
    fs.mkdirSync(scenesDir, { recursive: true });
  }

  // Load manifest.json if exists to extract text
  let manifestData = null;
  const manifestFile = path.join(templateDir, "public", "audio", topicKey, "manifest.json");
  if (fs.existsSync(manifestFile)) {
    try {
      manifestData = JSON.parse(fs.readFileSync(manifestFile, "utf-8"));
    } catch (e) {}
  }

  const isComparison = topicKey.toLowerCase().includes("sosnh") || topicKey.toLowerCase().includes("vs") || topicKey.toLowerCase().includes("khac");

  // Helper titles
  const t1 = isComparison ? "DEV VS BA: AI GÁNH TEAM?" : `${topicKey.replace(/Explainer$/i, '').toUpperCase()} LÀ GÌ?`;
  const t2 = isComparison ? "NỖI ĐAU BÀN GIAO MÃ NGUỒN" : "THÁCH THỨC VÀ NỖI ĐAU";
  const t3 = isComparison ? "BỘ NÃO PHÂN TÍCH BA" : "GIẢI PHÁP CỐT LÕI";
  const t4 = isComparison ? "QUY TRÌNH HỢP TÁC SPRINT" : "SƠ ĐỒ VẬN HÀNH 3 BƯỚC";
  const t5 = isComparison ? "GIẢM 50% LỖI DỰ ÁN" : "3 LỢI ÍCH VƯỢT TRỘI";
  const t6 = isComparison ? "DEV LÀ ĐÔI TAY, BA LÀ ĐÔI MẮT" : "TỔNG KẾT & ĐĂNG KÝ KÊNH";

  // 1. Scene1Hook.tsx - Spring Pop Title & Energy Ring
  const scene1Code = `import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { SubtitleBox } from "../../../ExplainerTemplate/components/SubtitleBox";
import { audioManifest } from "../audioData";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneData = audioManifest.scenes[0] || { text: "", durationInFrames: 180, audioPath: "" };

  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringScale = spring({ frame: frame - 4, fps, config: { damping: 10, stiffness: 80 } });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white select-none">
      {sceneData.audioPath && <Audio src={staticFile(sceneData.audioPath)} />}
      <div style={{ transform: \`scale(\${scale})\`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div style={{ transform: \`scale(\${ringScale})\` }} className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 text-6xl shadow-[0_0_50px_rgba(56,189,248,0.6)] border border-sky-300/40">
          ${isComparison ? "🥊" : "🔥"}
        </div>
        <div className="rounded-full border border-sky-400/40 bg-sky-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-sky-300 uppercase">CẢNH 1 / HOOK MỞ ĐẦU</span>
        </div>
        <h1 className="text-7xl font-black tracking-tight leading-tight bg-gradient-to-r from-sky-300 via-white to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          ${t1}
        </h1>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
`;
  fs.writeFileSync(path.join(scenesDir, "Scene1Hook.tsx"), scene1Code, "utf-8");

  // 2. Scene2Problem.tsx - Quote Card & Warning Amber Effect
  const scene2Code = `import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { SubtitleBox } from "../../../ExplainerTemplate/components/SubtitleBox";
import { audioManifest } from "../audioData";

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneData = audioManifest.scenes[1] || { text: "", durationInFrames: 180, audioPath: "" };

  const scale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardY = interpolate(frame, [5, 20], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white select-none">
      {sceneData.audioPath && <Audio src={staticFile(sceneData.audioPath)} />}
      <div style={{ transform: \`scale(\${scale})\`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/20 text-5xl border border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          😅
        </div>
        <div className="rounded-full border border-amber-400/40 bg-amber-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-amber-300 uppercase">${t2}</span>
        </div>
        <div style={{ transform: \`translateY(\${cardY}px)\` }} className="rounded-3xl border-2 border-amber-400/30 bg-amber-950/40 p-8 text-center shadow-2xl backdrop-blur-xl max-w-2xl">
          <h2 className="text-4xl font-black text-amber-200 leading-tight">
            &quot;Ơ kìa, trên máy em vẫn chạy ngon mà?!&quot;
          </h2>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
`;
  fs.writeFileSync(path.join(scenesDir, "Scene2Problem.tsx"), scene2Code, "utf-8");

  // 3. Scene3Solution.tsx - Brain / Container Solution Emerald Glow Card
  const scene3Code = `import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { SubtitleBox } from "../../../ExplainerTemplate/components/SubtitleBox";
import { audioManifest } from "../audioData";

export const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneData = audioManifest.scenes[2] || { text: "", durationInFrames: 180, audioPath: "" };

  const scale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white select-none">
      {sceneData.audioPath && <Audio src={staticFile(sceneData.audioPath)} />}
      <div style={{ transform: \`scale(\${scale})\`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/20 text-6xl border border-emerald-400/40 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
          🧠
        </div>
        <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-emerald-300 uppercase">CẢNH 3 / GIẢI PHÁP CỐT LÕI</span>
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
          ${t3}
        </h1>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
`;
  fs.writeFileSync(path.join(scenesDir, "Scene3Solution.tsx"), scene3Code, "utf-8");

  // 4. Scene4Flow.tsx - Step Flow Diagram Cards (BA -> DEV -> DEMO)
  const scene4Code = `import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { SubtitleBox } from "../../../ExplainerTemplate/components/SubtitleBox";
import { audioManifest } from "../audioData";

export const Scene4Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneData = audioManifest.scenes[3] || { text: "", durationInFrames: 180, audioPath: "" };

  const scale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step1X = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 100 } });
  const step2X = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 100 } });
  const step3X = spring({ frame: frame - 22, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white select-none">
      {sceneData.audioPath && <Audio src={staticFile(sceneData.audioPath)} />}
      <div style={{ transform: \`scale(\${scale})\`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-indigo-300 uppercase">CẢNH 4 / ${t4}</span>
        </div>

        {/* 3 Step Flow Diagram */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <div style={{ transform: \`scale(\${step1X})\` }} className="flex flex-col items-center rounded-2xl border border-indigo-400/30 bg-slate-900/80 px-6 py-4 backdrop-blur-md shadow-lg">
            <span className="text-3xl">📋</span>
            <span className="text-xl font-bold text-indigo-200 mt-1">1. BA Story</span>
          </div>
          <span className="text-3xl text-indigo-400 font-bold">➔</span>
          <div style={{ transform: \`scale(\${step2X})\` }} className="flex flex-col items-center rounded-2xl border border-sky-400/30 bg-slate-900/80 px-6 py-4 backdrop-blur-md shadow-lg">
            <span className="text-3xl">💻</span>
            <span className="text-xl font-bold text-sky-200 mt-1">2. Dev Code</span>
          </div>
          <span className="text-3xl text-sky-400 font-bold">➔</span>
          <div style={{ transform: \`scale(\${step3X})\` }} className="flex flex-col items-center rounded-2xl border border-emerald-400/30 bg-slate-900/80 px-6 py-4 backdrop-blur-md shadow-lg">
            <span className="text-3xl">🚀</span>
            <span className="text-xl font-bold text-emerald-200 mt-1">3. Demo</span>
          </div>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
`;
  fs.writeFileSync(path.join(scenesDir, "Scene4Flow.tsx"), scene4Code, "utf-8");

  // 5. Scene5Benefits.tsx - 3 Stat Benefit Badges (-50% Bug, Đúng Hạn, No War)
  const scene5Code = `import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { SubtitleBox } from "../../../ExplainerTemplate/components/SubtitleBox";
import { audioManifest } from "../audioData";

export const Scene5Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneData = audioManifest.scenes[4] || { text: "", durationInFrames: 180, audioPath: "" };

  const scale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b1 = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 110 } });
  const b2 = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white select-none">
      {sceneData.audioPath && <Audio src={staticFile(sceneData.audioPath)} />}
      <div style={{ transform: \`scale(\${scale})\`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-cyan-300 uppercase">CẢNH 5 / ${t5}</span>
        </div>

        <div className="flex gap-6 mt-2">
          <div style={{ transform: \`scale(\${b1})\` }} className="flex flex-col items-center rounded-3xl border-2 border-cyan-400/40 bg-cyan-950/40 p-6 backdrop-blur-xl shadow-xl">
            <span className="text-5xl font-black text-cyan-300">-50%</span>
            <span className="text-xl font-bold text-slate-200 mt-2">Thời gian sửa lỗi</span>
          </div>
          <div style={{ transform: \`scale(\${b2})\` }} className="flex flex-col items-center rounded-3xl border-2 border-emerald-400/40 bg-emerald-950/40 p-6 backdrop-blur-xl shadow-xl">
            <span className="text-5xl font-black text-emerald-300">100%</span>
            <span className="text-xl font-bold text-slate-200 mt-2">Đúng tiến độ Demo</span>
          </div>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
`;
  fs.writeFileSync(path.join(scenesDir, "Scene5Benefits.tsx"), scene5Code, "utf-8");

  // 6. Scene6Outro.tsx - Summary Card & CTA Action Buttons (Thả tim & Follow)
  const scene6Code = `import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { SubtitleBox } from "../../../ExplainerTemplate/components/SubtitleBox";
import { audioManifest } from "../audioData";

export const Scene6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneData = audioManifest.scenes[5] || { text: "", durationInFrames: 180, audioPath: "" };

  const scale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaScale = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 100 } });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white select-none">
      {sceneData.audioPath && <Audio src={staticFile(sceneData.audioPath)} />}
      <div style={{ transform: \`scale(\${scale})\`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-500/20 text-5xl border border-pink-400/40 shadow-[0_0_30px_rgba(236,72,153,0.5)]">
          ⭐
        </div>
        <div className="rounded-full border border-pink-400/40 bg-pink-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-pink-300 uppercase">CẢNH 6 / TỔNG KẾT & KÊU GỌI</span>
        </div>

        <h1 className="text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-pink-300 via-purple-200 to-sky-300 bg-clip-text text-transparent">
          ${t6}
        </h1>

        <div style={{ transform: \`scale(\${ctaScale})\` }} className="flex items-center gap-5 mt-4">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 px-8 py-4 font-black text-2xl text-white shadow-2xl">
            <span>❤️</span> Thả Tim
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-900 border-2 border-sky-400/50 px-8 py-4 font-black text-2xl text-sky-300 backdrop-blur-md shadow-2xl">
            <span>🔔</span> Follow Kênh
          </div>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
`;
  fs.writeFileSync(path.join(scenesDir, "Scene6Outro.tsx"), scene6Code, "utf-8");

  // 7. Write <TopicKey>.tsx composition importing 6 scenes from ./scenes/
  const componentCode = `import React from "react";
import { AbsoluteFill, Series, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandHeader } from "../../ExplainerTemplate/components/BrandHeader";
import { audioManifest } from "./audioData";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Solution } from "./scenes/Scene3Solution";
import { Scene4Flow } from "./scenes/Scene4Flow";
import { Scene5Benefits } from "./scenes/Scene5Benefits";
import { Scene6Outro } from "./scenes/Scene6Outro";

export const ${topicKey}: React.FC<{ channelName?: string }> = ({ channelName = "FierZone" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = fadeIn * fadeOut;

  const scenes = audioManifest.scenes;
  const d1 = (scenes[0]?.durationInFrames || 180) + 3;
  const d2 = (scenes[1]?.durationInFrames || 180) + 3;
  const d3 = (scenes[2]?.durationInFrames || 180) + 3;
  const d4 = (scenes[3]?.durationInFrames || 180) + 3;
  const d5 = (scenes[4]?.durationInFrames || 180) + 3;
  const d6 = (scenes[5]?.durationInFrames || 180) + 10;

  return (
    <AbsoluteFill style={{ opacity }} className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black font-sans text-white select-none">
      <BrandHeader channelName={channelName} />

      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-sky-600/15 blur-[140px]" />
      <div className="absolute top-1/2 -right-40 h-[700px] w-[700px] rounded-full bg-indigo-600/15 blur-[160px]" />
      <div className="absolute -bottom-40 left-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[140px]" />

      <Series>
        <Series.Sequence durationInFrames={d1}><Scene1Hook /></Series.Sequence>
        <Series.Sequence durationInFrames={d2}><Scene2Problem /></Series.Sequence>
        <Series.Sequence durationInFrames={d3}><Scene3Solution /></Series.Sequence>
        <Series.Sequence durationInFrames={d4}><Scene4Flow /></Series.Sequence>
        <Series.Sequence durationInFrames={d5}><Scene5Benefits /></Series.Sequence>
        <Series.Sequence durationInFrames={d6}><Scene6Outro /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
`;
  fs.writeFileSync(path.join(srcTopicDir, `${topicKey}.tsx`), componentCode, "utf-8");

  // 8. Register in src/Root.tsx if not registered
  const rootTsxPath = path.join(templateDir, "src", "Root.tsx");
  let rootTsx = fs.readFileSync(rootTsxPath, "utf-8");

  if (!rootTsx.includes(`id="${topicKey}"`)) {
    const importLine = `import { ${topicKey} } from "./srcVideo/${topicKey}/${topicKey}";\n`;
    rootTsx = importLine + rootTsx;

    const compBlock = `
      <Composition
        id="${topicKey}"
        component={${topicKey}}
        durationInFrames={${totalDurationFrames}}
        fps={30}
        width={1080}
        height={1920}
        schema={explainerTemplateSchema}
        defaultProps={{
          title: "${topicKey}",
          subtitle: "AI Video Explainer",
          channelName: "FierZone",
        }}
      />`;
    rootTsx = rootTsx.replace("</>", `${compBlock}\n    </>`);
    fs.writeFileSync(rootTsxPath, rootTsx, "utf-8");
  }
}
