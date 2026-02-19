"use client";

import { useTranslations } from "next-intl";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { useInView } from "@/hooks/use-in-view";
import { useCountUp } from "@/hooks/use-count-up";
import { COMPANY, STAGGER_DELAY } from "@/lib/constants";
import { cn } from "@/lib/utils";

const stats = [
  { target: COMPANY.stats.years, suffix: "+", labelKey: "statsYears" },
  { target: COMPANY.stats.brands, suffix: "+", labelKey: "statsBrands" },
  { target: COMPANY.stats.products, suffix: "+", labelKey: "statsProducts" },
  { target: COMPANY.stats.clients, suffix: "+", labelKey: "statsClients" },
] as const;

export function StatsStrip({ hasImage }: { hasImage: boolean }) {
  const t = useTranslations("hero");
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        "mt-20 grid grid-cols-2 gap-6 border-t pt-8 md:flex md:flex-wrap md:items-center md:gap-12 lg:gap-16",
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
    <div className="flex items-start gap-3">
      <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      <div>
        <div
          className={cn(
            "text-3xl font-normal tracking-tight md:text-4xl",
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
    </div>
  );
}
