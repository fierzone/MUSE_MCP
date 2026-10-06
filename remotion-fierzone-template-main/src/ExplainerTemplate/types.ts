import { z } from "zod";

export const sceneSchema = z.object({
  id: z.string(),
  text: z.string(),
  durationInFrames: z.number(),
  audioPath: z.string(),
});

export const explainerTemplateSchema = z.object({
  title: z.string().default("AI Explainer Video"),
  subtitle: z.string().default("Phim Ngắn Đồ Họa 9:16"),
  channelName: z.string().default(process.env.CHANNEL_NAME || "FierZone"),
});

export type SceneData = z.infer<typeof sceneSchema>;
export type ExplainerTemplateProps = z.infer<typeof explainerTemplateSchema> & {
  manifest?: {
    topic: string;
    voice?: string;
    totalScenes: number;
    totalDurationFrames: number;
    scenes: SceneData[];
  };
};
