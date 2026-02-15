import { createSupabaseClient } from "@/lib/supabase";
import type { Product, DbProduct, Locale } from "@/data/types";

export type ProductSort = "default" | "name-asc" | "name-desc" | "newest";

export type ProductFilter = {
  category?: string;
  brand?: string;
  search?: string;
  locale?: Locale;
  sort?: ProductSort;
  page?: number;
  perPage?: number;
};

export type PaginatedProducts = {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

function toProduct(row: DbProduct): Product {
  return {
    slug: row.slug,
    categorySlug: row.category_slug,
    brandSlug: row.brand_slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    images: row.images ?? [],
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

export async function getFilteredProducts(filter: ProductFilter = {}): Promise<PaginatedProducts> {
  const supabase = createSupabaseClient();
  const {
    category,
    brand,
    search,
    locale = "th",
    sort = "default",
    page = 1,
    perPage = 24,
  } = filter;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" });

  if (category) query = query.eq("category_slug", category);
  if (brand) query = query.eq("brand_slug", brand);

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      `name->>th.ilike.${pattern},name->>en.ilike.${pattern},short_description->>th.ilike.${pattern},short_description->>en.ilike.${pattern}`
    );
  }

  switch (sort) {
    case "name-asc":
      query = query.order(`name->>` + locale, { ascending: true });
      break;
    case "name-desc":
      query = query.order(`name->>` + locale, { ascending: false });
      break;
    case "newest":
      query = query.order("updated_at", { ascending: false });
      break;
    default:
      query = query.order("sort_order", { ascending: true });
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) return { products: [], total: 0, page, perPage, totalPages: 0 };

  const total = count ?? 0;
  return {
    products: (data as DbProduct[]).map(toProduct),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
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
