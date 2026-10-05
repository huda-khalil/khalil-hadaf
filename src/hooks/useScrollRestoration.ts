import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "khalil-hadaf-scroll-positions";

function getPositions(): Record<string, number> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePosition(path: string, y: number) {
  const positions = getPositions();
  positions[path] = y;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

export function useScrollRestoration() {
  const { pathname } = useLocation();

  // Save scroll position when leaving a page
  useEffect(() => {
    const handleScroll = () => {
      savePosition(pathname, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      handleScroll(); // save one last time
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Restore scroll position when arriving at a page
  useEffect(() => {
    const positions = getPositions();
    const saved = positions[pathname];

    if (saved && saved > 0) {
      // Wait for the page to render, then restore
      // Use rAF to wait for the next paint
      requestAnimationFrame(() => {
        // Small delay lets data queries resolve
        setTimeout(() => {
          window.scrollTo({ top: saved, behavior: "instant" });
        }, 100);
      });
    }
  }, [pathname]);
}
