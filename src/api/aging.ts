import apiClient from "./client";
import type {
  AgingGenerateRequest,
  AgingGenerateResponse,
  AgedPhotoOut,
} from "@/types";

export const generateAgedFaces = (data: AgingGenerateRequest) =>
  apiClient
    .post<AgingGenerateResponse>("/aging/generate", data, { timeout: 180_000 })
    .then((r) => r.data);

export const getAgedResults = (photoId: number) =>
  apiClient
    .get<AgedPhotoOut[]>(`/aging/results/${photoId}`)
    .then((r) => r.data);

export const deleteAgedResult = (agedId: number) =>
  apiClient.delete(`/aging/results/${agedId}`);