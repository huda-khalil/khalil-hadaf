import type { ReactNode } from "react";
import { useUIStore } from "../../stores/uiStore";

type Props = {
  title: string;
  titleSecondary?: string | null;
  subtitle?: string;
  children?: ReactNode;
};

export default function PageShell({
  title,
  titleSecondary,
  subtitle,
  children,
}: Props) {
  const lang = useUIStore((s) => s.lang);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-24">
      <header className="mb-16">
        <h1 className="heading-glow font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
          {title}
        </h1>

        {titleSecondary && (
          <p
            className="mt-3 font-serif text-xl md:text-2xl font-light text-muted"
            dir={lang === "en" ? "rtl" : "ltr"}
          >
            {titleSecondary}
          </p>
        )}

        {subtitle && <p className="mt-4 text-muted text-lg">{subtitle}</p>}
      </header>
      {children}
    </div>
  );
}
