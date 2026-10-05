import { Minus, Plus } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { ObjectiveFeature } from "@/types";

interface Props {
  features: ObjectiveFeature[];
  scores: Record<string, number>;
  onChange: (code: string, score: number) => void;
  isLoading?: boolean;
}

export default function ObjectiveForm({
  features,
  scores,
  onChange,
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {features.map((f) => {
        const value = scores[f.code] ?? 0;
        return (
          <div
            key={f.id}
            className="bg-surface rounded-2xl border border-border p-4"
          >
            <div className="flex items-start gap-2 mb-3">
              <span className="text-xs font-mono text-muted shrink-0">
                {f.code}
              </span>
              <p className="text-sm text-ink leading-snug flex-1">
                {f.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onChange(f.code, Math.max(0, value - 1))}
                disabled={value <= 0}
                className="w-10 h-10 rounded-full bg-canvas border border-border flex items-center justify-center disabled:opacity-40 active:scale-95 transition"
              >
                <Minus size={18} />
              </button>

              <div className="flex-1 flex gap-1 justify-center">
                {Array.from({ length: f.max_score + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onChange(f.code, i)}
                    className={`h-2.5 flex-1 rounded-full transition ${
                      i <= value ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  onChange(f.code, Math.min(f.max_score, value + 1))
                }
                disabled={value >= f.max_score}
                className="w-10 h-10 rounded-full bg-canvas border border-border flex items-center justify-center disabled:opacity-40 active:scale-95 transition"
              >
                <Plus size={18} />
              </button>
            </div>

            <p className="text-center text-xs text-muted mt-2">
              {value} / {f.max_score}
            </p>
          </div>
        );
      })}
    </div>
  );
}