import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { calculate } from "@/api/calculate";
import { useOnboarding } from "../onboardingStore";
import { useAppStore } from "@/store/useAppStore";
import type { CalculateResponse } from "@/types";

export function ResultStep() {
  const navigate = useNavigate();
  const draft = useOnboarding();
  const { setOnboardingCompleted, setUserName, setUserAge, setLastResult } =
    useAppStore();

  const mutation = useMutation<CalculateResponse, Error>({
    mutationFn: () =>
      calculate({
        subjective_feature_ids: draft.subjectiveIds,
        objective_scores: Object.entries(draft.objectiveScores).map(
          ([code, score]) => ({ code, score }),
        ),
        user_genotypes: Object.fromEntries(
          Object.entries(draft.genotypes).filter(([, v]) => v),
        ),
        active_factor_ids:
          draft.factorIds.length > 0 ? draft.factorIds : undefined,
      }),
  });

  useEffect(() => {
    mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      const result = mutation.data;
      setOnboardingCompleted(true);
      setUserName(draft.name);
      setUserAge(draft.age);
      setLastResult(result);

      const t = setTimeout(() => {
        navigate("/passport", { replace: true });
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [
    mutation.isSuccess,
    mutation.data,
    navigate,
    draft.name,
    draft.age,
    setOnboardingCompleted,
    setUserName,
    setUserAge,
    setLastResult,
  ]);

  useEffect(() => {
    if (mutation.isError) {
      navigate("/onboarding/factors", { replace: true });
    }
  }, [mutation.isError, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-welcome-rose px-8 safe-top safe-bottom">
      {/* Иконка с анимацией */}
      <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-rose-300 blur-2xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-28 h-28 rounded-full bg-white/90 backdrop-blur shadow-soft flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={52} strokeWidth={1.5} className="text-rose-500" />
          </motion.div>
        </motion.div>
      </div>

      <h1 className="text-2xl font-display text-ink text-center mb-3">
        Собираем ваш паспорт кожи…
      </h1>
      <p className="text-sm text-muted text-center max-w-xs">
        Анализируем генетику, признаки и факторы. Это займёт пару секунд
      </p>

      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="w-2.5 h-2.5 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  );
}
