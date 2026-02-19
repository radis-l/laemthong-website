import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/section-heading";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import type { ProductListItem, Locale } from "@/data/types";
import { formatSlug } from "@/lib/format";
import { STAGGER_DELAY } from "@/lib/constants";

type Props = {
  products: ProductListItem[];
};

export function FeaturedProducts({ products }: Props) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateOnScroll>
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
        </AnimateOnScroll>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <AnimateOnScroll key={product.slug} delay={i * STAGGER_DELAY}>
              <Link
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted/50">
                    {product.images[0]?.startsWith("http") ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name[locale]}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <PlaceholderImage
                        variant="product"
                        aspect="aspect-[4/3]"
                      />
                    )}
                  </div>
                  <div className="relative h-px w-full bg-border">
                    <div className="absolute left-0 top-0 h-full w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {formatSlug(product.brandSlug)}
                    </p>
                    <h3 className="mt-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                      {product.name[locale]}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {product.shortDescription[locale]}
                    </p>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
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
