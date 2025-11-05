"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <label
        className="flex items-center gap-2 text-sm select-none"
        aria-label="Tema anahtarı"
      >
        <span className="hidden md:inline">Tema</span>
        <div
          className="relative h-6 w-11 pointer-events-none"
          role="switch"
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-full bg-zinc-400/50"></div>
          <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white"></div>
        </div>
      </label>
    );
  }

  return (
    <label
      className="flex items-center gap-2 text-sm cursor-pointer select-none"
      aria-label="Tema anahtarı"
    >
      <span className="hidden text-black dark:text-white md:inline">
        {isDark ? "Koyu" : "Açık"} Mod
      </span>
      <div
        className="relative h-6 w-11"
        onClick={toggle}
        role="switch"
        aria-checked={isDark}
      >
        <div
          className={`absolute inset-0 rounded-full transition-colors ${
            isDark ? "bg-zinc-700" : "bg-zinc-300"
          }`}
        ></div>
        <div
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            isDark ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
}
