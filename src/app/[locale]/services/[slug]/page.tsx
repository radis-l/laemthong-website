import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle2 } from "lucide-react";
import { CtaContactSection } from "@/components/shared/cta-contact-section";
import { BreadcrumbBar } from "@/components/shared/breadcrumb-bar";
import { SectionHeading } from "@/components/shared/section-heading";
import Image from "next/image";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { JsonLd } from "@/components/shared/json-ld";
import { getPageImage } from "@/lib/db";
import { SERVICES, SERVICE_SLUGS, getServiceBySlug } from "@/data/services";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
  buildBreadcrumbSchema,
  buildServiceSchema,
} from "@/lib/seo";
import type { Locale } from "@/data/types";

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: "services" });
  const title = t(`${slug}.metaTitle`);
  const description = t(`${slug}.metaDescription`);
  const pageUrl = getPageUrl(loc, `/services/${slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: getAlternateLanguages(`/services/${slug}`),
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

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "services" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const serviceImage = await getPageImage(`service-${slug}`);

  const Icon = service.icon;
  const features = t.raw(`${slug}.features`) as string[];
  const processSteps = t.raw(`${slug}.processSteps`) as {
    title: string;
    description: string;
  }[];
  const expertise = t.raw(`${slug}.expertise`) as string[];
  const otherServices = SERVICES.filter((s) => s.slug !== slug);

  return (
    <>
      <JsonLd
        data={buildServiceSchema(
          slug,
          loc,
          t(`${slug}.title`),
          t(`${slug}.description`),
        )}
      />
      <JsonLd
        data={buildBreadcrumbSchema(loc, [
          { name: tNav("home"), href: "/" },
          { name: t("title"), href: "/services" },
          { name: t(`${slug}.title`), href: `/services/${slug}` },
        ])}
      />

      <BreadcrumbBar items={[
        { label: tNav("home"), href: "/" },
        { label: t("title"), href: "/services" },
        { label: t(`${slug}.title`) },
      ]} />

      {/* Hero */}
      <section className="border-b py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-center">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                    {t(`${slug}.title`)}
                  </h1>
                </div>
              </div>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {t(`${slug}.description`)}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="overflow-hidden rounded-lg border">
                {serviceImage ? (
                  <Image
                    src={serviceImage}
                    alt={t(`${slug}.title`)}
                    width={400}
                    height={400}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <PlaceholderImage variant="service" aspect="aspect-square" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features + Expertise */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Features - 2 cols */}
            <div className="lg:col-span-2">
              <SectionHeading title={t("keyFeatures")} align="left" />
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border bg-card p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm leading-relaxed text-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expertise - 1 col */}
            <div>
              <SectionHeading title={t("areasOfExpertise")} align="left" />
              <div className="space-y-3">
                {expertise.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-muted px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y bg-muted/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading title={t("ourProcess")} />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <div key={i} className="relative">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaContactSection
        title={t("ctaTitle")}
        description={t("ctaDescription")}
        getInTouchLabel={tCommon("getInTouch")}
        buttonLabel={t("ctaButton")}
      />

      {/* Other Services */}
      <section className="border-t py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading title={t("otherServices")} />
          <div className="grid gap-6 sm:grid-cols-3">
            {otherServices.map((other) => {
              const OtherIcon = other.icon;
              return (
                <Link
                  key={other.slug}
                  href={`/services/${other.slug}`}
                  className="group rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border">
                    <OtherIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {t(`${other.slug}.title`)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {t(`${other.slug}.shortDescription`)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
