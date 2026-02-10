import { createSupabaseClient } from "@/lib/supabase";
import type { Product, DbProduct } from "@/data/types";

function toProduct(row: DbProduct): Product {
  return {
    slug: row.slug,
    categorySlug: row.category_slug,
    brandSlug: row.brand_slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    image: row.image,
    gallery: row.gallery,
    specifications: row.specifications,
    features: row.features,
    documents: row.documents,
    featured: row.featured,
    sortOrder: row.sort_order,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order");
  if (error) return [];
  return (data as DbProduct[]).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return undefined;
  return toProduct(data as DbProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", categorySlug)
    .order("sort_order");
  if (error) return [];
  return (data as DbProduct[]).map(toProduct);
}

export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("brand_slug", brandSlug)
    .order("sort_order");
  if (error) return [];
  return (data as DbProduct[]).map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("sort_order");
  if (error) return [];
  return (data as DbProduct[]).map(toProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug");
  if (error) return [];
  return data.map((row) => row.slug);
}

export async function getProductSlugsWithDates(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug, updated_at");
  if (error) return [];
  return data.map((row) => ({
    slug: row.slug,
    updatedAt: row.updated_at,
  }));
}
