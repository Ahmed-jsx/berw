"use client";
import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return redirect("/login");
  }

  return <div>{children}</div>;
};

export default AuthProvider;
