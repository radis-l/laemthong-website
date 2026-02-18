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
    imageOpacity: string;
    position: string;
  }
> = {
  home: {
    d: "M0 0L40 40M40 0L0 40M20 20L20.01 20",
    size: 40,
    strokeOpacity: "text-muted-foreground/[0.10]",
    imageOpacity: "opacity-20",
    position:
      "right-0 w-[60%] [mask-image:linear-gradient(to_right,transparent,black_30%)]",
  },
  page: {
    d: "M0 0L20 20M20 0L0 20",
    size: 20,
    strokeOpacity: "text-muted-foreground/[0.08]",
    imageOpacity: "opacity-15",
    position:
      "right-0 w-[50%] [mask-image:linear-gradient(to_right,transparent,black_40%)]",
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
        <div className={cn("absolute top-0 h-full", config.position)}>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className={cn("object-cover", config.imageOpacity)}
            sizes="100vw"
            priority={variant === "home"}
          />
        </div>
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
