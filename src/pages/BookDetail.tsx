import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBooks } from "../hooks/useBooks";
import { useUIStore } from "../stores/uiStore";
import { getTitles } from "../lib/title";
import { ArrowLink } from "../components/ui/ArrowLink";
import MoreBooks from "../components/sections/MoreBooks";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

const LANG_LABEL: Record<string, string> = {
  fa: "Persian",
  ar: "Arabic",
  en: "English",
  "fa-ar": "Persian & Arabic",
  other: "Other",
};

const LANG_LABEL_FA: Record<string, string> = {
  fa: "فارسی",
  ar: "عربی",
  en: "انگلیسی",
  "fa-ar": "فارسی و عربی",
  other: "سایر",
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
        <p className="text-muted">{t("common.loading")}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-24">
        <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight">
          {t("book_detail.not_found")}
        </h1>
        <p className="mt-4 text-muted">{t("book_detail.not_found_text")}</p>
        <ArrowLink
          to="/books"
          direction="back"
          variant="muted"
          className="mt-6 text-xs uppercase tracking-[0.2em]"
        >
          {t("book_detail.back")}
        </ArrowLink>
      </div>
    );
  }

  const coverUrl = book.cover_path
    ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${book.cover_path}`
    : null;

  const langLabelMap = lang === "fa" ? LANG_LABEL_FA : LANG_LABEL;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-24">
      <header className="mb-16">
        <ArrowLink
          to="/books"
          direction="back"
          variant="muted"
          className="text-xs uppercase tracking-[0.2em]"
        >
          {t("book_detail.back")}
        </ArrowLink>

        <h1 className="heading-glow mt-6 font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
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
                {t("book_detail.buy")}
              </ArrowLink>
            )}

            {book.pdf_path && (
              <div className="flex items-center gap-4 text-sm tracking-wide">
                <ArrowLink
                  href={`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${book.pdf_path}`}
                  variant="primary"
                >
                  {t("book_detail.read_pdf")}
                </ArrowLink>
                <span className="text-hairline">·</span>
                <a
                  href={`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${book.pdf_path}`}
                  download
                  className="text-muted hover:text-burgundy transition-colors"
                >
                  {t("book_detail.download")}
                </a>
              </div>
            )}
          </div>
        </div>

        <div>
          <dl className="grid grid-cols-[130px_1fr] gap-y-3 text-sm">
            {book.year && (
              <>
                <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
                  {t("book_detail.year")}
                </dt>
                <dd>{book.year}</dd>
              </>
            )}
            {book.publisher && (
              <>
                <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
                  {t("book_detail.publisher")}
                </dt>
                <dd>{book.publisher}</dd>
              </>
            )}
            {book.language && (
              <>
                <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
                  {t("book_detail.language")}
                </dt>
                <dd>{langLabelMap[book.language] ?? book.language}</dd>
              </>
            )}
            <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
              {t("book_detail.category")}
            </dt>
            <dd>{t(`category.${book.category}`)}</dd>
            {book.original_author && (
              <>
                <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
                  {t("book_detail.original_author")}
                </dt>
                <dd>{book.original_author}</dd>
              </>
            )}
            {book.original_title && (
              <>
                <dt className="text-muted uppercase tracking-wider text-xs pt-0.5">
                  {t("book_detail.original_title")}
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
                  {t("book_detail.more_from_shelf")}
                </span>
              </div>
              <h2 className="heading-glow font-serif text-2xl md:text-3xl font-light tracking-[0.15em] uppercase">
                {t("book_detail.other_books")}
              </h2>
            </div>
            <ArrowLink
              to="/books"
              variant="muted"
              className="text-xs uppercase tracking-[0.2em] pb-1"
            >
              {t("home.link_all_books")}
            </ArrowLink>
          </div>

          <MoreBooks books={books} excludeId={book.id} />
        </section>
      )}
    </div>
  );
}
