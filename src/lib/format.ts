/**
 * Converts a slug like "lincoln-electric" to "Lincoln Electric".
 */
export function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
