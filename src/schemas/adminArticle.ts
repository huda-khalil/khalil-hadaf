import { z } from "zod";

export const AdminArticleSchema = z
  .object({
    slug: z.string().min(1, "Slug is required"),
    title: z.string().optional().nullable(),
    title_fa: z.string().optional().nullable(),
    excerpt: z.string().optional().nullable(),
    excerpt_fa: z.string().optional().nullable(),
    body_md: z.string().optional().nullable(),
    body_md_fa: z.string().optional().nullable(),
    cover_path: z.string().optional().nullable(),
    pdf_path: z.string().optional().nullable(),
    published_in: z.string().optional().nullable(),
    published_at: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    tags: z.array(z.string()),
    featured: z.boolean(),
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

export type AdminArticleInput = z.infer<typeof AdminArticleSchema>;
