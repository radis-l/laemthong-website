"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type HeaderTheme = "light" | "dark";

const HeaderThemeContext = createContext<{
  theme: HeaderTheme;
  setTheme: (t: HeaderTheme) => void;
}>({ theme: "light", setTheme: () => {} });

export function HeaderThemeProvider({
  children,
  initial = "light",
}: {
  children: ReactNode;
  initial?: HeaderTheme;
}) {
  const [theme, setTheme] = useState<HeaderTheme>(initial);
  return (
    <HeaderThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </HeaderThemeContext.Provider>
  );
}

export function useHeaderTheme() {
  return useContext(HeaderThemeContext);
}
