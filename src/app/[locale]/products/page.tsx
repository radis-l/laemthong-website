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
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            {/* Sidebar filters */}
            <aside className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  {t("filterByCategory")}
                </h3>
                <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                  <Link
                    href={buildProductsUrl({ brand, q })}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      !category
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("allCategories")}
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={buildProductsUrl({ category: cat.slug, brand, q })}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        category === cat.slug
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.name[loc]}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  {t("filterByBrand")}
                </h3>
                <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                  <Link
                    href={buildProductsUrl({ category, q })}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      !brand
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("allBrands")}
                  </Link>
                  {brands.map((b) => (
                    <Link
                      key={b.slug}
                      href={buildProductsUrl({ category, brand: b.slug, q })}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        brand === b.slug
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <div>
              <div className="mb-6">
                <Suspense fallback={<div className="h-9" />}>
                  <ProductSearch currentQuery={q ?? ""} />
                </Suspense>
              </div>

              {q && filteredProducts.length > 0 && (
                <p className="mb-4 text-sm text-muted-foreground">
                  {t("searchResultsFor", { query: q })} ({filteredProducts.length})
                </p>
              )}

              {filteredProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
          </div>
        </div>
      </section>
    </>
  );
}
