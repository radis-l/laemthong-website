import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import type { Product, Locale } from "@/data/types";

type Props = {
  product: Product;
  locale: Locale;
};

function formatBrandSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ProductCard({ product, locale }: Props) {
  const brandLabel = formatBrandSlug(product.brandSlug);

  return (
    <Link href={`/products/${product.slug}`} className="group">
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
                        : product.categorySlug === "safety-equipment"
                          ? "🛡️"
                          : "🔧"}
              </div>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {brandLabel}
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
  );
}
