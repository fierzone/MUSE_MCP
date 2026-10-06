import fs from "fs";
import path from "path";

/**
 * Creates dynamic component folder src/<topicKey>/ and registers <Composition> in src/Root.tsx
 */
export function createTopicComposition(topicKey, totalDurationFrames = 1280) {
  const rootDir = process.cwd();
  const srcTopicDir = path.join(rootDir, "src", topicKey);

  if (!fs.existsSync(srcTopicDir)) {
    fs.mkdirSync(srcTopicDir, { recursive: true });
  }

  const schemaName = `${topicKey.charAt(0).toLowerCase() + topicKey.slice(1)}Schema`;

  // 1. Write types.ts
  const typesCode = `import { z } from "zod";

export const ${schemaName} = z.object({
  title: z.string().default("${topicKey}"),
  subtitle: z.string().default("AI Video Explainer"),
  channelName: z.string().default(process.env.CHANNEL_NAME || "FierZone"),
});

export type ${topicKey}Props = z.infer<typeof ${schemaName}>;
`;
  fs.writeFileSync(path.join(srcTopicDir, "types.ts"), typesCode, "utf-8");

  // 2. Write <TopicKey>.tsx
  const componentCode = `import React from "react";
import { AbsoluteFill, Series, interpolate, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { ${topicKey}Props } from "./types";
import { audioManifest } from "./audioData";
import { BrandHeader } from "../DockerExplainer/components/BrandHeader";
import { SubtitleBox } from "../DockerExplainer/components/SubtitleBox";

export const ${topicKey}: React.FC<${topicKey}Props> = ({
  channelName = process.env.CHANNEL_NAME || "FierZone",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = fadeIn * fadeOut;

  const scenes = audioManifest.scenes;

  return (
    <AbsoluteFill style={{ opacity }} className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black font-sans text-white select-none">
      <BrandHeader channelName={channelName} />

      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-sky-600/15 blur-[140px]" />
      <div className="absolute top-1/2 -right-40 h-[700px] w-[700px] rounded-full bg-indigo-600/15 blur-[160px]" />
      <div className="absolute -bottom-40 left-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[140px]" />

      <Series>
        {scenes.map((sc: any, i: number) => {
          const duration = sc.durationInFrames + (i === scenes.length - 1 ? 10 : 3);
          return (
            <Series.Sequence key={sc.id} durationInFrames={duration}>
              <AbsoluteFill className="flex flex-col items-center justify-center px-10 text-white">
                <Audio src={staticFile(sc.audioPath)} />
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="rounded-full border border-sky-400/40 bg-sky-500/10 px-8 py-3.5 backdrop-blur-md">
                    <span className="text-2xl font-black tracking-widest text-sky-300 uppercase">CẢNH {i + 1} / {scenes.length}</span>
                  </div>
                  <h1 className="text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent max-w-4xl">
                    {sc.id.replace(/_/g, ' ').toUpperCase()}
                  </h1>
                </div>
                <SubtitleBox text={sc.text} durationInFrames={sc.durationInFrames} className="mt-64" />
              </AbsoluteFill>
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
`;
  fs.writeFileSync(path.join(srcTopicDir, `${topicKey}.tsx`), componentCode, "utf-8");

  // 3. Register in src/Root.tsx if not registered
  const rootTsxPath = path.join(rootDir, "src", "Root.tsx");
  let rootTsx = fs.readFileSync(rootTsxPath, "utf-8");

  if (!rootTsx.includes(`import { ${topicKey} }`)) {
    const importLine = `import { ${topicKey} } from "./${topicKey}/${topicKey}";\nimport { ${schemaName} } from "./${topicKey}/types";\n`;
    rootTsx = importLine + rootTsx;

    const compBlock = `
      <Composition
        id="${topicKey}"
        component={${topicKey}}
        durationInFrames={${totalDurationFrames}}
        fps={30}
        width={1080}
        height={1920}
        schema={${schemaName}}
        defaultProps={{
          title: "${topicKey}",
          subtitle: "AI Video Explainer",
          channelName: "FierZone",
        }}
      />`;
    rootTsx = rootTsx.replace("</>", `${compBlock}\n    </>`);
    fs.writeFileSync(rootTsxPath, rootTsx, "utf-8");
  }
}
