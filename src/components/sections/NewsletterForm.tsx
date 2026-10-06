import { useState } from "react";
import type { SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { SubscriberInputSchema } from "../../schemas/subscriber";
import { useSubscribe } from "../../hooks/useSubscribe";

export default function NewsletterForm({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<false | "new" | "already">(false);

  const mutation = useSubscribe();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const parsed = SubscriberInputSchema.safeParse({ name, email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    try {
      await mutation.mutateAsync(parsed.data);
      setDone("new");
      setName("");
      setEmail("");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      if (msg === "ALREADY_SUBSCRIBED") {
        setDone("already");
      } else {
        setError("Could not subscribe. Try again later.");
      }
    }
  };

  if (done) {
    return (
      <div className="border-s-2 border-brass ps-5 py-2">
        <p className="text-sm text-ink">
          {done === "new"
            ? t("newsletter.thanks_new")
            : t("newsletter.thanks_already")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!compact && (
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
            {t("newsletter.name")} {t("newsletter.optional")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-hairline bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
      )}

      <div>
        {!compact && (
          <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
            {t("newsletter.email")}
          </label>
        )}
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletter.email_placeholder")}
            className="flex-1 border border-hairline bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-ink text-paper px-5 py-2.5 text-xs uppercase tracking-[0.15em] hover:bg-burgundy transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? "…" : t("newsletter.subscribe")}
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-burgundy">{error}</p>}
    </form>
  );
}
