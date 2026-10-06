import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAdminTimeline,
  useDeleteTimelineEvent,
} from "../../hooks/useAdminTimeline";
import Loading from "../../components/ui/Loading";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

function photoUrl(path: string | null) {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export default function AdminTimeline() {
  const { data: events, isLoading, error } = useAdminTimeline();
  const deleteMutation = useDeleteTimelineEvent();
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
            Timeline
          </div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Manage timeline
          </h1>
        </div>
        <Link
          to="/admin/timeline/new"
          className="bg-ink text-paper px-5 py-2.5 text-sm tracking-wide hover:bg-burgundy transition-colors"
        >
          + Add event
        </Link>
      </div>

      <Loading label="Loading" />
      {error && (
        <p className="text-burgundy text-sm">Failed to load timeline events.</p>
      )}

      {events && events.length === 0 && (
        <div className="border border-hairline rounded-sm p-12 text-center text-muted text-sm">
          No events yet. Click "Add event" to create the first one.
        </div>
      )}

      {events && events.length > 0 && (
        <div className="border border-hairline rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-well text-muted text-xs uppercase tracking-[0.15em]">
              <tr>
                <th className="text-start ps-4 py-3 w-16"></th>
                <th className="text-start py-3 w-20">Year</th>
                <th className="text-start py-3">Title</th>
                <th className="text-start py-3 w-28">Kind</th>
                <th className="text-start py-3 w-20">Order</th>
                <th className="text-start py-3 w-24">Published</th>
                <th className="text-end pe-4 py-3 w-40"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-hairline hover:bg-well/40 transition-colors"
                >
                  <td className="ps-4 py-3">
                    {photoUrl(event.photo_path) ? (
                      <img
                        src={photoUrl(event.photo_path)!}
                        alt={event.title ?? ""}
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-well" />
                    )}
                  </td>
                  <td className="py-3 font-serif text-lg text-ink">
                    {event.year}
                  </td>
                  <td className="py-3 pe-4">
                    <div className="text-ink">
                      {event.title || event.title_fa}
                    </div>
                    {event.title_fa && event.title && (
                      <div className="text-xs text-muted mt-0.5" dir="rtl">
                        {event.title_fa}
                      </div>
                    )}
                  </td>
                  <td className="py-3">
                    <span className="text-xs uppercase tracking-wider text-muted">
                      {event.kind}
                    </span>
                  </td>
                  <td className="py-3 text-muted">{event.sort_order}</td>
                  <td className="py-3">
                    {event.published ? (
                      <span className="text-xs text-teal-deep">●</span>
                    ) : (
                      <span className="text-xs text-muted">○</span>
                    )}
                  </td>
                  <td className="pe-4 py-3 text-end">
                    {confirmId === event.id ? (
                      <div className="flex items-center justify-end gap-3 text-xs">
                        <span className="text-muted">Delete?</span>
                        <button
                          onClick={() => handleDelete(event.id)}
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
                          to={`/admin/timeline/${event.id}`}
                          className="text-muted hover:text-burgundy transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setConfirmId(event.id)}
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
