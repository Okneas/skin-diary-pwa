// src/utils/storage.ts
const STORAGE_BASE = "/storage";

export function getFullStorageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("/")) {
    return path;
  }
  return `${STORAGE_BASE}/${path}`;
}