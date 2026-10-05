import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/Skeleton";
import type { DeteriorationFactor } from "@/types";

interface Props {
  factors: DeteriorationFactor[];
  selected: number[];
  onChange: (ids: number[]) => void;
  isLoading?: boolean;
}

export default function FactorsSelect({
  factors,
  selected,
  onChange,
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-full" />
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
    <div className="flex flex-wrap gap-2">
      {factors.map((f) => {
        const active = selected.includes(f.id);
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => toggle(f.id)}
            className={cn(
              "px-4 py-2.5 rounded-full text-sm font-medium border transition",
              active
                ? "bg-primary text-white border-primary shadow-soft"
                : "bg-surface text-ink border-border"
            )}
          >
            {f.name}
          </button>
        );
      })}
    </div>
  );
}