// src/pages/DiaryPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LayoutGrid, Images } from "lucide-react";
import { Screen } from "@/components/ui/Screen";
import { Skeleton } from "@/components/ui/Skeleton";
import { DiaryCalendar } from "@/features/diary/DiaryCalendar";
import { DiaryList } from "@/features/diary/DiaryList";
import { PhotoSlider } from "@/features/diary/PhotoSlider";
import { useDiaryInfinite } from "@/hooks/useDiary";
import { cn } from "@/utils/cn";

type ViewMode = "slider" | "calendar";

export default function DiaryPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>("slider");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { data, isLoading } = useDiaryInfinite(50);

  const allEntries = data?.pages.flatMap((p) => p.items) ?? [];
  // Для слайдера — только записи с фото
  const entriesWithPhoto = allEntries.filter((e) => e.photo_path);

  return (
    <div className="relative">
      <Screen title="Дневник" className="[&>main]:flex [&>main]:flex-col [&>main]:gap-5">
        {/* Переключатель режима */}
        <div className="flex gap-1 p-1 rounded-2xl bg-border/40 flex-1">
          <ModeTab
            active={view === "slider"}
            onClick={() => setView("slider")}
            icon={Images}
            label="Фото"
          />
          <ModeTab
            active={view === "calendar"}
            onClick={() => setView("calendar")}
            icon={LayoutGrid}
            label="Календарь"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton variant="rect" className="h-96 w-full" />
            <Skeleton variant="rect" className="h-20 w-full" />
          </div>
        ) : view === "slider" ? (
          <PhotoSlider
            entries={entriesWithPhoto}
            onEmptyAction={() => navigate("/diary/new")}
          />
        ) : (
          <>
            <div className="mb-5">
              <DiaryCalendar
                entries={allEntries}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>

            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.15em] text-muted">
                {selectedDate ? "Записи дня" : "История"}
              </p>
              <p className="text-xs text-muted">{allEntries.length} записей</p>
            </div>

            <DiaryList
              entries={allEntries}
              isLoading={false}
              selectedDate={selectedDate}
              onCreate={() => navigate("/diary/new")}
            />
          </>
        )}
      </Screen>

      {/* FAB */}
      <button
        onClick={() => navigate("/diary/new")}
        aria-label="Новая запись"
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-primary text-white shadow-soft flex items-center justify-center active:scale-95 transition z-30"
      >
        <Plus size={26} strokeWidth={2.4} />
      </button>
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Images;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition",
        active
          ? "bg-surface text-ink shadow-soft"
          : "text-muted"
      )}
    >
      <Icon size={16} strokeWidth={2} />
      {label}
    </button>
  );
}