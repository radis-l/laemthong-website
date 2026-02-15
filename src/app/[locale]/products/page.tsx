import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getFilteredProducts, getAllCategories, getAllBrands } from "@/lib/db";
import type { ProductSort } from "@/lib/db";
import { ProductCard } from "@/components/products/product-card";
import { ProductSearch } from "@/components/products/product-search";
import { ProductPagination } from "@/components/products/product-pagination";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { X, LayoutGrid, List } from "lucide-react";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
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
  const { category, brand, q, page: pageParam, sort: sortParam, view: viewParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  const loc = locale as Locale;

  const pageNum = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const sort: ProductSort = VALID_SORTS.includes(sortParam as ProductSort)
    ? (sortParam as ProductSort)
    : "default";
  const view = viewParam === "list" ? "list" : "grid";

  const [result, categories, brands] = await Promise.all([
    getFilteredProducts({
      category,
      brand,
      search: q,
      locale: loc,
      sort,
      page: pageNum,
      perPage: 24,
    }),
    getAllCategories(),
    getAllBrands(),
  ]);

  const { products, total, totalPages } = result;

  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

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
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
              <span className="mr-1 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("filterByCategory")}:
              </span>
              <Link
                href={buildProductsUrl({ brand, q, sort: sortParam, view: viewParam })}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
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
                  href={buildProductsUrl({ category: cat.slug, brand, q, sort: sortParam, view: viewParam })}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
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
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
              <span className="mr-1 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("filterByBrand")}:
              </span>
              <Link
                href={buildProductsUrl({ category, q, sort: sortParam, view: viewParam })}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
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
                  href={buildProductsUrl({ category, brand: b.slug, q, sort: sortParam, view: viewParam })}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    brand === b.slug
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {b.name}
                </Link>
              ))}
            </div>

            {/* Active filter chips */}
            {(category || brand || q) && (
              <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("activeFilters")}:
                </span>
                {category && (() => {
                  const cat = categoryMap.get(category);
                  return cat ? (
                    <Link
                      href={buildProductsUrl({ brand, q, sort: sortParam, view: viewParam })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground/10"
                    >
                      {cat.name[loc]}
                      <X className="h-3 w-3" />
                    </Link>
                  ) : null;
                })()}
                {brand && (() => {
                  const br = brands.find((b) => b.slug === brand);
                  return br ? (
                    <Link
                      href={buildProductsUrl({ category, q, sort: sortParam, view: viewParam })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground/10"
                    >
                      {br.name}
                      <X className="h-3 w-3" />
                    </Link>
                  ) : null;
                })()}
                {q && (
                  <Link
                    href={buildProductsUrl({ category, brand, sort: sortParam, view: viewParam })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground/10"
                  >
                    &ldquo;{q}&rdquo;
                    <X className="h-3 w-3" />
                  </Link>
                )}
                <Link
                  href="/products"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {t("clearAll")}
                </Link>
              </div>
            )}
          </div>

          {/* Results bar with sort + view toggle */}
          <div className="mt-8 mb-6 flex items-center justify-between border-b pb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {q
                ? `${t("searchResultsFor", { query: q })} (${total})`
                : t("productCount", { count: total })}
            </p>

            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="hidden text-xs text-muted-foreground sm:inline">
                  {t("sortLabel")}:
                </label>
                <SortSelect
                  current={sort}
                  buildUrl={(s) => buildProductsUrl({ category, brand, q, sort: s, view: viewParam })}
                  labels={Object.fromEntries(
                    VALID_SORTS.map((s) => [s, t(SORT_KEYS[s])])
                  ) as Record<ProductSort, string>}
                />
              </div>

              {/* View toggle */}
              <div className="flex items-center rounded-lg border">
                <Link
                  href={buildProductsUrl({ category, brand, q, page: pageNum, sort: sortParam, view: "grid" })}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-l-lg transition-colors ${
                    view === "grid"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={t("viewGrid")}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={buildProductsUrl({ category, brand, q, page: pageNum, sort: sortParam, view: "list" })}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-r-lg transition-colors ${
                    view === "list"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={t("viewList")}
                >
                  <List className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Product grid/list */}
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
                  {products.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      locale={loc}
                      categoryName={categoryMap.get(product.categorySlug)?.name[loc]}
                    />
                  ))}
                </div>
              )}

              <ProductPagination
                currentPage={pageNum}
                totalPages={totalPages}
                buildUrl={(p) => buildProductsUrl({ category, brand, q, page: p, sort: sortParam, view: viewParam })}
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
                  <Button asChild variant="outline" size="lg">
                    <Link href="/products">
                      {t("clearAll")}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function SortSelect({
  current,
  buildUrl,
  labels,
}: {
  current: ProductSort;
  buildUrl: (sort: string) => string;
  labels: Record<ProductSort, string>;
}) {
  return (
    <div className="relative">
      <select
        id="sort-select"
        defaultValue={current}
        className="h-8 cursor-pointer appearance-none rounded-lg border bg-background pr-8 pl-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
        // Client-side navigation on change
        // Using a data attribute + inline script to avoid a client component
        data-sort-urls={JSON.stringify(
          Object.fromEntries(VALID_SORTS.map((s) => [s, buildUrl(s)]))
        )}
      >
        {VALID_SORTS.map((s) => (
          <option key={s} value={s}>
            {labels[s]}
          </option>
        ))}
      </select>
      <SortSelectScript />
    </div>
  );
}

function SortSelectScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.addEventListener('change',function(e){var s=e.target;if(s.id==='sort-select'){var u=JSON.parse(s.dataset.sortUrls);if(u[s.value])window.location.href=u[s.value]}})`,
      }}
    />
  );
}
