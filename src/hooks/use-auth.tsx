"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";
import { AuthResponse } from "@/types/auth";

// ---- Login ----
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return apiFetch<AuthResponse>(
        "https://monkey-dc6r.onrender.com/api/user/signin",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user); // ✅ matches backend
    },
  });
}

// ---- Register ----
export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: {
      user_name: string;
      user_email: string;
      password: string;
      user_number: string;
    }) => {
      return apiFetch<{ token: string; user: User }>(
        "https://monkey-dc6r.onrender.com/api/user/signup",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
}

// ---- Logout ----
export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: async () => {
      // optional: call backend logout endpoint
      return true;
    },
    onSuccess: () => {
      clearAuth();
    },
  });
}
