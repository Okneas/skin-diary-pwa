// src/pages/ProfilePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Pencil,
  LogOut,
  BookHeart,
  Camera,
  CalendarDays,
  ChevronRight,
  Shield,
  Bell,
  Save,
} from "lucide-react";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { useDiaryEntries } from "@/hooks/useDiary";
import { usePhotos } from "@/hooks/usePhotos";
import { useUpdateMe } from "@/hooks/useAuth";
import { formatDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export default function ProfilePage() {
  const navigate = useNavigate();
  const toast = useToast((s) => s.push);
  const qc = useQueryClient();

  const { user, logout } = useAuthStore();
  const resetOnboarding = useAppStore((s) => s.setOnboardingCompleted);
  const resetLastResult = useAppStore((s) => s.setLastResult);

  const { data: entries } = useDiaryEntries(1);
  const { data: photos } = usePhotos(1);
  const updateMutation = useUpdateMe();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState<string>("");
  const [confirmLogout, setConfirmLogout] = useState(false);

  const openEdit = () => {
    if (!user) return;
    setEditName(user.name);
    setEditAge(user.age != null ? String(user.age) : "");
    setEditing(true);
  };

  const saveEdit = () => {
    const payload: { name?: string; age?: number } = {};
    if (editName.trim() && editName.trim() !== user?.name) {
      payload.name = editName.trim();
    }
    const ageNum = editAge.trim() ? Number(editAge) : null;
    if (
      ageNum != null &&
      ageNum !== user?.age &&
      ageNum >= 10 &&
      ageNum <= 120
    ) {
      payload.age = ageNum;
    }
    if (Object.keys(payload).length === 0) {
      setEditing(false);
      return;
    }
    updateMutation.mutate(payload, {
      onSuccess: () => {
        toast("success", "Профиль обновлён");
        setEditing(false);
      },
      onError: () => toast("error", "Не удалось сохранить"),
    });
  };

  const handleLogout = () => {
    logout();
    resetOnboarding(false);
    resetLastResult(null);
    qc.clear();
    navigate("/auth/login", { replace: true });
  };

  if (!user) {
    return (
      <Screen title="Профиль">
        <SkeletonCard />
      </Screen>
    );
  }

  const memberSince = user.created_at ? formatDate(user.created_at) : "—";

  return (
    <Screen>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-6 pb-6 flex flex-col items-center text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center shadow-soft mb-4">
          <span className="text-3xl font-display text-ink">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h1 className="text-2xl font-display text-ink">{user.name}</h1>
        {user.age != null && (
          <p className="text-sm text-muted mt-0.5">{user.age} лет</p>
        )}
        <p className="text-xs text-muted mt-1">{user.email}</p>

        <Button
          variant="secondary"
          size="sm"
          onClick={openEdit}
          className="mt-4"
        >
          <span className="inline-flex items-center gap-2">
            <Pencil size={14} />
            Редактировать
          </span>
        </Button>
      </motion.div>

      {/* Статистика */}
      <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3 px-1">
        Статистика
      </p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        <MiniStat
          icon={BookHeart}
          value={entries?.total ?? 0}
          label="Записей"
        />
        <MiniStat icon={Camera} value={photos?.length ?? 0} label="Фото" />
        <MiniStat
          icon={CalendarDays}
          value={memberSince.split(" ")[2] ?? "—"}
          label="С нами"
        />
      </div>

      {/* Настройки */}
      <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3 px-1">
        Настройки
      </p>
      <div className="space-y-2 mb-5">
        <ThemeSwitcher />
        <SettingRow
          icon={Bell}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          title="Уведомления"
          subtitle="Скоро: напоминания о дневнике"
          onClick={() => toast("info", "Раздел в разработке")}
        />
        <SettingRow
          icon={Shield}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          title="Приватность"
          subtitle="Как мы храним ваши данные"
          onClick={() => toast("info", "Раздел в разработке")}
        />
      </div>

      {/* Выход */}
      <Button
        fullWidth
        variant="secondary"
        onClick={() => setConfirmLogout(true)}
        className="text-rose-600"
      >
        <span className="inline-flex items-center gap-2">
          <LogOut size={18} />
          Выйти из аккаунта
        </span>
      </Button>

      {/* Sheet: редактирование */}
      <Sheet
        open={editing}
        onClose={() => setEditing(false)}
        title="Редактировать профиль"
      >
        <div className="space-y-4">
          <Input
            label="Имя"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Например, Светлана"
          />
          <Input
            label="Возраст"
            type="number"
            inputMode="numeric"
            value={editAge}
            onChange={(e) => setEditAge(e.target.value)}
            placeholder="25"
            hint="От 10 до 120 лет"
          />
          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setEditing(false)}
            >
              Отмена
            </Button>
            <Button
              fullWidth
              onClick={saveEdit}
              disabled={updateMutation.isPending}
            >
              <span className="inline-flex items-center gap-2">
                <Save size={16} />
                {updateMutation.isPending ? "Сохраняем…" : "Сохранить"}
              </span>
            </Button>
          </div>
        </div>
      </Sheet>

      {/* Sheet: подтверждение выхода */}
      <Sheet
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Выйти из аккаунта?"
      >
        <p className="text-sm text-muted mb-5">
          Ваши данные сохранятся, вы сможете войти снова
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setConfirmLogout(false)}
          >
            Отмена
          </Button>
          <Button
            fullWidth
            onClick={handleLogout}
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            <span className="inline-flex items-center gap-2">
              <LogOut size={16} />
              Выйти
            </span>
          </Button>
        </div>
      </Sheet>
    </Screen>
  );
}

// ============================================================
// Компоненты
// ============================================================
function MiniStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BookHeart;
  value: number | string;
  label: string;
}) {
  return (
    <Card className="text-center py-3">
      <Icon
        size={16}
        className="text-primary mx-auto mb-1.5"
        strokeWidth={1.8}
      />
      <p className="text-lg font-display text-ink tabular-nums">{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </Card>
  );
}

function SettingRow({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  onClick,
}: {
  icon: typeof Bell;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full text-left">
      <Card className="flex items-center gap-3">
        <span
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            iconBg,
          )}
        >
          <Icon size={18} strokeWidth={1.8} className={iconColor} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink">{title}</p>
          <p className="text-xs text-muted truncate">{subtitle}</p>
        </div>
        <ChevronRight size={18} className="text-muted shrink-0" />
      </Card>
    </button>
  );
}
