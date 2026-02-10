import { createSupabaseAdminClient } from "@/lib/supabase";
import type { DbBrand, DbCategory, DbProduct } from "@/data/types";

// ─── Brands ──────────────────────────────────────────────────────────────────

export async function adminGetAllBrands(): Promise<DbBrand[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data as DbBrand[];
}

export async function adminGetBrandBySlug(
  slug: string
): Promise<DbBrand | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as DbBrand;
}

export async function adminCreateBrand(
  brand: Omit<DbBrand, "updated_at">
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("brands").insert(brand);
  if (error) throw error;
}

export async function adminUpdateBrand(
  slug: string,
  brand: Partial<Omit<DbBrand, "updated_at">>
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("brands")
    .update(brand)
    .eq("slug", slug);
  if (error) throw error;
}

export async function adminDeleteBrand(slug: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("brands").delete().eq("slug", slug);
  if (error) throw error;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function adminGetAllCategories(): Promise<DbCategory[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data as DbCategory[];
}

export async function adminGetCategoryBySlug(
  slug: string
): Promise<DbCategory | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as DbCategory;
}

export async function adminCreateCategory(
  category: Omit<DbCategory, "updated_at">
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("categories").insert(category);
  if (error) throw error;
}

export async function adminUpdateCategory(
  slug: string,
  category: Partial<Omit<DbCategory, "updated_at">>
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("categories")
    .update(category)
    .eq("slug", slug);
  if (error) throw error;
}

export async function adminDeleteCategory(slug: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("slug", slug);
  if (error) throw error;
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function adminGetAllProducts(): Promise<DbProduct[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data as DbProduct[];
}

export async function adminGetProductBySlug(
  slug: string
): Promise<DbProduct | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as DbProduct;
}

export async function adminCreateProduct(
  product: Omit<DbProduct, "updated_at">
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("products").insert(product);
  if (error) throw error;
}

export async function adminUpdateProduct(
  slug: string,
  product: Partial<Omit<DbProduct, "updated_at">>
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("products")
    .update(product)
    .eq("slug", slug);
  if (error) throw error;
}

export async function adminDeleteProduct(slug: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("products").delete().eq("slug", slug);
  if (error) throw error;
}
