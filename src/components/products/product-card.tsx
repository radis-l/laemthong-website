import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Product, Locale } from "@/data/types";
import { formatSlug } from "@/lib/format";

type Props = {
  product: Product;
  locale: Locale;
  categoryName?: string;
};

export function ProductCard({ product, locale, categoryName }: Props) {
  const brandLabel = formatSlug(product.brandSlug);

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted/50">
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
        <div className="py-4">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {brandLabel}
            </p>
            {categoryName && (
              <>
                <span className="text-muted-foreground/40">|</span>
                <p className="text-xs text-muted-foreground">
                  {categoryName}
                </p>
              </>
            )}
          </div>
          <h3 className="mt-1 font-semibold text-foreground transition-colors group-hover:text-primary">
            {product.name[locale]}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.shortDescription[locale]}
          </p>
        </div>
      </div>
    </Link>
  );
}
