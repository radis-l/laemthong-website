import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CtaContactSection } from "@/components/shared/cta-contact-section";
import { TrustStrip } from "@/components/shared/trust-strip";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHero } from "@/components/shared/page-hero";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { getAllBrands, getPageImage } from "@/lib/db";
import { BrandGridCard } from "@/components/brands/brand-grid-card";
import { STAGGER_DELAY } from "@/lib/constants";
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
  const tTrust = await getTranslations({ locale, namespace: "trust" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const [brands, heroImage] = await Promise.all([
    getAllBrands(),
    getPageImage("hero-brands"),
  ]);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema(loc, [
          { name: tNav("home"), href: "/" },
          { name: t("title"), href: "/brands" },
        ])}
      />

      <PageHero label={t("title")} title={t("title")} description={t("description")} backgroundImage={heroImage ?? undefined} />

      {/* Brand cards */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {brands.map((brand, index) => (
              <AnimateOnScroll
                key={brand.slug}
                direction="up"
                delay={Math.min(index * STAGGER_DELAY, 400)}
              >
                <BrandGridCard brand={brand} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <TrustStrip items={[
        { title: tTrust("item1Title"), description: tTrust("item1Desc") },
        { title: tTrust("item2Title"), description: tTrust("item2Desc") },
        { title: tTrust("item3Title"), description: tTrust("item3Desc") },
      ]} />

      <CtaContactSection
        title={t("ctaTitle")}
        description={t("ctaDescription")}
        getInTouchLabel={tCommon("getInTouch")}
        buttonLabel={t("ctaButton")}
      />
    </>
  );
}
