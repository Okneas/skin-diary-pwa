// src/pages/DashboardPage.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera,
  BookHeart,
  Sparkles,
  ChevronRight,
  Plus,
  Sun,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sparkline } from "@/components/charts/Sparkline";
import { useDiaryEntries, useDiaryTrends } from "@/hooks/useDiary";
import { usePhotos } from "@/hooks/usePhotos";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";
import { LogoMark } from "@/components/brand";
import { HeroBackdrop } from "@/components/decor/HeroBackdrop";
import { Blob } from "@/components/decor";
import { listContainer, listItem } from "@/utils/motion";

// Совет дня — локально, позже заменим на рекомендации с бэка
const DAILY_TIPS = [
  "Не забывайте про SPF — даже в пасмурную погоду",
  "Пейте воду: гидратация влияет на упругость кожи",
  "Спите 7–8 часов — кожа восстанавливается ночью",
  "Не трите лицо полотенцем — промакивайте",
  "Витамин C утром, ретинол вечером — не наоборот",
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data: entries, isLoading: entriesLoading } = useDiaryEntries(1);
  const { data: photos, isLoading: photosLoading } = usePhotos(1);
  const { data: trends } = useDiaryTrends();

  const lastEntry = entries?.items?.[0] ?? null;
  const totalEntries = entries?.total ?? 0;
  const totalPhotos = photos?.length ?? 0;

  // Тип старения из последней записи
  const aging = lastEntry?.leading_aging_type;
  const agingScore = lastEntry?.leading_aging_score;

  // Совет дня — детерминированный по дате
  const tipIndex = new Date().getDate() % DAILY_TIPS.length;
  const dailyTip = DAILY_TIPS[tipIndex];

  // Sparkline по первому графику из трендов
  const firstGraphTrend =
    trends?.graphs && trends.graphs.length > 0
      ? (groupByCode(trends.graphs)[trends.graphs[0].code] ?? [])
      : [];
  const sparkValues = firstGraphTrend.map((p) => p.value);
  const sparkLabel = trends?.graphs?.[0]?.name_ru ?? "";

  const hour = new Date().getHours();
  const greeting =
    hour < 6
      ? "Доброй ночи"
      : hour < 12
        ? "Доброе утро"
        : hour < 18
          ? "Добрый день"
          : "Добрый вечер";

  return (
    <div className="relative min-h-full">
      {/* 👇 hero-обёртка с фиксированной высотой и обрезкой */}
      <div className="relative h-56 overflow-hidden">
        <HeroBackdrop
          image="/backgrounds/dashboard.jpg"
          overlay="auto"
          intensity="strong"
          position="top"
        >
          <Blob
            variant="accent"
            className="top-0 right-0"
            size={200}
            opacity={0.35}
          />
        </HeroBackdrop>

        <header className="relative z-10 px-5 pt-8 pb-6 flex items-start justify-between">
          <div>
            <p className="text-sm text-muted">{greeting},</p>
            <h1 className="text-3xl font-display text-ink">
              {user?.name ?? "Пользователь"}
            </h1>
          </div>
          <LogoMark size={44} className="drop-shadow-sm" />
        </header>
      </div>

      {/* Карточка состояния кожи */}
      <div className="relative z-10 px-5 pb-24 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {entriesLoading ? (
            <Skeleton variant="rect" className="h-40 w-full mb-4" />
          ) : lastEntry ? (
            <Card className="mb-4 bg-gradient-to-br from-surface to-primary-soft/40 dark:to-primary-soft/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
                  Состояние кожи
                </p>
                <span className="text-[11px] text-muted">
                  {formatRelative(lastEntry.recorded_at)}
                </span>
              </div>

              <h2 className="text-2xl font-display text-ink mb-1">
                {aging ?? "Нет данных"}
              </h2>
              {agingScore != null && (
                <p className="text-sm text-muted mb-4">
                  Ведущий тип старения · {Math.round(agingScore)}
                </p>
              )}

              {sparkValues.length >= 2 && (
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <div>
                    <p className="text-[11px] text-muted">{sparkLabel}</p>
                    <p className="text-lg font-display text-ink tabular-nums">
                      {sparkValues[sparkValues.length - 1].toFixed(1)}
                    </p>
                  </div>
                  <Sparkline
                    values={sparkValues}
                    color="#B27A8E"
                    width={100}
                    height={32}
                  />
                </div>
              )}
            </Card>
          ) : (
            <Card className="mb-4 text-center py-6">
              <p className="text-sm text-muted mb-3">
                Пока нет ни одной записи
              </p>
              <Button onClick={() => navigate("/diary/new")}>
                <span className="inline-flex items-center gap-2">
                  <Plus size={16} />
                  Создать первую запись
                </span>
              </Button>
            </Card>
          )}
        </motion.div>

        {/* Статистика */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <motion.div variants={listItem} className="flex">
            <StatCard
              icon={BookHeart}
              label="Записей"
              value={entriesLoading ? "—" : totalEntries}
              color="rose"
              onClick={() => navigate("/diary")}
            />
          </motion.div>
          <motion.div variants={listItem} className="flex">
            <StatCard
              icon={Camera}
              label="Фото"
              value={photosLoading ? "—" : totalPhotos}
              color="purple"
              onClick={() => navigate("/analysis")}
            />
          </motion.div>
        </motion.div>

        {/* Быстрые действия */}
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3 px-1">
          Быстрые действия
        </p>
        <div className="space-y-2 mb-5">
          <ActionRow
            icon={Camera}
            iconBg="bg-purple-50 dark:bg-purple-500/15"
            iconColor="text-purple-500 dark:text-purple-400"
            title="Анализ фото"
            subtitle="Построить карту лица и состарить"
            onClick={() => navigate("/analysis")}
          />
          <ActionRow
            icon={BookHeart}
            iconBg="bg-rose-50 dark:bg-rose-500/15"
            iconColor="text-rose-500 dark:text-rose-400"
            title="Новая запись"
            subtitle="Отметить состояние кожи сегодня"
            onClick={() => navigate("/diary/new")}
          />
          <ActionRow
            icon={Sparkles}
            iconBg="bg-amber-50 dark:bg-amber-500/15"
            iconColor="text-amber-500 dark:text-amber-400"
            title="Паспорт кожи"
            subtitle="Графики, динамика, генетика"
            onClick={() => navigate("/passport")}
          />
        </div>
        {/* Совет дня */}
        <Card className="bg-gradient-to-br from-amber-50/60 to-surface border-amber-100">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Sun size={18} className="text-amber-600" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-ink mb-1">
                Совет дня
              </p>
              <p className="text-sm text-ink leading-snug">{dailyTip}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// Компоненты
// ============================================================
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  onClick,
}: {
  icon: typeof BookHeart;
  label: string;
  value: number | string;
  color: "rose" | "purple";
  onClick: () => void;
}) {
  const colorMap = {
    rose: { bg: "bg-rose-50", text: "text-rose-500" },
    purple: { bg: "bg-purple-50", text: "text-purple-500" },
  }[color];

  return (
    <button onClick={onClick} className="text-left flex-1">
      <Card className="h-full">
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center mb-3",
            colorMap.bg,
          )}
        >
          <Icon size={18} className={colorMap.text} strokeWidth={1.8} />
        </div>
        <p className="text-2xl font-display text-ink tabular-nums">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </Card>
    </button>
  );
}

function ActionRow({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  onClick,
}: {
  icon: typeof Camera;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full text-left">
      <Card className="flex items-center gap-3 hover:bg-surface/80 transition">
        <span
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center shrink-0",
            iconBg,
          )}
        >
          <Icon size={20} strokeWidth={1.8} className={iconColor} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink">{title}</p>
          <p className="text-xs text-muted truncate">{subtitle}</p>
        </div>
        <ChevronRight size={18} className="text-muted shrink-0" />
      </Card>
    </button>
  );
}

// ============================================================
// Утилиты
// ============================================================
function groupByCode<T extends { code: string }>(
  arr: T[],
): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      (acc[item.code] ||= []).push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (24 * 3600 * 1000),
  );
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  if (diffDays < 7) return `${diffDays} дн. назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
  return `${Math.floor(diffDays / 30)} мес. назад`;
}
