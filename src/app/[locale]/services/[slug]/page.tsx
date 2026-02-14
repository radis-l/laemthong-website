import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { JsonLd } from "@/components/shared/json-ld";
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

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              {tNav("home")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/services" className="hover:text-foreground">
              {t("title")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{t(`${slug}.title`)}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-center">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-8 w-8 text-primary" />
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
              <div className="overflow-hidden rounded-2xl border">
                <PlaceholderImage variant="service" icon={Icon} aspect="aspect-square" />
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
                    className="rounded-lg bg-primary/5 px-4 py-3 text-sm font-medium text-foreground"
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
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
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

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-8 py-14 text-center md:px-16 md:py-20">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-white/10" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                {t("ctaTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                {t("ctaDescription")}
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="mt-8 gap-2"
              >
                <Link href="/contact">
                  {t("ctaButton")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
                  className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <OtherIcon className="h-5 w-5 text-primary" />
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
