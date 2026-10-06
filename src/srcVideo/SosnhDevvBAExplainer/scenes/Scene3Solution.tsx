import React from "react";
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
      <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/20 text-6xl border border-emerald-400/40 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
          🧠
        </div>
        <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-emerald-300 uppercase">CẢNH 3 / GIẢI PHÁP CỐT LÕI</span>
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
          BỘ NÃO PHÂN TÍCH BA
        </h1>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
