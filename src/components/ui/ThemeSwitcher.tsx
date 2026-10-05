// src/components/ui/ThemeSwitcher.tsx
import { Sun, Moon, Monitor } from "lucide-react";
import { useThemeStore, type ThemeMode } from "@/store/useThemeStore";
import { cn } from "@/utils/cn";

const OPTIONS: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Светлая", icon: Sun },
  { id: "dark", label: "Тёмная", icon: Moon },
  { id: "system", label: "Системная", icon: Monitor },
];

export function ThemeSwitcher() {
  const { mode, setMode } = useThemeStore();

  return (
    <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-surface-2 border border-border">
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs transition",
              active
                ? "bg-primary shadow-soft text-white"
                : "text-muted hover:bg-surface"
            )}
          >
            <Icon size={16} strokeWidth={2} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}