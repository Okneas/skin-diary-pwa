// src/components/brand/Logo.tsx
import { cn } from "@/utils/cn";
import { LogoMark } from "./LogoMark";

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
  accent?: boolean;
  /** Только текст, без subtitle */
  compact?: boolean;
}

const SIZES = {
  sm: { icon: 24, title: "text-sm", subtitle: "text-[9px]" },
  md: { icon: 32, title: "text-base", subtitle: "text-[10px]" },
  lg: { icon: 48, title: "text-2xl", subtitle: "text-xs" },
};

export function Logo({ size = "md", className, accent, compact }: Props) {
  const s = SIZES[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark size={s.icon} accent={accent} />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display tracking-tight",
            s.title,
            accent ? "text-accent" : "text-ink"
          )}
        >
          Дневник красоты
        </span>
        {!compact && (
          <span
            className={cn(
              "uppercase tracking-[0.25em] mt-1 text-muted",
              s.subtitle
            )}
          >
            genes & ai
          </span>
        )}
      </div>
    </div>
  );
}