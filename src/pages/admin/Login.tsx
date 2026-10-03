import { useState, useEffect } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../stores/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { session, isAdmin } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in and admin, go to dashboard
  useEffect(() => {
    if (session && isAdmin) navigate("/admin", { replace: true });
  }, [session, isAdmin, navigate]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (signInError) {
      setError("Invalid email or password.");
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="text-xs uppercase tracking-[0.3em] text-brass mb-4">
          Admin
        </div>
        <h1 className="font-serif text-3xl font-light tracking-tight mb-10">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>

          {error && <p className="text-sm text-burgundy">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-paper py-3 text-sm tracking-wide hover:bg-burgundy transition-colors disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-xs text-muted text-center">
          <a href="/" className="hover:text-burgundy transition-colors">
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
