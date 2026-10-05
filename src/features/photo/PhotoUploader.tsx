// src/features/photo/PhotoUploader.tsx
import { useState } from "react";
import {
  Camera,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useMediaPipe } from "./useMediaPipe";
import { runQualityGate } from "./qualityGate";
import type { QualityGateResult } from "@/types";

interface Props {
  onPhotoReady: (
    file: File,
    landmarks: number[][],
    quality: QualityGateResult,
  ) => void;
}

export function PhotoUploader({ onPhotoReady }: Props) {
  const { landmarker, isReady, error: mpError } = useMediaPipe();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [landmarks, setLandmarks] = useState<number[][] | null>(null);
  const [quality, setQuality] = useState<QualityGateResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !landmarker) return;

    setFile(f);
    setAnalyzing(true);
    setPreview(null);
    setLandmarks(null);
    setQuality(null);

    // 1. Создаём object URL для превью
    const url = URL.createObjectURL(f);
    setPreview(url);

    // 2. Загружаем изображение в HTMLImageElement для MediaPipe
    const img = new Image();
    img.src = url;
    await img.decode();

    // 3. Детектируем landmarks
    const result = landmarker.detect(img);
    if (result.faceLandmarks.length === 0) {
      setAnalyzing(false);
      return;
    }

    const lm = result.faceLandmarks[0].map((p) => [p.x, p.y, p.z]);
    setLandmarks(lm);

    // 4. Прогоняем quality gate
    const q = await runQualityGate({
      landmarks: lm,
      imageWidth: img.naturalWidth,
      imageHeight: img.naturalHeight,
      imageDataUrl: url,
    });
    setQuality(q);
    setAnalyzing(false);
  };

  const handleConfirm = () => {
    if (file && landmarks && quality) {
      onPhotoReady(file, landmarks, quality);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setLandmarks(null);
    setQuality(null);
  };

  const goodQuality = quality && quality.score >= 0.7;

  return (
    <div className="space-y-4">
      {!preview && (
        <label className="block w-full p-8 rounded-3xl border-2 border-dashed border-border bg-surface text-center cursor-pointer hover:border-primary/50 transition">
          <input
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handleFileChange}
            disabled={!isReady || analyzing}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera
                size={28}
                className="text-primary"
                strokeWidth={1.8}
              />
            </div>
            <p className="text-sm font-medium text-ink">
              Сделать или загрузить фото
            </p>
            <p className="text-xs text-muted">
              Лицо должно быть хорошо освещено и смотреть прямо
            </p>
          </div>
        </label>
      )}

      {mpError && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <span>{mpError}</span>
        </div>
      )}

      {preview && (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-black">
            <img src={preview} alt="Превью" className="w-full h-auto" />
            {analyzing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <RefreshCw size={32} className="text-white animate-spin" />
              </div>
            )}
          </div>

          {quality && (
            <div
              className={`p-4 rounded-2xl border ${
                goodQuality
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {goodQuality ? (
                  <CheckCircle size={18} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={18} className="text-amber-600" />
                )}
                <span className="text-sm font-medium">
                  {goodQuality
                    ? "Отличное качество"
                    : "Качество можно улучшить"}
                </span>
              </div>
              <ul className="text-xs space-y-1 text-muted">
                {quality.flags.face_too_small && (
                  <li>· Лицо слишком маленькое</li>
                )}
                {quality.flags.blurry && <li>· Фото размытое</li>}
                {quality.flags.low_light && <li>· Недостаточно света</li>}
                {quality.flags.tilted && <li>· Голова наклонена</li>}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={reset}>
              <RefreshCw size={16} className="mr-2" />
              Другое фото
            </Button>
            {landmarks && (
              <Button fullWidth onClick={handleConfirm} disabled={analyzing}>
                <Upload size={16} className="mr-2" />
                Продолжить
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
