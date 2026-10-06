import React from "react";
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
      <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-500/20 text-5xl border border-pink-400/40 shadow-[0_0_30px_rgba(236,72,153,0.5)]">
          ⭐
        </div>
        <div className="rounded-full border border-pink-400/40 bg-pink-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-pink-300 uppercase">CẢNH 6 / TỔNG KẾT & KÊU GỌI</span>
        </div>

        <h1 className="text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-pink-300 via-purple-200 to-sky-300 bg-clip-text text-transparent">
          DEV LÀ ĐÔI TAY, BA LÀ ĐÔI MẮT
        </h1>

        <div style={{ transform: `scale(${ctaScale})` }} className="flex items-center gap-5 mt-4">
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
