import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/Button";
import { useOnboarding } from "../onboardingStore";
import { useGenes } from "@/hooks/useReferenceData";
import { cn } from "@/utils/cn";

export function GenotypeStep() {
  const navigate = useNavigate();
  const { genotypes, setGenotype } = useOnboarding();
  const { data, isLoading } = useGenes();
  const [openGene, setOpenGene] = useState<string | null>(null);

  const filled = data?.filter((g) => genotypes[g.name]).length ?? 0;
  const total = data?.length ?? 0;

  const openGeneObj = data?.find((g) => g.name === openGene);

  return (
    <OnboardingLayout
      step={6}
      total={8}
      title="Ваши генотипы"
      subtitle="Если у вас есть результаты ДНК-теста — выберите значения. Иначе пропустите этот шаг."
      onBack={() => navigate("/onboarding/objective")}
      footer={
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate("/onboarding/factors")}
        >
          {filled > 0 ? `Продолжить (${filled}/${total})` : "Пропустить"}
        </Button>
      }
    >
      {isLoading && (
        <div className="text-center text-muted py-10">Загрузка…</div>
      )}

      <div className="space-y-2">
        {data?.map((g) => {
          const val = genotypes[g.name];
          return (
            <button
              key={g.id}
              onClick={() => setOpenGene(g.name)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition",
                val
                  ? "bg-primary/10 border-primary"
                  : "bg-surface border-border"
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">
                  {g.name}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {val ? `Генотип: ${val}` : "Не выбрано"}
                </p>
              </div>
              <ChevronRight size={18} className="text-muted shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Bottom Sheet выбора генотипа */}
      <AnimatePresence>
        {openGeneObj && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenGene(null)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl p-5 pb-8 safe-bottom z-50 max-w-md mx-auto"
            >
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-display text-ink mb-4">
                {openGeneObj.name}
              </h3>
              <div className="space-y-2">
                {openGeneObj.genotypes.map((gt) => {
                  const active = genotypes[openGeneObj.name] === gt;
                  return (
                    <button
                      key={gt}
                      onClick={() => {
                        setGenotype(openGeneObj.name, gt);
                        setOpenGene(null);
                      }}
                      className={cn(
                        "w-full p-3.5 rounded-2xl border text-left font-mono transition",
                        active
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-canvas border-border text-ink"
                      )}
                    >
                      {gt}
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    setGenotype(openGeneObj.name, "");
                    setOpenGene(null);
                  }}
                  className="w-full p-3.5 text-muted text-sm"
                >
                  Очистить
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </OnboardingLayout>
  );
}