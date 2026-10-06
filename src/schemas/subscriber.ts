import { z } from "zod";

export const SubscriberInputSchema = z.object({
  name: z.string().max(80).optional().or(z.literal("")),
  email: z.email("Please enter a valid email").max(200),
});

export type SubscriberInput = z.infer<typeof SubscriberInputSchema>;

export const SubscriberSchema = z.object({
  id: z.uuid(),
  email: z.string(),
  name: z.string().nullable(),
  subscribed_at: z.string(),
  unsubscribed_at: z.string().nullable(),
});

export const SubscribersSchema = z.array(SubscriberSchema);

export type Subscriber = z.infer<typeof SubscriberSchema>;
