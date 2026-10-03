import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";

type AuthState = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isAdmin: false,
  loading: true,
  setSession: (session) => set({ session }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setLoading: (loading) => set({ loading }),
}));
