// components/auth/AuthGuard.tsx
"use client";

import { useAuth } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/login",
  fallback = null,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    if (requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams();
      searchParams.set("from", currentPath);
      router.push(`${redirectTo}?${searchParams.toString()}`);
      return;
    }

    if (!requireAuth && isAuthenticated) {
      // User is logged in but trying to access auth pages
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, isLoading, requireAuth, router, redirectTo]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  // Don't render children if auth requirements aren't met
  if (requireAuth && !isAuthenticated) {
    return fallback || null;
  }

  if (!requireAuth && isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Higher-order component version
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, "children"> = {}
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Hooks for conditional rendering based on auth state
export function useRequireAuth(redirectTo: string = "/login") {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams();
      searchParams.set("from", currentPath);
      router.push(`${redirectTo}?${searchParams.toString()}`);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

export function useRequireGuest(redirectTo: string = "/dashboard") {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated: !isAuthenticated, isLoading };
}
