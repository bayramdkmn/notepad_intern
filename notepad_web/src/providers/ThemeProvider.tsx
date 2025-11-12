"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ThemeContextType } from "@/types";

type Theme = "light" | "dark";

type ThemeContextValue = ThemeContextType & {
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  const apply = (t: Theme) => {
    setThemeState(t);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", t === "dark");
      try {
        localStorage.setItem("theme", t);
      } catch {}
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      let initial: Theme | null = null;
      if (stored === "light" || stored === "dark") {
        initial = stored;
      } else if (typeof window !== "undefined") {
        initial = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      if (initial) {
        document.documentElement.classList.toggle("dark", initial === "dark");
        setThemeState(initial);
      }
    } catch {}
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: apply,
      toggle: () => apply(theme === "dark" ? "light" : "dark"),
      toggleTheme: () => apply(theme === "dark" ? "light" : "dark"),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
