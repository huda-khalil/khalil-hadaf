/**
 * Given an item with `title` (Latin) and `title_fa` (Persian),
 * return the primary + secondary titles for the current language.
 *
 * - primary: the title in the current language, or falls back to the other
 * - secondary: the title in the OTHER language, shown smaller if it exists
 *              and differs from the primary
 */
export function getTitles(
  item: { title: string | null; title_fa?: string | null },
  lang: "en" | "fa",
): { primary: string; secondary: string | null } {
  const en = item.title?.trim() || null;
  const fa = item.title_fa?.trim() || null;

  if (lang === "fa") {
    const primary = fa ?? en ?? "";
    const secondary = en && en !== primary ? en : null;
    return { primary, secondary };
  }

  const primary = en ?? fa ?? "";
  const secondary = fa && fa !== primary ? fa : null;
  return { primary, secondary };
}
