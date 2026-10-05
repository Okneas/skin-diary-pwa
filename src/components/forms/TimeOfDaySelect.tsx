import { Sun, Moon, SunMoon } from "lucide-react";
import { cn } from "@/utils/cn";
import type { TimeOfDay } from "@/types";

interface Props {
  value: TimeOfDay | null;
  onChange: (v: TimeOfDay | null) => void;
}

const OPTIONS: { id: TimeOfDay; label: string; icon: typeof Sun }[] = [
  { id: "morning", label: "Утром", icon: Sun },
  { id: "evening", label: "Вечером", icon: Moon },
  { id: "both", label: "Утром и вечером", icon: SunMoon },
];

export default function TimeOfDaySelect({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(active ? null : id)}
            className={cn(
              "flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition active:scale-[0.97]",
              active
                ? "bg-primary/10 border-primary text-primary"
                : "bg-surface border-border text-muted"
            )}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span
              className={cn(
                "text-xs text-center leading-tight",
                active && "font-medium"
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}