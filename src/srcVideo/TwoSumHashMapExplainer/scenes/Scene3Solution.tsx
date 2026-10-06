import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { SubtitleBox } from "../../../ExplainerTemplate/components/SubtitleBox";
import { audioManifest } from "../audioData";

export const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneData = audioManifest.scenes[2] || { text: "", durationInFrames: 260, audioPath: "" };

  const scale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardScale = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 100 } });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white select-none">
      {sceneData.audioPath && <Audio src={staticFile(sceneData.audioPath)} />}
      <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/20 text-6xl border border-emerald-400/40 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
          🚀
        </div>
        <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-emerald-300 uppercase">GIẢI PHÁP: HASHMAP O(1) LOOKUP</span>
        </div>
        
        <div style={{ transform: `scale(${cardScale})` }} className="rounded-3xl border-2 border-emerald-400/40 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold text-emerald-400">⚡ Tra Cứu HashMap</span>
            <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 font-mono text-lg font-bold rounded-full border border-emerald-400/30">O(1) Lookup</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left font-mono">
            <div className="rounded-2xl bg-slate-800/80 p-5 border border-slate-700">
              <span className="text-slate-400 text-sm block mb-1">Công Thức Cần Tìm:</span>
              <span className="text-3xl font-black text-amber-300">Target - Num</span>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-5 border border-slate-700">
              <span className="text-slate-400 text-sm block mb-1">Tốc Độ Tra Cứu:</span>
              <span className="text-3xl font-black text-emerald-400">Tức Thì O(1)</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 p-4 text-emerald-200 text-xl font-medium">
            💡 Không cần lặp lại mảng! Chỉ lấy số đang tìm tra ngay vào Hash Table.
          </div>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};

