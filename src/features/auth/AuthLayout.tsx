import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand";
import { Blob, FloralPattern } from "@/components/decor";
import { HeroCard } from "@/components/decor/HeroCard";
import { HeroBackdrop } from "@/components/decor/HeroBackdrop";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-welcome-rose safe-top safe-bottom relative overflow-hidden">
      <HeroBackdrop
        image="/backgrounds/auth.jpg"
        overlay="auto"
        intensity="medium"
      >
        <Blob
          variant="primary"
          className="-top-20 -left-20"
          size={300}
          opacity={0.4}
        />
        <Blob
          variant="accent"
          className="-bottom-24 -right-16"
          size={260}
          opacity={0.3}
        />
        <FloralPattern opacity={0.12} />
      </HeroBackdrop>

      <div className="relative flex-1 flex flex-col px-6 pt-16 pb-10 max-w-md mx-auto w-full">
        {/* Logo в стеклянном кружке */}
        <div className="flex flex-col items-center mb-10">
          <HeroCard padding="md" className="rounded-full mb-4">
            <LogoMark size={32} />
          </HeroCard>
          <h1 className="text-2xl font-display text-ink text-center">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted mt-2 text-center">{subtitle}</p>
          )}
        </div>

        <div className="flex-1">{children}</div>
        {footer && <div className="mt-6 text-center">{footer}</div>}
      </div>
    </div>
  );
}
