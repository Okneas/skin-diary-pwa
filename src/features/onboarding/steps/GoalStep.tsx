import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/Button";
import { useOnboarding } from "../onboardingStore";
import { goalOptions } from "../onboardingData";
import { cn } from "@/utils/cn";

export function GoalStep() {
  const navigate = useNavigate();
  const { goal, setGoal } = useOnboarding();

  return (
    <OnboardingLayout
      step={3}
      total={8}
      title="Какова ваша главная цель?"
      subtitle="Мы адаптируем рекомендации под ваш запрос"
      onBack={() => navigate("/onboarding/name")}
      footer={
        <Button
          fullWidth
          size="lg"
          disabled={!goal}
          onClick={() => navigate("/onboarding/subjective")}
        >
          Продолжить
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-3">
        {goalOptions.map((g) => {
          const Icon = g.icon;
          const active = goal === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border text-left transition",
                active
                  ? "bg-primary/10 border-primary shadow-soft"
                  : "bg-surface border-border"
              )}
            >
              <span
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center shrink-0",
                  g.iconBg
                )}
              >
                <Icon size={22} strokeWidth={1.8} className={g.iconColor} />
              </span>
              <span
                className={cn(
                  "font-medium flex-1",
                  active ? "text-primary" : "text-ink"
                )}
              >
                {g.label}
              </span>
              <span
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition",
                  active
                    ? "bg-primary text-white"
                    : "border-2 border-border"
                )}
              >
                {active && <Check size={12} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </OnboardingLayout>
  );
}