import { DatabaseTransactionExplainer } from "./srcVideo/DatabaseTransactionExplainer/DatabaseTransactionExplainer";
import { TwoSumHashMapExplainer } from "./srcVideo/TwoSumHashMapExplainer/TwoSumHashMapExplainer";
import { SosnhDevvBAExplainer } from "./srcVideo/SosnhDevvBAExplainer/SosnhDevvBAExplainer";
import "./index.css";
import { Composition } from "remotion";
import { ExplainerTemplate, explainerTemplateSchema } from "./ExplainerTemplate";
export const RemotionRoot: React.FC = () => {
  return (
    <>
    
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
    
      <Composition
        id="TwoSumHashMapExplainer"
        component={TwoSumHashMapExplainer}
        durationInFrames={1531}
        fps={30}
        width={1080}
        height={1920}
        schema={explainerTemplateSchema}
        defaultProps={{
          title: "TwoSumHashMapExplainer",
          subtitle: "AI Video Explainer",
          channelName: "FierZone",
        }}
      />
    
      <Composition
        id="DatabaseTransactionExplainer"
        component={DatabaseTransactionExplainer}
        durationInFrames={3886}
        fps={30}
        width={1080}
        height={1920}
        schema={explainerTemplateSchema}
        defaultProps={{
          title: "DatabaseTransactionExplainer",
          subtitle: "AI Video Explainer",
          channelName: "FierZone",
        }}
      />
    </>
  );
};
