import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAllProducts, getAllCategories, getAllBrands } from "@/lib/db";
import { ProductCard } from "@/components/products/product-card";
import { ProductSearch } from "@/components/products/product-search";
import { Link } from "@/i18n/navigation";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
} from "@/lib/seo";
import type { Locale } from "@/data/types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; brand?: string; q?: string }>;
};

function buildProductsUrl(params: { category?: string; brand?: string; q?: string }): string {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.brand) sp.set("brand", params.brand);
  if (params.q) sp.set("q", params.q);
  const qs = sp.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "products" });
  const title = t("title");
  const description = t("description");
  const pageUrl = getPageUrl(loc, "/products");
  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: getAlternateLanguages("/products"),
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      locale: getOgLocale(loc),
      alternateLocale: getOgAlternateLocale(loc),
      type: "website",
    },
    twitter: { title, description },
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, brand, q } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  const loc = locale as Locale;

  const [allProducts, categories, brands] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
  ]);

  const searchQuery = q?.trim().toLowerCase() ?? "";

  const filteredProducts = allProducts.filter((p) => {
    if (category && p.categorySlug !== category) return false;
    if (brand && p.brandSlug !== brand) return false;
    if (searchQuery) {
      const name = p.name[loc].toLowerCase();
      const shortDesc = p.shortDescription[loc].toLowerCase();
      const desc = p.description[loc].toLowerCase();
      if (
        !name.includes(searchQuery) &&
        !shortDesc.includes(searchQuery) &&
        !desc.includes(searchQuery)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      {/* Page header */}
      <section className="border-b py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            {t("title")}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          {/* Top filter bar */}
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Suspense fallback={<div className="h-10 w-full max-w-sm" />}>
                <ProductSearch currentQuery={q ?? ""} />
              </Suspense>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("filterByCategory")}:
              </span>
              <Link
                href={buildProductsUrl({ brand, q })}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  !category
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {t("allCategories")}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={buildProductsUrl({ category: cat.slug, brand, q })}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    category === cat.slug
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {cat.name[loc]}
                </Link>
              ))}
            </div>

            {/* Brand pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("filterByBrand")}:
              </span>
              <Link
                href={buildProductsUrl({ category, q })}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  !brand
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {t("allBrands")}
              </Link>
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  href={buildProductsUrl({ category, brand: b.slug, q })}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    brand === b.slug
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Results info */}
          <div className="mt-8 mb-6 flex items-center justify-between border-b pb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {q
                ? `${t("searchResultsFor", { query: q })} (${filteredProducts.length})`
                : `${filteredProducts.length} products`}
            </p>
          </div>

          {/* Product grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  locale={loc}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              {t("noProducts")}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
