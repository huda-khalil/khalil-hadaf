import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageShell from "../components/layout/PageShell";
import { useArticles } from "../hooks/useArticles";
import { useUIStore } from "../stores/uiStore";
import { getTitles } from "../lib/title";
import Loading from "../components/ui/Loading";

export default function Articles() {
  const { t } = useTranslation();
  const { data: articles, isLoading, error } = useArticles();
  const lang = useUIStore((s) => s.lang);

  return (
    <PageShell
      title={t("pages.articles.title")}
      subtitle={t("pages.articles.subtitle")}
    >
      {isLoading && <Loading />}

      {error && <p className="text-burgundy">Could not load articles.</p>}

      {articles && articles.length === 0 && (
        <p className="text-muted">No articles yet.</p>
      )}

      {articles && articles.length > 0 && (
        <div className="border-t border-hairline bg-well rounded-sm px-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="border-b border-hairline py-10 group"
            >
              <Link to={`/articles/${article.slug}`} className="block">
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 md:gap-10">
                  <div className="text-sm text-muted pt-1">
                    {article.published_at && (
                      <time dateTime={article.published_at}>
                        {new Date(article.published_at).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </time>
                    )}
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl font-light tracking-tight group-hover:text-burgundy transition-colors">
                      {getTitles(article, lang).primary}
                    </h2>
                    {getTitles(article, lang).secondary && (
                      <p
                        className="mt-1 font-serif text-base text-muted"
                        dir={lang === "en" ? "rtl" : "ltr"}
                      >
                        {getTitles(article, lang).secondary}
                      </p>
                    )}

                    {article.excerpt && (
                      <p className="mt-3 text-ink/70 leading-relaxed max-w-prose">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      {article.published_in && (
                        <span className="text-muted italic">
                          {article.published_in}
                        </span>
                      )}
                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
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
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
