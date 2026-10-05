import { useMemo } from "react";
import { BookHeart, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { DiaryEntryCard } from "./DiaryEntryCard";
import { motion } from "framer-motion";
import { isSameDay } from "@/utils/date";
import type { DiaryEntryListItem } from "@/types";
import { listContainer, listItem } from "@/utils/motion";

interface Props {
  entries: DiaryEntryListItem[];
  isLoading: boolean;
  selectedDate?: Date | null;
  onCreate: () => void;
}

export function DiaryList({
  entries,
  isLoading,
  selectedDate,
  onCreate,
}: Props) {
  // Фильтр по дню, если выбран
  const filtered = useMemo(() => {
    if (!selectedDate) return entries;
    return entries.filter((e) =>
      isSameDay(new Date(e.recorded_at), selectedDate),
    );
  }, [entries, selectedDate]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={BookHeart}
        title={selectedDate ? "В этот день записей нет" : "Дневник пока пуст"}
        description={
          selectedDate
            ? "Выберите другой день или сбросьте фильтр"
            : "Начните наблюдать за кожей — добавляйте записи о состоянии"
        }
        action={
          !selectedDate && (
            <Button onClick={onCreate}>
              <span className="inline-flex items-center gap-2">
                <Plus size={18} />
                Первая запись
              </span>
            </Button>
          )
        }
      />
    );
  }

  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {filtered.map((entry, idx) => {
        const prev = idx + 1 < filtered.length ? filtered[idx + 1] : null;
        return (
          <motion.div key={entry.id} variants={listItem}>
            <DiaryEntryCard entry={entry} previous={prev} index={idx} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
