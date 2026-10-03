import { z } from "zod";

export const TimelineEventSchema = z.object({
  id: z.uuid(),
  year: z.number(),
  title: z.string(),
  title_fa: z.string().nullable(),
  description: z.string().nullable(),
  description_fa: z.string().nullable(),
  photo_path: z.string().nullable(),
  kind: z.enum(["milestone", "lecture", "award", "publication"]),
  sort_order: z.number(),
  published: z.boolean(),
  created_at: z.string(),
});

export const TimelineSchema = z.array(TimelineEventSchema);

export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
