import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { TimelineSchema } from "../schemas/timeline";

export function useTimeline() {
  return useQuery({
    queryKey: ["timeline"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("published", true)
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
