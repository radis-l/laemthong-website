import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllBrands, getProductsByBrand } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
} from "@/lib/seo";
import type { Locale } from "@/data/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "brands" });
  const title = t("title");
  const description = t("description");
  const pageUrl = getPageUrl(loc, "/brands");
  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: getAlternateLanguages("/brands"),
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

export default async function BrandsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "brands" });
  const brands = await getAllBrands();
  const productCounts = await Promise.all(
    brands.map(async (b) => (await getProductsByBrand(b.slug)).length)
  );

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

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-8">
            {brands.map((brand, idx) => {
              const productCount = productCounts[idx];
              return (
                <div
                  key={brand.slug}
                  className="overflow-hidden rounded-xl border bg-card shadow-sm"
                >
                  <div className="grid gap-6 p-8 md:grid-cols-[200px_1fr]">
                    <div className="flex items-center justify-center rounded-xl bg-muted p-6">
                      <span className="text-2xl font-bold text-primary">
                        {brand.name}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-foreground">
                          {brand.name}
                        </h2>
                        <span className="text-sm text-muted-foreground">
                          {brand.country}
                        </span>
                      </div>
                      <p className="mt-3 leading-relaxed text-muted-foreground">
                        {brand.description[locale as Locale]}
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <Link
                          href={`/brands/${brand.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          {t("productsFrom")} {brand.name} ({productCount})
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        {brand.website && (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            {t("visitWebsite")} &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
