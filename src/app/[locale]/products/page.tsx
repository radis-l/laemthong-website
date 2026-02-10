import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAllProducts, getAllCategories, getAllBrands } from "@/lib/db";
import { ProductCard } from "@/components/products/product-card";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
} from "@/lib/seo";
import type { Locale } from "@/data/types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; brand?: string }>;
};

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
  const { category, brand } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });

  const [allProducts, categories, brands] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
  ]);

  const filteredProducts = allProducts.filter((p) => {
    if (category && p.categorySlug !== category) return false;
    if (brand && p.brandSlug !== brand) return false;
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
                    href="/products"
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
                      href={`/products?category=${cat.slug}`}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        category === cat.slug
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.name[locale as Locale]}
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
                    href={category ? `/products?category=${category}` : "/products"}
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
                      href={`/products?brand=${b.slug}${category ? `&category=${category}` : ""}`}
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
              {filteredProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      locale={locale as Locale}
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
