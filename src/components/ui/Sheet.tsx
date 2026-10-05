import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Sheet({ open, onClose, title, children, className }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto",
              "bg-surface rounded-t-3xl p-5 pb-8 safe-bottom",
              "max-h-[85vh] overflow-y-auto no-scrollbar",
              className
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-1 bg-border rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              {title && (
                <h3 className="text-lg font-display text-ink mt-2">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="ml-auto w-8 h-8 rounded-full bg-canvas flex items-center justify-center text-muted"
                aria-label="Закрыть"
              >
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}