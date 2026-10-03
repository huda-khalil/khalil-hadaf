export function slugify(input: string): string {
  const cleaned = input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // keep word chars, spaces, hyphens
    .replace(/[\s_]+/g, "-") // spaces/underscores → hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // trim leading/trailing hyphens

  if (cleaned.length >= 2) return cleaned;

  // Fallback for Persian/Arabic titles (or anything that cleans to nothing)
  return `bk-${Math.random().toString(36).slice(2, 8)}`;
}
