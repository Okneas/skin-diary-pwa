import apiClient from "./client";
import type { CalculateRequest, CalculateResponse } from "@/types";

export const calculate = (data: CalculateRequest) =>
  apiClient.post<CalculateResponse>("/calculate", data).then((r) => r.data);