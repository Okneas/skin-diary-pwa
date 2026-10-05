// src/features/photo/FaceMap.tsx
import { useState } from "react";

interface Props {
  imageUrl: string;
  landmarks: number[][]; // Нормализованные [x, y, z]
}

// Ключевые зоны для подсветки
const ZONES = {
  mouth: { name: "Уголки губ", indices: [61, 291, 13, 14, 0, 17, 84, 314] },
  nasolabial: { name: "Носогубные складки", indices: [129, 358, 98, 327] },
  eyes: { name: "Периорбитальная зона", indices: [33, 133, 362, 263, 159, 145, 386, 374] },
};

export function FaceMap({ imageUrl, landmarks }: Props) {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const activeIndices = activeZone
    ? ZONES[activeZone as keyof typeof ZONES].indices
    : [];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-black">
      <img src={imageUrl} alt="Анализ лица" className="w-full h-auto" />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {/* Все landmarks — маленькие точки */}
        {landmarks.map((lm, i) => (
          <circle
            key={i}
            cx={lm[0] * 100}
            cy={lm[1] * 100}
            r="0.3"
            fill="rgba(255,255,255,0.5)"
          />
        ))}

        {/* Подсветка активной зоны */}
        {activeIndices.map((idx) => {
          const lm = landmarks[idx];
          if (!lm) return null;
          return (
            <circle
              key={`hl-${idx}`}
              cx={lm[0] * 100}
              cy={lm[1] * 100}
              r="1.2"
              fill="#B27A8E"
              stroke="white"
              strokeWidth="0.3"
            />
          );
        })}
      </svg>

      {/* Легенда зон */}
      <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 flex-wrap">
        {Object.entries(ZONES).map(([key, zone]) => (
          <button
            key={key}
            onClick={() => setActiveZone(activeZone === key ? null : key)}
            className={`px-2.5 py-1.5 rounded-full text-[10px] font-medium backdrop-blur-sm transition ${
              activeZone === key
                ? "bg-primary text-white"
                : "bg-black/50 text-white"
            }`}
          >
            {zone.name}
          </button>
        ))}
      </div>
    </div>
  );
}