import { useTranslation } from "react-i18next";
import PageShell from "../components/layout/PageShell";

export default function Translations() {
  const { t } = useTranslation();
  return (
    <PageShell
      title={t("pages.translations.title")}
      subtitle={t("pages.translations.subtitle")}
    >
      <p className="text-muted">Translations will appear here.</p>
    </PageShell>
  );
}
