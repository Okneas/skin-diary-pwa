// src/hooks/useProducts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhoto,
  deleteProductPhoto,
} from "@/api/products";
import type { ProductCreateRequest, ProductUpdateRequest } from "@/types";

export const useProducts = (includeArchived = false) =>
  useQuery({
    queryKey: ["products", "list", includeArchived],
    queryFn: () => getProducts(includeArchived),
  });

export const useProduct = (id: number) =>
  useQuery({
    queryKey: ["products", "product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
      photo,
    }: {
      data: ProductCreateRequest;
      photo?: File | null;
    }) => createProduct(data, photo),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};
export const useUpdateProduct = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductUpdateRequest) => updateProduct(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useUploadProductPhoto = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadProductPhoto(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useDeleteProductPhoto = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteProductPhoto(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};
