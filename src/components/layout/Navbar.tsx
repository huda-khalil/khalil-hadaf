import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "../../stores/uiStore";
import i18n from "../../lib/i18n";

const LINKS = [
  { to: "/", key: "home" },
  { to: "/books", key: "books" },
  { to: "/articles", key: "articles" },
  { to: "/translations", key: "translations" },
  { to: "/about", key: "about" },
  { to: "/contact", key: "contact" },
  { to: "/videos", key: "videos" },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { lang, setLang } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleLang = () => {
    const next = lang === "en" ? "fa" : "en";
    setLang(next);
    i18n.changeLanguage(next);
  };
  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: transparent
            ? "rgba(250, 247, 242, 0)"
            : "rgba(250, 247, 242, 0.92)",
          backdropFilter: transparent ? "blur(0px)" : "blur(12px)",
          borderColor: transparent
            ? "rgba(230, 223, 213, 0)"
            : "rgba(230, 223, 213, 1)",
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 inset-x-0 z-50 border-b"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Link
            to="/"
            className={`font-serif text-xl md:text-2xl tracking-tight transition-colors ${
              transparent ? "text-paper" : "text-ink"
            }`}
          >
            {t("hero.name")}
          </Link>

          <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {LINKS.map((l) => (
              <NavLink
                key={l.key}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `relative text-base tracking-wide transition-colors px-4 py-2 rounded-md ${
                    transparent
                      ? isActive
                        ? "text-paper"
                        : "text-paper/85 hover:text-paper"
                      : isActive
                        ? "text-burgundy"
                        : "text-muted hover:text-burgundy"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Background pill — appears on hover, stays for active */}
                    <span
                      aria-hidden
                      className={`absolute inset-0 rounded-md transition-colors duration-300 pointer-events-none ${
                        isActive
                          ? transparent
                            ? "bg-white/10"
                            : "bg-burgundy/8"
                          : transparent
                            ? "bg-white/0 group-hover:bg-white/10"
                            : "bg-ink/0"
                      }`}
                    />

                    <span className="relative">{t(`nav.${l.key}`)}</span>

                    {isActive && (
                      <span
                        className={`absolute -bottom-1.5 inset-s-4 inset-e-4 h-px ${
                          transparent ? "bg-paper/60" : "bg-burgundy"
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLang}
              className={`hidden md:inline relative group text-base tracking-wide transition-colors ${
                transparent ? "text-paper" : "text-ink"
              }`}
              style={{ perspective: 400 }}
            >
              <motion.div
                whileHover={{ rotateX: 360, scale: 1.1 }}
                transition={{
                  rotateX: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
                  scale: { duration: 0.3, ease: "easeOut" },
                }}
                className="relative flex items-center justify-center w-14 h-14 rounded-full"
                style={{
                  transformStyle: "preserve-3d",
                  backgroundColor: transparent
                    ? "rgba(250, 247, 242, 0.15)"
                    : "rgba(28, 26, 23, 0.08)",
                }}
              >
                {/* Rotating gradient border */}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{
                    padding: 1,
                    background: `conic-gradient(from 0deg, transparent 0%, ${
                      transparent
                        ? "rgba(184,137,74,0.6)"
                        : "rgba(184,137,74,0.8)"
                    } 25%, transparent 50%, ${
                      transparent
                        ? "rgba(110,38,57,0.5)"
                        : "rgba(110,38,57,0.7)"
                    } 75%, transparent 100%)`,
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Orbiting dot */}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full pointer-events-none"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <span
                    className="absolute"
                    style={{
                      top: -5,
                      insetInlineStart: "50%",
                      transform: "translateX(-50%)",
                      filter: "drop-shadow(0 0 3px rgba(184,137,74,0.9))",
                    }}
                  >
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="#B8894A"
                    >
                      <path d="M12 2 L13 11 L22 12 L13 13 L12 22 L11 13 L2 12 L11 11 Z" />
                    </svg>
                  </span>
                </motion.span>

                {/* The text */}
                <span className="relative text-sm tracking-wide">
                  {lang === "en" ? "فا" : "EN"}
                </span>
              </motion.div>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className={`md:hidden transition-colors ${
                transparent ? "text-paper" : "text-ink"
              }`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-60 bg-paper md:hidden"
          >
            <div className="h-16 px-6 flex items-center justify-between border-b border-hairline">
              <span className="font-serif text-xl">{t("hero.name")}</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col px-6 py-12 gap-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `font-serif text-4xl ${isActive ? "text-burgundy" : "text-ink"}`
                    }
                  >
                    {t(`nav.${l.key}`)}
                  </NavLink>
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * LINKS.length, duration: 0.3 }}
                onClick={toggleLang}
                className="mt-8 text-start text-base text-muted tracking-wide relative self-start px-4 py-2 rounded-full"
              >
                <motion.span
                  className="relative inline-block"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {lang === "en" ? "فارسی" : "English"}
                </motion.span>
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
