import { useId } from "react";
import { motion } from "framer-motion";
import type { GraphPoint } from "@/types";

interface Props {
  points: GraphPoint[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
  userAge?: number | null;
  minAge?: number;
  maxAge?: number;
  minValue?: number;
  maxValue?: number;
}

const W = 320;
const H = 160;
const PAD_L = 28;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 24;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

export function AgeCurve({
  points,
  color,
  gradientFrom,
  gradientTo,
  userAge,
  minAge = 10,
  maxAge = 70,
  minValue = 0,
  maxValue = 100,
}: Props) {
  const baseId = useId().replace(/:/g, "");
  const gradId = `grad-${baseId}`;
  const lineId = `line-${baseId}`;

  const sorted = [...points].sort((a, b) => a.age - b.age);
  if (sorted.length < 2) return null;

  const xScale = (age: number) =>
    PAD_L + ((age - minAge) / (maxAge - minAge)) * INNER_W;
  const yScale = (v: number) =>
    PAD_T + (1 - (v - minValue) / (maxValue - minValue)) * INNER_H;

  const coords = sorted.map((p) => ({
    x: xScale(p.age),
    y: yScale(p.value),
  }));

  // Плавная кривая (монотонная кубическая — как у recharts monotone)
  let linePath = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const a = coords[i];
    const b = coords[i + 1];
    const cx = (a.x + b.x) / 2;
    linePath += ` C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`;
  }

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${
    PAD_T + INNER_H
  } L ${coords[0].x} ${PAD_T + INNER_H} Z`;

  // Точка пользователя
  const userAgeInRange =
    userAge != null && userAge >= minAge && userAge <= maxAge;
  let userPoint: { x: number; y: number } | null = null;
  if (userAgeInRange && userAge != null) {
    const y = getValueAtAge(sorted, userAge);
    userPoint = { x: xScale(userAge), y: yScale(y) };
  }

  const ageTicks = [10, 20, 30, 40, 50, 60, 70];
  const valueTicks = [0, 50, 100];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.5" />
          <stop offset="100%" stopColor={gradientFrom} stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      {valueTicks.map((v) => (
        <line
          key={v}
          x1={PAD_L}
          x2={PAD_L + INNER_W}
          y1={yScale(v)}
          y2={yScale(v)}
          stroke="#E8DFD6"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      ))}

      {/* Оси */}
      {valueTicks.map((v) => (
        <text
          key={v}
          x={PAD_L - 6}
          y={yScale(v) + 3}
          fontSize="9"
          fill="#A89AA5"
          textAnchor="end"
        >
          {v}
        </text>
      ))}
      {ageTicks.map((a) => (
        <text
          key={a}
          x={xScale(a)}
          y={H - 6}
          fontSize="9"
          fill="#A89AA5"
          textAnchor="middle"
        >
          {a}
        </text>
      ))}

      {/* Area */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        d={areaPath}
        fill={`url(#${gradId})`}
      />

      {/* Line */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
        d={linePath}
        fill="none"
        stroke={`url(#${lineId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Точка пользователя */}
      {userPoint && (
        <>
          <line
            x1={userPoint.x}
            x2={userPoint.x}
            y1={PAD_T}
            y2={PAD_T + INNER_H}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.4"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 300 }}
            cx={userPoint.x}
            cy={userPoint.y}
            r="4"
            fill={color}
            stroke="white"
            strokeWidth="2"
          />
          {/* Пульсация */}
          <motion.circle
            initial={{ r: 4, opacity: 0.55 }}
            animate={{ r: 12, opacity: 0 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.2,
            }}
            cx={userPoint.x}
            cy={userPoint.y}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
        </>
      )}
    </svg>
  );
}

function getValueAtAge(points: GraphPoint[], age: number): number {
  if (points.length === 0) return 0;
  if (age <= points[0].age) return points[0].value;
  if (age >= points[points.length - 1].age)
    return points[points.length - 1].value;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (age >= a.age && age <= b.age) {
      const t = (age - a.age) / (b.age - a.age);
      return a.value + t * (b.value - a.value);
    }
  }
  return points[points.length - 1].value;
}