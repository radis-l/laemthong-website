import { useTranslations } from "next-intl";
import { Clock, DollarSign, Wrench, ShieldCheck } from "lucide-react";

const usps = [
  { key: "experience", icon: Clock },
  { key: "directImporter", icon: DollarSign },
  { key: "serviceTeam", icon: Wrench },
  { key: "authorized", icon: ShieldCheck },
] as const;

export function UspSection() {
  const t = useTranslations("usp");

  return (
    <section className="border-y bg-card py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {usps.map(({ key, icon: Icon }) => (
            <div key={key} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-lg font-bold text-foreground">
                {t(`${key}` as `${typeof key}`)}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t(`${key}Desc` as `${typeof key}Desc`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
