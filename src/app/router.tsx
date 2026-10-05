import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { OnboardingRouter } from "@/features/onboarding/OnboardingRouter";
import { AuthRouter } from "@/features/auth/AuthRouter";
import DashboardPage from "@/pages/DashboardPage";
import DiaryPage from "@/pages/DiaryPage";
import DiaryEntryPage from "@/pages/DiaryEntryPage";
import AnalysisPage from "@/pages/AnalysisPage";
import PassportPage from "@/pages/PassportPage";
import ProfilePage from "@/pages/ProfilePage";
import AnalysisResultPage from "@/pages/AnalysisResultPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductFormPage from "@/pages/ProductFormPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRouter />} />
      <Route path="/onboarding/*" element={<OnboardingRouter />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/diary/new" element={<DiaryEntryPage />} />
        <Route path="/diary/:id" element={<DiaryEntryPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/passport" element={<PassportPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/analysis/:id" element={<AnalysisResultPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductFormPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
