import { create } from "zustand";

type UIState = {
  lang: "en" | "fa";
  setLang: (lang: "en" | "fa") => void;
  mobileNavOpen: boolean;
  toggleMobileNav: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  lang: "en",
  setLang: (lang) => set({ lang }),
  mobileNavOpen: false,
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
}));
