import { cn } from "@/utils/cn";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { SubjectiveFeature } from "@/types";

interface Props {
  features: SubjectiveFeature[];
  selected: number[];
  onChange: (ids: number[]) => void;
  isLoading?: boolean;
}

export default function SubjectiveForm({
  features,
  selected,
  onChange,
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-2">
      {features.map((f) => {
        const active = selected.includes(f.id);
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => toggle(f.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition",
              active
                ? "bg-primary/10 border-primary"
                : "bg-surface border-border"
            )}
          >
            <span
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center text-white text-xs transition shrink-0",
                active
                  ? "bg-primary border-primary"
                  : "border-border"
              )}
            >
              {active && "✓"}
            </span>
            <span className="text-sm text-ink leading-snug">
              {f.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}