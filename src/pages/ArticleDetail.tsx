import { useParams, Link } from "react-router-dom";
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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

const LANG_LABEL: Record<string, string> = {
  fa: "Persian",
  ar: "Arabic",
  en: "English",
  "fa-ar": "Persian & Arabic",
  other: "Other",
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
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-32 md:pt-40 pb-24">
        <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight">
          Not found
        </h1>
        <p className="mt-4 text-muted">This article doesn't exist.</p>
        <Link
          to="/articles"
          className="inline-block mt-6 text-burgundy hover:underline"
        >
          ← Back to articles
        </Link>
      </div>
    );
  }

  const coverUrl = article.cover_path
    ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${article.cover_path}`
    : null;

  return (
    <article className="max-w-4xl mx-auto px-6 pt-32 md:pt-40 pb-24">
      <ReadingProgress />

      <header className="mb-12">
        <Link
          to="/articles"
          className="text-xs uppercase tracking-[0.2em] text-muted hover:text-burgundy transition-colors"
        >
          ← {t("nav.articles")}
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
              <span>{LANG_LABEL[article.language] ?? article.language}</span>
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
              Discussion
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
            Join in
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
