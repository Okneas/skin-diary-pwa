import { Routes, Route, Navigate } from "react-router-dom";
import { WelcomeStep } from "./steps/WelcomeStep";
import { NameStep } from "./steps/NameStep";
import { GoalStep } from "./steps/GoalStep";
import { SubjectiveStep } from "./steps/SubjectiveStep";
import { ObjectiveStep } from "./steps/ObjectiveStep";
import { GenotypeStep } from "./steps/GenotypeStep";
import { FactorsStep } from "./steps/FactorsStep";
import { ResultStep } from "./steps/ResultStep";

export function OnboardingRouter() {
  return (
    <Routes>
      <Route path="welcome" element={<WelcomeStep />} />
      <Route path="name" element={<NameStep />} />
      <Route path="goal" element={<GoalStep />} />
      <Route path="subjective" element={<SubjectiveStep />} />
      <Route path="objective" element={<ObjectiveStep />} />
      <Route path="genotypes" element={<GenotypeStep />} />
      <Route path="factors" element={<FactorsStep />} />
      <Route path="result" element={<ResultStep />} />
      <Route path="*" element={<Navigate to="welcome" replace />} />
    </Routes>
  );
}