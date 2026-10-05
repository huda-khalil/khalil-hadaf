import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeroCrossfade from "../components/sections/HeroCrossfade";
import FeaturedBooks from "../components/sections/FeaturedBooks";
import VideoCarousel from "../components/sections/VideoCarousel";
import { useBooks } from "../hooks/useBooks";
import { useArticles } from "../hooks/useArticles";
import { useVideos } from "../hooks/useVideos";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <span className="h-px w-8 bg-brass" />
      <span className="text-xs uppercase tracking-[0.3em] text-brass">
        {children}
      </span>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { data: books } = useBooks();
  const { data: articles } = useArticles();
  const { data: videos } = useVideos();

  const featuredArticles = articles?.filter((a) => a.featured) ?? [];
  const recentArticles = articles?.filter((a) => !a.featured) ?? [];
  const homeArticles = [...featuredArticles, ...recentArticles].slice(0, 10);

  const homeVideos = videos ?? [];

  return (
    <>
      <HeroCrossfade />

      {/* ─── Intro ─────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 py-24 md:py-32 text-center">
        <SectionLabel>{t("home.intro_label")}</SectionLabel>
        <p className="font-serif text-3xl md:text-4xl font-light text-ink/85 leading-relaxed">
          {t("home.intro_text")}
        </p>
      </section>

      {/* ─── Featured Books ────────────────────────────── */}
      {books && books.length > 0 && (
        <section className="border-t border-hairline">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-16">
              <div>
                <SectionLabel>{t("home.label_archive")}</SectionLabel>
                <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-[0.12em] uppercase">
                  {t("home.heading_featured_books")}
                </h2>
              </div>
              <Link
                to="/books"
                className="text-sm tracking-wide text-muted hover:text-burgundy transition-colors pb-2"
              >
                {t("home.link_all_books")}
              </Link>
            </div>

            <div className="bg-well/50 rounded-sm p-8 md:p-12 border border-hairline/60">
              <FeaturedBooks books={books} />
            </div>
          </div>
        </section>
      )}

      {/* ─── Latest Writing ────────────────────────────── */}
      {homeArticles.length > 0 && (
        <section className="bg-well">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <div className="flex items-end justify-between mb-12">
              <div>
                <SectionLabel>{t("home.label_writing")}</SectionLabel>
                <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-[0.12em] uppercase">
                  {t("home.heading_latest_articles")}
                </h2>
              </div>
              <Link
                to="/articles"
                className="text-sm tracking-wide text-muted hover:text-burgundy transition-colors pb-2"
              >
                {t("home.link_all_articles")}
              </Link>
            </div>

            {/* <div className="divide-y divide-hairline border-t border-b border-hairline"> */}
            <div className="divide-y divide-ink/15 border-t border-b border-ink/15">
              {homeArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="relative block py-6 group ps-0 hover:ps-5 transition-all duration-300"
                >
                  <span
                    aria-hidden
                    className="absolute inset-s-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-burgundy transition-all duration-300 group-hover:h-12"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-10">
                    <div className="text-sm text-muted pt-1">
                      {article.published_at &&
                        new Date(article.published_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl font-light group-hover:text-burgundy transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2 text-ink/70 leading-relaxed max-w-prose">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Selected Videos ───────────────────────────── */}
      {homeVideos.length > 0 && (
        <section className="border-t border-hairline">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-12">
              <div>
                <SectionLabel>{t("home.label_media")}</SectionLabel>
                <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-[0.12em] uppercase">
                  {t("home.heading_selected_videos")}
                </h2>
              </div>
              <Link
                to="/videos"
                className="text-sm tracking-wide text-muted hover:text-burgundy transition-colors pb-2"
              >
                {t("home.link_all_videos")} →
              </Link>
            </div>

            {/* Video carousel: kept LTR in both languages. The physical layout of
    thumbnails doesn't mirror, and the arrows should stay visually consistent. */}
            <div dir="ltr">
              <VideoCarousel videos={homeVideos} />
            </div>
          </div>
        </section>
      )}

      {/* ─── Timeline Invitation ───────────────────────── */}
      <section className="bg-ink text-paper">
        <div className="max-w-2xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="h-px w-16 bg-brass mx-auto mb-10" />
          <p className="font-serif text-3xl md:text-4xl font-light leading-relaxed">
            {t("home.timeline_line")}
          </p>
          <Link
            to="/about"
            className="mt-10 inline-block text-sm tracking-[0.2em] uppercase text-brass hover:text-paper transition-colors"
          >
            {t("home.link_timeline")} →
          </Link>
        </div>
      </section>
    </>
  );
}
