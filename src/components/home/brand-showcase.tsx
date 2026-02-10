import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Brand, Locale } from "@/data/types";

type Props = {
  brands: Brand[];
};

export function BrandShowcase({ brands }: Props) {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;

  return (
    <section className="border-y bg-card py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title={t("ourBrands")}
          description={t("ourBrandsDesc")}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group"
            >
              <div className="flex flex-col items-center rounded-xl border bg-background p-8 text-center shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5">
                  <span className="text-xl font-bold text-primary">
                    {brand.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                  {brand.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {brand.country}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {brand.description[locale]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
