import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  uploadPhoto,
  getPhotos,
  getPhoto,
  getFaceMap,
  deletePhoto,
  type UploadPhotoParams,
} from "@/api/photos";

export const usePhotos = (limit = 30) =>
  useQuery({
    queryKey: ["photos", "list", limit],
    queryFn: () => getPhotos(limit, 0),
  });

export const usePhoto = (id: number) =>
  useQuery({
    queryKey: ["photos", "photo", id],
    queryFn: () => getPhoto(id),
    enabled: !!id,
  });

export const useFaceMap = (id: number) =>
  useQuery({
    queryKey: ["photos", "face-map", id],
    queryFn: () => getFaceMap(id),
    enabled: !!id,
  });

export const useUploadPhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: UploadPhotoParams) => uploadPhoto(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["photos"] });
    },
  });
};

export const useDeletePhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePhoto(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["photos"] });
    },
  });
};