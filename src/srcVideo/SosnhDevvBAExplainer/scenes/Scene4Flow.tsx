import React from "react";
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
      <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-indigo-300 uppercase">CẢNH 4 / QUY TRÌNH HỢP TÁC SPRINT</span>
        </div>

        {/* 3 Step Flow Diagram */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <div style={{ transform: `scale(${step1X})` }} className="flex flex-col items-center rounded-2xl border border-indigo-400/30 bg-slate-900/80 px-6 py-4 backdrop-blur-md shadow-lg">
            <span className="text-3xl">📋</span>
            <span className="text-xl font-bold text-indigo-200 mt-1">1. BA Story</span>
          </div>
          <span className="text-3xl text-indigo-400 font-bold">➔</span>
          <div style={{ transform: `scale(${step2X})` }} className="flex flex-col items-center rounded-2xl border border-sky-400/30 bg-slate-900/80 px-6 py-4 backdrop-blur-md shadow-lg">
            <span className="text-3xl">💻</span>
            <span className="text-xl font-bold text-sky-200 mt-1">2. Dev Code</span>
          </div>
          <span className="text-3xl text-sky-400 font-bold">➔</span>
          <div style={{ transform: `scale(${step3X})` }} className="flex flex-col items-center rounded-2xl border border-emerald-400/30 bg-slate-900/80 px-6 py-4 backdrop-blur-md shadow-lg">
            <span className="text-3xl">🚀</span>
            <span className="text-xl font-bold text-emerald-200 mt-1">3. Demo</span>
          </div>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
