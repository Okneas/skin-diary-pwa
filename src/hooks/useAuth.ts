import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login,
  register,
  getMe,
  updateMe,
  type LoginPayload,
  type RegisterPayload,
} from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: RegisterPayload) => register(data),
    onSuccess: (res) => setAuth(res.access_token, res.user),
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: (res) => setAuth(res.access_token, res.user),
  });
};

export const useMe = () => {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await getMe();
      setUser(user);
      return user;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateMe = () => {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      setUser(user);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
};