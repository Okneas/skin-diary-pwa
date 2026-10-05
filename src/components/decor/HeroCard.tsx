// src/components/decor/HeroCard.tsx
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface Props {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const PADDING = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function HeroCard({ children, className, padding = "md" }: Props) {
  return (
    <div
      className={cn(
        "relative rounded-3xl border border-border/40",
        "bg-surface/70 backdrop-blur-xl shadow-soft",
        PADDING[padding],
        className
      )}
    >
      {children}
    </div>
  );
}