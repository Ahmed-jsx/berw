import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

const layout = ({ children }: { children: React.ReactNode }) => {
  //   const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  //   if (!isAuthenticated) {
  //     redirect("/login");
  //   }
  return <div>{children}</div>;
};

export default layout;
