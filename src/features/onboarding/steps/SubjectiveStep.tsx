import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/Button";
import { useOnboarding } from "../onboardingStore";
import { useSubjectiveFeatures } from "@/hooks/useReferenceData";
import { cn } from "@/utils/cn";

export function SubjectiveStep() {
  const navigate = useNavigate();
  const { subjectiveIds, toggleSubjective } = useOnboarding();
  const { data, isLoading } = useSubjectiveFeatures();

  const canContinue = (subjectiveIds.length ?? 0) > 0;

  return (
    <OnboardingLayout
      step={4}
      total={8}
      title="Расскажите о своей коже"
      subtitle="Отметьте всё, что вам подходит"
      onBack={() => navigate("/onboarding/goal")}
      footer={
        <Button
          fullWidth
          size="lg"
          disabled={!canContinue}
          onClick={() => navigate("/onboarding/objective")}
        >
          Продолжить ({subjectiveIds.length})
        </Button>
      }
    >
      {isLoading && (
        <div className="text-center text-muted py-10">Загрузка…</div>
      )}

      <div className="space-y-2">
        {data?.map((f) => {
          const active = subjectiveIds.includes(f.id);
          return (
            <button
              key={f.id}
              onClick={() => toggleSubjective(f.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition",
                active
                  ? "bg-primary/10 border-primary"
                  : "bg-surface border-border"
              )}
            >
              <span
                className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center text-white text-xs transition",
                  active
                    ? "bg-primary border-primary"
                    : "border-border"
                )}
              >
                {active && "✓"}
              </span>
              <span className="text-sm text-ink leading-snug">
                {f.description}
              </span>
            </button>
          );
        })}
      </div>
    </OnboardingLayout>
  );
}