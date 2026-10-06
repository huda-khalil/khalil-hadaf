import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NewsletterForm from "../sections/NewsletterForm";

const LINKS = [
  { to: "/books", key: "books" },
  { to: "/articles", key: "articles" },
  { to: "/translations", key: "translations" },
  { to: "/about", key: "about" },
  { to: "/contact", key: "contact" },
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="font-serif text-2xl mb-3">{t("hero.name")}</div>
          <p className="text-sm text-muted">{t("footer.tagline")}</p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
            {t("footer.explore")}
          </div>
          <ul className="space-y-2">
            {LINKS.map((l) => (
              <li key={l.key}>
                <Link
                  to={l.to}
                  className="text-sm text-ink/80 hover:text-burgundy transition-colors"
                >
                  {t(`nav.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
            {t("footer.connect")}
          </div>
          <ul className="space-y-2 text-sm text-ink/80 mb-8">
            <li>
              <a
                href="mailto:contact@khalilhadaf.com"
                className="hover:text-burgundy transition-colors"
              >
                contact@khalilhadaf.com
              </a>
            </li>
          </ul>

          <div className="text-xs uppercase tracking-[0.2em] text-muted mb-3">
            {t("newsletter.heading")}
          </div>
          <NewsletterForm compact />
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted">
          <span>
            © {year} {t("hero.name")}. {t("footer.rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
