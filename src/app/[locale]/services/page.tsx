import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaContactSection } from "@/components/shared/cta-contact-section";
import { JsonLd } from "@/components/shared/json-ld";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { PageHero } from "@/components/shared/page-hero";
import { SERVICES } from "@/data/services";
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
  const t = await getTranslations({ locale, namespace: "services" });
  const title = t("title");
  const description = t("description");
  const pageUrl = getPageUrl(loc, "/services");
  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: getAlternateLanguages("/services"),
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

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "services" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema(loc, [
          { name: tNav("home"), href: "/" },
          { name: t("title"), href: "/services" },
        ])}
      />

      <PageHero label={t("title")} title={t("title")} description={t("subtitle")} />

      {/* All Services */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              const features = t.raw(
                `${service.slug}.features`,
              ) as string[];
              return (
                <AnimateOnScroll
                  key={service.slug}
                  direction="up"
                  delay={index * STAGGER_DELAY}
                >
                  <div className="h-full overflow-hidden rounded-lg border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {t(`${service.slug}.title`)}
                    </h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      {t(`${service.slug}.shortDescription`)}
                    </p>
                    <ul className="mt-6 space-y-2">
                      {features.slice(0, 4).map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="mt-8 gap-2">
                      <Link href={`/services/${service.slug}`}>
                        {t("viewDetails")}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <CtaContactSection
        title={t("ctaTitle")}
        description={t("ctaDescription")}
        getInTouchLabel={tCommon("getInTouch")}
        buttonLabel={t("ctaButton")}
      />
    </>
  );
}
