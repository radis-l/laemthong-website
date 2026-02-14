import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/section-heading";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { getCategoryIcon } from "@/lib/category-icons";
import { Button } from "@/components/ui/button";
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
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            label={t("featuredProducts")}
            title={t("featuredProducts")}
            description={t("featuredProductsDesc")}
            className="mb-0"
          />
          <Button asChild variant="ghost" className="hidden gap-2 text-primary hover:text-primary sm:inline-flex">
            <Link href="/products">
              {tCommon("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="overflow-hidden rounded-lg bg-muted/50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {product.image?.startsWith("http") ? (
                    <Image
                      src={product.image}
                      alt={product.name[locale]}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <PlaceholderImage
                      icon={getCategoryIcon(product.categorySlug)}
                      variant="product"
                      aspect="aspect-[4/3]"
                    />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {formatSlug(product.brandSlug)}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {product.name[locale]}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {product.shortDescription[locale]}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
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
