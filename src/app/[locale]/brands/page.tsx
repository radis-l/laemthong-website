import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/shared/json-ld";
import { getAllBrands, getProductCountsByBrand } from "@/lib/db";
import { BrandFilterPanel } from "@/components/brands/brand-filter-panel";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
  buildBreadcrumbSchema,
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
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "brands" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const [brands, productCounts] = await Promise.all([
    getAllBrands(),
    getProductCountsByBrand(),
  ]);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema(loc, [
          { name: tNav("home"), href: "/" },
          { name: t("title"), href: "/brands" },
        ])}
      />

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">{tNav("home")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("title")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero */}
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

      {/* Brand filter + cards */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <BrandFilterPanel
            brands={brands}
            productCounts={productCounts}
            locale={locale as Locale}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                {t("ctaTitle")}
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
                {t("ctaDescription")}
              </p>
            </div>
            <div className="rounded-lg bg-foreground p-8 text-background md:p-10">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-background/50">
                {tCommon("getInTouch")}
              </p>
              <p className="mt-3 text-xl font-semibold text-background">
                sales@laemthong-syndicate.com
              </p>
              <p className="mt-1 text-lg text-background/70">
                +66-2-234-5678
              </p>
              <Button asChild variant="accent" size="lg" className="mt-6 gap-2">
                <Link href="/contact">
                  {t("ctaButton")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
