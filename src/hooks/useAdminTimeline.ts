import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { TimelineSchema } from "../schemas/timeline";
import type { AdminTimelineInput } from "../schemas/adminTimeline";

export function useAdminTimeline() {
  return useQuery({
    queryKey: ["admin-timeline"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .order("year", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) throw error;

      const result = TimelineSchema.safeParse(data);
      if (!result.success) {
        console.error("Zod issues:", result.error.issues);
        console.error("Raw data:", data);
        throw new Error("Timeline data failed validation");
      }
      return result.data;
    },
  });
}

export function useAdminTimelineEvent(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-timeline-event", id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminTimelineInput) => {
      const { data, error } = await supabase
        .from("timeline_events")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-timeline"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useUpdateTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: AdminTimelineInput;
    }) => {
      const { data, error } = await supabase
        .from("timeline_events")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-timeline"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-timeline-event", vars.id],
      });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useDeleteTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("timeline_events")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-timeline"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}
