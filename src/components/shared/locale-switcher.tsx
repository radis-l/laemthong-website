"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  th: "TH",
  en: "EN",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onLocaleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => onLocaleChange(l)}
          aria-pressed={locale === l}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            locale === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
