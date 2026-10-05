// src/components/layout/TabBar.tsx
import { NavLink } from "react-router-dom";
import { Home, BookHeart, Sparkles, Package, IdCard, User } from "lucide-react";
import { cn } from "@/utils/cn";

const tabs = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/diary", label: "Дневник", icon: BookHeart },
  { to: "/products", label: "Средства", icon: Package },
  { to: "/analysis", label: "Анализ", icon: Sparkles },
  { to: "/passport", label: "Паспорт", icon: IdCard },
  { to: "/profile", label: "Профиль", icon: User },
];

export function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur border-t border-border safe-bottom z-40">
      <ul className="flex justify-around items-center h-16 max-w-md mx-auto px-1">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] transition leading-tight",
                  isActive ? "text-primary" : "text-muted"
                )
              }
            >
              <Icon size={20} strokeWidth={2} />
              <span className="truncate max-w-full">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}