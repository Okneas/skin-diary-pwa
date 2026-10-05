// src/features/diary/PhotoSlider.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, ChevronRight } from "lucide-react";
import { getFullStorageUrl } from "@/utils/storage";
import { formatDateShort } from "@/utils/date";
import { cn } from "@/utils/cn";
import type { DiaryEntryListItem } from "@/types";

interface Props {
  entries: DiaryEntryListItem[];
  onEmptyAction: () => void;
}

export function PhotoSlider({ entries, onEmptyAction }: Props) {

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <Camera size={36} strokeWidth={1.5} className="text-primary" />
        </div>
        <h3 className="text-lg font-display text-ink mb-2">
          Пока нет записей
        </h3>
        <p className="text-sm text-muted max-w-xs mb-6">
          Начните наблюдать за кожей — добавьте первую запись с фото
        </p>
        <button
          onClick={onEmptyAction}
          className="px-5 py-3 rounded-2xl bg-primary text-white text-sm font-medium shadow-soft active:scale-[0.97] transition"
        >
          Создать запись
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Карусель */}
      <div className="relative -mx-5">
        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-5 pb-2">
          {entries.map((entry, i) => (
            <Slide key={entry.id} entry={entry} index={i} />
          ))}
          {/* Трейлинг-спейсер для корректного снапа последнего слайда */}
          <div className="shrink-0 w-1" />
        </div>
      </div>

      <p className="text-[11px] uppercase tracking-[0.15em] text-muted text-center">
        Свайпните, чтобы листать · {entries.length} записей
      </p>
    </div>
  );
}

function Slide({
  entry,
  index,
}: {
  entry: DiaryEntryListItem;
  index: number;
}) {
  const navigate = useNavigate();
  const photoUrl = entry.photo_path ? getFullStorageUrl(entry.photo_path) : null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      onClick={() => navigate(`/diary/${entry.id}`)}
      className={cn(
        "shrink-0 snap-center w-[78vw] max-w-[320px]",
        "relative rounded-3xl overflow-hidden shadow-card",
        "bg-surface border border-border/60",
        "text-left active:scale-[0.98] transition"
      )}
    >
      {/* Фото или плейсхолдер */}
      <div className="aspect-[3/4] bg-surface-2 flex items-center justify-center overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={entry.leading_aging_type ?? "Запись"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted">
            <Camera size={40} strokeWidth={1.2} />
            <p className="text-xs">Без фото</p>
          </div>
        )}

        {/* Градиент снизу для читаемости подписи */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />

        {/* Дата сверху */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[11px] font-medium">
          {formatDateShort(entry.recorded_at)}
        </div>
      </div>

      {/* Подпись снизу */}
      <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
        <p className="text-white text-lg font-display leading-tight mb-1 line-clamp-1">
          {entry.leading_aging_type ?? "Без расчёта"}
        </p>
        {entry.leading_aging_score != null && (
          <p className="text-white/80 text-xs">
            Тип старения · {Math.round(entry.leading_aging_score)}
          </p>
        )}
        {entry.note && (
          <p className="text-white/70 text-xs mt-1 line-clamp-1">
            «{entry.note}»
          </p>
        )}
      </div>

      {/* Шеврон в правом верхнем углу */}
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <ChevronRight size={14} className="text-white" />
      </div>
    </motion.button>
  );
}