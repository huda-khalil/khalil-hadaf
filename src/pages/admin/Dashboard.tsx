import { useAuthStore } from "../../stores/authStore";

export default function Dashboard() {
  const { session } = useAuthStore();

  return (
    <div>
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-brass mb-3">
          Welcome
        </div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="border border-hairline rounded-sm p-6">
        <p className="text-sm text-muted">
          Signed in as <span className="text-ink">{session?.user.email}</span>
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Books" value="—" />
        <StatCard label="Articles" value="—" />
        <StatCard label="Pending comments" value="—" />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-hairline rounded-sm p-5">
      <div className="text-xs uppercase tracking-[0.2em] text-muted mb-2">
        {label}
      </div>
      <div className="font-serif text-3xl font-light text-ink">{value}</div>
    </div>
  );
}
