/**
 * Case-insensitive substring search across multiple string fields.
 * Returns true if query is empty or matches any field.
 */
export function matchesSearch(
  query: string,
  ...fields: (string | undefined | null)[]
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => field?.toLowerCase().includes(q));
}
