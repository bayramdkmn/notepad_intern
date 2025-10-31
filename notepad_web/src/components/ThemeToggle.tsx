"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { useEffect } from "react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  useEffect(() => {
    console.log(theme);
    console.log("toggle basıldı");
  }, [theme, toggle]);
  return (
    <button
      onClick={toggle}
      className="border rounded px-3 py-1 text-sm"
      aria-label="Tema Değiştir"
    >
      {theme === "dark" ? "Açık Moda Geç" : "Koyu Moda Geç"}
    </button>
  );
}
