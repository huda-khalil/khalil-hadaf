import { z } from "zod";

export const VideoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  title_fa: z.string().nullable(),
  description: z.string().nullable(),
  description_fa: z.string().nullable(),
  youtube_id: z.string(),
  thumbnail_path: z.string().nullable(),
  kind: z.enum(["interview", "lecture", "program", "other"]),
  featured: z.boolean(),
  published: z.boolean(),
  sort_order: z.number(),
  created_at: z.string(),
});

export const VideosSchema = z.array(VideoSchema);

export type Video = z.infer<typeof VideoSchema>;
