import fs from "fs";
import path from "path";

/**
 * Creates dynamic generated folder src/generated/<topicKey>/ and registers <Composition> in src/Root.tsx
 */
export function createTopicComposition(topicKey, totalDurationFrames = 1280) {
  const rootDir = process.cwd();
  const srcTopicDir = path.join(rootDir, "src", "generated", topicKey);

  if (!fs.existsSync(srcTopicDir)) {
    fs.mkdirSync(srcTopicDir, { recursive: true });
  }

  // 1. Write <TopicKey>.tsx wrapper using universal ExplainerTemplate
  const componentCode = `import React from "react";
import { ExplainerTemplate } from "../../ExplainerTemplate/ExplainerTemplate";
import { audioManifest } from "./audioData";

export const ${topicKey}: React.FC<{ channelName?: string }> = ({ channelName = "FierZone" }) => {
  return (
    <ExplainerTemplate
      channelName={channelName}
      title="${topicKey}"
      subtitle="AI Video Explainer"
      manifest={audioManifest as any}
    />
  );
};
`;
  fs.writeFileSync(path.join(srcTopicDir, `${topicKey}.tsx`), componentCode, "utf-8");

  // 2. Register in src/Root.tsx if not registered
  const rootTsxPath = path.join(rootDir, "src", "Root.tsx");
  let rootTsx = fs.readFileSync(rootTsxPath, "utf-8");

  if (!rootTsx.includes(`id="${topicKey}"`)) {
    const importLine = `import { ${topicKey} } from "./generated/${topicKey}/${topicKey}";\n`;
    rootTsx = importLine + rootTsx;

    const compBlock = `
      <Composition
        id="${topicKey}"
        component={${topicKey}}
        durationInFrames={${totalDurationFrames}}
        fps={30}
        width={1080}
        height={1920}
        schema={explainerTemplateSchema}
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
