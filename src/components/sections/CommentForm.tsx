import { useState } from "react";
import type { SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { CommentInputSchema } from "../../schemas/comment";
import { useSubmitComment } from "../../hooks/useComments";

export default function CommentForm({
  targetType,
  targetId,
}: {
  targetType: string;
  targetId: string;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const mutation = useSubmitComment(targetType, targetId);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (honeypot.trim() !== "") return;

    const parsed = CommentInputSchema.safeParse({
      author_name: name,
      author_email: email,
      body,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await mutation.mutateAsync(parsed.data);
      setSubmitted(true);
      setName("");
      setEmail("");
      setBody("");
    } catch (err) {
      console.error(err);
      setErrors({ form: t("comments.error_generic") });
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-hairline rounded-sm border-s-2 border-s-teal-deep p-6">
        <div className="font-serif text-lg text-ink mb-1">Thank you</div>
        <p className="text-sm text-muted leading-relaxed">
          {t("comments.thanks")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-well border border-hairline rounded-sm p-6 md:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
            {t("comments.name")} *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-hairline bg-paper px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
          {errors.author_name && (
            <p className="mt-1.5 text-xs text-burgundy">{errors.author_name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
            {t("comments.email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-hairline bg-paper px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
          {errors.author_email && (
            <p className="mt-1.5 text-xs text-burgundy">
              {errors.author_email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
          {t("comments.body")} *
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="w-full border border-hairline bg-paper px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors resize-y"
        />
        {errors.body && (
          <p className="mt-1.5 text-xs text-burgundy">{errors.body}</p>
        )}
      </div>

      {/* Honeypot */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label>
          Leave this field empty
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {errors.form && <p className="text-sm text-burgundy">{errors.form}</p>}

      <div className="flex items-center justify-between pt-2 border-t border-hairline/70 gap-4">
        <p className="text-xs text-muted leading-relaxed max-w-md">
          {t("comments.note")}
        </p>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="shrink-0 bg-ink text-paper px-6 py-2.5 text-sm tracking-wide hover:bg-burgundy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? t("comments.submitting") : t("comments.submit")}
        </button>
      </div>
    </form>
  );
}
