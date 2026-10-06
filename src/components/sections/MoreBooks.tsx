import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../../schemas/book";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

function coverUrl(path: string | null) {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MoreBooks({
  books,
  excludeId,
}: {
  books: Book[];
  excludeId?: string;
}) {
  const randomBooks = useMemo(() => {
    const pool = books.filter((b) => b.id !== excludeId);
    return shuffle(pool).slice(0, 6);
  }, [books, excludeId]);

  if (randomBooks.length === 0) return null;

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-5">
      {randomBooks.map((book) => {
        const url = coverUrl(book.cover_path);

        return (
          <Link
            key={book.id}
            to={`/books/${book.slug}`}
            className="block group"
          >
            <div className="aspect-[2/3] bg-hairline overflow-hidden">
              {url ? (
                <img
                  src={url}
                  alt={book.title || book.title_fa || ""}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: book.spine_color ?? "#6E2639" }}
                />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
