"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  th: "TH",
  en: "EN",
};

type Props = {
  variant?: "default" | "dark";
};

export function LocaleSwitcher({ variant = "default" }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isDark = variant === "dark";

  function onLocaleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      className={`flex items-center gap-1 rounded-lg border p-0.5 transition-colors ${
        isDark
          ? "border-white/20 bg-white/10"
          : "border-border bg-background"
      }`}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => onLocaleChange(l)}
          aria-pressed={locale === l}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            locale === l
              ? "bg-primary text-primary-foreground"
              : isDark
                ? "text-white/70 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
