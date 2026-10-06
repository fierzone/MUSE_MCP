import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { SubtitleBox } from "../../../ExplainerTemplate/components/SubtitleBox";
import { audioManifest } from "../audioData";

export const Scene5Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneData = audioManifest.scenes[4] || { text: "", durationInFrames: 280, audioPath: "" };

  const scale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b1 = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 110 } });
  const b2 = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white select-none">
      {sceneData.audioPath && <Audio src={staticFile(sceneData.audioPath)} />}
      <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-emerald-300 uppercase">SO SÁNH ĐỘ PHỨC TẠP BẮT MẮT</span>
        </div>

        <div className="flex gap-6 mt-2 w-full max-w-2xl justify-center">
          <div style={{ transform: `scale(${b1})` }} className="flex-1 flex flex-col items-center rounded-3xl border-2 border-rose-500/40 bg-rose-950/40 p-6 backdrop-blur-xl shadow-xl text-center">
            <span className="text-3xl">🐢</span>
            <span className="text-2xl font-black text-rose-300 mt-2">2 Vòng For</span>
            <div className="mt-4 font-mono text-left w-full space-y-2 text-lg">
              <p className="text-slate-300">Time: <span className="text-rose-400 font-bold">O(n²)</span></p>
              <p className="text-slate-300">Space: <span className="text-emerald-400 font-bold">O(1)</span></p>
              <p className="text-rose-300 font-bold pt-2 border-t border-rose-500/30">100.000.000 Phép thử</p>
            </div>
          </div>

          <div style={{ transform: `scale(${b2})` }} className="flex-1 flex flex-col items-center rounded-3xl border-2 border-emerald-400/40 bg-emerald-950/40 p-6 backdrop-blur-xl shadow-xl text-center">
            <span className="text-3xl">⚡</span>
            <span className="text-2xl font-black text-emerald-300 mt-2">HashMap</span>
            <div className="mt-4 font-mono text-left w-full space-y-2 text-lg">
              <p className="text-slate-300">Time: <span className="text-emerald-400 font-bold">O(n)</span></p>
              <p className="text-slate-300">Space: <span className="text-amber-300 font-bold">O(n)</span></p>
              <p className="text-emerald-300 font-bold pt-2 border-t border-emerald-500/30">10.000 Phép thử (⚡x10.000)</p>
            </div>
          </div>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};

