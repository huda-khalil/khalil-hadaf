import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Book } from "../../schemas/book";
import { useUIStore } from "../../stores/uiStore";

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
      <div className="flex items-end justify-between gap-6 pb-3">
        {/* Spines — take up the left side (right in RTL) */}
        <div className="flex items-end gap-3">
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

        {/* Fixed cover panel — always on the end side of the row */}
        <div
          className="relative hidden md:block shrink-0 bg-well/50 border border-hairline rounded-sm"
          style={{ width: 380, height: 520 }}
        >
          <AnimatePresence mode="wait">
            {hoveredBook ? (
              <CoverReveal key={hoveredBook.id} book={hoveredBook} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center p-3"
              >
                <div
                  className="bg-paper p-2 w-full h-full flex items-center justify-center"
                  style={{ boxShadow: "0 12px 30px rgba(28, 26, 23, 0.18)" }}
                >
                  {/* cover */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-px w-full bg-hairline" />
      {/* <div
        className="h-2 w-full rounded-sm"
        style={{
          background:
            "linear-gradient(180deg, #8B6A47 0%, #6F5135 55%, #5A4029 100%)",
          boxShadow: "0 4px 8px rgba(28, 26, 23, 0.15)",
        }}
      /> */}
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
            {lang === "fa"
              ? book.title_fa || book.title
              : book.title || book.title_fa}
          </span>
        </div>

        <div className="absolute top-4 inset-x-3 h-px bg-brass/40" />
        <div className="absolute bottom-4 inset-x-3 h-px bg-brass/40" />
      </motion.div>
    </Link>
  );
}

function CoverReveal({ book }: { book: Book }) {
  const url = coverUrl(book.cover_path);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div
        className="bg-paper p-2 w-full h-full flex items-center justify-center"
        style={{ boxShadow: "0 12px 30px rgba(28, 26, 23, 0.18)" }}
      >
        {url ? (
          <img
            src={url}
            alt={book.title || book.title_fa || ""}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: book.spine_color ?? "#6E2639" }}
          />
        )}
      </div>
    </motion.div>
  );
}
