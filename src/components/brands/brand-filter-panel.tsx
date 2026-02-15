"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { BrandGridCard } from "./brand-grid-card";
import { BrandListCard } from "./brand-list-card";
import { Search, X, LayoutGrid, List } from "lucide-react";
import type { Brand, Locale } from "@/data/types";

type Props = {
  brands: Brand[];
  productCounts: Record<string, number>;
  locale: Locale;
};

export function BrandFilterPanel({ brands, productCounts, locale }: Props) {
  const t = useTranslations("brands");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const uniqueCountries = useMemo(
    () => [...new Set(brands.map((b) => b.country))].sort(),
    [brands],
  );

  const filteredBrands = useMemo(() => {
    let result = brands;
    if (selectedCountry) {
      result = result.filter((b) => b.country === selectedCountry);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description[locale]?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [brands, selectedCountry, searchQuery, locale]);

  const isFiltered = searchQuery.trim() !== "" || selectedCountry !== null;

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCountry(null);
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
          aria-label={t("searchLabel")}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Country filter pills */}
      {uniqueCountries.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <span className="mr-1 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("filterByCountry")}:
          </span>
          <button
            onClick={() => setSelectedCountry(null)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              selectedCountry === null
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {t("allCountries")}
          </button>
          {uniqueCountries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                selectedCountry === country
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      )}

      {/* Results bar */}
      <div className="flex items-center justify-between border-b pb-4 pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {isFiltered
            ? t("showingFiltered", {
                count: filteredBrands.length,
                total: brands.length,
              })
            : t("brandCount", { count: brands.length })}
        </p>

        <div className="flex items-center rounded-lg border">
          <button
            onClick={() => setView("grid")}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-l-lg transition-colors ${
              view === "grid"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={t("viewGrid")}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-r-lg transition-colors ${
              view === "list"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={t("viewList")}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Brand cards */}
      {filteredBrands.length > 0 ? (
        view === "grid" ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredBrands.map((brand, index) => (
              <AnimateOnScroll
                key={brand.slug}
                direction="up"
                delay={Math.min(index * 50, 400)}
              >
                <BrandGridCard
                  brand={brand}
                  productCount={productCounts[brand.slug] ?? 0}
                  productsLabel={t("products", {
                    count: productCounts[brand.slug] ?? 0,
                  })}
                />
              </AnimateOnScroll>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBrands.map((brand, index) => (
              <AnimateOnScroll
                key={brand.slug}
                direction="up"
                delay={Math.min(index * 80, 500)}
              >
                <BrandListCard
                  brand={brand}
                  productCount={productCounts[brand.slug] ?? 0}
                  locale={locale}
                  productsFromLabel={t("productsFrom")}
                  visitWebsiteLabel={t("visitWebsite")}
                />
              </AnimateOnScroll>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            {t("noBrandsLabel")}
          </p>
          <p className="mt-3 max-w-md text-muted-foreground">
            {t("noBrandsDescription")}
          </p>
          <div className="mt-6">
            <Button variant="outline" size="lg" onClick={handleClearFilters}>
              {t("clearFilters")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
