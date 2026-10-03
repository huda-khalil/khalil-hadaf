import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { ArticlesSchema } from "../schemas/articles";

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false });

      if (error) throw error;

      const result = ArticlesSchema.safeParse(data);
      if (!result.success) {
        console.error("Zod issues:", result.error.issues);
        console.error("Raw data:", data);
        throw new Error("Article data failed validation");
      }
      return result.data;
    },
  });
}
