import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  role: "user" | "admin" | "cashier" | null;
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

      // ✅ store role from API response - check is_cashier first, then is_admin/role
      setAuth: (token, user) => {
        let role: "user" | "admin" | "cashier" = "user";
        
        // Check is_cashier flag first (from user.ts User type)
        if ((user as any).is_cashier === true) {
          role = "cashier";
        } else if (user.role === "admin" || (user as any).is_admin === true) {
          role = "admin";
        }
        
        set({
          token,
          user,
          isAuthenticated: true,
          role,
        });
      },

      setRole: (role) =>
        set({
          role: role === "admin" ? "admin" : role === "cashier" ? "cashier" : "user",
        }),

      clearAuth: () =>
        set({ token: null, user: null, isAuthenticated: false, role: null }),
    }),
    { name: "auth-storage" }
  )
);
