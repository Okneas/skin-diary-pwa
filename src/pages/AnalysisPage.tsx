// src/pages/AnalysisPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowLeft } from "lucide-react";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { PhotoUploader } from "@/features/photo/PhotoUploader";
import { FaceMap } from "@/features/photo/FaceMap";
import { useUploadPhoto } from "@/hooks/usePhotos";
import type { QualityGateResult } from "@/types";

export default function AnalysisPage() {
  const navigate = useNavigate();
  const toast = useToast((s) => s.push);
  const uploadMutation = useUploadPhoto();

  const [step, setStep] = useState<"upload" | "analyze" | "done">("upload");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [landmarks, setLandmarks] = useState<number[][]>([]);
  const [quality, setQuality] = useState<QualityGateResult | null>(null);
  const [photoId, setPhotoId] = useState<number | null>(null);

  const handlePhotoReady = async (
    file: File,
    lm: number[][],
    q: QualityGateResult,
  ) => {
    setPreviewUrl(URL.createObjectURL(file));
    setLandmarks(lm);
    setQuality(q);
    setStep("analyze");

    // Загружаем на бэкенд
    uploadMutation.mutate(
      { file, landmarks: lm, quality: q },
      {
        onSuccess: (data) => {
          toast("success", "Фото загружено");
          navigate(`/analysis/${data.id}`);
        },
        onError: () => {
          toast("error", "Не удалось загрузить фото");
          setStep("upload");
        },
      },
    );
  };

  return (
    <Screen>
      <header className="flex items-center gap-3 mb-5">
        {step !== "upload" && (
          <button
            onClick={() => setStep("upload")}
            className="w-10 h-10 rounded-full bg-surface shadow-soft flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-ink" />
          </button>
        )}
        <h1 className="text-2xl font-display text-ink">Анализ лица</h1>
      </header>

      {step === "upload" && (
        <>
          <p className="text-sm text-muted mb-6">
            Сделайте фото при хорошем освещении, чтобы мы могли точно
            проанализировать состояние кожи
          </p>
          <PhotoUploader onPhotoReady={handlePhotoReady} />
        </>
      )}

      {step === "analyze" && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Camera size={28} className="text-primary animate-pulse" />
          </div>
          <p className="text-muted">Анализируем фото…</p>
        </div>
      )}

      {step === "done" && photoId && (
        <div className="space-y-4">
          <FaceMap imageUrl={previewUrl} landmarks={landmarks} />

          {quality && (
            <Card>
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3">
                Качество снимка
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 rounded-full bg-border/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    style={{ width: `${quality.score * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-ink">
                  {Math.round(quality.score * 100)}%
                </span>
              </div>
            </Card>
          )}

          <Card>
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3">
              Геометрические признаки
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Уголки губ</span>
                <span className="text-ink font-medium">
                  {quality?.flags.tilted ? "Смещены" : "Норма"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Симметрия лица</span>
                <span className="text-ink font-medium">
                  {quality
                    ? `${Math.round((1 - quality.score * 0.1) * 100)}%`
                    : "—"}
                </span>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setStep("upload");
                setPhotoId(null);
              }}
            >
              Другое фото
            </Button>
            <Button fullWidth onClick={() => navigate(`/analysis/${photoId}`)}>
              Подробнее
            </Button>
          </div>
        </div>
      )}
    </Screen>
  );
}
