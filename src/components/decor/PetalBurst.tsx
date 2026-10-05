// src/components/decor/PetalBurst.tsx
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface Props {
  count?: number;
  className?: string;
}

const POSITIONS = [
  { top: "8%", left: "12%", size: 16, rotate: -25, delay: 0 },
  { top: "15%", right: "18%", size: 12, rotate: 30, delay: 0.2 },
  { top: "42%", left: "5%", size: 10, rotate: 15, delay: 0.4 },
  { top: "65%", right: "8%", size: 14, rotate: -40, delay: 0.1 },
  { top: "78%", left: "22%", size: 8, rotate: 20, delay: 0.3 },
  { top: "30%", right: "30%", size: 6, rotate: -10, delay: 0.5 },
];

export function PetalBurst({ count = 6, className }: Props) {
  const petals = POSITIONS.slice(0, count);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: p.delay, duration: 0.8 }}
        >
          <motion.svg
            width={p.size}
            height={p.size}
            viewBox="0 0 16 16"
            style={{ transform: `rotate(${p.rotate}deg)` }}
            animate={{ rotate: [p.rotate, p.rotate + 8, p.rotate] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M8 2 C 11 4, 12 8, 8 14 C 4 8, 5 4, 8 2 Z"
              fill="rgb(var(--c-primary) / 0.35)"
            />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
}