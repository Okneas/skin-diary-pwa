// src/components/brand/LogoWordmark.tsx
import { cn } from "@/utils/cn";

interface Props {
  className?: string;
  /** Раскладка: вертикальная или горизонтальная */
  layout?: "vertical" | "horizontal";
}

export function LogoWordmark({ className, layout = "vertical" }: Props) {
  return (
    <div
      className={cn(
        "flex",
        layout === "vertical"
          ? "flex-col items-center gap-2"
          : "flex-row items-baseline gap-3",
        className
      )}
    >
      <span className="font-display text-4xl text-ink leading-none">
        Дневник
      </span>
      <span className="font-display text-4xl text-primary leading-none italic">
        красоты
      </span>
    </div>
  );
}