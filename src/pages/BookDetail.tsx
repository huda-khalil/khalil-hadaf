import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBooks } from "../hooks/useBooks";
import { useUIStore } from "../stores/uiStore";
import { getTitles } from "../lib/title";
import { ArrowLink } from "../components/ui/ArrowLink";
import MoreBooks from "../components/sections/MoreBooks";
import Loading from "../components/ui/Loading";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

const LANG_LABEL: Record<string, string> = {
  fa: "Persian",
  ar: "Arabic",
  en: "English",
  "fa-ar": "Persian & Arabic",
  other: "Other",
};

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
        <Loading />
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
        <ArrowLink
          to="/books"
          direction="back"
          variant="muted"
          className="text-xs uppercase tracking-[0.2em]"
        >
          {t("nav.books")}
        </ArrowLink>
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
        <ArrowLink
          to="/books"
          direction="back"
          variant="muted"
          className="text-xs uppercase tracking-[0.2em]"
        >
          {t("nav.books")}
        </ArrowLink>

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
              <ArrowLink href={book.buy_url} variant="primary">
                Buy
              </ArrowLink>
            )}

            {book.pdf_path && (
              <div className="flex items-center gap-8 text-sm">
                <a
                  href={`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${book.pdf_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn relative inline-block uppercase tracking-[0.2em] text-xs text-ink py-2 transition-colors"
                >
                  <span className="relative z-10">Read</span>
                  <span className="absolute bottom-1.5 inset-x-0 h-px bg-ink/40 transition-all duration-300 group-hover/btn:h-[2px] group-hover/btn:bg-ink" />
                  <span className="absolute bottom-1.5 inset-x-0 h-0 bg-brass/25 transition-all duration-300 group-hover/btn:h-6 group-hover/btn:bottom-1.5" />
                </a>

                <a
                  href={`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${book.pdf_path}`}
                  download
                  className="group/btn relative inline-block uppercase tracking-[0.2em] text-xs text-muted py-2 transition-colors hover:text-ink"
                >
                  <span className="relative z-10">Download</span>
                  <span className="absolute bottom-1.5 inset-x-0 h-px bg-muted/40 transition-all duration-300 group-hover/btn:h-[2px] group-hover/btn:bg-ink" />
                  <span className="absolute bottom-1.5 inset-x-0 h-0 bg-brass/25 transition-all duration-300 group-hover/btn:h-6 group-hover/btn:bottom-1.5" />
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
                <dd>{LANG_LABEL[book.language] ?? book.language}</dd>
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
      {books && books.length > 1 && (
        <section className="mt-32 pt-16 border-t border-hairline">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="mb-4 flex items-center gap-4">
                <span className="h-px w-8 bg-brass" />
                <span className="text-xs uppercase tracking-[0.3em] text-brass">
                  More from the shelf
                </span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.15em] uppercase">
                Other books
              </h2>
            </div>
            <ArrowLink
              to="/books"
              variant="muted"
              className="text-xs uppercase tracking-[0.2em] pb-1"
            >
              All books
            </ArrowLink>
          </div>

          <MoreBooks books={books} excludeId={book.id} />
        </section>
      )}
    </div>
  );
}
