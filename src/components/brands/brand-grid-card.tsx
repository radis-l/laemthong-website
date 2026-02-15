import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Brand } from "@/data/types";

type Props = {
  brand: Brand;
  productsLabel: string;
};

export function BrandGridCard({ brand, productsLabel }: Props) {
  return (
    <Link href={{ pathname: "/products", query: { brand: brand.slug } }} className="group block">
      <div className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
        {/* Logo area */}
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-muted/50 p-8">
          {brand.logo?.startsWith("http") ? (
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-6 grayscale-hover"
            />
          ) : (
            <span className="text-4xl font-bold text-muted-foreground/60 transition-colors group-hover:text-foreground">
              {brand.name.charAt(0)}
            </span>
          )}
          {/* Country badge */}
          <span className="absolute right-2 top-2 rounded-sm bg-background/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {brand.country}
          </span>
        </div>

        {/* Red accent divider */}
        <div className="h-px w-full bg-border transition-colors duration-300 group-hover:bg-primary" />

        {/* Info area */}
        <div className="px-4 py-3">
          <h3 className="truncate text-sm font-bold tracking-tight text-foreground">
            {brand.name}
          </h3>
          <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary">
            {productsLabel}
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </p>
        </div>
      </div>
    </Link>
  );
}
