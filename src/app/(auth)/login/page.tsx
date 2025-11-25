"use client";
import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    if (isAuthenticated) {
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
  }, [isAuthenticated, role, router]);
  
  return (
    <div className=" flex min-h-svh justify-center items-center">
      <div className="flex w-full max-w-[450px] flex-col gap-6">
        {/* <Logo /> */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
