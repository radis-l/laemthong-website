"use client";

import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { STAGGER_DELAY } from "@/lib/constants";

type TrustItem = {
  title: string;
  description: string;
};

type Props = {
  items: TrustItem[];
};

export function TrustStrip({ items }: Props) {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {items.map((item, i) => (
            <AnimateOnScroll key={i} delay={i * STAGGER_DELAY}>
              <div className="group">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-background/50">
                  0{i + 1}
                </div>
                <div className="mt-2 text-base font-semibold text-background">
                  {item.title}
                </div>
                <div className="mt-1.5 text-sm leading-relaxed text-background/70">
                  {item.description}
                </div>
                <div className="mt-3 h-px w-8 bg-primary transition-all duration-300 group-hover:w-12" />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
