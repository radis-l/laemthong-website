import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/shared/logo";
import { Phone, Mail, MapPin } from "lucide-react";
import { getAllCategories } from "@/lib/db";
import type { Locale } from "@/data/types";

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  // Fetch categories from database
  const categories = await getAllCategories();
  const footerCategories = categories.slice(0, 6);
  const loc = locale as Locale;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {(["about", "products", "brands", "services", "contact"] as const).map(
                (key) => (
                  <li key={key}>
                    <Link
                      href={`/${key}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
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
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {t("productCategories")}
              </h3>
              <ul className="space-y-2.5">
                {footerCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
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
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              {t("contactInfo")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <a
                  href="tel:+6622345678"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  +66-2-234-5678
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <a
                  href="mailto:sales@laemthong-syndicate.com"
                  className="text-sm text-muted-foreground hover:text-primary"
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

        {/* Bottom bar */}
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {currentYear} {tCommon("companyFullName")}. {t("allRightsReserved")}.
        </div>
      </div>
    </footer>
  );
}
