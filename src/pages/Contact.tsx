import { useTranslation } from "react-i18next";
import PageShell from "../components/layout/PageShell";

export default function Contact() {
  const { t } = useTranslation();
  return (
    <PageShell
      title={t("pages.contact.title")}
      subtitle={t("pages.contact.subtitle")}
    >
      <p className="text-muted">Contact will appear here.</p>
    </PageShell>
  );
}
