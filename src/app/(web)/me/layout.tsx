import AuthGuard from "@/components/auth/AuthGuard";
import React from "react";

const MeLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default MeLayout;

