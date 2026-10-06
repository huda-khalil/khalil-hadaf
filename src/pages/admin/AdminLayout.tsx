import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../stores/authStore";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/books", label: "Books" },
  { to: "/admin/articles", label: "Articles" },
  { to: "/admin/translations", label: "Translations" },
  { to: "/admin/videos", label: "Videos" },
  { to: "/admin/timeline", label: "Timeline" },
  { to: "/admin/comments", label: "Comments" },
  { to: "/admin/subscribers", label: "Subscribers" },
  { to: "/admin/pages", label: "Pages" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { session } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-paper">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-ink text-paper flex flex-col">
        <div className="px-6 py-8 border-b border-paper/10">
          <div className="font-serif text-lg tracking-tight">Khalil Hadaf</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-brass">
            Admin
          </div>
        </div>

        <nav className="flex-1 py-6 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2.5 my-0.5 text-sm rounded-sm transition-colors ${
                  isActive
                    ? "bg-paper/10 text-paper"
                    : "text-paper/60 hover:text-paper hover:bg-paper/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-paper/10">
          <a
            href="/"
            className="block text-xs text-paper/50 hover:text-paper transition-colors"
          >
            ← Back to site
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-hairline flex items-center justify-between px-8 shrink-0">
          <div />
          <div className="flex items-center gap-5">
            <span className="text-xs text-muted hidden md:inline">
              {session?.user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-muted hover:text-burgundy transition-colors"
            >
              Log out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="px-8 py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
