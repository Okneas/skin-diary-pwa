// src/components/ui/Card.tsx
import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  bare?: boolean;
  /** Добавить tap-эффект (только для кликабельных карточек) */
  interactive?: boolean;
}

export function Card({ className, bare, interactive, ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-card p-4 transition-all duration-200",
        !bare && "bg-surface border border-border/60",
        interactive &&
          "cursor-pointer hover:shadow-elevated active:scale-[0.98] hover:border-primary/20",
        className
      )}
      {...props}
    />
  );
}