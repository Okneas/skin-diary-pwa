import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/hooks/useAuth";
import { HeroCard } from "@/components/decor/HeroCard";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const loginMutation = useLogin();

  const canSubmit = email.includes("@") && password.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => navigate("/passport", { replace: true }),
      },
    );
  };

  return (
    <AuthLayout
      title="С возвращением"
      subtitle="Войдите, чтобы продолжить наблюдение за кожей"
      footer={
        <p className="text-sm text-muted">
          Нет аккаунта?{" "}
          <Link to="/auth/register" className="text-primary font-medium">
            Зарегистрироваться
          </Link>
        </p>
      }
    >
      <HeroCard padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="text-sm text-muted mb-2 block">Пароль</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
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

          {loginMutation.isError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>
                {(loginMutation.error as any)?.response?.data?.detail ??
                  "Не удалось войти. Проверьте данные."}
              </span>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={!canSubmit || loginMutation.isPending}
            className="mt-2"
          >
            <span className="inline-flex items-center gap-2 text-ink">
              {loginMutation.isPending ? "Входим…" : "Войти"}
              <ArrowRight size={18} />
            </span>
          </Button>
        </form>
      </HeroCard>
    </AuthLayout>
  );
}
