import React from "react";
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
      <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div style={{ transform: `scale(${ringScale})` }} className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 text-6xl shadow-[0_0_50px_rgba(56,189,248,0.6)] border border-sky-300/40">
          🥊
        </div>
        <div className="rounded-full border border-sky-400/40 bg-sky-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-sky-300 uppercase">CẢNH 1 / HOOK MỞ ĐẦU</span>
        </div>
        <h1 className="text-7xl font-black tracking-tight leading-tight bg-gradient-to-r from-sky-300 via-white to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          DEV VS BA: AI GÁNH TEAM?
        </h1>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
