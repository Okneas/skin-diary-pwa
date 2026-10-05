// src/components/decor/FloralPattern.tsx
import { cn } from "@/utils/cn";

interface Props {
  className?: string;
  /** Прозрачность паттерна */
  opacity?: number;
}

export function FloralPattern({ className, opacity = 0.4 }: Props) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 w-full h-full", className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="floral"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="rgb(var(--c-primary))"
            strokeWidth="0.6"
            strokeLinecap="round"
            opacity="0.5"
          >
            {/* Простой цветок */}
            <g transform="translate(20 20)">
              <circle cx="0" cy="0" r="1.5" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse
                  key={deg}
                  cx="0"
                  cy="-6"
                  rx="2"
                  ry="4"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
            {/* Маленькая искра */}
            <path d="M60 15 l 1 2 l 2 1 l -2 1 l -1 2 l -1 -2 l -2 -1 l 2 -1 z" />
            {/* Точки-бусинки */}
            <circle cx="70" cy="55" r="0.8" />
            <circle cx="15" cy="65" r="0.8" />
            <circle cx="45" cy="45" r="0.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#floral)" />
    </svg>
  );
}