import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Button } from "@/components/ui/Button";
import { useRegister } from "@/hooks/useAuth";
import { HeroCard } from "@/components/decor/HeroCard";

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const registerMutation = useRegister();

  const canSubmit =
    name.trim().length >= 2 && email.includes("@") && password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          // После регистрации сразу в онбординг — расчёт привяжется к юзеру
          navigate("/onboarding/welcome", { replace: true });
        },
      },
    );
  };

  return (
    <AuthLayout
      title="Создать аккаунт"
      subtitle="Это займёт полминуты"
      footer={
        <p className="text-sm text-muted">
          Уже есть аккаунт?{" "}
          <Link to="/auth/login" className="text-primary font-medium">
            Войти
          </Link>
        </p>
      }
    >
      <HeroCard padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted mb-2 block">Имя</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Светлана"
              autoComplete="name"
              className="w-full px-4 py-3.5 rounded-2xl bg-surface border border-border text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-sm text-muted mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3.5 rounded-2xl bg-surface border border-border text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-sm text-muted mb-2 block">
              Пароль <span className="text-xs">(минимум 8 символов)</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-surface border border-border text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {registerMutation.isError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>
                {(registerMutation.error as any)?.response?.data?.detail ??
                  "Не удалось создать аккаунт."}
              </span>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={!canSubmit || registerMutation.isPending}
            className="mt-2"
          >
            <span className="inline-flex items-center gap-2">
              {registerMutation.isPending ? "Создаём…" : "Создать аккаунт"}
              <ArrowRight size={18} />
            </span>
          </Button>
        </form>
      </HeroCard>
    </AuthLayout>
  );
}
