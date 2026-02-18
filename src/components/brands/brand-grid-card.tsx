import type { Brand } from "@/data/types";
import { BrandLogo } from "./brand-logo";

type Props = {
  brand: Brand;
};

export function BrandGridCard({ brand }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md">
      {/* Logo area */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-muted/30 p-10">
        {brand.logo?.startsWith("http") ? (
          <BrandLogo src={brand.logo} alt={brand.name} name={brand.name} />
        ) : (
          <span className="text-4xl font-bold text-muted-foreground/60">
            {brand.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Red accent divider */}
      <div className="h-0.5 w-full bg-primary" />

      {/* Info area */}
      <div className="px-4 py-3">
        <h3 className="truncate text-sm font-bold tracking-tight text-foreground">
          {brand.name}
        </h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {brand.country}
        </p>
      </div>
    </div>
  );
}
