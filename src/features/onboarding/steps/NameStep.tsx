import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/Button";
import { useOnboarding } from "../onboardingStore";

export function NameStep() {
  const navigate = useNavigate();
  const { name, age, setName, setAge } = useOnboarding();
  const valid = name.trim().length >= 2;

  return (
    <OnboardingLayout
      step={2}
      total={8}
      title="Как вас зовут?"
      subtitle="Это поможет сделать рекомендации персональными"
      onBack={() => navigate("/onboarding/welcome")}
      footer={
        <Button
          fullWidth
          size="lg"
          disabled={!valid}
          onClick={() => navigate("/onboarding/goal")}
        >
          Продолжить
        </Button>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm text-muted mb-2 block">Имя</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, Светлана"
            autoFocus
            className="w-full px-4 py-4 text-lg rounded-2xl bg-surface border border-border text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label className="text-sm text-muted mb-2 block">
            Возраст (необязательно)
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={age ?? ""}
            onChange={(e) => {
              const v = e.target.value === "" ? null : Number(e.target.value);
              setAge(v && v > 0 && v < 120 ? v : null);
            }}
            placeholder="25"
            className="w-full px-4 py-4 text-lg rounded-2xl bg-surface border border-border text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>
    </OnboardingLayout>
  );
}