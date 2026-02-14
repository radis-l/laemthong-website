import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Product, Locale } from "@/data/types";
import { formatSlug } from "@/lib/format";

type Props = {
  product: Product;
  locale: Locale;
};

export function ProductCard({ product, locale }: Props) {
  const brandLabel = formatSlug(product.brandSlug);

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
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
            <PlaceholderImage
              icon={getCategoryIcon(product.categorySlug)}
              variant="product"
              aspect="aspect-[4/3]"
            />
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
