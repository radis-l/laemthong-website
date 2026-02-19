import { useTranslations } from "next-intl";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { STAGGER_DELAY } from "@/lib/constants";

const usps = [
  { key: "experience" },
  { key: "directImporter" },
  { key: "serviceTeam" },
  { key: "authorized" },
] as const;

export function UspSection() {
  const t = useTranslations("usp");

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {usps.map(({ key }, i) => (
            <AnimateOnScroll key={key} delay={i * STAGGER_DELAY}>
              <div className="group">
                <div className="text-xs font-medium uppercase tracking-[0.15em] text-background/50">
                  0{i + 1}
                </div>
                <div className="mt-2 text-base font-semibold text-background">
                  {t(`${key}` as `${typeof key}`)}
                </div>
                <div className="mt-1.5 text-sm leading-relaxed text-background/70">
                  {t(`${key}Desc` as `${typeof key}Desc`)}
                </div>
                <div className="mt-3 h-px w-12 origin-left scale-x-[0.667] bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
