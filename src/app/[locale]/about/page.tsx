import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Building2, DollarSign, Wrench, Award, Users } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
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
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary">60+</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {locale === "th" ? "ปีแห่งประสบการณ์" : "Years Experience"}
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary">3+</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {locale === "th" ? "แบรนด์ชั้นนำ" : "Global Brands"}
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary">1000+</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {locale === "th" ? "สินค้า" : "Products"}
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {locale === "th" ? "ลูกค้า" : "Clients"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y bg-card py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Building2 className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-3xl font-bold text-foreground">
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
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
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
