// src/components/pwa/InstallPrompt.tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X, Share } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const DISMISS_KEY = "pwa-install-dismissed";
const DISMISS_TTL = 1000 * 60 * 60 * 24 * 7; // 7 дней

export function InstallPrompt() {
  const { canInstall, promptInstall, isInstalled, isIOS } = usePWAInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isInstalled) return;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - Number(dismissed) < DISMISS_TTL) return;
    if (canInstall || isIOS) {
      const t = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(t);
    }
  }, [canInstall, isIOS, isInstalled]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    await promptInstall();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed bottom-20 left-3 right-3 z-40 max-w-md mx-auto safe-bottom"
        >
          <div className="bg-surface rounded-2xl shadow-soft border border-border p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Download size={18} className="text-ink" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">
                Добавить на главный экран
              </p>
              {isIOS ? (
                <p className="text-xs text-muted mt-1 leading-snug">
                  Нажмите <Share size={11} className="inline mx-0.5" /> и выберите
                  «На экран “Домой”»
                </p>
              ) : (
                <p className="text-xs text-muted mt-1 leading-snug">
                  Быстрый доступ и работа офлайн
                </p>
              )}
              {canInstall && (
                <Button size="sm" onClick={install} className="mt-3">
                  Установить
                </Button>
              )}
            </div>
            <button
              onClick={dismiss}
              aria-label="Закрыть"
              className="w-7 h-7 rounded-full bg-canvas flex items-center justify-center shrink-0"
            >
              <X size={14} className="text-muted" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}