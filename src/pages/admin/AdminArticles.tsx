import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAdminArticles,
  useDeleteArticle,
} from "../../hooks/useAdminArticles";
import Loading from "../../components/ui/Loading";

export default function AdminArticles() {
  const { data: articles, isLoading, error } = useAdminArticles();
  const deleteMutation = useDeleteArticle();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setConfirmId(null);
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-brass mb-3">
            Articles
          </div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Manage articles
          </h1>
        </div>
        <Link
          to="/admin/articles/new"
          className="bg-ink text-paper px-5 py-2.5 text-sm tracking-wide hover:bg-burgundy transition-colors"
        >
          + Add article
        </Link>
      </div>

      <Loading label="Loading" />
      {error && (
        <p className="text-burgundy text-sm">Failed to load articles.</p>
      )}

      {articles && articles.length === 0 && (
        <div className="border border-hairline rounded-sm p-12 text-center text-muted text-sm">
          No articles yet. Click "Add article" to create the first one.
        </div>
      )}

      {articles && articles.length > 0 && (
        <div className="border border-hairline rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-well text-muted text-xs uppercase tracking-[0.15em]">
              <tr>
                <th className="text-start ps-4 py-3">Title</th>
                <th className="text-start py-3 w-32">Published</th>
                <th className="text-start py-3 w-24">Featured</th>
                <th className="text-start py-3 w-24">Published?</th>
                <th className="text-end pe-4 py-3 w-40"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-t border-hairline hover:bg-well/40 transition-colors"
                >
                  <td className="ps-4 py-3 pe-4">
                    <div className="text-ink">{article.title}</div>
                    {article.title_fa && (
                      <div className="text-xs text-muted mt-0.5" dir="rtl">
                        {article.title_fa}
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-muted">
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "—"}
                  </td>
                  <td className="py-3">
                    {article.featured ? (
                      <span className="text-brass text-xs">★</span>
                    ) : (
                      <span className="text-muted/40 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    {article.published ? (
                      <span className="text-xs text-teal-deep">●</span>
                    ) : (
                      <span className="text-xs text-muted">○</span>
                    )}
                  </td>
                  <td className="pe-4 py-3 text-end">
                    {confirmId === article.id ? (
                      <div className="flex items-center justify-end gap-3 text-xs">
                        <span className="text-muted">Delete?</span>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={deleteMutation.isPending}
                          className="text-burgundy hover:underline disabled:opacity-50"
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
                      <div className="flex items-center justify-end gap-4 text-xs">
                        <Link
                          to={`/admin/articles/${article.id}`}
                          className="text-muted hover:text-burgundy transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setConfirmId(article.id)}
                          className="text-muted hover:text-burgundy transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
