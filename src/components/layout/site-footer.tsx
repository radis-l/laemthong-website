import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/shared/logo";
import { Phone, Mail, MapPin, ShieldCheck, Award, Clock } from "lucide-react";
import { getAllCategories } from "@/lib/db";
import type { Locale } from "@/data/types";

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const categories = await getAllCategories();
  const footerCategories = categories.slice(0, 6);
  const loc = locale as Locale;

  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* Top tier — white */}
      <div className="border-t bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Company info */}
            <div className="lg:col-span-1">
              <Logo />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {t("description")}
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                {t("quickLinks")}
              </h3>
              <ul className="space-y-3">
                {(["about", "products", "brands", "services", "contact"] as const).map(
                  (key) => (
                    <li key={key}>
                      <Link
                        href={`/${key}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {tNav(key)}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Product categories */}
            {footerCategories.length > 0 && (
              <div>
                <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  {t("productCategories")}
                </h3>
                <ul className="space-y-3">
                  {footerCategories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={{ pathname: "/products", query: { category: cat.slug } }}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {cat.name[loc]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact info */}
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                {t("contactInfo")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <a
                    href="tel:+6622345678"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    +66-2-234-5678
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <a
                    href="mailto:sales@laemthong-syndicate.com"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    sales@laemthong-syndicate.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    123 Charoen Krung Road, Bang Rak, Bangkok 10500
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tier — black */}
      <div className="bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-5 sm:flex-row sm:justify-between">
          <p className="text-xs text-background/50">
            &copy; {currentYear} {tCommon("companyFullName")}. {t("allRightsReserved")}.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-xs text-background/50">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t("authorizedDealer")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-background/50">
              <Award className="h-3.5 w-3.5" />
              <span>{t("qualityAssured")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-background/50">
              <Clock className="h-3.5 w-3.5" />
              <span>{t("trustedSince")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
