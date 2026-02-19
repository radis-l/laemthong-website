"use client";

import { useLayoutEffect } from "react";
import { useHeaderTheme } from "@/components/layout/header-theme-context";

export function HeroThemeSetter({ isDark }: { isDark: boolean }) {
  const { setTheme } = useHeaderTheme();

  useLayoutEffect(() => {
    setTheme(isDark ? "dark" : "light");
    return () => setTheme("light");
  }, [isDark, setTheme]);

  return null;
}
