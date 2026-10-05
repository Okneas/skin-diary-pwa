import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-sm text-muted mb-2 block">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3.5 rounded-2xl bg-surface backdrop-blur-md bg-surface/80",
            "border border-border text-ink",
            "placeholder:text-muted/60",
            "focus:outline-none focus:border-primary transition",
            error && "border-rose-400 focus:border-rose-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-muted mt-1.5">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";