// src/components/pwa/UpdatePrompt.tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export function UpdatePrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("pwa:need-refresh", handler);
    return () => window.removeEventListener("pwa:need-refresh", handler);
  }, []);

  const update = () => {
    const fn = (window as unknown as { __pwaUpdate?: () => void }).__pwaUpdate;
    fn?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-4 left-3 right-3 z-[100] max-w-md mx-auto safe-top"
        >
          <div className="bg-brand-ink text-white rounded-2xl shadow-soft p-3 flex items-center gap-3">
            <RefreshCw size={18} className="shrink-0" />
            <p className="text-sm flex-1">Доступна новая версия</p>
            <button
              onClick={update}
              className="px-3 py-1.5 rounded-xl bg-white/15 text-sm font-medium"
            >
              Обновить
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}