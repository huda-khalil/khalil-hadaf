import { useTranslation } from "react-i18next";
import PageShell from "../components/layout/PageShell";
import Timeline from "../components/sections/Timeline";
import { useTimeline } from "../hooks/useTimeline";
import NewsletterForm from "../components/sections/NewsletterForm";

export default function About() {
  const { t } = useTranslation();
  const { data: events, isLoading, error } = useTimeline();

  return (
    <PageShell
      title={t("pages.about.title")}
      subtitle={t("pages.about.subtitle")}
    >
      <div className="max-w-prose mb-20">
        <p className="text-ink/85 leading-relaxed">
          Khalil Hadaf is an author, lecturer, and translator working between
          Arabic and Persian. His work spans classical poetry, modern prose, and
          the difficult art of carrying meaning across languages.
        </p>
      </div>

      {isLoading && <p className="text-muted">Loading…</p>}

      {error && <p className="text-burgundy">Could not load timeline.</p>}

      {events && events.length > 0 && <Timeline events={events} />}
      <section className="mt-32 pt-16 border-t border-hairline max-w-2xl">
        <div className="mb-4 flex items-center gap-4">
          <span className="h-px w-8 bg-brass" />
          <span className="text-xs uppercase tracking-[0.3em] text-brass">
            {t("newsletter.heading")}
          </span>
        </div>
        <p className="font-serif text-2xl md:text-3xl font-light text-ink/85 leading-relaxed mb-10">
          {t("newsletter.subheading")}
        </p>
        <NewsletterForm />
      </section>
    </PageShell>
  );
}
