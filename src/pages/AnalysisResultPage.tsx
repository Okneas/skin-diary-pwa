// src/pages/AnalysisResultPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { FaceMap } from "@/features/photo/FaceMap";
import { AgingCarousel } from "@/features/aging/AgingCarousel";
import { AgingProgress } from "@/features/aging/AgingProgress";
import { usePhoto, useFaceMap } from "@/hooks/usePhotos";
import { useAgedResults, useGenerateAged } from "@/hooks/useAging";
import { useAuthStore } from "@/store/useAuthStore";
import { getFullStorageUrl } from "@/utils/storage";

import axios from "axios";

function extractError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const detail = (err.response?.data as { detail?: string } | undefined)
      ?.detail;
    return detail ?? fallback;
  }
  return fallback;
}

export default function AnalysisResultPage() {
  const { id } = useParams<{ id: string }>();
  const photoId = Number(id);
  const navigate = useNavigate();
  const toast = useToast((s) => s.push);
  const userAge = useAuthStore((s) => s.user?.age ?? null);

  const { data: photo, isLoading: photoLoading } = usePhoto(photoId);
  const { data: faceMap } = useFaceMap(photoId);
  const { data: agedResults } = useAgedResults(photoId);
  const generateMutation = useGenerateAged();

  const [stageIndex, setStageIndex] = useState(0);

  // Крутим стадии, пока идёт генерация
  useEffect(() => {
    if (!generateMutation.isPending) return;
    const t = setInterval(() => {
      setStageIndex((i) => (i < 3 ? i + 1 : i));
    }, 6000);
    return () => clearInterval(t);
  }, [generateMutation.isPending]);

  const handleGenerate = () => {
    setStageIndex(0);
    generateMutation.mutate(
      { photo_id: photoId, target_ages: [30, 50, 70], model: "sam" },
      {
        onSuccess: () => toast("success", "Готово! Посмотрите результат"),
        onError: (err) =>
          toast("error", extractError(err, "Не удалось состарить фото")),
      },
    );
  };

  if (photoLoading || !photo) {
    return (
      <div className="px-5 pt-8 max-w-md mx-auto space-y-4">
        <Skeleton variant="rect" className="h-10 w-40" />
        <Skeleton variant="rect" className="aspect-[3/4] w-full" />
      </div>
    );
  }

  const imageUrl = getFullStorageUrl(photo.storage_path);
  const geo = faceMap?.geometry_features ?? {};
  const hasAged = (agedResults?.length ?? 0) > 0;

  return (
    <div className="px-5 pt-8 pb-32 max-w-md mx-auto">
      <header className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface shadow-soft flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-2xl font-display text-ink">
          Результат анализа
        </h1>
      </header>

      {/* Прогресс или карусель */}
      {generateMutation.isPending ? (
        <AgingProgress stageIndex={stageIndex} />
      ) : hasAged && agedResults ? (
        <>
          <AgingCarousel
            originalUrl={imageUrl}
            results={agedResults}
            userAge={userAge}
          />
          <div className="mt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCw size={16} />
                Перегенерировать
              </span>
            </Button>
          </div>
        </>
      ) : (
        <>
          <FaceMap imageUrl={imageUrl} landmarks={photo.landmarks ?? []} />

          <Card className="mt-4">
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3">
              Карта лица построена
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Metric
                label="Уголки губ"
                value={fmt(geo.mouth_corner_angle, "°")}
              />
              <Metric label="Симметрия" value={fmt(geo.facial_symmetry, "")} />
              <Metric
                label="Носогубные складки"
                value={fmt(geo.nasolabial_asymmetry, "")}
              />
              <Metric
                label="Нижняя треть"
                value={fmt(geo.lower_third_ratio, "")}
              />
            </div>
          </Card>

          <Card className="mt-4 bg-gradient-to-br from-surface to-primary-soft/40 dark:to-primary-soft/10">
            <p className="text-sm font-medium text-ink mb-1">
              Как вы будете выглядеть в 30, 50, 70 лет?
            </p>
            <p className="text-xs text-muted mb-4">
              Компьютерная модель состарит ваше фото на основе текущего
              состояния кожи
            </p>
            <Button fullWidth onClick={handleGenerate}>
              <span className="inline-flex items-center gap-2">
                <Sparkles size={16} />
                Состарить фото
              </span>
            </Button>
          </Card>
        </>
      )}

      {/* Ошибки */}
      {generateMutation.isError && (
        <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <span>
            {extractError(generateMutation.error, "Сервис старения недоступен")}
          </span>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted">{label}</p>
      <p className="text-sm font-medium text-ink tabular-nums">
        {value || "—"}
      </p>
    </div>
  );
}

function fmt(v: unknown, suffix: string): string {
  if (typeof v !== "number") return "—";
  return `${v.toFixed(2)}${suffix}`;
}
