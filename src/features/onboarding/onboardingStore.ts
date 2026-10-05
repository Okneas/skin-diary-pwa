import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  name: string;
  age: number | null;
  goal: string | null;

  subjectiveIds: number[];
  objectiveScores: Record<string, number>;
  genotypes: Record<string, string>;
  factorIds: number[];

  setName: (v: string) => void;
  setAge: (v: number | null) => void;
  setGoal: (v: string) => void;
  toggleSubjective: (id: number) => void;
  setObjective: (code: string, score: number) => void;
  setGenotype: (gene: string, gt: string) => void;
  toggleFactor: (id: number) => void;
  reset: () => void;
}

const initial = {
  name: "",
  age: null as number | null,
  goal: null as string | null,
  subjectiveIds: [] as number[],
  objectiveScores: {} as Record<string, number>,
  genotypes: {} as Record<string, string>,
  factorIds: [] as number[],
};

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initial,
      setName: (v) => set({ name: v }),
      setAge: (v) => set({ age: v }),
      setGoal: (v) => set({ goal: v }),
      toggleSubjective: (id) =>
        set((s) => ({
          subjectiveIds: s.subjectiveIds.includes(id)
            ? s.subjectiveIds.filter((x) => x !== id)
            : [...s.subjectiveIds, id],
        })),
      setObjective: (code, score) =>
        set((s) => ({
          objectiveScores: { ...s.objectiveScores, [code]: score },
        })),
      setGenotype: (gene, gt) =>
        set((s) => ({ genotypes: { ...s.genotypes, [gene]: gt } })),
      toggleFactor: (id) =>
        set((s) => ({
          factorIds: s.factorIds.includes(id)
            ? s.factorIds.filter((x) => x !== id)
            : [...s.factorIds, id],
        })),
      reset: () => set(initial),
    }),
    { name: "onboarding-draft" }
  )
);