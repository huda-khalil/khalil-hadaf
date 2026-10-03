import { z } from "zod";

export const CommentSchema = z.object({
  id: z.uuid(),
  target_type: z.string(),
  target_id: z.uuid(),
  author_name: z.string(),
  author_email: z.string().nullable(),
  body: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  created_at: z.string(),
  approved_at: z.string().nullable(),
});

export const CommentsSchema = z.array(CommentSchema);

export type Comment = z.infer<typeof CommentSchema>;

// What the form submits — email optional
export const CommentInputSchema = z.object({
  author_name: z.string().min(1, "Name is required").max(80),
  author_email: z.email("Invalid email").max(200).optional().or(z.literal("")),
  body: z.string().min(2, "Comment is too short").max(4000),
});

export type CommentInput = z.infer<typeof CommentInputSchema>;
