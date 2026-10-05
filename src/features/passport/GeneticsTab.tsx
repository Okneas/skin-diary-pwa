// src/features/passport/GeneticsTab.tsx
import { Dna } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";
import type { PredispositionStat } from "@/types";

export function GeneticsTab() {
  const result = useAppStore((s) => s.lastResult);
  const predispositions = result?.predispositions ?? [];

  if (predispositions.length === 0) {
    return (
      <EmptyState
        icon={Dna}
        title="Нет данных о генетике"
        description="Пройдите онбординг и укажите генотипы, чтобы увидеть предрасположенности"
      />
    );
  }

  return (
    <Card>
      <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-1">
        Генетические предрасположенности
      </p>
      <p className="text-xs text-muted mb-5">
        На основе ваших генотипов
      </p>

      <div className="divide-y divide-border/60">
        {predispositions.map((p, i) => (
          <Row key={p.id} item={p} index={i} />
        ))}
      </div>
    </Card>
  );
}

function Row({ item, index }: { item: PredispositionStat; index: number }) {
  const risk = getRiskLevel(item.risk_percent);
  const pct = Math.max(2, Math.min(100, item.risk_percent));

  return (
    <div className="py-3.5 first:pt-0 last:pb-0">
      <div className="flex justify-between items-start gap-3 mb-2">
        <p className="text-sm text-ink leading-snug flex-1">
          {item.name}
        </p>
        <span
          className={cn(
            "text-[11px] font-medium whitespace-nowrap pt-0.5",
            risk.textColor
          )}
        >
          {risk.label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-border/60 overflow-hidden">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r", risk.gradient)}
            style={{ width: `${pct}%`, transitionDelay: `${index * 50}ms` }}
          />
        </div>
        <span className="text-[11px] text-muted tabular-nums w-9 text-right">
          {Math.round(item.risk_percent)}%
        </span>
      </div>
    </div>
  );
}

function getRiskLevel(pct: number) {
  if (pct >= 75)
    return {
      label: "Очень высокая",
      textColor: "text-rose-600 dark:text-rose-400",
      gradient: "from-rose-400 to-rose-600 dark:from-rose-500 dark:to-rose-400",
    };
  if (pct >= 50)
    return {
      label: "Высокая",
      textColor: "text-orange-600 dark:text-orange-400",
      gradient: "from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-400",
    };
  if (pct >= 25)
    return {
      label: "Средняя",
      textColor: "text-amber-600 dark:text-amber-400",
      gradient: "from-amber-300 to-amber-500 dark:from-amber-500 dark:to-amber-400",
    };
  return {
    label: "Низкая",
    textColor: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-300 to-emerald-500 dark:from-emerald-500 dark:to-emerald-400",
  };
}