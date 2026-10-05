// src/features/aging/AgingCarousel.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AgedPhotoOut } from "@/types";

interface Props {
  originalUrl: string;
  results: AgedPhotoOut[];
  userAge: number | null;
  storageBase?: string;
}

const SLIDE_LABELS = (age: number) => `В ${age} лет`;

export function AgingCarousel({
  originalUrl,
  results,
  userAge,
  storageBase = "/storage",
}: Props) {
  const slides = [
    { key: "now", label: userAge ? `Сейчас, ${userAge}` : "Сейчас", url: originalUrl, age: null },
    ...results.map((r) => ({
      key: `age-${r.target_age}`,
      label: SLIDE_LABELS(r.target_age),
      url: `${storageBase}/${r.storage_path}`,
      age: r.target_age,
    })),
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = (delta: number) => {
    const next = index + delta;
    if (next < 0 || next >= slides.length) return;
    setDirection(delta);
    setIndex(next);
  };

  const slide = slides[index];

  return (
    <div className="space-y-3">
      <div className="relative rounded-3xl overflow-hidden bg-black aspect-[3/4]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={slide.key}
            src={slide.url}
            alt={slide.label}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Стрелки */}
        {index > 0 && (
          <button
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
            aria-label="Предыдущий"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {index < slides.length - 1 && (
          <button
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
            aria-label="Следующий"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Подпись */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-lg font-display">{slide.label}</p>
          {slide.age && (
            <p className="text-white/70 text-xs mt-0.5">
              Прогноз на основе текущего состояния кожи
            </p>
          )}
        </div>
      </div>

      {/* Точки-индикаторы */}
      <div className="flex justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-primary" : "w-1.5 bg-border"
            }`}
            aria-label={s.label}
          />
        ))}
      </div>
    </div>
  );
}