"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { HeroBackground } from "@/components/shared/hero-background";
import { useInView } from "@/hooks/use-in-view";
import { useCountUp } from "@/hooks/use-count-up";
import { COMPANY, STAGGER_DELAY } from "@/lib/constants";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  backgroundImage?: string;
};

export function HeroSection({ backgroundImage }: HeroSectionProps) {
  const t = useTranslations("hero");
  const hasImage = !!backgroundImage;

  return (
    <section
      className={cn(
        "relative",
        hasImage ? "bg-foreground" : "bg-background"
      )}
    >
      <HeroBackground backgroundImage={backgroundImage} variant="home" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-40">
        {/* Label */}
        <p
          className={cn(
            "mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em]",
            hasImage ? "text-white/60" : "text-muted-foreground"
          )}
        >
          <span className="inline-block h-px w-8 bg-primary" />
          {`Since ${COMPANY.foundedYear}`}
        </p>

        {/* Heading */}
        <div className="relative max-w-4xl">
          <h1
            className={cn(
              "text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl",
              hasImage ? "text-white" : "text-foreground"
            )}
          >
            {t("title")}
          </h1>
          {/* Red accent line */}
          <div className="mt-6 h-0.5 w-16 bg-primary" />
        </div>

        <p
          className={cn(
            "mt-6 max-w-xl text-lg leading-relaxed",
            hasImage ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {t("subtitle")}
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8">
            <Link href="/products">
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className={cn(
              "gap-2",
              hasImage
                ? "text-white/80 hover:bg-white/10 hover:text-white"
                : "text-primary hover:text-primary"
            )}
          >
            <Link href="/contact">
              <Phone className="h-4 w-4" />
              {t("ctaSecondary")}
            </Link>
          </Button>
        </div>

        {/* Stats strip */}
        <StatsStrip hasImage={hasImage} />
      </div>
    </section>
  );
}

const stats = [
  { target: COMPANY.stats.years, suffix: "+", labelKey: "statsYears" },
  { target: COMPANY.stats.brands, suffix: "+", labelKey: "statsBrands" },
  { target: COMPANY.stats.products, suffix: "+", labelKey: "statsProducts" },
  { target: COMPANY.stats.clients, suffix: "+", labelKey: "statsClients" },
] as const;

function StatsStrip({ hasImage }: { hasImage: boolean }) {
  const t = useTranslations("hero");
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        "mt-20 flex flex-wrap items-center gap-8 border-t pt-8 md:gap-12 lg:gap-16",
        hasImage && "border-white/20"
      )}
    >
      {stats.map((stat, i) => (
        <AnimateOnScroll key={stat.labelKey} delay={i * STAGGER_DELAY}>
          <StatItem
            target={stat.target}
            suffix={stat.suffix}
            label={t(stat.labelKey)}
            isInView={isInView}
            hasImage={hasImage}
          />
        </AnimateOnScroll>
      ))}
    </div>
  );
}

function StatItem({
  target,
  suffix,
  label,
  isInView,
  hasImage,
}: {
  target: number;
  suffix: string;
  label: string;
  isInView: boolean;
  hasImage: boolean;
}) {
  const count = useCountUp(target, isInView);

  return (
    <div>
      <div
        className={cn(
          "text-3xl font-light tracking-tight md:text-4xl",
          hasImage ? "text-white" : "text-foreground"
        )}
      >
        {count.toLocaleString("en-US")}{suffix}
      </div>
      <div
        className={cn(
          "mt-1 text-xs font-medium uppercase tracking-[0.15em]",
          hasImage ? "text-white/60" : "text-muted-foreground"
        )}
      >
        {label}
      </div>
    </div>
  );
}
