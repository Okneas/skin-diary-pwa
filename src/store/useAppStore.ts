import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalculateResponse } from "@/types";

interface AppState {
  onboardingCompleted: boolean;
  setOnboardingCompleted: (v: boolean) => void;

  userName: string;
  setUserName: (v: string) => void;

  userAge: number | null;
  setUserAge: (v: number | null) => void;

  lastResult: CalculateResponse | null;
  setLastResult: (r: CalculateResponse | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboardingCompleted: false,
      setOnboardingCompleted: (v) => set({ onboardingCompleted: v }),

      userName: "",
      setUserName: (v) => set({ userName: v }),

      userAge: null,
      setUserAge: (v) => set({ userAge: v }),

      lastResult: null,
      setLastResult: (r) => set({ lastResult: r }),
    }),
    { name: "app-store" }
  )
);