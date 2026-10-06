import { create } from "zustand";

type UIState = {
  lang: "en" | "fa";
  setLang: (lang: "en" | "fa") => void;
  mobileNavOpen: boolean;
  toggleMobileNav: () => void;
};

// Read the saved language from localStorage, default to "en"
function getInitialLang(): "en" | "fa" {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem("khalil-hadaf-lang");
  if (saved === "fa" || saved === "en") return saved;
  return "en";
}

export const useUIStore = create<UIState>((set) => ({
  lang: getInitialLang(),
  setLang: (lang) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("khalil-hadaf-lang", lang);
    }
    set({ lang });
  },
  mobileNavOpen: false,
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
}));

// if we want the page to open in english version in new sessions:
// Change the storage from localStorage to sessionStorage in both files.

// src/stores/uiStore.ts:

// ts
// window.sessionStorage.getItem("khalil-hadaf-lang")
// window.sessionStorage.setItem("khalil-hadaf-lang", lang)
// src/lib/i18n.ts:

// ts
// window.sessionStorage.getItem("khalil-hadaf-lang")
