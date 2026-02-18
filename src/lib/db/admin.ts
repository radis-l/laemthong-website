import { createSupabaseAdminClient } from "@/lib/supabase";
import type { DbBrand, DbCategory, DbProduct, DbPageImage } from "@/data/types";

// ─── Brands ──────────────────────────────────────────────────────────────────

export async function adminGetAllBrands(): Promise<DbBrand[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("sort_order");
  if (error) return [];
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
): Promise<DbBrand> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("brands")
    .insert(brand)
    .select()
    .single();
  if (error) throw error;
  return data as DbBrand;
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
  if (error) return [];
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
): Promise<DbCategory> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();
  if (error) throw error;
  return data as DbCategory;
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

export interface AdminProductsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  brand?: string;
}

export interface AdminProductsResult {
  products: DbProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function adminGetProducts(
  query: AdminProductsQuery = {}
): Promise<AdminProductsResult> {
  const {
    page = 1,
    pageSize = 20,
    search,
    category,
    brand,
  } = query;

  const supabase = createSupabaseAdminClient();
  let q = supabase.from("products").select("*", { count: "exact" });

  // Search across name (en/th) and slug
  if (search) {
    const term = `%${search}%`;
    q = q.or(`name->>en.ilike.${term},name->>th.ilike.${term},slug.ilike.${term}`);
  }

  // Filters
  if (category) q = q.eq("category_slug", category);
  if (brand) q = q.eq("brand_slug", brand);

  // Always sort by sort_order ascending
  q = q.order("sort_order", { ascending: true });

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;

  if (error) {
    return { products: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const total = count ?? 0;
  return {
    products: data as DbProduct[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function adminGetAllProducts(): Promise<DbProduct[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order");
  if (error) return [];
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

// ─── Page Images ────────────────────────────────────────────────────────────

export async function adminGetAllPageImages(): Promise<DbPageImage[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("page_images")
    .select("*")
    .order("key");
  if (error) return [];
  return data as DbPageImage[];
}

export async function adminUpsertPageImage(
  key: string,
  imageUrl: string
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("page_images")
    .upsert({ key, image_url: imageUrl }, { onConflict: "key" });
  if (error) throw error;
}

export async function adminDeletePageImage(key: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("page_images")
    .delete()
    .eq("key", key);
  if (error) throw error;
}
