import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { VideosSchema } from "../schemas/video";

export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true });

      if (error) throw error;

      const result = VideosSchema.safeParse(data);
      if (!result.success) {
        console.error("Zod issues:", result.error.issues);
        console.error("Raw data:", data);
        throw new Error("Video data failed validation");
      }
      return result.data;
    },
  });
}
