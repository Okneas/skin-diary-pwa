// src/features/passport/DynamicsTab.tsx
import { TrendingUp, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { TrendCurve } from "@/components/charts/TrendCurve";
import { GRAPH_THEMES, GRAPH_ORDER } from "./graphThemes";
import { useDiaryTrends } from "@/hooks/useDiary";
import { useBaseGraphs } from "@/hooks/useReferenceData";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";
import type { GraphTrendPoint } from "@/types";

export function DynamicsTab() {
  const userAge = useAuthStore((s) => s.user?.age ?? null);
  const { data: trends, isLoading: tLoading } = useDiaryTrends();
  const { data: baseGraphs, isLoading: gLoading } = useBaseGraphs();

  if (tLoading || gLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rect" className="h-52 w-full" />
        ))}
      </div>
    );
  }

  // Группируем персональные точки по code
  const personalByCode = new Map<string, GraphTrendPoint[]>();
  for (const p of trends?.graphs ?? []) {
    const arr = personalByCode.get(p.code) ?? [];
    arr.push(p);
    personalByCode.set(p.code, arr);
  }

  const totalPoints = trends?.graphs?.length ?? 0;

  if (totalPoints === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="Пока нечего показывать"
        description="Добавьте несколько записей в дневник — и здесь появятся графики динамики"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent-soft/40 dark:to-accent-soft/20 border border-border p-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-primary" />
          <p className="text-sm font-medium text-ink">
            Персональная динамика
          </p>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Жирная линия — ваши наблюдения. Пунктир — средняя динамика
          для вашего возраста
        </p>
      </div>

      {GRAPH_ORDER.map((code) => {
        const theme = GRAPH_THEMES[code];
        const base = baseGraphs?.find((g) => g.code === code);
        const personal = personalByCode.get(code) ?? [];
        const Icon = theme.icon;

        return (
          <Card key={code}>
            <div className="flex items-center gap-3 mb-3">
              <span
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                  theme.iconBg
                )}
              >
                <Icon size={18} strokeWidth={1.8} className={theme.iconColor} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">
                  {base?.name_ru ?? code}
                </p>
                <p className="text-[11px] text-muted">
                  {personal.length > 0
                    ? `${personal.length} наблюдений`
                    : "Нет данных"}
                </p>
              </div>
            </div>

            <TrendCurve
              basePoints={base?.points}
              personalPoints={personal.map((p) => ({
                date: p.date,
                value: p.value,
              }))}
              userAge={userAge}
              color={theme.stroke}
              gradientFrom={theme.gradientFrom}
              gradientTo={theme.gradientTo}
            />
          </Card>
        );
      })}
    </div>
  );
}