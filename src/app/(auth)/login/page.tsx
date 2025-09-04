"use client";
import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    redirect("/dashboard");
  }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-[450px] flex-col gap-6">
        {/* <Logo /> */}
        <LoginForm />
      </div>
    </div>
  );
}
