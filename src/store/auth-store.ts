import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  role: "user" | "admin" | null;
  setAuth: (token: string, user: User) => void;
  setRole: (role: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      role: null,
      setAuth: (token, user) =>
      set({ token, user, isAuthenticated: true }), 
      setRole: (role) => set({ role: role === "admin" ? "admin" : "user" }),

      clearAuth: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" } 
  )
);
