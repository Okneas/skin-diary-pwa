// src/hooks/useTheme.ts
import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function useThemeInit() {
  const { mode, resolved, setMode, applySystemPreference } = useThemeStore();

  // Применяем тему при монтировании
  useEffect(() => {
    if (mode === "system") {
      applySystemPreference();
    } else {
      setMode(mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Слушаем изменения системной темы
  useEffect(() => {
    if (mode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applySystemPreference();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [mode, applySystemPreference]);

  return { mode, resolved, setMode };
}