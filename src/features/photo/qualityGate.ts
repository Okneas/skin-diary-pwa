// src/features/photo/qualityGate.ts
import type { QualityGateResult } from "@/types";

interface QualityParams {
  landmarks: number[][];
  imageWidth: number;
  imageHeight: number;
  imageDataUrl: string;
}

export async function runQualityGate(
  params: QualityParams
): Promise<QualityGateResult> {
  const flags: QualityGateResult["flags"] = {};
  let score = 1.0;

  // === 1. Наличие лица ===
  if (!params.landmarks || params.landmarks.length < 468) {
    flags.face_too_small = true;
    score -= 0.5;
  }

  // === 2. Размер лица в кадре ===
  if (params.landmarks.length > 0) {
    const xs = params.landmarks.map((p) => p[0]);
    const ys = params.landmarks.map((p) => p[1]);
    const faceWidth = Math.max(...xs) - Math.min(...xs);
    const faceHeight = Math.max(...ys) - Math.min(...ys);
    const faceArea = faceWidth * faceHeight;

    if (faceArea < 0.15) {
      flags.face_too_small = true;
      score -= 0.3;
    }
  }

  // === 3. Резкость (Laplacian variance) ===
  const sharpness = await computeSharpness(params.imageDataUrl);
  // Порог: 100 — размытое, 300+ — резкое. Возьмём 150 как компромисс.
  if (sharpness < 150) {
    flags.blurry = true;
    score -= 0.4;
  }

  // === 4. Освещение ===
  const brightness = await computeAverageBrightness(params.imageDataUrl);
  if (brightness < 0.2) {
    flags.low_light = true;
    score -= 0.3;
  } else if (brightness > 0.9) {
    flags.low_light = true;
    score -= 0.2;
  }

  // === 5. Наклон головы ===
  if (params.landmarks.length > 300) {
    const leftEye = params.landmarks[33];
    const rightEye = params.landmarks[263];
    if (leftEye && rightEye) {
      const tilt = Math.abs(leftEye[1] - rightEye[1]);
      if (tilt > 0.05) {
        flags.tilted = true;
        score -= 0.15;
      }
    }
  }

  return {
    score: Math.max(0, Math.min(1, score)),
    flags,
  };
}

// ============================================================
// Дисперсия лапласиана — классический метод оценки резкости
// ============================================================
async function computeSharpness(dataUrl: string): Promise<number> {
  const img = await loadImage(dataUrl);

  // Уменьшаем до 400px по большей стороне — ускоряет и сглаживает шум
  const maxSide = 400;
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;

  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  // Перевод в grayscale
  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // Ядро Лапласиана: [0 1 0; 1 -4 1; 0 1 0]
  const laplacian: number[] = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const val =
        gray[idx - w] +
        gray[idx + w] +
        gray[idx - 1] +
        gray[idx + 1] -
        4 * gray[idx];
      laplacian.push(val);
    }
  }

  if (laplacian.length === 0) return 0;

  // Дисперсия
  const mean =
    laplacian.reduce((s, v) => s + v, 0) / laplacian.length;
  const variance =
    laplacian.reduce((s, v) => s + (v - mean) ** 2, 0) / laplacian.length;

  return variance;
}

// ============================================================
// Средняя яркость (0..1)
// ============================================================
async function computeAverageBrightness(dataUrl: string): Promise<number> {
  const img = await loadImage(dataUrl);

  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;

  ctx.drawImage(img, 0, 0, 100, 100);
  const { data } = ctx.getImageData(0, 0, 100, 100);

  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  return sum / (data.length / 4) / 255;
}

// ============================================================
// Хелпер: загрузка изображения из data URL
// ============================================================
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}