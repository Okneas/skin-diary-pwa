// src/api/products.ts
import apiClient from "./client";
import type {
  ProductOut,
  ProductListResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
} from "@/types";

export const getProducts = (includeArchived = false) =>
  apiClient
    .get<ProductListResponse>("/products", {
      params: { include_archived: includeArchived },
    })
    .then((r) => r.data);

export const getProduct = (id: number) =>
  apiClient.get<ProductOut>(`/products/${id}`).then((r) => r.data);

export const createProduct = (data: ProductCreateRequest, photo?: File | null) => {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.brand) formData.append("brand", data.brand);
  if (data.category) formData.append("category", data.category);
  if (data.description) formData.append("description", data.description);
  if (photo) formData.append("photo", photo);

  return apiClient
    .post<ProductOut>("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const updateProduct = (id: number, data: ProductUpdateRequest) =>
  apiClient.patch<ProductOut>(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: number) =>
  apiClient.delete(`/products/${id}`);

export const uploadProductPhoto = (id: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient
    .post<ProductOut>(`/products/${id}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const deleteProductPhoto = (id: number) =>
  apiClient.delete<ProductOut>(`/products/${id}/photo`).then((r) => r.data);