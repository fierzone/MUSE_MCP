import React from "react";
import { ExplainerTemplate } from "../../ExplainerTemplate/ExplainerTemplate";
import { audioManifest } from "./audioData";

export const SosnhDevvBAExplainer: React.FC<{ channelName?: string }> = ({ channelName = "FierZone" }) => {
  return (
    <ExplainerTemplate
      channelName={channelName}
      title="SosnhDevvBAExplainer"
      subtitle="AI Video Explainer"
      manifest={audioManifest as any}
    />
  );
};
