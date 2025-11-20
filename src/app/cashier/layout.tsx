import { CashierSidebar } from "@/components/cashier-sidebar";
import AuthGuard from "@/components/auth/AuthGuard";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const sidebarProviderStyle = {
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
  } as React.CSSProperties;

  return (
    <AuthGuard>
      <SidebarProvider style={sidebarProviderStyle}>
        <CashierSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default Layout;

