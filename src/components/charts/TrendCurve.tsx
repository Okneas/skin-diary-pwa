// src/components/charts/TrendCurve.tsx
import { useId } from "react";
import { motion } from "framer-motion";
import type { GraphPoint } from "@/types";

interface PersonalPoint {
  date: string;
  value: number;
}

interface Props {
  basePoints?: GraphPoint[];          // базовая кривая (без факторов)
  personalPoints?: PersonalPoint[];   // точки из дневника
  userAge?: number | null;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  minAge?: number;
  maxAge?: number;
  minValue?: number;
  maxValue?: number;
}

const W = 340;
const H = 180;
const PAD_L = 30;
const PAD_R = 14;
const PAD_T = 16;
const PAD_B = 28;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

export function TrendCurve({
  basePoints,
  personalPoints = [],
  userAge,
  color,
  gradientFrom,
  gradientTo,
  minAge = 10,
  maxAge = 70,
  minValue = 0,
  maxValue = 100,
}: Props) {
  const baseId = useId().replace(/:/g, "");
  const gradArea = `area-${baseId}`;
  const gradLine = `line-${baseId}`;

  const xAge = (age: number) =>
    PAD_L + ((age - minAge) / (maxAge - minAge)) * INNER_W;
  const yVal = (v: number) =>
    PAD_T + (1 - (v - minValue) / (maxValue - minValue)) * INNER_H;

  // === Базовая кривая ===
  const baseSorted = basePoints ? [...basePoints].sort((a, b) => a.age - b.age) : [];
  let basePath = "";
  if (baseSorted.length >= 2) {
    const coords = baseSorted.map((p) => ({ x: xAge(p.age), y: yVal(p.value) }));
    basePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const a = coords[i];
      const b = coords[i + 1];
      const cx = (a.x + b.x) / 2;
      basePath += ` C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`;
    }
  }

  // === Персональные точки на возрастной оси ===
  const now = new Date();
  const personal = personalPoints
    .map((p) => {
      const d = new Date(p.date);
      // Насколько лет назад была запись
      const yearsAgo =
        (now.getTime() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
      const ageAt = userAge != null ? userAge - yearsAgo : null;
      return { age: ageAt, value: p.value, date: p.date };
    })
    .filter((p) => p.age != null && p.age >= minAge && p.age <= maxAge)
    .sort((a, b) => (a.age! - b.age!)) as { age: number; value: number; date: string }[];

  // === Персональная кривая ===
  let personalPath = "";
  const personalCoords = personal.map((p) => ({
    x: xAge(p.age),
    y: yVal(p.value),
    date: p.date,
  }));
  if (personalCoords.length >= 2) {
    personalPath = `M ${personalCoords[0].x} ${personalCoords[0].y}`;
    for (let i = 0; i < personalCoords.length - 1; i++) {
      const a = personalCoords[i];
      const b = personalCoords[i + 1];
      const cx = (a.x + b.x) / 2;
      personalPath += ` C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`;
    }
  }

  const hasPersonal = personalCoords.length >= 1;
  const lastPoint = personalCoords[personalCoords.length - 1] ?? null;

  const ageTicks = [10, 20, 30, 40, 50, 60, 70];
  const valueTicks = [0, 25, 50, 75, 100];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={gradArea} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.35" />
          <stop offset="100%" stopColor={gradientFrom} stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={gradLine} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
      </defs>

      {/* Grid */}
      {valueTicks.map((v) => (
        <line
          key={v}
          x1={PAD_L}
          x2={PAD_L + INNER_W}
          y1={yVal(v)}
          y2={yVal(v)}
          stroke="#E8DFD6"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      ))}

      {/* Y-axis labels */}
      {[0, 50, 100].map((v) => (
        <text
          key={v}
          x={PAD_L - 6}
          y={yVal(v) + 3}
          fontSize="9"
          fill="#A89AA5"
          textAnchor="end"
        >
          {v}
        </text>
      ))}

      {/* X-axis labels */}
      {ageTicks.map((a) => (
        <text
          key={a}
          x={xAge(a)}
          y={H - 6}
          fontSize="9"
          fill="#A89AA5"
          textAnchor="middle"
        >
          {a}
        </text>
      ))}

      {/* Базовая кривая — пунктир, бледная */}
      {basePath && (
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          d={basePath}
          fill="none"
          stroke="#B8A9B3"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      )}

      {/* Персональная кривая — заливка + линия */}
      {hasPersonal && (
        <>
          {personalCoords.length >= 2 && (
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              d={`${personalPath} L ${personalCoords[personalCoords.length - 1].x} ${PAD_T + INNER_H} L ${personalCoords[0].x} ${PAD_T + INNER_H} Z`}
              fill={`url(#${gradArea})`}
            />
          )}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            d={personalPath || `M ${personalCoords[0].x} ${personalCoords[0].y}`}
            fill="none"
            stroke={`url(#${gradLine})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {/* Точки */}
      {personalCoords.map((c, i) => (
        <motion.circle
          key={`${c.date}-${i}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9 + i * 0.05, type: "spring", stiffness: 300 }}
          cx={c.x}
          cy={c.y}
          r="3"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
        />
      ))}

      {/* Пульсирующая точка «последнее наблюдение» */}
      {lastPoint && (
        <>
          <motion.circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="5"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            animate={{ r: [5, 12], opacity: [0.55, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="4.5"
            fill={color}
            stroke="white"
            strokeWidth="2"
          />
        </>
      )}

      {/* Если нет персональных данных — сообщение */}
      {!hasPersonal && !basePath && (
        <text
          x={W / 2}
          y={H / 2}
          fontSize="11"
          fill="#A89AA5"
          textAnchor="middle"
        >
          Нет данных
        </text>
      )}
    </svg>
  );
}