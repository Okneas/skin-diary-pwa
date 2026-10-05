// src/components/brand/SplashScreen.tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "./LogoMark";
import { LogoWordmark } from "./LogoWordmark";
import { Blob, PetalBurst } from "@/components/decor";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] bg-canvas flex flex-col items-center justify-center overflow-hidden"
        >
          <Blob
            variant="primary"
            className="-top-24 -left-24"
            size={360}
            opacity={0.5}
          />
          <Blob
            variant="accent"
            className="-bottom-24 -right-24"
            size={320}
            opacity={0.4}
          />
          <PetalBurst count={5} />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <LogoMark size={80} />
            <LogoWordmark className="mt-8" />
          </motion.div>

          {/* Точки-индикаторы загрузки внизу */}
          <div className="absolute bottom-16 flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}