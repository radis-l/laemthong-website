import { FadeImage } from "@/components/shared/fade-image";
import { Link } from "@/i18n/navigation";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { ChevronRight } from "lucide-react";
import type { ProductListItem, Locale } from "@/data/types";
import { formatSlug } from "@/lib/format";

type Props = {
  product: ProductListItem;
  locale: Locale;
  categoryName?: string;
  variant?: "grid" | "list";
  priority?: boolean;
};

export function ProductCard({ product, locale, categoryName, variant = "grid", priority = false }: Props) {
  const brandLabel = formatSlug(product.brandSlug);

  if (variant === "list") {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex items-center gap-4 rounded-lg border bg-card p-3 transition-all hover:shadow-md"
      >
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-muted/50">
          {product.images[0]?.startsWith("http") ? (
            <FadeImage
              src={product.images[0]}
              alt={product.name[locale]}
              fill
              className="object-cover"
              sizes="80px"
              quality={70}
            />
          ) : (
            <PlaceholderImage
              variant="product"
              aspect="aspect-[4/3]"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {brandLabel}
            </p>
            {categoryName && (
              <>
                <span className="text-muted-foreground/40">|</span>
                <p className="text-xs text-muted-foreground">{categoryName}</p>
              </>
            )}
          </div>
          <h3 className="mt-0.5 truncate font-semibold text-foreground transition-colors group-hover:text-primary">
            {product.name[locale]}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
            {product.shortDescription[locale]}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/50">
          {product.images[0]?.startsWith("http") ? (
            <FadeImage
              src={product.images[0]}
              alt={product.name[locale]}
              fill
              className="object-cover transition-[opacity,transform] duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              priority={priority}
              quality={70}
            />
          ) : (
            <PlaceholderImage
              variant="product"
              aspect="aspect-[4/3]"
            />
          )}
        </div>
        {/* Animated red accent divider */}
        <div className="relative h-px w-full bg-border">
          <div className="absolute left-0 top-0 h-full w-0 bg-primary transition-all duration-300 group-hover:w-full" />
        </div>
        <div className="px-5 py-4">
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
