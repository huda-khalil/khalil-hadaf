import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBooks } from "../hooks/useBooks";
import { useUIStore } from "../stores/uiStore";
import { getTitles } from "../lib/title";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

export default function BookDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { data: books, isLoading } = useBooks();
  const lang = useUIStore((s) => s.lang);

  const book = books?.find((b) => b.slug === slug);
  const { primary, secondary } = book
    ? getTitles(book, lang)
    : { primary: "", secondary: null };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-24">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-24">
        <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight">
          Not found
        </h1>
        <p className="mt-4 text-muted">This book doesn't exist.</p>
        <Link
          to="/books"
          className="inline-block mt-6 text-burgundy hover:underline"
        >
          ← Back to books
        </Link>
      </div>
    );
  }

  const coverUrl = book.cover_path
    ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${book.cover_path}`
    : null;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-24">
      {/* Header */}
      <header className="mb-16">
        <Link
          to="/books"
          className="text-xs uppercase tracking-[0.2em] text-muted hover:text-burgundy transition-colors"
        >
          ← {t("nav.books")}
        </Link>

        <h1 className="mt-6 font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
          {primary}
        </h1>

        {secondary && (
          <p
            className="mt-3 font-serif text-xl md:text-2xl font-light text-muted"
            dir={lang === "en" ? "rtl" : "ltr"}
          >
            {secondary}
          </p>
        )}

        {book.subtitle && (
          <p className="mt-4 text-lg text-muted">{book.subtitle}</p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
        <div>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={primary}
              className="w-full"
              style={{ boxShadow: "0 12px 30px rgba(28, 26, 23, 0.15)" }}
            />
          ) : (
            <div
              className="w-full aspect-2/3"
              style={{ backgroundColor: book.spine_color ?? "#6E2639" }}
            />
          )}

          <div className="mt-6 space-y-3">
            {book.buy_url && (
              <a
                href={book.buy_url}
                target="_blank"
                rel="noreferrer"
                className="block text-sm tracking-wide text-burgundy hover:underline"
              >
                Buy →
              </a>
            )}

            {book.pdf_path && (
              <div className="flex items-center gap-4 text-sm tracking-wide">
                <a
                  href={`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${book.pdf_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-burgundy hover:underline"
                >
                  Read PDF
                </a>
                <span className="text-hairline">·</span>
                <a
                  href={`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${book.pdf_path}`}
                  download
                  className="text-muted hover:text-burgundy transition-colors"
                >
                  Download
                </a>
              </div>
            )}
          </div>
        </div>

        <div>
          <dl className="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
            {book.year && (
              <>
                <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
                  Year
                </dt>
                <dd>{book.year}</dd>
              </>
            )}
            {book.publisher && (
              <>
                <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
                  Publisher
                </dt>
                <dd>{book.publisher}</dd>
              </>
            )}
            {book.language && (
              <>
                <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
                  Language
                </dt>
                <dd className="uppercase">{book.language}</dd>
              </>
            )}
            <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
              Category
            </dt>
            <dd className="capitalize">{book.category}</dd>
            {book.original_author && (
              <>
                <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
                  Original author
                </dt>
                <dd>{book.original_author}</dd>
              </>
            )}
            {book.original_title && (
              <>
                <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
                  Original title
                </dt>
                <dd>{book.original_title}</dd>
              </>
            )}
          </dl>

          {book.description && (
            <p className="mt-10 text-ink/85 leading-relaxed max-w-prose">
              {book.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
