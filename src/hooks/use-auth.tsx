// hooks/use-auth.tsx
"use client";

import { fetcher, FetchError } from "@/lib/fetcher";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";

interface AuthContextType {
  user: User | null;
  csrfToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Context Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth"],
    queryFn: async (): Promise<AuthResponse> => {
      try {
        return await fetcher<AuthResponse>("/auth/me");
      } catch (error) {
        if (error instanceof FetchError && error.status === 401) {
          // Try to refresh the session
          return await fetcher<AuthResponse>("/auth/refresh", {
            method: "POST",
            requiresAuth: false,
          });
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error instanceof FetchError && error.status === 401) {
        return false; // Don't retry on 401
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const value: AuthContextType = {
    user: authData?.user || null,
    csrfToken: authData?.csrfToken || null,
    isLoading,
    isAuthenticated: !!authData?.user,
    error: error as Error | null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Login Hook
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      return fetcher<AuthResponse>("/user/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        requiresAuth: false,
      });
    },
    onSuccess: (data) => {
      // Update auth cache
      queryClient.setQueryData(["auth"], data);

      // Invalidate and refetch any protected data
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] !== "auth";
        },
      });

      // Redirect to intended page or dashboard
      const searchParams = new URLSearchParams(window.location.search);
      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

// Logout Hook
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { csrfToken } = useAuth();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (!csrfToken) {
        throw new Error("No CSRF token available");
      }

      await fetcher<void>("/user/logout", {
        method: "POST",
        csrfToken,
      });
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();

      // Redirect to login
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Even if logout fails, clear local state
      queryClient.clear();
      router.push("/login");
    },
  });
}

// Register Hook
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (userData: RegisterRequest): Promise<AuthResponse> => {
      return fetcher<AuthResponse>("/user/signup", {
        method: "POST",
        body: JSON.stringify(userData),
        requiresAuth: false,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth"], data);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
}
