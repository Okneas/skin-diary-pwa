import apiClient from "./client";
import type {
  PhotoUploadResponse,
  PhotoOut,
  FaceMapResponse,
  QualityGateResult,
} from "@/types";

export interface UploadPhotoParams {
  file: File;
  landmarks: number[][];
  quality: QualityGateResult;
}

export const uploadPhoto = async ({ file, landmarks, quality }: UploadPhotoParams) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("landmarks", JSON.stringify(landmarks));
  formData.append("quality_score", String(quality.score));
  formData.append("quality_flags", JSON.stringify(quality.flags));

  const { data } = await apiClient.post<PhotoUploadResponse>("/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getPhotos = (limit = 30, offset = 0) =>
  apiClient
    .get<PhotoUploadResponse[]>("/photos", { params: { limit, offset } })
    .then((r) => r.data);

export const getPhoto = (id: number) =>
  apiClient.get<PhotoOut>(`/photos/${id}`).then((r) => r.data);

export const getFaceMap = (id: number) =>
  apiClient.get<FaceMapResponse>(`/photos/${id}/face-map`).then((r) => r.data);

export const deletePhoto = (id: number) =>
  apiClient.delete(`/photos/${id}`);