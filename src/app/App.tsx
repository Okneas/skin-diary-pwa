// src/app/App.tsx
import { AppProviders } from "./providers";
import { AppRouter } from "./router";
import { ToastHost } from "@/components/ui/Toast";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";
import { OfflineBadge } from "@/components/pwa/OfflineBadge";
import { useThemeInit } from "@/hooks/useTheme";
import { SplashScreen } from "@/components/brand/SplashScreen";

function ThemeBootstrap({ children }: { children: React.ReactNode }) {
  useThemeInit();
  return <>{children}</>;
}

export default function App() {
  return (
    <AppProviders>
      <ThemeBootstrap>
        <OfflineBadge />
        <UpdatePrompt />
        <ToastHost />
        <AppRouter />
        <InstallPrompt />
        <SplashScreen />
      </ThemeBootstrap>
    </AppProviders>
  );
}