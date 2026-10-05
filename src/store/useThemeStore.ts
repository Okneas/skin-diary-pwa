// src/store/useThemeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  applySystemPreference: () => void;
}

function resolveMode(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyToDOM(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  // Обновляем meta theme-color под тему
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", resolved === "dark" ? "#1A111E" : "#FAF6F1");
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      resolved: "light",
      setMode: (mode) => {
        const resolved = resolveMode(mode);
        applyToDOM(resolved);
        set({ mode, resolved });
      },
      applySystemPreference: () => {
        const { mode } = get();
        if (mode === "system") {
          const resolved = resolveMode("system");
          applyToDOM(resolved);
          set({ resolved });
        }
      },
    }),
    {
      name: "theme-store",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = resolveMode(state.mode);
          applyToDOM(resolved);
          state.resolved = resolved;
        }
      },
    }
  )
);