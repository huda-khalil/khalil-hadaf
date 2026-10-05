import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminBooks, useDeleteBook } from "../../hooks/useAdminBooks";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

function coverUrl(path: string | null) {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export default function AdminBooks() {
  const { data: books, isLoading, error } = useAdminBooks();
  const deleteMutation = useDeleteBook();
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
            Books
          </div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Manage books
          </h1>
        </div>
        <Link
          to="/admin/books/new"
          className="bg-ink text-paper px-5 py-2.5 text-sm tracking-wide hover:bg-burgundy transition-colors"
        >
          + Add book
        </Link>
      </div>

      {isLoading && <p className="text-muted text-sm">Loading…</p>}
      {error && <p className="text-burgundy text-sm">Failed to load books.</p>}

      {books && books.length === 0 && (
        <div className="border border-hairline rounded-sm p-12 text-center text-muted text-sm">
          No books yet. Click "Add book" to create the first one.
        </div>
      )}

      {books && books.length > 0 && (
        <div className="border border-hairline rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-well text-muted text-xs uppercase tracking-[0.15em]">
              <tr>
                <th className="text-start ps-4 py-3 w-16"></th>
                <th className="text-start py-3">Title</th>
                <th className="text-start py-3 w-20">Year</th>
                <th className="text-start py-3 w-32">Category</th>
                <th className="text-start py-3 w-24">Featured</th>
                <th className="text-start py-3 w-24">Published</th>
                <th className="text-end pe-4 py-3 w-40"></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="border-t border-hairline hover:bg-well/40 transition-colors"
                >
                  <td className="ps-4 py-3">
                    {coverUrl(book.cover_path) ? (
                      <img
                        src={coverUrl(book.cover_path)!}
                        alt={book.title || book.title_fa || ""}
                        className="w-10 h-14 object-cover"
                      />
                    ) : (
                      <div
                        className="w-10 h-14"
                        style={{
                          backgroundColor: book.spine_color ?? "#4A1F28",
                        }}
                      />
                    )}
                  </td>
                  <td className="py-3 pe-4">
                    <div className="text-ink">{book.title}</div>
                    {book.title_fa && (
                      <div className="text-xs text-muted mt-0.5">
                        {book.title_fa}
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-muted">{book.year ?? "—"}</td>
                  <td className="py-3">
                    <span className="text-xs uppercase tracking-wider text-muted">
                      {book.category}
                    </span>
                  </td>
                  <td className="py-3">
                    {book.featured ? (
                      <span className="text-brass text-xs">★</span>
                    ) : (
                      <span className="text-muted/40 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    {book.published ? (
                      <span className="text-xs text-teal-deep">●</span>
                    ) : (
                      <span className="text-xs text-muted">○</span>
                    )}
                  </td>
                  <td className="pe-4 py-3 text-end">
                    {confirmId === book.id ? (
                      <div className="flex items-center justify-end gap-3 text-xs">
                        <span className="text-muted">Delete?</span>
                        <button
                          onClick={() => handleDelete(book.id)}
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
                          to={`/admin/books/${book.id}`}
                          className="text-muted hover:text-burgundy transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setConfirmId(book.id)}
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
