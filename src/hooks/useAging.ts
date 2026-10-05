import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateAgedFaces,
  getAgedResults,
  deleteAgedResult,
} from "@/api/aging";
import type { AgingGenerateRequest } from "@/types";

export const useAgedResults = (photoId: number) =>
  useQuery({
    queryKey: ["aging", "results", photoId],
    queryFn: () => getAgedResults(photoId),
    enabled: !!photoId,
  });

export const useGenerateAged = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AgingGenerateRequest) => generateAgedFaces(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["aging", "results", variables.photo_id] });
    },
  });
};

export const useDeleteAged = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (agedId: number) => deleteAgedResult(agedId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["aging"] });
    },
  });
};