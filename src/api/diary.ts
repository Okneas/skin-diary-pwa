import apiClient from "./client";
import type {
  DiaryEntryCreateRequest,
  DiaryEntryUpdateRequest,
  DiaryEntryOut,
  DiaryEntryListResponse,
  DiaryTrendsResponse,
} from "@/types";

export const createDiaryEntry = (data: DiaryEntryCreateRequest) =>
  apiClient.post<DiaryEntryOut>("/diary", data).then((r) => r.data);

export const getDiaryEntries = (limit = 30, offset = 0) =>
  apiClient
    .get<DiaryEntryListResponse>("/diary", { params: { limit, offset } })
    .then((r) => r.data);

export const getDiaryEntry = (id: number) =>
  apiClient.get<DiaryEntryOut>(`/diary/${id}`).then((r) => r.data);

export const updateDiaryEntry = (id: number, data: DiaryEntryUpdateRequest) =>
  apiClient.patch<DiaryEntryOut>(`/diary/${id}`, data).then((r) => r.data);

export const deleteDiaryEntry = (id: number) =>
  apiClient.delete(`/diary/${id}`);

export const getDiaryTrends = (fromDate?: string, toDate?: string) =>
  apiClient
    .get<DiaryTrendsResponse>("/diary/trends", {
      params: {
        ...(fromDate ? { from_date: fromDate } : {}),
        ...(toDate ? { to_date: toDate } : {}),
      },
    })
    .then((r) => r.data);