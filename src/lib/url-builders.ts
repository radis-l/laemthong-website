/**
 * Build a URL for the products page with optional filter parameters.
 * Shared across products page, filter bar, and pagination.
 */
export function buildProductsUrl(params: {
  category?: string;
  brand?: string;
  q?: string;
  page?: number;
  view?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.brand) sp.set("brand", params.brand);
  if (params.q) sp.set("q", params.q);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  if (params.view && params.view !== "grid") sp.set("view", params.view);
  const qs = sp.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}
