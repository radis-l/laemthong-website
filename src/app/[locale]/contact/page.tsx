import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact/contact-form";
import { GoogleMap } from "@/components/contact/google-map";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { getCompanyInfo } from "@/lib/db";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
  buildLocalBusinessSchema,
} from "@/lib/seo";
import type { Locale } from "@/data/types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "contact" });
  const title = t("title");
  const description = t("description");
  const pageUrl = getPageUrl(loc, "/contact");
  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: getAlternateLanguages("/contact"),
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

export default async function ContactPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { product } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const company = await getCompanyInfo();

  return (
    <>
      {company && <JsonLd data={buildLocalBusinessSchema(company, locale as Locale)} />}
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

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Form */}
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-foreground">
                {t("formTitle")}
              </h2>
              <ContactForm locale={locale} defaultProduct={product} />
            </div>

            {/* Company info sidebar */}
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-foreground">
                  {t("companyInfo")}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t("phoneLabel")}
                      </p>
                      <a
                        href="tel:+6622345678"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        +66-2-234-5678
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t("emailLabel")}
                      </p>
                      <a
                        href="mailto:sales@laemthong-syndicate.com"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        sales@laemthong-syndicate.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t("addressLabel")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("addressValue")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t("businessHours")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("businessHoursValue")}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map */}
              <GoogleMap
                mapUrl={company?.mapUrl}
                coordinates={company?.coordinates}
                title={company?.name[locale as Locale]}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
