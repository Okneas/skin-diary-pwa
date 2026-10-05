import apiClient from "./client";

export interface User {
  id: number;
  email: string;
  name: string;
  age: number | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  age?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const register = (data: RegisterPayload) =>
  apiClient.post<AuthResponse>("/auth/register", data).then((r) => r.data);

export const login = (data: LoginPayload) =>
  apiClient.post<AuthResponse>("/auth/login", data).then((r) => r.data);

export const getMe = () =>
  apiClient.get<User>("/auth/me").then((r) => r.data);

export const updateMe = (data: { name?: string; age?: number }) =>
  apiClient.patch<User>("/auth/me", data).then((r) => r.data);