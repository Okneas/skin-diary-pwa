// src/components/decor/Sparkle.tsx
import { cn } from "@/utils/cn";

interface Props {
  size?: number;
  className?: string;
  color?: "primary" | "accent" | "ink";
}

const COLOR_MAP = {
  primary: "text-primary",
  accent: "text-accent",
  ink: "text-ink",
};

export function Sparkle({ size = 16, className, color = "primary" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn(COLOR_MAP[color], className)}
      aria-hidden="true"
    >
      <path d="M8 0 C 8.8 4.5, 9.5 5.2, 14 6 C 9.5 6.8, 8.8 7.5, 8 12 C 7.2 7.5, 6.5 6.8, 2 6 C 6.5 5.2, 7.2 4.5, 8 0 Z" />
    </svg>
  );
}