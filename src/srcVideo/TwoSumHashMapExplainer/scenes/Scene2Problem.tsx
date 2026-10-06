import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { SubtitleBox } from "../../../ExplainerTemplate/components/SubtitleBox";
import { audioManifest } from "../audioData";

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneData = audioManifest.scenes[1] || { text: "", durationInFrames: 262, audioPath: "" };

  const scale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardY = interpolate(frame, [5, 20], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white select-none">
      {sceneData.audioPath && <Audio src={staticFile(sceneData.audioPath)} />}
      <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center gap-6 text-center max-w-4xl z-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/20 text-5xl border border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          🐢
        </div>
        <div className="rounded-full border border-amber-400/40 bg-amber-500/10 px-8 py-3.5 backdrop-blur-md">
          <span className="text-2xl font-black tracking-widest text-amber-300 uppercase">2 VÒNG FOR = O(n²) CỰC CHẬM</span>
        </div>
        
        <div style={{ transform: `translateY(${cardY}px)` }} className="rounded-3xl border-2 border-amber-500/40 bg-slate-900/90 p-8 text-left shadow-2xl backdrop-blur-xl w-full max-w-2xl">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-4">
            <span className="text-lg font-mono text-amber-400">// Brute Force Approach</span>
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-sm font-bold border border-rose-500/30">O(n²) Time</span>
          </div>
          <pre className="font-mono text-2xl text-slate-200 leading-relaxed overflow-x-auto">
            <code>
              <span className="text-purple-400">for</span> (i = 0; i &lt; n; i++) &#123;<br />
              &nbsp;&nbsp;<span className="text-purple-400">for</span> (j = i + 1; j &lt; n; j++) &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> (nums[i] + nums[j] == target)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">return</span> [i, j];<br />
              &nbsp;&nbsp;&#125;<br />
              &#125;
            </code>
          </pre>
          <div className="mt-6 rounded-2xl bg-rose-950/60 border border-rose-500/40 p-4 text-center">
            <p className="text-rose-200 font-bold text-xl">⚠️ N = 10.000 phần tử → 100 TRIỆU phép so sánh!</p>
          </div>
        </div>
      </div>
      <SubtitleBox text={sceneData.text} durationInFrames={sceneData.durationInFrames} className="mt-64" />
    </AbsoluteFill>
  );
};

