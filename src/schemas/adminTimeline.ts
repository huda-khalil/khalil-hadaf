import { z } from "zod";

export const AdminTimelineSchema = z
  .object({
    year: z.coerce.number().int().min(1000).max(2100),
    title: z.string().optional().nullable(),
    title_fa: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    description_fa: z.string().optional().nullable(),
    photo_path: z.string().optional().nullable(),
    kind: z.enum(["milestone", "lecture", "award", "publication"]),
    sort_order: z.coerce.number().int().default(0),
    published: z.boolean(),
  })
  .refine(
    (data) =>
      (data.title && data.title.trim() !== "") ||
      (data.title_fa && data.title_fa.trim() !== ""),
    {
      message: "At least one title (English or Persian) is required",
      path: ["title"],
    },
  );

export type AdminTimelineInput = z.infer<typeof AdminTimelineSchema>;
