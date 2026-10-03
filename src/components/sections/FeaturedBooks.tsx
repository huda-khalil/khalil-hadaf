import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Book } from "../../schemas/book";
import { useUIStore } from "../../stores/uiStore";
import { getTitles } from "../../lib/title";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";
const SHELF_SIZE = 6;
const ROTATE_MS = 9000;

function coverUrl(path: string | null) {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export default function FeaturedBooks({ books }: { books: Book[] }) {
  const lang = useUIStore((s) => s.lang);

  const pool = books.slice(0, SHELF_SIZE);

  const [order, setOrder] = useState<string[]>(pool.map((b) => b.id));
  const [hovered, setHovered] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (pool.length > 0 && order.length === 0) {
      setOrder(pool.map((b) => b.id));
      // setActiveId(pool[0].id);
    }
  }, [pool, order.length]);

  useEffect(() => {
    if (hovered || pool.length < 2) return;

    timerRef.current = window.setInterval(() => {
      setOrder((prev) => {
        if (prev.length < 2) return prev;
        const next = [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)];
        return next;
      });
    }, ROTATE_MS);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [hovered, pool.length]);

  const rightmostId = order[order.length - 1];
  const displayId = hovered ?? rightmostId;
  const displayBook = pool.find((b) => b.id === displayId) ?? pool[0];

  const { primary: primaryTitle, secondary: secondaryTitle } = displayBook
    ? getTitles(displayBook, lang)
    : { primary: "", secondary: null };

  if (pool.length === 0) return null;

  const orderedSpines = order
    .map((id) => pool.find((b) => b.id === id))
    .filter((b): b is Book => Boolean(b));

  return (
    <div className="grid grid-cols-1 md:grid-cols-[380px_280px_1fr] gap-10 md:gap-12 items-start">
      {/* 1) Shelf */}
      <div className="md:pt-24">
        <div className="flex items-end gap-2 md:gap-4 pb-3 min-h-45 md:min-h-60">
          {orderedSpines.map((book) => (
            <MiniSpine
              key={book.id}
              book={book}
              lang={lang}
              isActive={book.id === displayId}
              onHover={() => setHovered(book.id)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
        <div className="h-px w-full bg-hairline" />
      </div>

      {/* 2) Cover */}
      {displayBook && (
        <motion.div
          key={displayBook.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto md:mx-0 md:pt-4"
        >
          <Link to={`/books/${displayBook.slug}`} className="block">
            <div className="aspect-2/3 w-70 bg-hairline overflow-hidden shadow-[0_12px_32px_rgba(28,26,23,0.14)]">
              {coverUrl(displayBook.cover_path) ? (
                <img
                  src={coverUrl(displayBook.cover_path)!}
                  alt={primaryTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: displayBook.spine_color ?? "#6E2639",
                  }}
                />
              )}
            </div>
          </Link>
        </motion.div>
      )}

      {/* 3) Metadata panel */}
      {displayBook && (
        <motion.div
          key={`meta-${displayBook.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="bg-paper border border-hairline rounded-sm p-6 md:p-8 h-full"
        >
          <Link to={`/books/${displayBook.slug}`} className="block group">
            <h3 className="font-serif text-2xl md:text-3xl font-light tracking-tight leading-tight group-hover:text-burgundy transition-colors">
              {primaryTitle}
            </h3>

            {secondaryTitle && (
              <p
                className="mt-2 font-serif text-base md:text-lg font-light text-muted"
                dir={lang === "en" ? "rtl" : "ltr"}
              >
                {secondaryTitle}
              </p>
            )}

            <div className="mt-3 font-serif italic text-muted text-sm">
              Khalil Hadaf
            </div>

            {displayBook.description && (
              <p className="mt-6 text-ink/80 leading-relaxed text-base">
                {displayBook.description}
              </p>
            )}

            <div className="mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-brass">
              {displayBook.year && <span>{displayBook.year}</span>}
              <span className="h-px w-4 bg-brass/60" />
              <span>{displayBook.category}</span>
            </div>

            <div className="mt-6 text-sm tracking-wide text-burgundy group-hover:underline">
              Read more →
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function MiniSpine({
  book,
  lang,
  isActive,
  onHover,
  onLeave,
}: {
  book: Book;
  lang: "en" | "fa";
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const color = book.spine_color ?? "#6E2639";
  const displayTitle =
    lang === "fa" && book.title_fa ? book.title_fa : book.title;

  return (
    <Link to={`/books/${book.slug}`} className="shrink-0">
      <motion.div
        layout
        layoutId={book.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className={`relative cursor-pointer shrink-0 w-8 h-45 md:w-11 md:h-60`}
        style={{
          backgroundColor: color,
          borderRadius: "2px 2px 1px 1px",
          boxShadow: isActive
            ? "0 10px 24px rgba(28, 26, 23, 0.2)"
            : "0 3px 6px rgba(28, 26, 23, 0.1)",
          transform: isActive ? "translateY(-5px)" : "translateY(0)",
          transition: "box-shadow 400ms, transform 400ms",
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          <span className="font-serif text-paper text-[10px] md:text-[12px] tracking-[0.22em] uppercase px-3 text-center">
            {displayTitle}
          </span>
        </div>

        <div className="absolute top-4 inset-x-3 h-px bg-brass/60" />
        <div className="absolute bottom-4 inset-x-3 h-px bg-brass/60" />
      </motion.div>
    </Link>
  );
}
