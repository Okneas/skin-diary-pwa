import apiClient from "./client";
import type { DeteriorationFactor } from "@/types";

export const getFactors = () =>
  apiClient.get<DeteriorationFactor[]>("/admin/factors").then((r) => r.data);