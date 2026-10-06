import { useTranslation } from "react-i18next";
import PageShell from "../components/layout/PageShell";

const EMAIL = "sekhalil58@gmail.com";
const FACEBOOK_URL = "https://www.facebook.com/khalil.hadaf.29350";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <PageShell title={t("contact.title")} subtitle={t("contact.subtitle")}>
      <div className="max-w-2xl">
        <p className="text-ink/85 leading-relaxed mb-12">
          {t("contact.intro")}
        </p>

        <dl className="grid grid-cols-[130px_1fr] gap-y-6 text-sm">
          <dt className="text-muted uppercase tracking-wider text-xs pt-1">
            {t("contact.email_label")}
          </dt>
          <dd>
            <a
              href={`mailto:${EMAIL}`}
              className="text-burgundy hover:underline"
            >
              {EMAIL}
            </a>
          </dd>

          <dt className="text-muted uppercase tracking-wider text-xs pt-1">
            {t("contact.facebook_label")}
          </dt>
          <dd>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="text-burgundy hover:underline"
            >
              Khalil Hadaf
            </a>
          </dd>

          <dt className="text-muted uppercase tracking-wider text-xs pt-1">
            {t("contact.phone_label")}
          </dt>
          <dd className="text-muted italic">{t("contact.phone_value")}</dd>
        </dl>
      </div>
    </PageShell>
  );
}
