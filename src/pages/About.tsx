import { useTranslation } from "react-i18next";
import PageShell from "../components/layout/PageShell";
import Timeline from "../components/sections/Timeline";
import { useTimeline } from "../hooks/useTimeline";

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
    </PageShell>
  );
}
