import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { SubtitleBox } from "../../../ExplainerTemplate/components/SubtitleBox";
import { audioManifest } from "../audioData";

export const Scene4Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneData = audioManifest.scenes[3] || { text: "", durationInFrames: 273, audioPath: "" };

  const scale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step1X = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 100 } });
  const step2X = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 100 } });
  const step3X = spring({ frame: frame - 22, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white select-none">
      {sceneData.audioPath && <Audio src={staticFile(sceneData.audioPath)} />}
      <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="rounded-full border border-sky-400/40 bg-sky-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-sky-300 uppercase">QUY TRÌNH 3 BƯỚC THUẬT TOÁN</span>
        </div>

        {/* 3 Step Flow Diagram */}
        <div className="flex flex-col gap-4 mt-2 w-full max-w-2xl">
          <div style={{ transform: `scale(${step1X})` }} className="flex items-center gap-4 rounded-2xl border border-indigo-400/30 bg-slate-900/90 px-6 py-4 backdrop-blur-md shadow-lg text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 text-2xl font-black border border-indigo-400/40">1</span>
            <div>
              <h3 className="text-xl font-bold text-indigo-200">Tính Số Cần Tìm (Complement)</h3>
              <p className="text-slate-300 text-base font-mono mt-0.5">diff = target - nums[i]</p>
            </div>
          </div>

          <div style={{ transform: `scale(${step2X})` }} className="flex items-center gap-4 rounded-2xl border border-sky-400/30 bg-slate-900/90 px-6 py-4 backdrop-blur-md shadow-lg text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300 text-2xl font-black border border-sky-400/40">2</span>
            <div>
              <h3 className="text-xl font-bold text-sky-200">Tra Cứu HashMap O(1)</h3>
              <p className="text-slate-300 text-base font-mono mt-0.5">map.has(diff) ?</p>
            </div>
          </div>

          <div style={{ transform: `scale(${step3X})` }} className="flex items-center gap-4 rounded-2xl border border-emerald-400/30 bg-slate-900/90 px-6 py-4 backdrop-blur-md shadow-lg text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 text-2xl font-black border border-emerald-400/40">3</span>
            <div>
              <h3 className="text-xl font-bold text-emerald-200">Trả Kết Quả / Ghi Nhớ</h3>
              <p className="text-slate-300 text-base font-mono mt-0.5">Found: return [map.get(diff), i] | Else: map.set(nums[i], i)</p>
            </div>
          </div>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};

