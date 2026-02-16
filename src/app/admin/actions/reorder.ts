"use server";

import { createSupabaseAdminClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

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

  revalidatePath(adminPath);
  revalidatePath("/", "layout");
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
