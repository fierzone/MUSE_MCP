import { SosnhDevvBAExplainer } from "./generated/SosnhDevvBAExplainer/SosnhDevvBAExplainer";
import "./index.css";
import { Composition } from "remotion";
import { ExplainerTemplate, explainerTemplateSchema } from "./ExplainerTemplate";
import { audioManifest as dockerAudio } from "./generated/DockerExplainer/audioData";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Default Explainer Topic: Docker */}
      <Composition
        id="DockerExplainer"
        component={() => (
          <ExplainerTemplate
            title="Docker là gì?"
            subtitle="Giải thích trong 50 giây"
            channelName="FierZone"
            manifest={dockerAudio as any}
          />
        )}
        durationInFrames={1255}
        fps={30}
        width={1080}
        height={1920}
        schema={explainerTemplateSchema}
        defaultProps={{
          title: "Docker là gì?",
          subtitle: "Giải thích trong 50 giây",
          channelName: "FierZone",
        }}
      />
    
      <Composition
        id="SosnhDevvBAExplainer"
        component={SosnhDevvBAExplainer}
        durationInFrames={1454}
        fps={30}
        width={1080}
        height={1920}
        schema={explainerTemplateSchema}
        defaultProps={{
          title: "SosnhDevvBAExplainer",
          subtitle: "AI Video Explainer",
          channelName: "FierZone",
        }}
      />
    </>
  );
};
