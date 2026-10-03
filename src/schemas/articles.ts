import { z } from "zod";

export const ArticleSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  title_fa: z.string().nullable(),
  excerpt: z.string().nullable(),
  excerpt_fa: z.string().nullable(),
  body_md: z.string().nullable(),
  body_md_fa: z.string().nullable(),
  cover_path: z.string().nullable(),
  published_in: z.string().nullable(),
  published_at: z.string().nullable(),
  language: z.string().nullable(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ArticlesSchema = z.array(ArticleSchema);

export type Article = z.infer<typeof ArticleSchema>;
