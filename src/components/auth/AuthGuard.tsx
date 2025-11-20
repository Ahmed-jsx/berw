"use client";

import { useAuthStore } from "@/store/auth-store";
import { redirect, usePathname } from "next/navigation";
import React from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isPublicPath = ["/login", "/sign-up"].includes(pathname);
  const isWebPath = pathname === "/" || pathname.startsWith("/menu") || pathname.startsWith("/merch") || pathname.startsWith("/check-out") || pathname.startsWith("/about-us");

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  // ✅ Allow free navigation in development
  if (process.env.NODE_ENV === "development") {
    return <>{children}</>;
  }

  // Redirect unauthenticated users away from protected routes (dashboard, /me)
  if (!isAuthenticated && !isPublicPath && !isWebPath) {
    redirect("/login");
  }

  // Redirect authenticated users away from public auth routes
  if (isAuthenticated && isPublicPath) {
    // Redirect based on role
    if (role === "admin") {
      redirect("/dashboard");
    } else if (role === "cashier") {
      redirect("/cashier");
    } else {
      redirect("/");
    }
  }

  // Restrict role-based paths
  if (isAuthenticated) {
    // Cashier route protection: only cashier and admin can access
    if (pathname.startsWith("/cashier") && role !== "cashier" && role !== "admin") {
      redirect("/");
    }
    
    // Block cashiers from accessing dashboard routes
    if (role === "cashier" && pathname.startsWith("/dashboard")) {
      redirect("/cashier");
    }
    
    // Block cashiers from accessing /me routes
    if (role === "cashier" && pathname.startsWith("/me")) {
      redirect("/cashier");
    }
    
    // Admin cannot access /me, redirect to dashboard
    if (role === "admin" && pathname.startsWith("/me")) {
      redirect("/dashboard");
    }
    
    // Regular users cannot access /dashboard, redirect to home
    if (role === "user" && pathname.startsWith("/dashboard")) {
      redirect("/");
    }
    
    // Regular users cannot access /cashier, redirect to home
    if (role === "user" && pathname.startsWith("/cashier")) {
      redirect("/");
    }
  }

  return <>{children}</>;
};

export default AuthGuard;
