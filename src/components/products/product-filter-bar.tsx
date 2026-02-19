"use client";

import { useState } from "react";
import { useFilterNavigation } from "./products-filter-context";
import { X } from "lucide-react";

type Dimension = "category" | "brand";

interface ProductFilterBarProps {
  categories: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  activeCategory?: string;
  activeBrand?: string;
  activeQuery?: string;
  sortParam?: string;
  viewParam?: string;
  labels: {
    category: string;
    brand: string;
    allCategories: string;
    allBrands: string;
    activeFilters: string;
    clearAll: string;
  };
  toolbar?: React.ReactNode;
}

function buildProductsUrl(params: {
  category?: string;
  brand?: string;
  q?: string;
  sort?: string;
  view?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.brand) sp.set("brand", params.brand);
  if (params.q) sp.set("q", params.q);
  if (params.sort && params.sort !== "default") sp.set("sort", params.sort);
  if (params.view && params.view !== "grid") sp.set("view", params.view);
  const qs = sp.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

export function ProductFilterBar({
  categories,
  brands,
  activeCategory,
  activeBrand,
  activeQuery,
  sortParam,
  viewParam,
  labels,
  toolbar,
}: ProductFilterBarProps) {
  const { navigate } = useFilterNavigation();

  // Auto-select tab based on active filter state
  const initialTab: Dimension =
    activeBrand && !activeCategory ? "brand" : "category";
  const [activeTab, setActiveTab] = useState<Dimension>(initialTab);

  const hasActiveFilters = !!(activeCategory || activeBrand || activeQuery);

  const activeCategoryName = activeCategory
    ? categories.find((c) => c.slug === activeCategory)?.name
    : undefined;
  const activeBrandName = activeBrand
    ? brands.find((b) => b.slug === activeBrand)?.name
    : undefined;

  const commonParams = {
    q: activeQuery,
    sort: sortParam,
    view: viewParam,
  };

  return (
    <div>
      {/* Tab row + toolbar + active chips */}
      <div className="flex items-end justify-between gap-4 border-b">
        {/* Dimension tabs */}
        <div className="flex shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("category")}
            className="group relative pb-3 pr-5"
          >
            <span
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
                activeTab === "category"
                  ? "text-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              {labels.category}
            </span>
            {/* Red underline indicator */}
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out ${
                activeTab === "category"
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              }`}
            />
          </button>

          {/* Divider */}
          <span className="mb-3 mr-5 h-3 w-px bg-border" />

          <button
            type="button"
            onClick={() => setActiveTab("brand")}
            className="group relative pb-3 pr-5"
          >
            <span
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
                activeTab === "brand"
                  ? "text-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              {labels.brand}
            </span>
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out ${
                activeTab === "brand"
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              }`}
            />
          </button>
        </div>

        {/* Right side: active chips + toolbar */}
        <div className="hidden items-center gap-3 pb-3 sm:flex">
          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              {activeCategoryName && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      buildProductsUrl({
                        brand: activeBrand,
                        ...commonParams,
                      }),
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground/10"
                >
                  {activeCategoryName}
                  <X className="h-3 w-3" />
                </button>
              )}
              {activeBrandName && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      buildProductsUrl({
                        category: activeCategory,
                        ...commonParams,
                      }),
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground/10"
                >
                  {activeBrandName}
                  <X className="h-3 w-3" />
                </button>
              )}
              {activeQuery && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      buildProductsUrl({
                        category: activeCategory,
                        brand: activeBrand,
                        sort: sortParam,
                        view: viewParam,
                      }),
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground/10"
                >
                  &ldquo;{activeQuery}&rdquo;
                  <X className="h-3 w-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="text-xs font-medium text-primary hover:underline"
              >
                {labels.clearAll}
              </button>
            </div>
          )}

          {/* Sort + view toolbar */}
          {toolbar && (
            <>
              {hasActiveFilters && <span className="h-3 w-px bg-border" />}
              {toolbar}
            </>
          )}
        </div>
      </div>

      {/* Pills row */}
      <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
        {activeTab === "category" ? (
          <>
            <button
              type="button"
              onClick={() =>
                navigate(
                  buildProductsUrl({
                    brand: activeBrand,
                    ...commonParams,
                  }),
                )
              }
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                !activeCategory
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {labels.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() =>
                  navigate(
                    buildProductsUrl({
                      category: cat.slug,
                      brand: activeBrand,
                      ...commonParams,
                    }),
                  )
                }
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  activeCategory === cat.slug
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                navigate(
                  buildProductsUrl({
                    category: activeCategory,
                    ...commonParams,
                  }),
                )
              }
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                !activeBrand
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {labels.allBrands}
            </button>
            {brands.map((b) => (
              <button
                key={b.slug}
                type="button"
                onClick={() =>
                  navigate(
                    buildProductsUrl({
                      category: activeCategory,
                      brand: b.slug,
                      ...commonParams,
                    }),
                  )
                }
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  activeBrand === b.slug
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {b.name}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Mobile: active filter chips + toolbar */}
      <div className="sm:hidden">
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3">
            {activeCategoryName && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    buildProductsUrl({
                      brand: activeBrand,
                      ...commonParams,
                    }),
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground/10"
              >
                {activeCategoryName}
                <X className="h-3 w-3" />
              </button>
            )}
            {activeBrandName && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    buildProductsUrl({
                      category: activeCategory,
                      ...commonParams,
                    }),
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground/10"
              >
                {activeBrandName}
                <X className="h-3 w-3" />
              </button>
            )}
            {activeQuery && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    buildProductsUrl({
                      category: activeCategory,
                      brand: activeBrand,
                      sort: sortParam,
                      view: viewParam,
                    }),
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground/10"
              >
                &ldquo;{activeQuery}&rdquo;
                <X className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="text-xs font-medium text-primary hover:underline"
            >
              {labels.clearAll}
            </button>
          </div>
        )}
        {toolbar && (
          <div className="flex items-center justify-between pt-3">
            {toolbar}
          </div>
        )}
      </div>
    </div>
  );
}
