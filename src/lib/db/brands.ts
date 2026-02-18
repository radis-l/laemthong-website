import { createSupabaseClient } from "@/lib/supabase";
import type { Brand, DbBrand } from "@/data/types";

function toBrand(row: DbBrand): Brand {
  return {
    slug: row.slug,
    name: row.name,
    logo: row.logo,
    description: row.description,
    website: row.website ?? undefined,
    country: row.country,
    sortOrder: row.sort_order,
  };
}

export async function getAllBrands(): Promise<Brand[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("sort_order");
  if (error) return [];
  return (data as DbBrand[]).map(toBrand);
}

export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return undefined;
  return toBrand(data as DbBrand);
}

export async function getBrandSlugsWithDates(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("brands")
    .select("slug, updated_at");
  if (error) return [];
  return data.map((row) => ({
    slug: row.slug,
    updatedAt: row.updated_at,
  }));
}
