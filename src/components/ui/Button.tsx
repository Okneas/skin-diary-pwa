// src/components/ui/Button.tsx
import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-2xl",
        "transition-all duration-150 active:scale-[0.97]",
        "disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-5 py-3 text-base",
        size === "lg" && "px-6 py-4 text-lg",
        variant === "primary" &&
          "bg-primary hover:bg-primary-dark text-white shadow-soft hover:shadow-elevated",
        variant === "secondary" &&
          "bg-surface text-ink border border-border hover:bg-surface-2 hover:border-primary/30",
        variant === "ghost" && "text-primary hover:bg-primary/10",
        variant === "danger" && "bg-danger text-white hover:opacity-90",
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}