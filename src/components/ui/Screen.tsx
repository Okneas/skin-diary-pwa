import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export function Screen({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={cn("min-h-full flex flex-col", className)}>
      {title && (
        <header className="px-5 pt-6 pb-4">
          <h1 className="text-2xl font-display text-ink">{title}</h1>
        </header>
      )}
      <main className="flex-1 px-5 pb-24">{children}</main>
    </div>
  );
}