import { useAuthStore } from "@/store/auth-store";
import type { User } from "@/types/user";

export function useUser(): {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
} {
  const { user, token, isAuthenticated } = useAuthStore();
  return { user, token, isAuthenticated };
}

