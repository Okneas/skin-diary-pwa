import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  monthLabel,
  getMonthGrid,
  isSameDay,
  toDateKey,
  WEEKDAYS,
} from "@/utils/date";
import { cn } from "@/utils/cn";

interface Props {
  entries: { id: number; recorded_at: string }[];
  selectedDate: Date | null;
  onSelectDate: (d: Date | null) => void;
}

export function DiaryCalendar({ entries, selectedDate, onSelectDate }: Props) {
  const [cursor, setCursor] = useState(new Date());

  const grid = getMonthGrid(cursor);
  const today = new Date();

  const entryDays = new Set(
    entries.map((e) => toDateKey(new Date(e.recorded_at)))
  );

  const goPrev = () =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const goNext = () =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  const handleDayTap = (d: Date) => {
    if (selectedDate && isSameDay(selectedDate, d)) {
      onSelectDate(null);
    } else {
      onSelectDate(d);
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goPrev}
          className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center"
          aria-label="Предыдущий месяц"
        >
          <ChevronLeft size={16} className="text-ink" />
        </button>
        <p className="text-sm font-medium text-ink">{monthLabel(cursor)}</p>
        <button
          onClick={goNext}
          className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center"
          aria-label="Следующий месяц"
        >
          <ChevronRight size={16} className="text-ink" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-[10px] uppercase tracking-wide text-muted py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {grid.map(({ date, isCurrentMonth }, idx) => {
          const key = toDateKey(date);
          const hasEntry = entryDays.has(key);
          const isSelected = selectedDate && isSameDay(selectedDate, date);
          const isToday = isSameDay(today, date);

          return (
            <button
              key={idx}
              onClick={() => handleDayTap(date)}
              className={cn(
                "relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition",
                !isCurrentMonth && "opacity-30",
                isSelected
                  ? "bg-primary text-white"
                  : isToday
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-ink hover:bg-canvas"
              )}
            >
              <span>{date.getDate()}</span>
              {hasEntry && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
              {hasEntry && isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <button
          onClick={() => onSelectDate(null)}
          className="mt-3 text-xs text-primary w-full py-1.5"
        >
          Сбросить фильтр
        </button>
      )}
    </div>
  );
}