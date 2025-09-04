// components/providers/AuthProvider.tsx
"use client";

import { useInitializeAuth } from "@/hooks/use-auth";
import { useAuth } from "@/store/auth-store";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auth state from localStorage and JWT token
  useInitializeAuth();

  const { isLoading } = useAuth();

  // Show loading spinner during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Alternative: Minimal provider that doesn't show loading screen
export function MinimalAuthProvider({ children }: AuthProviderProps) {
  useInitializeAuth();

  return <>{children}</>;
}
