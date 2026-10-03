import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAdminComments,
  useUpdateCommentStatus,
  useDeleteComment,
} from "../../hooks/useComments";
import { useAdminArticles } from "../../hooks/useAdminArticles";

type Tab = "pending" | "approved" | "rejected";

const TAB_META: Record<
  Tab,
  { label: string; accent: string; accentClass: string }
> = {
  pending: {
    label: "Pending",
    accent: "#B8894A",
    accentClass: "border-s-brass",
  },
  approved: {
    label: "Approved",
    accent: "#1F4E4A",
    accentClass: "border-s-teal-deep",
  },
  rejected: {
    label: "Rejected",
    accent: "#6B6560",
    accentClass: "border-s-muted",
  },
};

export default function AdminComments() {
  const [tab, setTab] = useState<Tab>("pending");

  const { data: comments, isLoading, error } = useAdminComments(tab);
  const { data: articles } = useAdminArticles();
  const updateStatus = useUpdateCommentStatus();
  const deleteComment = useDeleteComment();

  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Counts per tab (from separate queries would be ideal, but for now
  // just show pending count from current data)
  const pendingCount = tab === "pending" ? (comments?.length ?? 0) : null;

  const handleStatus = async (
    id: string,
    status: "pending" | "approved" | "rejected",
  ) => {
    await updateStatus.mutateAsync({ id, status });
  };

  const handleDelete = async (id: string) => {
    await deleteComment.mutateAsync(id);
    setConfirmId(null);
  };

  const articleMap = new Map(
    (articles ?? []).map((a) => [a.id, { title: a.title, slug: a.slug }]),
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-brass mb-3">
          Comments
        </div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Moderation
        </h1>
        <p className="mt-3 text-sm text-muted">
          Approve comments to publish them. Approved comments appear instantly
          on the article page.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-10 border-b border-hairline">
        {(["pending", "approved", "rejected"] as Tab[]).map((t) => {
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative pb-4 text-sm tracking-wide transition-colors ${
                isActive ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              <span className="flex items-center gap-2">
                {TAB_META[t].label}
                {t === "pending" &&
                  pendingCount !== null &&
                  pendingCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-brass text-paper text-xs font-medium">
                      {pendingCount}
                    </span>
                  )}
              </span>
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-px bg-ink" />
              )}
            </button>
          );
        })}
      </div>

      {/* States */}
      {isLoading && <p className="text-muted text-sm">Loading…</p>}
      {error && (
        <p className="text-burgundy text-sm">Failed to load comments.</p>
      )}

      {comments && comments.length === 0 && (
        <div className="border border-dashed border-hairline rounded-sm p-16 text-center">
          <div className="font-serif text-xl text-muted mb-2">
            No {tab} comments
          </div>
          <p className="text-sm text-muted/70">
            {tab === "pending" &&
              "When readers submit comments, they'll appear here for review."}
            {tab === "approved" &&
              "Approved comments will show up here and on the public site."}
            {tab === "rejected" &&
              "Rejected comments stay here in case you change your mind."}
          </p>
        </div>
      )}

      {/* Comment cards */}
      {comments && comments.length > 0 && (
        <div className="space-y-5">
          {comments.map((comment) => {
            const article = articleMap.get(comment.target_id);
            const meta = TAB_META[tab];

            return (
              <article
                key={comment.id}
                className={`relative bg-white border border-hairline rounded-sm border-s-2 ${meta.accentClass} hover:shadow-[0_4px_16px_rgba(28,26,23,0.06)] transition-shadow`}
              >
                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b border-hairline/70">
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="font-serif text-lg text-ink leading-tight">
                        {comment.author_name}
                      </div>
                      {comment.author_email && (
                        <a
                          href={`mailto:${comment.author_email}`}
                          className="inline-block mt-1 text-xs text-muted hover:text-burgundy transition-colors"
                        >
                          {comment.author_email}
                        </a>
                      )}
                    </div>
                    <time className="text-xs uppercase tracking-wider text-muted shrink-0 pt-1">
                      {new Date(comment.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </time>
                  </div>

                  {article && (
                    <div className="mt-3 text-xs text-muted">
                      <span className="uppercase tracking-wider">On</span>
                      <span className="mx-2 text-hairline">·</span>
                      <Link
                        to={`/articles/${article.slug}`}
                        target="_blank"
                        className="text-burgundy hover:underline"
                      >
                        {article.title}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  <p
                    dir="auto"
                    className="text-[15px] text-ink/90 leading-[1.75] whitespace-pre-wrap"
                  >
                    {comment.body}
                  </p>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-well/30 border-t border-hairline flex items-center gap-3">
                  {tab !== "approved" && (
                    <button
                      onClick={() => handleStatus(comment.id, "approved")}
                      disabled={updateStatus.isPending}
                      className="text-xs tracking-wide px-4 py-2 bg-teal-deep text-paper hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {tab !== "rejected" && (
                    <button
                      onClick={() => handleStatus(comment.id, "rejected")}
                      disabled={updateStatus.isPending}
                      className="text-xs tracking-wide px-4 py-2 border border-hairline text-muted bg-white hover:text-ink hover:border-ink/40 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  )}
                  {tab !== "pending" && (
                    <button
                      onClick={() => handleStatus(comment.id, "pending")}
                      disabled={updateStatus.isPending}
                      className="text-xs tracking-wide px-4 py-2 border border-hairline text-muted bg-white hover:text-ink hover:border-ink/40 transition-colors disabled:opacity-50"
                    >
                      Move to pending
                    </button>
                  )}

                  <div className="flex-1" />

                  {confirmId === comment.id ? (
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted">Delete permanently?</span>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deleteComment.isPending}
                        className="text-burgundy hover:underline disabled:opacity-50 font-medium"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-muted hover:text-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(comment.id)}
                      className="text-xs text-muted/70 hover:text-burgundy transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
