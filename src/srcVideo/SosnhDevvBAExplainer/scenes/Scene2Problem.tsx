import React from "react";
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
      <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/20 text-5xl border border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          😅
        </div>
        <div className="rounded-full border border-amber-400/40 bg-amber-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-amber-300 uppercase">NỖI ĐAU BÀN GIAO MÃ NGUỒN</span>
        </div>
        <div style={{ transform: `translateY(${cardY}px)` }} className="rounded-3xl border-2 border-amber-400/30 bg-amber-950/40 p-8 text-center shadow-2xl backdrop-blur-xl max-w-2xl">
          <h2 className="text-4xl font-black text-amber-200 leading-tight">
            &quot;Ơ kìa, trên máy em vẫn chạy ngon mà?!&quot;
          </h2>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
