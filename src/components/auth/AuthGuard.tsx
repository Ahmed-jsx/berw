"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
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
  useEffect(() => {
    if (!isAuthenticated && !isPublicPath && !isWebPath) {
      router.push("/login");
    }
  }, [isAuthenticated, isPublicPath, isWebPath, router]);

  // Redirect authenticated users away from public auth routes
  useEffect(() => {
    if (isAuthenticated && isPublicPath) {
      // Check for redirect destination stored in sessionStorage first
      const redirectPath = sessionStorage.getItem("redirectAfterAuth");
      if (redirectPath) {
        // Clear the redirect value
        sessionStorage.removeItem("redirectAfterAuth");
        router.push(redirectPath);
        return;
      }
      
      // If no redirect stored, redirect based on role
      if (role === "admin") {
        router.push("/dashboard");
      } else if (role === "cashier") {
        router.push("/cashier");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, isPublicPath, role, router]);

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
