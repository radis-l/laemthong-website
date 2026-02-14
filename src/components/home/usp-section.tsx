import { useTranslations } from "next-intl";

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
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {usps.map(({ key }, i) => (
            <div key={key} className="group">
              <div className="text-xs font-medium uppercase tracking-[0.15em] text-background/40">
                0{i + 1}
              </div>
              <div className="mt-2 text-base font-semibold text-background">
                {t(`${key}` as `${typeof key}`)}
              </div>
              <div className="mt-1.5 text-sm leading-relaxed text-background/60">
                {t(`${key}Desc` as `${typeof key}Desc`)}
              </div>
              <div className="mt-3 h-px w-8 bg-primary transition-all duration-300 group-hover:w-12" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
