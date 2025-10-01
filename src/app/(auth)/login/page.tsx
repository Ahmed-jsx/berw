"use client";
import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    redirect("/dashboard");
  }
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
