import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Building2, Shield, Clock, Layers, Users, Factory } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { STAGGER_DELAY } from "@/lib/constants";
import { PageHero } from "@/components/shared/page-hero";
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
    { key: "reason1", icon: Shield },
    { key: "reason2", icon: Clock },
    { key: "reason3", icon: Layers },
    { key: "reason4", icon: Users },
  ] as const;

  const milestones = [
    { yearKey: "milestone1Year", titleKey: "milestone1Title", descKey: "milestone1Desc" },
    { yearKey: "milestone2Year", titleKey: "milestone2Title", descKey: "milestone2Desc" },
    { yearKey: "milestone3Year", titleKey: "milestone3Title", descKey: "milestone3Desc" },
    { yearKey: "milestone4Year", titleKey: "milestone4Title", descKey: "milestone4Desc" },
    { yearKey: "milestone5Year", titleKey: "milestone5Title", descKey: "milestone5Desc" },
  ] as const;

  return (
    <>
      <PageHero label={t("title")} title={t("title")} description={t("subtitle")} />

      {/* History */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                {t("historyTitle")}
              </h2>
              <div className="mt-1 h-0.5 w-12 bg-primary" />
              <div className="mt-6 space-y-4">
                <p className="leading-relaxed text-muted-foreground">
                  {t("historyText1")}
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  {t("historyText2")}
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  {t("historyText3")}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-lg">
                <PlaceholderImage
                  variant="about"
                  icon={Factory}
                  aspect="aspect-[16/9]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "60+", label: t("statYearsExperience") },
                  { value: "19+", label: t("statGlobalBrands") },
                  { value: "5,000+", label: t("statProducts") },
                  { value: "10,000+", label: t("statClients") },
                ].map((stat, i) => (
                  <AnimateOnScroll key={stat.label} delay={i * STAGGER_DELAY}>
                    <div className="rounded-lg border p-5">
                      <div className="text-3xl font-light tracking-tight text-foreground">{stat.value}</div>
                      <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="border-y bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading title={t("milestonesTitle")} label="Timeline" align="center" />
          <div className="relative">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-border lg:block" />
            <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-5">
              {milestones.map((m, i) => (
                <AnimateOnScroll key={m.yearKey} delay={i * 150}>
                  <div className="relative text-center">
                    <div className="relative mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background">
                      {t(m.yearKey)}
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {t(m.titleKey)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t(m.descKey)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-foreground">
            <Building2 className="h-7 w-7 text-foreground" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            {t("missionTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("missionText")}
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-t py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading title={t("whyChooseUs")} label="Our Strengths" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ key, icon: Icon }, i) => (
              <AnimateOnScroll key={key} delay={i * STAGGER_DELAY}>
                <div className="group">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border transition-colors group-hover:border-primary group-hover:text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {t(`${key}Title` as `${typeof key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`${key}Desc` as `${typeof key}Desc`)}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
