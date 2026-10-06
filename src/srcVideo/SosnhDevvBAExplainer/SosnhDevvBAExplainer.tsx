import React from "react";
import { AbsoluteFill, Series, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandHeader } from "../../ExplainerTemplate/components/BrandHeader";
import { audioManifest } from "./audioData";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Solution } from "./scenes/Scene3Solution";
import { Scene4Flow } from "./scenes/Scene4Flow";
import { Scene5Benefits } from "./scenes/Scene5Benefits";
import { Scene6Outro } from "./scenes/Scene6Outro";

export const SosnhDevvBAExplainer: React.FC<{ channelName?: string }> = ({ channelName = "FierZone" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = fadeIn * fadeOut;

  const scenes = audioManifest.scenes;
  const d1 = (scenes[0]?.durationInFrames || 180) + 3;
  const d2 = (scenes[1]?.durationInFrames || 180) + 3;
  const d3 = (scenes[2]?.durationInFrames || 180) + 3;
  const d4 = (scenes[3]?.durationInFrames || 180) + 3;
  const d5 = (scenes[4]?.durationInFrames || 180) + 3;
  const d6 = (scenes[5]?.durationInFrames || 180) + 10;

  return (
    <AbsoluteFill style={{ opacity }} className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black font-sans text-white select-none">
      <BrandHeader channelName={channelName} />

      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-sky-600/15 blur-[140px]" />
      <div className="absolute top-1/2 -right-40 h-[700px] w-[700px] rounded-full bg-indigo-600/15 blur-[160px]" />
      <div className="absolute -bottom-40 left-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[140px]" />

      <Series>
        <Series.Sequence durationInFrames={d1}><Scene1Hook /></Series.Sequence>
        <Series.Sequence durationInFrames={d2}><Scene2Problem /></Series.Sequence>
        <Series.Sequence durationInFrames={d3}><Scene3Solution /></Series.Sequence>
        <Series.Sequence durationInFrames={d4}><Scene4Flow /></Series.Sequence>
        <Series.Sequence durationInFrames={d5}><Scene5Benefits /></Series.Sequence>
        <Series.Sequence durationInFrames={d6}><Scene6Outro /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
