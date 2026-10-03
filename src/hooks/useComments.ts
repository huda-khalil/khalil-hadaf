import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { CommentsSchema, type CommentInput } from "../schemas/comment";

export function useComments(targetType: string, targetId: string) {
  return useQuery({
    queryKey: ["comments", targetType, targetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("target_type", targetType)
        .eq("target_id", targetId)
        .eq("status", "approved")
        .order("created_at", { ascending: true });

      if (error) throw error;

      const result = CommentsSchema.safeParse(data);
      if (!result.success) {
        console.error("Zod issues:", result.error.issues);
        console.error("Raw data:", data);
        throw new Error("Comment data failed validation");
      }
      return result.data;
    },
  });
}

export function useSubmitComment(targetType: string, targetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CommentInput) => {
      const { error } = await supabase.from("comments").insert({
        target_type: targetType,
        target_id: targetId,
        author_name: input.author_name,
        author_email: input.author_email || null,
        body: input.body,
        status: "pending",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate so if the comment is later approved elsewhere, refetch works
      queryClient.invalidateQueries({
        queryKey: ["comments", targetType, targetId],
      });
    },
  });
}

export function useAdminComments(status: "pending" | "approved" | "rejected") {
  return useQuery({
    queryKey: ["admin-comments", status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const result = CommentsSchema.safeParse(data);
      if (!result.success) {
        console.error("Zod issues:", result.error.issues);
        console.error("Raw data:", data);
        throw new Error("Comment data failed validation");
      }
      return result.data;
    },
  });
}

export function useUpdateCommentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "approved" | "rejected";
    }) => {
      const { error } = await supabase
        .from("comments")
        .update({
          status,
          approved_at: status === "approved" ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}
