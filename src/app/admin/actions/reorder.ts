"use server";

import { createSupabaseAdminClient } from "@/lib/supabase";
import { revalidateEntity } from "@/lib/revalidation";

async function reorderEntities(
  table: "brands" | "categories" | "products",
  slugs: string[],
  adminPath: string
) {
  const supabase = createSupabaseAdminClient();

  for (const [index, slug] of slugs.entries()) {
    const { error } = await supabase
      .from(table)
      .update({ sort_order: (index + 1) * 10 })
      .eq("slug", slug);

    if (error) throw error;
  }

  revalidateEntity(adminPath);
}

export async function reorderBrands(slugs: string[]) {
  return reorderEntities("brands", slugs, "/admin/brands");
}

export async function reorderCategories(slugs: string[]) {
  return reorderEntities("categories", slugs, "/admin/categories");
}

export async function reorderProducts(slugs: string[]) {
  return reorderEntities("products", slugs, "/admin/products");
}
