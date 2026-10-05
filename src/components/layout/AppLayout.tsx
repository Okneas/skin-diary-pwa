import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { TabBar } from "./TabBar";
import { PageTransition } from "./PageTransition";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";

export function AppLayout() {
  const { onboardingCompleted } = useAppStore();
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  if (!token) return <Navigate to="/auth/login" replace />;
  if (!onboardingCompleted)
    return <Navigate to="/onboarding/welcome" replace />;

  const hideTabBar =
    location.pathname === "/diary/new" ||
    location.pathname === "/products/new" ||
    /^\/products\/\d+$/.test(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </div>
      {!hideTabBar && <TabBar />}
    </div>
  );
}
