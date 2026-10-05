// src/components/brand/LogoMark.tsx
import { useId } from "react";
import { cn } from "@/utils/cn";

interface Props {
  size?: number | string;
  className?: string;
  /** Использовать золотой акцент вместо основного цвета */
  accent?: boolean;
}

export function LogoMark({ size = 40, className, accent = false }: Props) {
  const uid = useId().replace(/:/g, "");
  const gradId = `logo-grad-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradId} cx="0.3" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </radialGradient>
      </defs>

      {/* Мягкий круг-подложка */}
      <circle cx="32" cy="32" r="30" fill={`url(#${gradId})`} />

      {/* 6 лепестков, повёрнутых на 60° */}
      <g
        stroke={accent ? "rgb(var(--c-accent))" : "rgb(var(--c-primary))"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M32 32 C 26 22, 26 12, 32 8 C 38 12, 38 22, 32 32 Z"
            transform={`rotate(${deg} 32 32)`}
            fill={accent
              ? "rgb(var(--c-accent) / 0.06)"
              : "rgb(var(--c-primary) / 0.06)"}
          />
        ))}
      </g>

      {/* Центральный круг */}
      <circle
        cx="32"
        cy="32"
        r="4"
        fill={accent ? "rgb(var(--c-accent))" : "rgb(var(--c-primary))"}
      />
      <circle
        cx="32"
        cy="32"
        r="2"
        fill="rgb(var(--c-surface))"
      />

      {/* Искра */}
      <g
        transform="translate(48 12)"
        fill={accent ? "rgb(var(--c-accent))" : "rgb(var(--c-primary))"}
      >
        <path d="M0 -4 C 0.6 -1, 1 -0.6, 4 0 C 1 0.6, 0.6 1, 0 4 C -0.6 1, -1 0.6, -4 0 C -1 -0.6, -0.6 -1, 0 -4 Z" />
      </g>
    </svg>
  );
}