// src/features/aging/AgingProgress.tsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const STAGES = [
  "Анализируем черты лица…",
  "Применяем возрастные изменения…",
  "Синхронизируем текстуру кожи…",
  "Почти готово…",
];

export function AgingProgress({ stageIndex = 0 }: { stageIndex?: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-rose-300 blur-2xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="relative w-24 h-24 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={36} strokeWidth={1.5} className="text-primary" />
          </motion.div>
        </motion.div>
      </div>

      <h2 className="text-xl font-display text-ink mb-2">
        Компьютерная модель старит ваше лицо
      </h2>
      <p className="text-sm text-muted mb-6 max-w-xs">
        Это займёт 15–60 секунд. Не закрывайте приложение
      </p>

      <div className="space-y-2 w-full max-w-xs">
        {STAGES.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 text-xs transition-opacity ${
              i <= stageIndex ? "opacity-100" : "opacity-30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                i < stageIndex
                  ? "bg-emerald-500"
                  : i === stageIndex
                  ? "bg-primary animate-pulse"
                  : "bg-border"
              }`}
            />
            <span className="text-muted">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}