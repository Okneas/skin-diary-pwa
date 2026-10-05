import { create } from "zustand";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/utils/cn";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastStore {
  items: ToastItem[];
  push: (type: ToastType, message: string) => void;
  remove: (id: number) => void;
}

export const useToast = create<ToastStore>((set) => ({
  items: [],
  push: (type, message) => {
    const id = Date.now() + Math.random();
    set((s) => ({ items: [...s.items, { id, type, message }] }));
    setTimeout(() => {
      set((s) => ({ items: s.items.filter((t) => t.id !== id) }));
    }, 3500);
  },
  remove: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}));

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function ToastHost() {
  const items = useToast((s) => s.items);
  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none safe-top">
      <AnimatePresence>
        {items.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={cn(
                "pointer-events-auto px-4 py-3 rounded-2xl shadow-card max-w-md w-full",
                "flex items-center gap-3 text-sm font-medium",
                t.type === "success" &&
                  "bg-success/15 text-success border border-success/30",
                t.type === "error" &&
                  "bg-danger/15 text-danger border border-danger/30",
                t.type === "info" && "bg-surface text-ink border border-border",
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
