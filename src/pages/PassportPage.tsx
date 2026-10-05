// src/pages/PassportPage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, BookHeart, Sparkle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AgeCurve } from "@/components/charts/AgeCurve";
import { DynamicsTab } from "@/features/passport/DynamicsTab";
import { GeneticsTab } from "@/features/passport/GeneticsTab";
import { GRAPH_THEMES } from "@/features/passport/graphThemes";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { CalculateResponse } from "@/types";
import { cn } from "@/utils/cn";
import { Blob, PetalBurst } from "@/components/decor";
import { HeroBackdrop } from "@/components/decor/HeroBackdrop";

type Tab = "profile" | "dynamics" | "genetics";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Профиль" },
  { id: "dynamics", label: "Динамика" },
  { id: "genetics", label: "Генетика" },
];

export default function PassportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateResult = (location.state as { result?: CalculateResponse } | null)
    ?.result;
  const { lastResult, setLastResult } = useAppStore();
  const user = useAuthStore((s) => s.user);

  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (stateResult) {
      setLastResult(stateResult);
      window.history.replaceState({}, "");
    }
  }, [stateResult, setLastResult]);

  const result = stateResult ?? lastResult;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 safe-top safe-bottom">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Sparkle size={36} className="text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-display text-ink text-center mb-2">
          Паспорт ещё не создан
        </h2>
        <p className="text-sm text-muted text-center mb-8 max-w-xs">
          Пройдите короткий опрос, чтобы построить персональный паспорт кожи
        </p>
        <Button fullWidth onClick={() => navigate("/onboarding/welcome")}>
          Создать паспорт
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      {/* 👇 hero-обёртка с фиксированной высотой */}
      <div className="relative h-64 overflow-hidden">
        <HeroBackdrop
          image="/backgrounds/passport.jpg"
          overlay="auto"
          intensity="strong"
          position="top"
        >
          <Blob
            variant="primary"
            className="top-0 left-0"
            size={220}
            opacity={0.4}
          />
          <PetalBurst count={4} />
        </HeroBackdrop>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 px-5 pt-10 pb-6 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-200 to-purple-200 flex items-center justify-center shadow-soft shrink-0 border-2 border-white/50">
            <span className="text-2xl font-display text-rose-900">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
              Паспорт кожи
            </p>
            <h1 className="text-2xl font-display text-ink leading-tight truncate">
              {user?.name || "Пользователь"}
            </h1>
            {user?.age != null && (
              <p className="text-sm text-muted">{user.age} лет</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 mx-5 -mt-24 flex gap-1 p-1 rounded-2xl bg-surface/80 backdrop-blur-xl border border-border/40 shadow-soft mb-5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 py-2 rounded-xl text-sm font-medium transition relative",
              tab === t.id ? "bg-surface text-ink shadow-soft" : "text-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        className="px-5"
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {tab === "profile" && (
          <ProfileTab result={result} userAge={user?.age ?? null} />
        )}
        {tab === "dynamics" && <DynamicsTab />}
        {tab === "genetics" && <GeneticsTab />}
      </motion.div>

      {/* CTA */}
      <div className="mt-8 mb-4 space-y-3 px-5 pb-24">
        <Button fullWidth onClick={() => navigate("/analysis")}>
          <span className="inline-flex items-center gap-2 text-ink">
            <Camera size={18} />
            Добавить фото
          </span>
        </Button>
        <Button
          fullWidth
          variant="secondary"
          onClick={() => navigate("/diary")}
        >
          <span className="inline-flex items-center gap-2">
            <BookHeart size={18} />
            Заполнить дневник
          </span>
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// Таб «Профиль» — тип старения + базовые графики
// ============================================================
function ProfileTab({
  result,
  userAge,
}: {
  result: CalculateResponse;
  userAge: number | null;
}) {
  const { leading_type, scores } = result.aging_type;
  const maxScore = leading_type.score || 1;

  return (
    <div className="relative z-10">
      <Card className="mb-5 bg-gradient-to-br from-surface to-primary-soft/40 dark:to-primary-soft/10 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
            Тип старения
          </p>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-muted font-medium inline-flex items-center gap-1">
            <Sparkle size={11} strokeWidth={2.5} />
            Ведущий
          </span>
        </div>

        <h2 className="text-3xl font-display text-ink mb-1">
          {leading_type.name_ru}
        </h2>
        <p className="text-sm text-muted mb-6">
          Это ведущий тип старения вашей кожи
        </p>

        <div className="space-y-3.5">
          {scores.map((s, i) => {
            const isLeading = s.code === leading_type.code;
            const pct = Math.max(4, (s.score / maxScore) * 100);
            return (
              <div key={s.code}>
                <div className="flex justify-between items-center mb-1.5">
                  <span
                    className={cn(
                      "text-sm",
                      isLeading ? "text-ink font-medium" : "text-muted",
                    )}
                  >
                    {s.name_ru}
                  </span>
                  <span
                    className={cn(
                      "text-sm tabular-nums",
                      isLeading ? "text-primary font-semibold" : "text-muted",
                    )}
                  >
                    {Math.round(s.score)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-border/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + i * 0.1,
                      ease: "easeOut",
                    }}
                    className={cn(
                      "h-full rounded-full",
                      isLeading
                        ? "bg-gradient-to-r from-primary to-primary-dark"
                        : "bg-border",
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Возрастные графики */}
      {result.graphs?.length > 0 && (
        <>
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3 px-1">
            Возрастные графики
          </p>
          <div className="space-y-4">
            {result.graphs.map((graph, i) => {
              const theme =
                GRAPH_THEMES[graph.code] ?? GRAPH_THEMES.collagen_synthesis;
              const Icon = theme.icon;
              return (
                <motion.div
                  key={graph.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Card>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                          theme.iconBg,
                        )}
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.8}
                          className={theme.iconColor}
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink truncate">
                          {graph.name_ru}
                        </p>
                        <p className="text-[11px] text-muted">
                          Динамика с возрастом, %
                        </p>
                      </div>
                    </div>
                    <div className="pt-1">
                      <AgeCurve
                        points={graph.points}
                        color={theme.stroke}
                        gradientFrom={theme.gradientFrom}
                        gradientTo={theme.gradientTo}
                        userAge={userAge}
                      />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
