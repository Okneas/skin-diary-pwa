import { useNavigate } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/Button";
import { useOnboarding } from "../onboardingStore";
import { useObjectiveFeatures } from "@/hooks/useReferenceData";

export function ObjectiveStep() {
  const navigate = useNavigate();
  const { objectiveScores, setObjective } = useOnboarding();
  const { data, isLoading } = useObjectiveFeatures();

  return (
    <OnboardingLayout
      step={5}
      total={8}
      title="Осмотр кожи"
      subtitle="Оцените выраженность признаков от 0 до максимума"
      onBack={() => navigate("/onboarding/subjective")}
      footer={
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate("/onboarding/genotypes")}
        >
          Продолжить
        </Button>
      }
    >
      {isLoading && (
        <div className="text-center text-muted py-10">Загрузка…</div>
      )}

      <div className="space-y-3">
        {data?.map((f) => {
          const value = objectiveScores[f.code] ?? 0;
          return (
            <div
              key={f.id}
              className="bg-surface rounded-2xl border border-border p-4"
            >
              <div className="flex items-start gap-2 mb-3">
                <span className="text-xs font-mono text-muted">
                  {f.code}
                </span>
                <p className="text-sm text-ink leading-snug flex-1">
                  {f.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setObjective(f.code, Math.max(0, value - 1))
                  }
                  disabled={value <= 0}
                  className="w-10 h-10 rounded-full bg-canvas border border-border flex items-center justify-center disabled:opacity-40 active:scale-95 transition"
                >
                  <Minus size={18} />
                </button>

                <div className="flex-1 flex gap-1 justify-center">
                  {Array.from({ length: f.max_score + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setObjective(f.code, i)}
                      className={`h-2.5 flex-1 rounded-full transition ${
                        i <= value ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setObjective(f.code, Math.min(f.max_score, value + 1))
                  }
                  disabled={value >= f.max_score}
                  className="w-10 h-10 rounded-full bg-canvas border border-border flex items-center justify-center disabled:opacity-40 active:scale-95 transition"
                >
                  <Plus size={18} />
                </button>
              </div>

              <p className="text-center text-xs text-muted mt-2">
                {value} / {f.max_score}
              </p>
            </div>
          );
        })}
      </div>
    </OnboardingLayout>
  );
}