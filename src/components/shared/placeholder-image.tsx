import { Package, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "product" | "brand" | "hero" | "about" | "service";

type Props = {
  icon?: LucideIcon;
  label?: string;
  aspect?: string;
  variant?: Variant;
  className?: string;
};

const VARIANT_STYLES: Record<Variant, string> = {
  product: "bg-muted/50",
  brand: "bg-muted/40",
  hero: "bg-muted/30",
  about: "bg-muted/40",
  service: "bg-muted/50",
};

const PATTERNS: Record<Variant, { d: string; size: number }> = {
  product: {
    d: "M0 0L10 10M10 0L0 10",
    size: 10,
  },
  brand: {
    d: "M5 0A5 5 0 015 10A5 5 0 015 0",
    size: 20,
  },
  hero: {
    d: "M0 0L20 20M-5 15L15 -5M5 25L25 5",
    size: 20,
  },
  about: {
    d: "M5 5L5.01 5",
    size: 10,
  },
  service: {
    d: "M0 5H10M5 0V10",
    size: 10,
  },
};

export function PlaceholderImage({
  icon: Icon = Package,
  label,
  aspect = "aspect-[4/3]",
  variant = "product",
  className,
}: Props) {
  const pattern = PATTERNS[variant];
  const patternId = `pattern-${variant}`;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        VARIANT_STYLES[variant],
        aspect,
        className
      )}
    >
      {/* SVG pattern overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            width={pattern.size}
            height={pattern.size}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={pattern.d}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-muted-foreground/[0.06]"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Icon + label */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <Icon className="h-12 w-12 text-muted-foreground/20" />
        {label && (
          <span className="text-xs text-muted-foreground/30">{label}</span>
        )}
      </div>
    </div>
  );
}
