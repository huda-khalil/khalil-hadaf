import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { BooksSchema } from "../schemas/book";

export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("published", true)
        .order("year", { ascending: false });

      if (error) throw error;

      const result = BooksSchema.safeParse(data);
      if (!result.success) {
        console.error("Zod issues:", result.error.issues);
        console.error("Raw data:", data);
        throw new Error("Book data failed validation");
      }
      return result.data;
    },
  });
}
