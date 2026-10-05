// src/components/decor/Blob.tsx
import { cn } from "@/utils/cn";

interface Props {
  className?: string;
  variant?: "primary" | "accent" | "purple";
  size?: number;
  opacity?: number;
}

const VARIANTS = {
  primary: "from-primary/40 to-primary/0",
  accent: "from-accent/40 to-accent/0",
  purple: "from-accent/30 to-accent/0",  // ✅ было from-purple-300/30
};

export function Blob({
  className,
  variant = "primary",
  size = 320,
  opacity = 0.6,
}: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl bg-gradient-to-br",
        VARIANTS[variant],
        className
      )}
      style={{
        width: size,
        height: size,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}