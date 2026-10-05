// src/features/diary/DiaryEntryForm.tsx
import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  useSubjectiveFeatures,
  useObjectiveFeatures,
  useFactors,
} from "@/hooks/useReferenceData";
import {
  useCreateDiaryEntry,
  useDiaryEntries,
  useDiaryEntry,
} from "@/hooks/useDiary";
import { useToast } from "@/components/ui/Toast";
import SubjectiveForm from "@/components/forms/SubjectiveForm";
import ObjectiveForm from "@/components/forms/ObjectiveForm";
import FactorsSelect from "@/components/forms/FactorsSelect";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { formatDate } from "@/utils/date";
import TimeOfDaySelect from "@/components/forms/TimeOfDaySelect";
import { ProductPicker } from "@/components/product/ProductPicker";
import { useUploadPhoto } from "@/hooks/usePhotos";
import type { TimeOfDay } from "@/types";
import { SimplePhotoPicker } from "@/components/photo/SimplePhotoPicker";

const STEPS = ["Фото", "Признаки", "Осмотр", "Заметка"] as const;
type StepIndex = 0 | 1 | 2 | 3;

export function DiaryEntryForm() {
  const navigate = useNavigate();
  const toast = useToast((s) => s.push);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);

  const { data: subjective } = useSubjectiveFeatures();
  const { data: objective } = useObjectiveFeatures();
  const { data: factors } = useFactors();
  const createMutation = useCreateDiaryEntry();

  // === Подтягиваем последнюю запись ===
  const { data: entriesList } = useDiaryEntries(1);
  const lastEntryId = entriesList?.items?.[0]?.id;
  const { data: lastEntry } = useDiaryEntry(lastEntryId ?? 0);

  // === Состояние формы ===
  const [step, setStep] = useState<StepIndex>(0);
  const [subjectiveIds, setSubjectiveIds] = useState<number[]>([]);
  const [objectiveScores, setObjectiveScores] = useState<
    Record<string, number>
  >({});
  const [factorIds, setFactorIds] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [recordedAt, setRecordedAt] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );

  // === Показывать ли баннер "заполнено из записи от..." ===
  const [prefilledDate, setPrefilledDate] = useState<string | null>(null);
  const appliedRef = useRef<number | null>(null);
  const [productIds, setProductIds] = useState<number[]>([]);

  const [photoId, setPhotoId] = useState<number | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const uploadPhotoMutation = useUploadPhoto();

  useEffect(() => {
    if (!lastEntry) return;
    if (appliedRef.current === lastEntry.id) return;

    appliedRef.current = lastEntry.id;

    setSubjectiveIds(lastEntry.subjective_feature_ids ?? []);
    setObjectiveScores(lastEntry.objective_scores ?? {});
    setFactorIds(lastEntry.factor_ids ?? []);
    setPrefilledDate(lastEntry.recorded_at);
    setProductIds(lastEntry.products?.map((p) => p.id) ?? []);
    setTimeOfDay(lastEntry.time_of_day ?? null);
  }, [lastEntry]);

  const clearAutofill = () => {
    setSubjectiveIds([]);
    setObjectiveScores({});
    setFactorIds([]);
    setPrefilledDate(null);
    setTimeOfDay(null);
    setProductIds([]);
    setPhotoId(null);
    setPhotoPreview(null);
    appliedRef.current = lastEntry?.id ?? null; // не заполнять заново
  };

  const canNext = useMemo(() => {
    if (step === 0) return true; // фото опционально
    if (step === 1) return subjectiveIds.length > 0;
    if (step === 2) return Object.keys(objectiveScores).length > 0;
    return true;
  }, [step, subjectiveIds, objectiveScores]);

  const next = () => {
    if (step < 3) setStep((step + 1) as StepIndex);
  };
  const back = () => {
    if (step === 0) navigate(-1);
    else setStep((step - 1) as StepIndex);
  };

  const submit = () => {
    createMutation.mutate(
      {
        subjective_feature_ids: subjectiveIds,
        objective_scores: objectiveScores,
        user_genotypes: {}, // генетику сюда не тащим — она в профиле
        factor_ids: factorIds,
        note: note.trim() || undefined,
        recorded_at: new Date(recordedAt + "T12:00:00").toISOString(),
        time_of_day: timeOfDay,
        product_ids: productIds,
        photo_id: photoId,
      },
      {
        onSuccess: (entry) => {
          toast("success", "Запись сохранена");
          navigate(`/diary/${entry.id}`, { replace: true });
        },
        onError: () => {
          toast("error", "Не удалось сохранить запись");
        },
      },
    );
  };

  const handlePhotoPick = (file: File) => {
    // Мгновенное превью
    setPhotoPreview(URL.createObjectURL(file));

    // Загружаем на бэкенд с пустыми landmarks — без MediaPipe
    uploadPhotoMutation.mutate(
      {
        file,
        landmarks: [],
        quality: { score: 1, flags: {} },
      },
      {
        onSuccess: (data) => {
          setPhotoId(data.id);
        },
        onError: () => {
          toast("error", "Не удалось загрузить фото");
          setPhotoPreview(null);
        },
      },
    );
  };

  const handlePhotoRemove = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoId(null);
    setPhotoPreview(null);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* Progress */}
      <div className="h-1 bg-border">
        <motion.div
          className="h-full bg-primary"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2 safe-top">
        <button
          onClick={back}
          className="w-10 h-10 rounded-full bg-surface shadow-soft flex items-center justify-center"
        >
          <ChevronLeft size={20} className="text-ink" />
        </button>
        <span className="text-xs text-muted">
          {step + 1} / {STEPS.length}
        </span>
      </header>

      <AnimatePresence>
        {prefilledDate && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-5 mt-2 p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3"
          >
            <Sparkles
              size={16}
              className="text-primary shrink-0 mt-0.5"
              strokeWidth={2}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-ink leading-snug">
                Поля заполнены из записи от{" "}
                <span className="font-medium text-primary">
                  {formatDate(prefilledDate)}
                </span>
                . Проверьте и измените при необходимости.
              </p>
            </div>
            <button
              type="button"
              onClick={clearAutofill}
              aria-label="Очистить автозаполнение"
              className="w-6 h-6 rounded-full bg-surface flex items-center justify-center shrink-0 border border-border/60"
            >
              <X size={12} className="text-muted" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <h1 className="text-2xl font-display text-ink mb-2">
                  Добавим фото?
                </h1>
                <p className="text-sm text-muted mb-5">
                  Фото позволит отследить динамику и построить карту лица. Можно
                  пропустить и добавить позже.
                </p>

                <SimplePhotoPicker
                  preview={photoPreview}
                  uploading={uploadPhotoMutation.isPending}
                  onPick={handlePhotoPick}
                  onRemove={handlePhotoRemove}
                />
              </div>
            )}
            {step === 1 && (
              <div>
                <h1 className="text-2xl font-display text-ink mb-2">
                  Как себя чувствует кожа?
                </h1>
                <p className="text-sm text-muted mb-5">
                  Отметьте всё, что подходит сегодня
                </p>
                {!subjective ? (
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : (
                  <SubjectiveForm
                    features={subjective}
                    selected={subjectiveIds}
                    onChange={setSubjectiveIds}
                    isLoading={false}
                  />
                )}
              </div>
            )}
            {step === 2 && (
              <div>
                <h1 className="text-2xl font-display text-ink mb-2">Осмотр</h1>
                <p className="text-sm text-muted mb-5">
                  Оцените выраженность признаков
                </p>
                {!objective ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : (
                  <ObjectiveForm
                    features={objective}
                    scores={objectiveScores}
                    onChange={(code, score) =>
                      setObjectiveScores((p) => ({ ...p, [code]: score }))
                    }
                    isLoading={false}
                  />
                )}

                <div className="mt-6">
                  <p className="text-sm text-muted mb-3">Факторы влияния</p>
                  {factors && (
                    <FactorsSelect
                      factors={factors}
                      selected={factorIds}
                      onChange={setFactorIds}
                      isLoading={false}
                    />
                  )}
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h1 className="text-2xl font-display text-ink mb-2">
                  Заметка и дата
                </h1>
                <p className="text-sm text-muted mb-5">
                  Пара слов о том, что нового
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm text-muted mb-2 block">
                      Дата записи
                    </label>
                    <Input
                      type="date"
                      value={recordedAt}
                      onChange={(e) => setRecordedAt(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted mb-2 block">
                      Когда наносился уход
                    </label>
                    <TimeOfDaySelect
                      value={timeOfDay}
                      onChange={setTimeOfDay}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted mb-2 block">
                      Использованные средства
                    </label>
                    <ProductPicker
                      selectedIds={productIds}
                      onChange={setProductIds}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted mb-2 block">
                      Заметка (необязательно)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                      placeholder="Например: начала новый крем, кожа стала мягче"
                      className="w-full px-4 py-3.5 rounded-2xl bg-surface border border-border text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary transition resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 px-5 py-4 pb-6 safe-bottom bg-gradient-to-t from-canvas via-canvas to-transparent">
        <div className="max-w-md mx-auto">
          {step < 3 ? (
            <Button fullWidth size="lg" disabled={!canNext} onClick={next}>
              Продолжить
            </Button>
          ) : (
            <Button
              fullWidth
              size="lg"
              onClick={submit}
              disabled={createMutation.isPending}
            >
              <span className="inline-flex items-center gap-2">
                {createMutation.isPending ? "Сохраняем…" : "Сохранить запись"}
                {!createMutation.isPending && <Check size={18} />}
              </span>
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
