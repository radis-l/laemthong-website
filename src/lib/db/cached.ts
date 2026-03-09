import { unstable_cache } from "next/cache";
import { getAllCategories, getAllBrands } from "./index";
import { getFilteredProducts, type ProductFilter } from "./products";

export const getCachedCategories = unstable_cache(
  getAllCategories,
  ["all-categories"],
  { revalidate: 3600 },
);

export const getCachedBrands = unstable_cache(
  getAllBrands,
  ["all-brands"],
  { revalidate: 3600 },
);

export function getCachedFilteredProducts(filter: ProductFilter) {
  const key = `products:${filter.category ?? ""}:${filter.brand ?? ""}:${filter.search ?? ""}:${filter.page ?? 1}:${filter.perPage ?? 24}`;
  return unstable_cache(
    () => getFilteredProducts(filter),
    [key],
    { revalidate: 3600, tags: ["products"] },
  )();
}
