import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Book } from "../../schemas/book";
import { useUIStore } from "../../stores/uiStore";
import { getTitles } from "../../lib/title";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";
const PER_ROW = 6;

function coverUrl(path: string | null) {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function BookShelf({ books }: { books: Book[] }) {
  const rows = chunk(books, PER_ROW);

  return (
    <div className="flex flex-col gap-20">
      {rows.map((row, rowIndex) => (
        <ShelfRow key={rowIndex} books={row} />
      ))}
    </div>
  );
}

function ShelfRow({ books }: { books: Book[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredBook = books.find((b) => b.id === hovered) ?? null;
  const lang = useUIStore((s) => s.lang);

  return (
    <div className="relative bg-well rounded-sm px-6 pt-8 pb-0">
      <div className="flex items-start justify-between gap-6 pb-3">
        {/* Spines */}
        <div className="flex items-end gap-3 md:pt-24">
          {books.map((book) => (
            <Spine
              key={book.id}
              book={book}
              lang={lang}
              isHovered={hovered === book.id}
              onHover={() => setHovered(book.id)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>

        {/* Fixed preview panel */}
        <div
          className="relative hidden md:block shrink-0"
          style={{ width: 560, minHeight: 420 }}
        >
          <AnimatePresence mode="wait">
            {hoveredBook ? (
              <BookPreview
                key={hoveredBook.id}
                book={hoveredBook}
                lang={lang}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="h-px w-12 bg-brass/40" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-px w-full bg-hairline" />
    </div>
  );
}

function Spine({
  book,
  lang,
  isHovered,
  onHover,
  onLeave,
}: {
  book: Book;
  lang: "en" | "fa";
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const color = book.spine_color ?? "#6E2639";
  const displayTitle =
    lang === "fa" ? book.title_fa || book.title : book.title || book.title_fa;

  return (
    <Link to={`/books/${book.slug}`}>
      <motion.div
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        initial={false}
        animate={{
          y: isHovered ? -4 : 0,
          boxShadow: isHovered
            ? "0 8px 20px rgba(28, 26, 23, 0.15)"
            : "0 2px 4px rgba(28, 26, 23, 0.08)",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative cursor-pointer"
        style={{
          width: 42,
          height: 260,
          backgroundColor: color,
          borderRadius: "2px 2px 1px 1px",
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          <span className="font-serif text-paper text-[13px] tracking-[0.2em] uppercase px-4 text-center">
            {displayTitle}
          </span>
        </div>

        <div className="absolute top-4 inset-x-3 h-px bg-brass/40" />
        <div className="absolute bottom-4 inset-x-3 h-px bg-brass/40" />
      </motion.div>
    </Link>
  );
}

function BookPreview({ book, lang }: { book: Book; lang: "en" | "fa" }) {
  const { primary, secondary } = getTitles(book, lang);
  const url = coverUrl(book.cover_path);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-[220px_1fr] gap-8 items-start h-full"
    >
      {/* Cover */}
      <Link to={`/books/${book.slug}`} className="block">
        <div
          className="aspect-[2/3] w-full bg-paper p-2"
          style={{ boxShadow: "0 12px 30px rgba(28, 26, 23, 0.18)" }}
        >
          {url ? (
            <img
              src={url}
              alt={primary}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ backgroundColor: book.spine_color ?? "#6E2639" }}
            />
          )}
        </div>
      </Link>

      {/* Metadata panel */}
      <div className="bg-paper border border-hairline rounded-sm p-6 h-full">
        <Link to={`/books/${book.slug}`} className="block group">
          <h3 className="font-serif text-2xl font-light tracking-tight leading-tight group-hover:text-burgundy transition-colors">
            {primary}
          </h3>

          {secondary && (
            <p
              className="mt-2 font-serif text-base font-light text-muted"
              dir={lang === "en" ? "rtl" : "ltr"}
            >
              {secondary}
            </p>
          )}

          <div className="mt-3 font-serif italic text-muted text-sm">
            Khalil Hadaf
          </div>

          {book.description && (
            <p className="mt-5 text-ink/80 leading-relaxed text-sm line-clamp-5">
              {book.description}
            </p>
          )}

          <div className="mt-5 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-brass">
            {book.year && <span>{book.year}</span>}
            <span className="h-px w-4 bg-brass/60" />
            <span>{book.category}</span>
          </div>

          <div className="mt-5 text-sm tracking-wide text-burgundy group-hover:underline">
            Read more →
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
