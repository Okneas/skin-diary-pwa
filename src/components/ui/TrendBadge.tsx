import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/utils/cn";

interface Props {
  delta: number; // разница с предыдущим значением
  invertColors?: boolean; // если true — рост = плохо (напр., морщины)
  suffix?: string;
}

export function TrendBadge({
  delta,
  invertColors = false,
  suffix = "",
}: Props) {
  const eps = 0.01;
  const isUp = delta > eps;
  const isDown = delta < -eps;

  const good = invertColors ? isDown : isUp;

  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
        isUp || isDown
          ? good
            ? "bg-success/15 text-success dark:bg-success/20"
            : "bg-danger/15 text-danger dark:bg-danger/20"
          : "bg-border/50 text-muted",
      )}
    >
      <Icon size={12} strokeWidth={2.5} />
      {isUp || isDown
        ? `${delta > 0 ? "+" : ""}${delta.toFixed(1)}${suffix}`
        : "—"}
    </span>
  );
}
