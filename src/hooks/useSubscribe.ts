import { useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { SubscriberInput } from "../schemas/subscriber";

export function useSubscribe() {
  return useMutation({
    mutationFn: async (input: SubscriberInput) => {
      const { error } = await supabase.from("subscribers").insert({
        email: input.email.toLowerCase().trim(),
        name: input.name?.trim() || null,
      });

      // Handle the "already subscribed" case gracefully
      if (error) {
        if (error.code === "23505") {
          // unique violation — already subscribed
          throw new Error("ALREADY_SUBSCRIBED");
        }
        throw error;
      }
    },
  });
}
