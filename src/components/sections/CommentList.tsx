import { useTranslation } from "react-i18next";
import type { Comment } from "../../schemas/comment";

export default function CommentList({ comments }: { comments: Comment[] }) {
  const { t } = useTranslation();

  if (comments.length === 0) {
    return (
      <div className="border border-dashed border-hairline rounded-sm p-10 text-center">
        <div className="font-serif text-lg text-muted mb-1">
          {t("comments.empty")}
        </div>
        <p className="text-sm text-muted/70">Join the conversation below.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="relative bg-white border border-hairline rounded-sm border-s-2 border-s-brass"
        >
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-serif text-lg text-ink leading-tight">
                {comment.author_name}
              </span>
              <time className="text-xs uppercase tracking-wider text-muted shrink-0">
                {new Date(comment.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>

            <p
              dir="auto"
              className="mt-4 text-[15px] text-ink/90 leading-[1.75] whitespace-pre-wrap"
            >
              {comment.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
