import Image from "next/image";
import { cn } from "@/lib/utils";

type HeroBackgroundVariant = "home" | "page";

type Props = {
  backgroundImage?: string;
  variant?: HeroBackgroundVariant;
  className?: string;
};

const PATTERN_CONFIG: Record<
  HeroBackgroundVariant,
  {
    d: string;
    size: number;
    strokeOpacity: string;
    position: string;
    overlay: string;
  }
> = {
  home: {
    d: "M0 0L40 40M40 0L0 40M20 20L20.01 20",
    size: 40,
    strokeOpacity: "text-muted-foreground/[0.10]",
    position:
      "right-0 w-[60%] [mask-image:linear-gradient(to_right,transparent,black_30%)]",
    overlay:
      "bg-gradient-to-r from-black/80 via-black/50 via-60% to-black/10",
  },
  page: {
    d: "M0 0L20 20M20 0L0 20",
    size: 20,
    strokeOpacity: "text-muted-foreground/[0.08]",
    position:
      "right-0 w-[50%] [mask-image:linear-gradient(to_right,transparent,black_40%)]",
    overlay:
      "bg-gradient-to-r from-black/75 via-black/45 via-60% to-black/5",
  },
};

export function HeroBackground({
  backgroundImage,
  variant = "page",
  className,
}: Props) {
  const config = PATTERN_CONFIG[variant];
  const patternId = `hero-pattern-${variant}`;

  if (backgroundImage) {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          className
        )}
        aria-hidden="true"
      >
        {/* Full-width vivid image */}
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dark gradient overlay for text readability */}
        <div className={cn("absolute inset-0", config.overlay)} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <svg
        className={cn("absolute top-0 h-full", config.position)}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id={patternId}
            width={config.size}
            height={config.size}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={config.d}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              className={config.strokeOpacity}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
