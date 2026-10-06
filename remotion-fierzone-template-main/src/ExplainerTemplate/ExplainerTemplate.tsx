import React from "react";
import {
  AbsoluteFill,
  Series,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
} from "remotion";
import { ExplainerTemplateProps } from "./types";
import { BrandHeader } from "./components/BrandHeader";
import { SubtitleBox } from "./components/SubtitleBox";

export const ExplainerTemplate: React.FC<ExplainerTemplateProps> = ({
  channelName = process.env.CHANNEL_NAME || "FierZone",
  manifest,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const opacity = fadeIn * fadeOut;

  const scenes = manifest?.scenes || [];

  return (
    <AbsoluteFill
      style={{ opacity }}
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black font-sans text-white select-none"
    >
      <BrandHeader channelName={channelName} />

      {/* Dynamic Background Glow Animations */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-sky-600/15 blur-[140px]" />
      <div className="absolute top-1/2 -right-40 h-[700px] w-[700px] rounded-full bg-indigo-600/15 blur-[160px]" />
      <div className="absolute -bottom-40 left-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[140px]" />

      <Series>
        {scenes.map((sc, i) => {
          const duration =
            sc.durationInFrames + (i === scenes.length - 1 ? 10 : 3);
          const title = (sc.id || `Cảnh ${i + 1}`)
            .replace(/_/g, " ")
            .toUpperCase();

          return (
            <Series.Sequence key={sc.id || i} durationInFrames={duration}>
              <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white">
                {sc.audioPath && <Audio src={staticFile(sc.audioPath)} />}

                {/* Animated Scene Title Card */}
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="rounded-full border border-sky-400/40 bg-sky-500/10 px-8 py-3.5 backdrop-blur-md shadow-lg">
                    <span className="text-2xl font-black tracking-widest text-sky-300 uppercase">
                      PHÂN CẢNH {i + 1} / {scenes.length}
                    </span>
                  </div>
                  <h1 className="text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent max-w-4xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                    {title}
                  </h1>
                </div>

                {/* Kinetic Subtitle Banner */}
                <SubtitleBox
                  text={sc.text}
                  durationInFrames={sc.durationInFrames}
                  className="mt-64"
                />
              </AbsoluteFill>
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
