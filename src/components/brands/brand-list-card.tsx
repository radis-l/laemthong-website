import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Brand, Locale } from "@/data/types";

type Props = {
  brand: Brand;
  productCount: number;
  locale: Locale;
  productsFromLabel: string;
  visitWebsiteLabel: string;
};

export function BrandListCard({
  brand,
  productCount,
  locale,
  productsFromLabel,
  visitWebsiteLabel,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="grid gap-6 p-8 md:grid-cols-[200px_1fr]">
        <div className="flex items-center justify-center rounded-lg bg-muted p-6 grayscale-hover">
          {brand.logo?.startsWith("http") ? (
            <Image
              src={brand.logo}
              alt={brand.name}
              width={120}
              height={120}
              className="object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground">
                {brand.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">
              {brand.name}
            </h2>
            <span className="text-sm text-muted-foreground">
              {brand.country}
            </span>
          </div>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {brand.description[locale]}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Link
              href={`/brands/${brand.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {productsFromLabel} {brand.name} ({productCount})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {visitWebsiteLabel} &rarr;
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
