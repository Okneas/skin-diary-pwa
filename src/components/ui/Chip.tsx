import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface Props {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function Chip({ active, onClick, children, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-full text-sm font-medium border transition",
        active
          ? "bg-primary text-white border-primary shadow-soft"
          : "bg-surface text-ink border-border",
        className
      )}
    >
      {children}
    </button>
  );
}