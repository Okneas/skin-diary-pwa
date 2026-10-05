// src/components/decor/HeroBackdrop.tsx
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface Props {
  /** Путь к изображению (например, /backgrounds/welcome-1.jpg) */
  image?: string;
  /** Затемнение поверх картинки */
  overlay?: "light" | "dark" | "auto";
  /** Интенсивность затемнения */
  intensity?: "soft" | "medium" | "strong";
  /** Дочерние декоративные элементы (Blob, PetalBurst) */
  children?: ReactNode;
  className?: string;
  /** Позиционирование картинки */
  position?: "center" | "top" | "bottom";
}

const OVERLAY = {
  light: {
    soft: "bg-gradient-to-b from-white/40 via-white/20 to-canvas/80",
    medium: "bg-gradient-to-b from-white/60 via-white/35 to-canvas/90",
    strong: "bg-gradient-to-b from-white/80 via-white/50 to-canvas",
  },
  dark: {
    soft: "bg-gradient-to-b from-black/40 via-black/25 to-canvas/90",
    medium: "bg-gradient-to-b from-black/60 via-black/40 to-canvas",
    strong: "bg-gradient-to-b from-black/80 via-black/55 to-canvas",
  },
};

const POSITION = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
};

export function HeroBackdrop({
  image,
  overlay = "auto",
  intensity = "medium",
  children,
  className,
  position = "center",
}: Props) {
  // Определяем оверлей автоматически по теме
  const resolvedOverlay = overlay === "auto"
    ? undefined // будет применяться через dark: в классах ниже
    : overlay;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Изображение */}
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            POSITION[position]
          )}
        />
      )}

      {/* Оверлей — фиксированный */}
      {resolvedOverlay && (
        <div className={cn("absolute inset-0", OVERLAY[resolvedOverlay][intensity])} />
      )}

      {/* Оверлей — авто (по теме) */}
      {!resolvedOverlay && (
        <>
          <div
            className={cn(
              "absolute inset-0 dark:hidden",
              OVERLAY.light[intensity]
            )}
          />
          <div
            className={cn(
              "absolute inset-0 hidden dark:block",
              OVERLAY.dark[intensity]
            )}
          />
        </>
      )}

      {/* Дочерний декор (Blob, PetalBurst и т.д.) */}
      {children}
    </div>
  );
}