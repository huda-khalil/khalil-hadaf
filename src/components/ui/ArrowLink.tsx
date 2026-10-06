import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useUIStore } from "../../stores/uiStore";

type Direction = "forward" | "back";
type Variant = "primary" | "muted";

export function ArrowLink({
  to,
  href,
  children,
  direction = "forward",
  variant = "primary",
  className = "",
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  direction?: Direction;
  variant?: Variant;
  className?: string;
}) {
  const lang = useUIStore((s) => s.lang);
  const isRTL = lang === "fa";

  const arrowChar =
    direction === "forward" ? (isRTL ? "←" : "→") : isRTL ? "→" : "←";

  const arrowHover =
    direction === "forward"
      ? isRTL
        ? "group-hover/arrow:-translate-x-1"
        : "group-hover/arrow:translate-x-1"
      : isRTL
        ? "group-hover/arrow:translate-x-1"
        : "group-hover/arrow:-translate-x-1";

  const color =
    variant === "primary"
      ? "text-burgundy hover:text-burgundy-dark"
      : "text-muted hover:text-burgundy";

  const classes = `group/arrow inline-flex items-center gap-2 text-sm tracking-wide transition-colors ${color} ${className}`;

  const arrow = (
    <span
      className={`inline-block transition-transform duration-300 ease-out ${arrowHover}`}
    >
      {arrowChar}
    </span>
  );

  const content =
    direction === "back" ? (
      <>
        {arrow}
        <span>{children}</span>
      </>
    ) : (
      <>
        <span>{children}</span>
        {arrow}
      </>
    );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link to={to!} className={classes}>
      {content}
    </Link>
  );
}
