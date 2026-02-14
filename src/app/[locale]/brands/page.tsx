import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getAllBrands, getProductCountsByBrand } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
} from "@/lib/seo";
import type { Locale } from "@/data/types";

export const revalidate = 3600;

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
  const [brands, productCounts] = await Promise.all([
    getAllBrands(),
    getProductCountsByBrand(),
  ]);

  return (
    <>
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

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-8">
            {brands.map((brand) => {
              const productCount = productCounts[brand.slug] ?? 0;
              return (
                <div
                  key={brand.slug}
                  className="overflow-hidden rounded-lg border bg-card shadow-sm"
                >
                  <div className="grid gap-6 p-8 md:grid-cols-[200px_1fr]">
                    <div className="flex items-center justify-center rounded-lg bg-muted p-6">
                      {brand.logo?.startsWith("http") ? (
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={120}
                          height={120}
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-4xl font-bold text-muted-foreground">
                            {brand.name.charAt(0)}
                          </span>
                        </div>
                      )}
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
