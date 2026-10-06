import { z } from "zod";

export const dockerExplainerSchema = z.object({
  title: z.string().default("Docker là gì?"),
  subtitle: z.string().default("Giải thích trong 50 giây"),
  channelName: z.string().default(process.env.CHANNEL_NAME || "FierZone"),
});

export type DockerExplainerProps = z.infer<typeof dockerExplainerSchema>;
