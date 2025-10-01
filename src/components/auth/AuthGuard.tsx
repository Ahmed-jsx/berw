"use client";

import { useAuthStore } from "@/store/auth-store";
import { redirect, usePathname } from "next/navigation";
import React from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isPublicPath = ["/login", "/sign-up"].includes(pathname);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  if (!isAuthenticated && !isPublicPath) {
    redirect("/login");
  }

  if (isAuthenticated && isPublicPath) {
    if (role === "admin") redirect("/dashboard");
    if (role === "user") redirect("/me");
  }

  // Restrict role-based paths
  if (isAuthenticated) {
    if (role === "admin" && pathname.startsWith("/me")) {
      redirect("/dashboard");
    }
    if (role === "user" && pathname.startsWith("/dashboard")) {
      redirect("/me");
    }
  }

  return <>{children}</>;
};

export default AuthGuard;
