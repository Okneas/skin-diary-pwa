import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createDiaryEntry,
  getDiaryEntries,
  getDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  getDiaryTrends,
} from "@/api/diary";
import type { DiaryEntryCreateRequest, DiaryEntryUpdateRequest } from "@/types";

export const useDiaryEntries = (limit = 30) =>
  useQuery({
    queryKey: ["diary", "list", limit],
    queryFn: () => getDiaryEntries(limit, 0),
  });

export const useDiaryInfinite = (limit = 30) =>
  useInfiniteQuery({
    queryKey: ["diary", "infinite", limit],
    queryFn: ({ pageParam = 0 }) => getDiaryEntries(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((s, p) => s + p.items.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
    initialPageParam: 0,
  });

export const useDiaryEntry = (id: number) =>
  useQuery({
    queryKey: ["diary", "entry", id],
    queryFn: () => getDiaryEntry(id),
    enabled: !!id,
  });

export const useDiaryTrends = (fromDate?: string, toDate?: string) =>
  useQuery({
    queryKey: ["diary", "trends", fromDate, toDate],
    queryFn: () => getDiaryTrends(fromDate, toDate),
  });

export const useCreateDiaryEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DiaryEntryCreateRequest) => createDiaryEntry(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["diary"] });
    },
  });
};

export const useUpdateDiaryEntry = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DiaryEntryUpdateRequest) => updateDiaryEntry(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["diary"] });
    },
  });
};

export const useDeleteDiaryEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDiaryEntry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["diary"] });
    },
  });
};