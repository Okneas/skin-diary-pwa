import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/Button";
import { useOnboarding } from "../onboardingStore";
import { useFactors } from "@/hooks/useReferenceData";
import { cn } from "@/utils/cn";

export function FactorsStep() {
  const navigate = useNavigate();
  const { factorIds, toggleFactor } = useOnboarding();
  const { data, isLoading } = useFactors();

  return (
    <OnboardingLayout
      step={7}
      total={8}
      title="Факторы влияния"
      subtitle="Отметьте всё, что относится к вам — это уточнит прогноз"
      onBack={() => navigate("/onboarding/genotypes")}
      footer={
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate("/onboarding/result")}
        >
          {factorIds.length > 0
            ? `Рассчитать (${factorIds.length})`
            : "Рассчитать"}
        </Button>
      }
    >
      {isLoading && (
        <div className="text-center text-muted py-10">Загрузка…</div>
      )}

      <div className="flex flex-wrap gap-2">
        {data?.map((f) => {
          const active = factorIds.includes(f.id);
          return (
            <button
              key={f.id}
              onClick={() => toggleFactor(f.id)}
              className={cn(
                "px-4 py-2.5 rounded-full text-sm font-medium border transition",
                active
                  ? "bg-primary text-white border-primary shadow-soft"
                  : "bg-surface text-ink border-border"
              )}
            >
              {f.name}
            </button>
          );
        })}
      </div>
    </OnboardingLayout>
  );
}