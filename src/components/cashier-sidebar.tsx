"use client";
import {
  IconInnerShadowTop,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ShoppingCart } from "lucide-react";
import { IconUsers } from "@tabler/icons-react";
import { useAuthStore } from "@/store/auth-store";

const navMain = [
  {
    title: "Orders",
    url: "/cashier/orders",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    url: "/cashier/users",
    icon: IconUsers,
  },
];

export function CashierSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((s) => s.user);
  
  const userData = {
    name: user?.name || user?.email || "Cashier",
    email: user?.email || "",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/cashier">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Monkey brew</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}

