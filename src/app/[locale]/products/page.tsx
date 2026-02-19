import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getFilteredProducts, getCategoryBySlug, getBrandBySlug, getPageImage } from "@/lib/db";
import { getCachedCategories, getCachedBrands } from "@/lib/db/cached";
import type { ProductSort } from "@/lib/db";
import { ProductCard } from "@/components/products/product-card";
import { ProductSearch } from "@/components/products/product-search";
import { ProductFilterBar } from "@/components/products/product-filter-bar";
import { ProductPagination } from "@/components/products/product-pagination";
import { FilterNavigationProvider } from "@/components/products/products-filter-context";
import { SortSelect } from "@/components/products/sort-select";
import { ViewToggle } from "@/components/products/view-toggle";
import { ProductGridWrapper } from "@/components/products/product-grid-wrapper";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHero } from "@/components/shared/page-hero";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
  buildBreadcrumbSchema,
} from "@/lib/seo";
import type { Locale } from "@/data/types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    brand?: string;
    q?: string;
    page?: string;
    sort?: string;
    view?: string;
  }>;
};

const VALID_SORTS: ProductSort[] = ["default", "name-asc", "name-desc", "newest"];
const SORT_KEYS: Record<ProductSort, string> = {
  default: "sortDefault",
  "name-asc": "sortNameAsc",
  "name-desc": "sortNameDesc",
  newest: "sortNewest",
};

function buildProductsUrl(params: {
  category?: string;
  brand?: string;
  q?: string;
  page?: number;
  sort?: string;
  view?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.brand) sp.set("brand", params.brand);
  if (params.q) sp.set("q", params.q);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  if (params.sort && params.sort !== "default") sp.set("sort", params.sort);
  if (params.view && params.view !== "grid") sp.set("view", params.view);
  const qs = sp.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { category, brand } = await searchParams;
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "products" });

  let title = t("title");
  let description = t("description");
  let pagePath = "/products";

  if (category) {
    const cat = await getCategoryBySlug(category);
    if (cat) {
      title = `${cat.name[loc]} — ${t("title")}`;
      description = cat.description[loc] || description;
      pagePath = `/products?category=${category}`;
    }
  } else if (brand) {
    const br = await getBrandBySlug(brand);
    if (br) {
      title = `${br.name} — ${t("title")}`;
      description = br.description[loc] || description;
      pagePath = `/products?brand=${brand}`;
    }
  }

  const pageUrl = getPageUrl(loc, pagePath);
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
  const { category, brand, q, page: pageParam, sort: sortParam, view: viewParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  const loc = locale as Locale;

  const pageNum = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const sort: ProductSort = VALID_SORTS.includes(sortParam as ProductSort)
    ? (sortParam as ProductSort)
    : "default";
  const view = viewParam === "list" ? "list" : "grid";

  const [result, categories, brands, heroImage] = await Promise.all([
    getFilteredProducts({
      category,
      brand,
      search: q,
      locale: loc,
      sort,
      page: pageNum,
      perPage: 24,
    }),
    getCachedCategories(),
    getCachedBrands(),
    getPageImage("hero-products"),
  ]);

  const { products, total, totalPages } = result;

  const categoryMap = new Map(categories.map((c) => [c.slug, c]));
  const activeCategory = category ? categoryMap.get(category) : undefined;
  const activeBrand = brand ? brands.find((b) => b.slug === brand) : undefined;

  const tCommon = await getTranslations({ locale, namespace: "common" });

  // Hero content is always stable — filter context shown via breadcrumb + filter chips
  const heroLabel = t("title");
  const heroTitle = t("title");
  const heroDescription = t("description");

  // Pre-compute URLs for client components
  const sortUrls = Object.fromEntries(
    VALID_SORTS.map((s) => [s, buildProductsUrl({ category, brand, q, sort: s, view: viewParam })])
  ) as Record<string, string>;
  const sortLabels = Object.fromEntries(
    VALID_SORTS.map((s) => [s, t(SORT_KEYS[s])])
  ) as Record<string, string>;

  return (
    <>
      {/* Breadcrumb JSON-LD — always rendered for SEO */}
      <JsonLd
        data={buildBreadcrumbSchema(loc, [
          { name: tCommon("home"), href: "" },
          { name: t("title"), href: "/products" },
          ...(activeCategory
            ? [{ name: activeCategory.name[loc], href: `/products?category=${category}` }]
            : []),
          ...(activeBrand
            ? [{ name: activeBrand.name, href: `/products?brand=${brand}` }]
            : []),
        ])}
      />

      {/* Page header */}
      <PageHero label={heroLabel} title={heroTitle} description={heroDescription} backgroundImage={heroImage ?? undefined} className="pb-10 md:pb-12" />

      <section className="bg-muted/30 pt-8 pb-16 md:pt-10 md:pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <FilterNavigationProvider>
            {/* Full-width search */}
            <Suspense fallback={<div className="h-10 w-full" />}>
              <ProductSearch currentQuery={q ?? ""} />
            </Suspense>

            {/* Tabbed filter bar with sort/view controls */}
            <div className="mt-6 mb-8">
              <ProductFilterBar
                toolbar={
                  <div className="flex items-center gap-3">
                    <p className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {q
                        ? `${t("searchResultsFor", { query: q })} (${total})`
                        : t("productCount", { count: total })}
                    </p>

                    <SortSelect
                      current={sort}
                      sortUrls={sortUrls}
                      labels={sortLabels}
                      validSorts={VALID_SORTS as string[]}
                      sortLabel={t("sortLabel")}
                    />

                    <ViewToggle
                      currentView={view}
                      gridUrl={buildProductsUrl({ category, brand, q, page: pageNum, sort: sortParam, view: "grid" })}
                      listUrl={buildProductsUrl({ category, brand, q, page: pageNum, sort: sortParam, view: "list" })}
                      gridLabel={t("viewGrid")}
                      listLabel={t("viewList")}
                    />
                  </div>
                }
                categories={categories.map((c) => ({ slug: c.slug, name: c.name[loc] }))}
                brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
                activeCategory={category}
                activeBrand={brand}
                activeQuery={q}
                sortParam={sortParam}
                viewParam={viewParam}
                labels={{
                  category: t("filterByCategory"),
                  brand: t("filterByBrand"),
                  allCategories: t("allCategories"),
                  allBrands: t("allBrands"),
                  activeFilters: t("activeFilters"),
                  clearAll: t("clearAll"),
                }}
              />
            </div>

            {/* Product grid/list */}
            <ProductGridWrapper>
              {products.length > 0 ? (
                <>
                  {view === "list" ? (
                    <div className="space-y-2">
                      {products.map((product) => (
                        <ProductCard
                          key={product.slug}
                          product={product}
                          locale={loc}
                          categoryName={categoryMap.get(product.categorySlug)?.name[loc]}
                          variant="list"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {products.map((product, index) => (
                        <ProductCard
                          key={product.slug}
                          product={product}
                          locale={loc}
                          categoryName={categoryMap.get(product.categorySlug)?.name[loc]}
                          priority={index < 4}
                        />
                      ))}
                    </div>
                  )}

                  <ProductPagination
                    currentPage={pageNum}
                    totalPages={totalPages}
                    baseParams={{ category, brand, q, sort: sortParam, view: viewParam }}
                    previousLabel={t("previousPage")}
                    nextLabel={t("nextPage")}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center py-20 text-center">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    {t("noProductsLabel")}
                  </p>
                  <p className="mt-3 max-w-md text-muted-foreground">
                    {t("noProductsDescription")}
                  </p>
                  {(category || brand || q) && (
                    <div className="mt-6">
                      <ClearFiltersButton label={t("clearAll")} />
                    </div>
                  )}
                </div>
              )}
            </ProductGridWrapper>
          </FilterNavigationProvider>
        </div>
      </section>
    </>
  );
}

function ClearFiltersButton({ label }: { label: string }) {
  // This is rendered inside FilterNavigationProvider, but since it's a server component
  // helper, we need a small client component. However, since the empty state already
  // renders inside the provider, we can use a simple Link with scroll={false}.
  return (
    <Link
      href="/products"
      className="inline-flex h-11 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {label}
    </Link>
  );
}
