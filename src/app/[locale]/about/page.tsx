import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Building2, DollarSign, Wrench, Award, Users, Factory } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
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
  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("title");
  const description = t("subtitle");
  const pageUrl = getPageUrl(loc, "/about");
  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: getAlternateLanguages("/about"),
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

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  const reasons = [
    { key: "reason1", icon: DollarSign },
    { key: "reason2", icon: Wrench },
    { key: "reason3", icon: Award },
    { key: "reason4", icon: Users },
  ] as const;

  const milestones = [
    { yearKey: "milestone1Year", titleKey: "milestone1Title", descKey: "milestone1Desc" },
    { yearKey: "milestone2Year", titleKey: "milestone2Title", descKey: "milestone2Desc" },
    { yearKey: "milestone3Year", titleKey: "milestone3Title", descKey: "milestone3Desc" },
    { yearKey: "milestone4Year", titleKey: "milestone4Title", descKey: "milestone4Desc" },
  ] as const;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {t("historyTitle")}
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {t("historyText")}
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-2xl border shadow-sm">
                <PlaceholderImage
                  variant="about"
                  icon={Factory}
                  aspect="aspect-[16/9]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary">60+</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t("statYearsExperience")}
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary">3+</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t("statGlobalBrands")}
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary">1000+</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t("statProducts")}
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t("statClients")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="border-y bg-muted/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading title={t("milestonesTitle")} align="center" />
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-border md:block" />
            <div className="grid gap-8 md:grid-cols-4">
              {milestones.map((m) => (
                <div key={m.yearKey} className="relative text-center">
                  <div className="relative mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {t(m.yearKey)}
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {t(m.titleKey)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(m.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b bg-card py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            {t("missionTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("missionText")}
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading title={t("whyChooseUs")} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/60" />
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  {t(`${key}Title` as `${typeof key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${key}Desc` as `${typeof key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
