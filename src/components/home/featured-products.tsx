import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { Product, Locale } from "@/data/types";
import { formatSlug } from "@/lib/format";

type Props = {
  products: Product[];
};

export function FeaturedProducts({ products }: Props) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title={t("featuredProducts")}
          description={t("featuredProductsDesc")}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {product.image?.startsWith("http") ? (
                    <Image
                      src={product.image}
                      alt={product.name[locale]}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <div className="text-4xl text-muted-foreground/30">
                        {product.categorySlug === "welding-machines"
                          ? "⚡"
                          : product.categorySlug === "cutting-equipment"
                            ? "✂️"
                            : product.categorySlug === "welding-wire-rods"
                              ? "🔗"
                              : product.categorySlug === "gas-regulators"
                                ? "⚙️"
                                : "🔧"}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {formatSlug(product.brandSlug)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {product.name[locale]}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {product.shortDescription[locale]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/products">
              {tCommon("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
