"use client";

import { useAuthStore } from "@/store/auth-store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Select auth state
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  // Define public paths
  const publicPaths = ["/login", "/sign-up"];
  const isPublicPath = publicPaths.includes(pathname);
  const isAdmin = role === "admin";

  useEffect(() => {
    // Bypass in development
    if (process.env.NODE_ENV === "development") {
      setIsChecking(false);
      return;
    }

    // Determine redirect logic
    let redirectTo: string | null = null;

    if (!isAuthenticated && !isPublicPath) {
      // Not authenticated and trying to access protected route → login
      redirectTo = "/login";
    } else if (isAuthenticated && isPublicPath) {
      // Authenticated user trying to access auth pages → redirect based on role
      redirectTo = isAdmin ? "/dashboard" : "/me";
    } else if (
      isAuthenticated &&
      !isAdmin &&
      !isPublicPath &&
      pathname !== "/me" &&
      pathname !== "/"
    ) {
      // Non-admin trying to access admin routes → redirect to user home
      redirectTo = "/me";
    }

    if (redirectTo) {
      router.replace(redirectTo);
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, isAdmin, isPublicPath, pathname, router]);

  // Show loading state while checking auth
  if (isChecking && process.env.NODE_ENV !== "development") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
