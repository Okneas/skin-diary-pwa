import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface Props {
  step: number;          // 1-based
  total: number;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
  hideBack?: boolean;
  progress?: boolean;
}

export function OnboardingLayout({
  step,
  total,
  title,
  subtitle,
  children,
  footer,
  onBack,
  hideBack,
  progress = true,
}: Props) {
  const navigate = useNavigate();
  const percent = Math.min(100, (step / total) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* Прогресс */}
      {progress && (
        <div className="h-1 bg-border">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {/* Хедер */}
      <header className="flex items-center px-4 pt-4 pb-2 safe-top">
        {!hideBack && (
          <button
            onClick={() => (onBack ? onBack() : navigate(-1))}
            className="w-10 h-10 rounded-full bg-surface shadow-soft flex items-center justify-center"
            aria-label="Назад"
          >
            <ChevronLeft size={20} className="text-ink" />
          </button>
        )}
        {progress && (
          <span className="ml-auto text-xs text-muted">
            {step} / {total}
          </span>
        )}
      </header>

      {/* Контент */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-32">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-display text-ink leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted mt-2">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </main>

      {/* Футер */}
      {footer && (
        <footer
          className={cn(
            "fixed bottom-0 left-0 right-0 px-5 py-4 safe-bottom",
            "bg-gradient-to-t from-brand-bg via-brand-bg to-transparent"
          )}
        >
          <div className="max-w-md mx-auto">{footer}</div>
        </footer>
      )}
    </div>
  );
}