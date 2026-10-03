import { z } from "zod";

export const AdminArticleSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  title_fa: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  excerpt_fa: z.string().optional().nullable(),
  body_md: z.string().optional().nullable(),
  body_md_fa: z.string().optional().nullable(),
  cover_path: z.string().optional().nullable(),
  published_in: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  published: z.boolean(),
});

export type AdminArticleInput = z.infer<typeof AdminArticleSchema>;
