import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useArticles } from "../hooks/useArticles";
import { useComments } from "../hooks/useComments";
import { useUIStore } from "../stores/uiStore";
import { getTitles } from "../lib/title";
import ReadingProgress from "../components/sections/ReadingProgress";
import CommentForm from "../components/sections/CommentForm";
import CommentList from "../components/sections/CommentList";
import { ArrowLink } from "../components/ui/ArrowLink";
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

const LANG_LABEL_FA: Record<string, string> = {
  fa: "فارسی",
  ar: "عربی",
  en: "انگلیسی",
  "fa-ar": "فارسی و عربی",
  other: "سایر",
};

export default function ArticleDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { data: articles, isLoading } = useArticles();
  const lang = useUIStore((s) => s.lang);

  const article = articles?.find((a) => a.slug === slug);
  const { primary, secondary } = article
    ? getTitles(article, lang)
    : { primary: "", secondary: null };

  const { data: comments } = useComments(
    "article",
    article?.id ?? "00000000-0000-0000-0000-000000000000",
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-32 md:pt-40 pb-24">
        <Loading />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-32 md:pt-40 pb-24">
        <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight">
          {t("article_detail.not_found")}
        </h1>
        <p className="mt-4 text-muted">{t("article_detail.not_found_text")}</p>
        <ArrowLink
          to="/articles"
          direction="back"
          variant="muted"
          className="mt-6 text-xs uppercase tracking-[0.2em]"
        >
          {t("article_detail.back")}
        </ArrowLink>
      </div>
    );
  }

  const coverUrl = article.cover_path
    ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${article.cover_path}`
    : null;

  const langLabelMap = lang === "fa" ? LANG_LABEL_FA : LANG_LABEL;

  return (
    <article className="max-w-4xl mx-auto px-6 pt-32 md:pt-40 pb-24">
      <ReadingProgress />

      <header className="mb-12">
        <ArrowLink
          to="/articles"
          direction="back"
          variant="muted"
          className="text-xs uppercase tracking-[0.2em]"
        >
          {t("article_detail.back")}
        </ArrowLink>

        <div className="mt-6">
          <h1 className="heading-glow font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
            {primary}
          </h1>
        </div>

        {secondary && (
          <p
            className="mt-3 font-serif text-xl md:text-2xl font-light text-muted"
            dir={lang === "en" ? "rtl" : "ltr"}
          >
            {secondary}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          {article.published_at && (
            <time dateTime={article.published_at}>
              {new Date(article.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {article.published_in && (
            <>
              <span>·</span>
              <span className="italic">{article.published_in}</span>
            </>
          )}
          {article.language && (
            <>
              <span>·</span>
              <span>{langLabelMap[article.language] ?? article.language}</span>
            </>
          )}
        </div>
      </header>

      {coverUrl && (
        <div className="mb-12">
          <img src={coverUrl} alt={primary} className="w-full" />
        </div>
      )}

      {article.body_md && (
        <div className="prose-article">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.body_md}
          </ReactMarkdown>
        </div>
      )}

      {article.pdf_path && (
        <div className="mt-16 pt-10 border-t border-hairline">
          <div className="text-xs uppercase tracking-[0.3em] text-brass mb-4">
            {t("article_detail.full_article")}
          </div>
          <p className="text-ink/80 leading-relaxed max-w-prose mb-8">
            {t("article_detail.full_article_text")}
          </p>

          <div className="flex items-center gap-8 text-sm">
            <a
              href={`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${article.pdf_path}`}
              target="_blank"
              rel="noreferrer"
              className="group/btn relative inline-block uppercase tracking-[0.2em] text-xs text-ink py-2 transition-colors"
            >
              <span className="relative z-10">
                {t("article_detail.read_full")}
              </span>
              <span className="absolute bottom-1.5 inset-x-0 h-px bg-ink/40 transition-all duration-300 group-hover/btn:h-[2px] group-hover/btn:bg-ink" />
              <span className="absolute bottom-1.5 inset-x-0 h-0 bg-brass/25 transition-all duration-300 group-hover/btn:h-6 group-hover/btn:bottom-1.5" />
            </a>

            <a
              href={`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${article.pdf_path}`}
              download
              className="group/btn relative inline-block uppercase tracking-[0.2em] text-xs text-muted py-2 transition-colors hover:text-ink"
            >
              <span className="relative z-10">
                {t("article_detail.download_pdf")}
              </span>
              <span className="absolute bottom-1.5 inset-x-0 h-px bg-muted/40 transition-all duration-300 group-hover/btn:h-[2px] group-hover/btn:bg-ink" />
              <span className="absolute bottom-1.5 inset-x-0 h-0 bg-brass/25 transition-all duration-300 group-hover/btn:h-6 group-hover/btn:bottom-1.5" />
            </a>
          </div>
        </div>
      )}

      {article.tags.length > 0 && (
        <div className="mt-16 pt-8 border-t border-hairline flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs uppercase tracking-wider text-muted border border-hairline px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <section className="mt-24 pt-14 border-t border-hairline">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-brass mb-3">
              {t("article_detail.discussion")}
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-light tracking-tight">
              {t("comments.title")}
              {comments && comments.length > 0 && (
                <span className="ms-3 text-muted text-xl">
                  ({comments.length})
                </span>
              )}
            </h2>
          </div>
        </div>

        {comments && <CommentList comments={comments} />}

        <div className="mt-16">
          <div className="text-xs uppercase tracking-[0.3em] text-brass mb-3">
            {t("article_detail.join_in")}
          </div>
          <h3 className="font-serif text-xl md:text-2xl font-light tracking-tight mb-6">
            {t("comments.leave")}
          </h3>
          <CommentForm targetType="article" targetId={article.id} />
        </div>
      </section>
    </article>
  );
}
