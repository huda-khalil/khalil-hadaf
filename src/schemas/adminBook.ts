import { z } from "zod";

export const AdminBookSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  title_fa: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  subtitle_fa: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  description_fa: z.string().optional().nullable(),
  cover_path: z.string().optional().nullable(),
  year: z.coerce.number().int().min(1000).max(2100).optional().nullable(),
  publisher: z.string().optional().nullable(),
  isbn: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  category: z.enum(["authored", "translated", "edited"]),
  original_author: z.string().optional().nullable(),
  original_title: z.string().optional().nullable(),
  buy_url: z.string().optional().nullable(),
  pdf_path: z.string().optional().nullable(),
  spine_color: z.string(),
  featured: z.boolean(),
  published: z.boolean(),
});

export type AdminBookInput = z.infer<typeof AdminBookSchema>;
