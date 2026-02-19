import { unstable_cache } from "next/cache";
import { getAllCategories, getAllBrands } from "./index";

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
