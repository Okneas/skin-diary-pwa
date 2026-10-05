import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, Trash2, Save, Pencil, Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { Sheet } from "@/components/ui/Sheet";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { DiaryEntryForm } from "@/features/diary/DiaryEntryForm";
import { Link } from "react-router-dom";
import {
  useDiaryEntry,
  useDeleteDiaryEntry,
  useUpdateDiaryEntry,
} from "@/hooks/useDiary";
import {
  useSubjectiveFeatures,
  useObjectiveFeatures,
} from "@/hooks/useReferenceData";
import { formatDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import { getFullStorageUrl } from "@/utils/storage";

export default function DiaryEntryPage() {
  const { id } = useParams<{ id: string }>();

  // Режим "new"
  if (id === "new" || !id) {
    return <DiaryEntryForm />;
  }

  // Режим "view"
  return <DiaryEntryView id={Number(id)} />;
}

// ============================================================
// Просмотр существующей записи
// ============================================================
function DiaryEntryView({ id }: { id: number }) {
  const navigate = useNavigate();
  const toast = useToast((s) => s.push);

  const { data: entry, isLoading } = useDiaryEntry(id);
  const { data: subjective } = useSubjectiveFeatures();
  const { data: objective } = useObjectiveFeatures();

  const deleteMutation = useDeleteDiaryEntry();
  const updateMutation = useUpdateDiaryEntry(id);

  const [editing, setEditing] = useState(false);
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openEdit = () => {
    if (!entry) return;
    setEditNote(entry.note ?? "");
    const d = new Date(entry.recorded_at);
    setEditDate(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
    setEditing(true);
  };

  const saveEdit = () => {
    updateMutation.mutate(
      {
        note: editNote.trim() || undefined,
        recorded_at: new Date(editDate + "T12:00:00").toISOString(),
      },
      {
        onSuccess: () => {
          toast("success", "Запись обновлена");
          setEditing(false);
        },
        onError: () => toast("error", "Не удалось обновить"),
      },
    );
  };

  const doDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast("success", "Запись удалена");
        navigate("/diary", { replace: true });
      },
      onError: () => toast("error", "Не удалось удалить"),
    });
  };

  if (isLoading || !entry) {
    return (
      <div className="px-5 pt-8 max-w-md mx-auto">
        <Skeleton variant="rect" className="h-10 w-40 mb-4" />
        <SkeletonCard />
        <div className="h-3" />
        <SkeletonCard />
      </div>
    );
  }

  const subjectiveTitles = new Map(
    (subjective ?? []).map((s) => [s.id, s.description]),
  );
  const objectiveMap = new Map((objective ?? []).map((o) => [o.code, o]));

  const aging = entry.result_snapshot?.aging_type;

  return (
    <div className="px-5 pt-8 pb-32 max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface shadow-soft flex items-center justify-center"
        >
          <ChevronLeft size={20} className="text-ink" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={openEdit}
            className="w-10 h-10 rounded-full bg-surface shadow-soft flex items-center justify-center"
            aria-label="Редактировать"
          >
            <Pencil size={16} className="text-ink" />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-10 h-10 rounded-full bg-surface shadow-soft flex items-center justify-center"
            aria-label="Удалить"
          >
            <Trash2 size={16} className="text-rose-500" />
          </button>
        </div>
      </header>

      <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-1">
        Запись
      </p>
      <h1 className="text-2xl font-display text-ink mb-5">
        {formatDate(entry.recorded_at)}
      </h1>

      {/* Aging */}
      {aging && (
        <Card className="mb-4 bg-gradient-to-br from-surface to-primary-soft/40 dark:to-primary-soft/10">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-2">
            Тип старения
          </p>
          <h2 className="text-2xl font-display text-ink mb-4">
            {aging.leading_type.name_ru}
          </h2>
          <div className="space-y-2.5">
            {aging.scores.map((s) => {
              const isLeading = s.code === aging.leading_type.code;
              const pct = Math.max(
                4,
                (s.score / (aging.leading_type.score || 1)) * 100,
              );
              return (
                <div key={s.code}>
                  <div className="flex justify-between text-sm mb-1">
                    <span
                      className={
                        isLeading ? "text-ink font-medium" : "text-muted"
                      }
                    >
                      {s.name_ru}
                    </span>
                    <span
                      className={cn(
                        "tabular-nums",
                        "text-primary font-semibold",
                      )}
                    >
                      {Math.round(s.score)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        isLeading
                          ? "bg-gradient-to-r from-primary to-primary-dark"
                          : "bg-border",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Заметка */}
      {entry.note && (
        <Card className="mb-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-2">
            Заметка
          </p>
          <p className="text-sm text-ink leading-relaxed whitespace-pre-line">
            {entry.note}
          </p>
        </Card>
      )}

      {entry.time_of_day && (
        <Card className="mb-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-2">
            Когда наносился уход
          </p>
          <p className="text-sm text-ink">
            {entry.time_of_day === "morning" && "Утром"}
            {entry.time_of_day === "evening" && "Вечером"}
            {entry.time_of_day === "both" && "Утром и вечером"}
          </p>
        </Card>
      )}

      {entry.products && entry.products.length > 0 && (
        <Card className="mb-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3">
            Использованные средства
          </p>
          <div className="space-y-1">
            {entry.products.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded-2xl hover:bg-surface-2 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center shrink-0 overflow-hidden">
                  {p.photo_path ? (
                    <img
                      src={getFullStorageUrl(p.photo_path)}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={16} className="text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink truncate">{p.name}</p>
                  {p.brand && (
                    <p className="text-xs text-muted truncate">{p.brand}</p>
                  )}
                </div>
                <ChevronRight size={16} className="text-muted shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Субъективные */}
      {entry.subjective_feature_ids.length > 0 && (
        <Card className="mb-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3">
            Субъективные признаки
          </p>
          <ul className="space-y-1.5">
            {entry.subjective_feature_ids.map((sid) => (
              <li key={sid} className="text-sm text-ink leading-snug">
                · {subjectiveTitles.get(sid) ?? `#${sid}`}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Объективные */}
      {Object.keys(entry.objective_scores).length > 0 && (
        <Card className="mb-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3">
            Объективные признаки
          </p>
          <ul className="space-y-1.5">
            {Object.entries(entry.objective_scores).map(([code, score]) => {
              const feat = objectiveMap.get(code);
              return (
                <li
                  key={code}
                  className="text-sm text-ink flex justify-between gap-3"
                >
                  <span className="flex-1 leading-snug">
                    {feat?.description ?? code}
                  </span>
                  <span className="text-muted tabular-nums shrink-0">
                    {score} / {feat?.max_score ?? "?"}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {/* Редактирование — Sheet */}
      <Sheet
        open={editing}
        onClose={() => setEditing(false)}
        title="Редактировать"
      >
        <div className="space-y-4">
          <Input
            type="date"
            label="Дата"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
          />
          <div>
            <label className="text-sm text-muted mb-2 block">Заметка</label>
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              rows={4}
              className="w-full px-4 py-3.5 rounded-2xl bg-surface border border-border text-ink focus:outline-none focus:border-primary transition resize-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setEditing(false)}
            >
              Отмена
            </Button>
            <Button
              fullWidth
              onClick={saveEdit}
              disabled={updateMutation.isPending}
            >
              <span className="inline-flex items-center gap-2">
                <Save size={16} />
                Сохранить
              </span>
            </Button>
          </div>
        </div>
      </Sheet>

      {/* Подтверждение удаления — Sheet */}
      <Sheet
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Удалить запись?"
      >
        <p className="text-sm text-muted mb-5">Это действие нельзя отменить.</p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setConfirmDelete(false)}
          >
            Отмена
          </Button>
          <Button
            fullWidth
            onClick={doDelete}
            disabled={deleteMutation.isPending}
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            <span className="inline-flex items-center gap-2">
              <Trash2 size={16} />
              Удалить
            </span>
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
