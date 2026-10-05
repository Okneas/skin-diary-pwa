// src/components/ui/Skeleton.tsx
import { cn } from "@/utils/cn";

interface Props {
  className?: string;
  variant?: "text" | "rect" | "circle";
}

export function Skeleton({ className, variant = "rect" }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-border/40",
        variant === "text" && "h-4 rounded-md",
        variant === "rect" && "rounded-2xl",
        variant === "circle" && "rounded-full",
        className
      )}
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgb(var(--c-surface) / 0.4) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface rounded-2xl border border-border/60 p-4 space-y-3">
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="text" className="w-2/3" />
      <Skeleton variant="rect" className="h-20 w-full" />
    </div>
  );
}