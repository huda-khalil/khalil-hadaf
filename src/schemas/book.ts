import { z } from "zod";

export const BookSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  title_fa: z.string().nullable(),
  subtitle: z.string().nullable(),
  subtitle_fa: z.string().nullable(),
  description: z.string().nullable(),
  description_fa: z.string().nullable(),
  cover_path: z.string().nullable(),
  year: z.number().nullable(),
  publisher: z.string().nullable(),
  isbn: z.string().nullable(),
  language: z.string().nullable(),
  category: z.enum(["authored", "translated", "edited"]),
  original_author: z.string().nullable(),
  original_title: z.string().nullable(),
  buy_url: z.string().nullable(),
  pdf_path: z.string().nullable(),
  featured: z.boolean(),
  published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  spine_color: z.string().nullable(),
});

export const BooksSchema = z.array(BookSchema);

export type Book = z.infer<typeof BookSchema>;
