"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { apiFetch } from "@/lib/api";

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: async (data: { user_email: string; password: string }) => {
      return apiFetch("https://monkey-dc6r.onrender.com/api/user/signin", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setToken(data.token); // save token
    },
  });
}

export function useRegister() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: async (data: {
      user_email: string;
      password: string;
      user_name: string;
      user_number: string;
    }) => {
      return apiFetch("https://monkey-dc6r.onrender.com/api/user/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setToken(data.token); // save token
    },
  });
}

export function useLogout() {
  const clearToken = useAuthStore((s) => s.clearToken);

  return useMutation({
    mutationFn: async () => {
      // optional: call backend logout
      return true;
    },
    onSuccess: () => {
      clearToken();
    },
  });
}
