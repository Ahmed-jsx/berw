"use client";
import { useAuthStore } from "@/store/auth-store";
import { redirect, usePathname } from "next/navigation";
import React from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isPublicPath = ["/login", "/sign-up"].includes(pathname);
  const isProtectedPath = ["/dashboard"].includes(pathname);

  // ✅ Select each field directly (prevents infinite loop)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // ✅ Bypass all checks in development
  if (process.env.NODE_ENV === "development") {
    return <>{children}</>;
  }

  // If not authenticated → always send to login
  if (!isAuthenticated && !isPublicPath) {
    redirect("/login");
  }

  // If authenticated but trying to access public (auth) pages → send to dashboard
  if (isAuthenticated && isPublicPath) {
    redirect("/dashboard");
  }

  // If route is protected and user is not admin → send home
  if (isAuthenticated && isProtectedPath && user?.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
};

export default AuthGuard;
