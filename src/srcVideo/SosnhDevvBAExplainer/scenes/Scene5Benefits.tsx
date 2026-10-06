import React from "react";
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
      <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-cyan-300 uppercase">CẢNH 5 / GIẢM 50% LỖI DỰ ÁN</span>
        </div>

        <div className="flex gap-6 mt-2">
          <div style={{ transform: `scale(${b1})` }} className="flex flex-col items-center rounded-3xl border-2 border-cyan-400/40 bg-cyan-950/40 p-6 backdrop-blur-xl shadow-xl">
            <span className="text-5xl font-black text-cyan-300">-50%</span>
            <span className="text-xl font-bold text-slate-200 mt-2">Thời gian sửa lỗi</span>
          </div>
          <div style={{ transform: `scale(${b2})` }} className="flex flex-col items-center rounded-3xl border-2 border-emerald-400/40 bg-emerald-950/40 p-6 backdrop-blur-xl shadow-xl">
            <span className="text-5xl font-black text-emerald-300">100%</span>
            <span className="text-xl font-bold text-slate-200 mt-2">Đúng tiến độ Demo</span>
          </div>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};
