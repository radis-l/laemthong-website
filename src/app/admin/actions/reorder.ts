"use server";

import { createSupabaseAdminClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function reorderBrands(slugs: string[]) {
  const supabase = createSupabaseAdminClient();

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Update sort_order in batch - renumber with gaps of 10
  const updates = slugs.map((slug, index) => ({
    slug,
    sort_order: (index + 1) * 10,
  }));

  // Update each brand's sort_order
  for (const { slug, sort_order } of updates) {
    await supabase.from("brands").update({ sort_order }).eq("slug", slug);
  }

  revalidatePath("/admin/brands");
  revalidatePath("/", "layout"); // Revalidate public pages
}

export async function reorderCategories(slugs: string[]) {
  const supabase = createSupabaseAdminClient();

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Update sort_order in batch - renumber with gaps of 10
  const updates = slugs.map((slug, index) => ({
    slug,
    sort_order: (index + 1) * 10,
  }));

  // Update each category's sort_order
  for (const { slug, sort_order } of updates) {
    await supabase.from("categories").update({ sort_order }).eq("slug", slug);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout"); // Revalidate public pages
}

export async function reorderProducts(slugs: string[]) {
  const supabase = createSupabaseAdminClient();

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Update sort_order in batch - renumber with gaps of 10
  const updates = slugs.map((slug, index) => ({
    slug,
    sort_order: (index + 1) * 10,
  }));

  // Update each product's sort_order
  for (const { slug, sort_order } of updates) {
    await supabase.from("products").update({ sort_order }).eq("slug", slug);
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout"); // Revalidate public pages
}
