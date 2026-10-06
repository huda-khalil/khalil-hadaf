import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { SubscribersSchema } from "../../schemas/subscriber";
import Loading from "../../components/ui/Loading";

export default function AdminSubscribers() {
  const {
    data: subscribers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .is("unsubscribed_at", null)
        .order("subscribed_at", { ascending: false });
      if (error) throw error;
      const result = SubscribersSchema.safeParse(data);
      if (!result.success) throw new Error("Subscriber data failed validation");
      return result.data;
    },
  });

  const handleExport = () => {
    if (!subscribers) return;
    const csv = [
      "email,name,subscribed_at",
      ...subscribers.map(
        (s) =>
          `${s.email},${(s.name ?? "").replace(/,/g, ";")},${s.subscribed_at}`,
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-brass mb-3">
            Newsletter
          </div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Subscribers
          </h1>
        </div>
        {subscribers && subscribers.length > 0 && (
          <button
            onClick={handleExport}
            className="bg-ink text-paper px-5 py-2.5 text-sm tracking-wide hover:bg-burgundy transition-colors"
          >
            Export CSV
          </button>
        )}
      </div>

      {isLoading && <Loading />}
      {error && (
        <p className="text-burgundy text-sm">Failed to load subscribers.</p>
      )}

      {subscribers && subscribers.length === 0 && (
        <div className="border border-hairline rounded-sm p-12 text-center text-muted text-sm">
          No subscribers yet.
        </div>
      )}

      {subscribers && subscribers.length > 0 && (
        <div className="border border-hairline rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-well text-muted text-xs uppercase tracking-[0.15em]">
              <tr>
                <th className="text-start ps-4 py-3">Email</th>
                <th className="text-start py-3">Name</th>
                <th className="text-start py-3 w-40">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-t border-hairline">
                  <td className="ps-4 py-3 text-ink">{s.email}</td>
                  <td className="py-3 text-muted">{s.name ?? "—"}</td>
                  <td className="py-3 text-muted text-xs">
                    {new Date(s.subscribed_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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
