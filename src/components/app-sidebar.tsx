"use client";
import {
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconUsers,
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
import { ShoppingCart, SquarePlus } from "lucide-react";

const data = {
  user: {
    name: "admin",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard", // Fixed: Added leading slash
      icon: IconDashboard,
    },
    {
      title: "Orders",
      url: "/dashboard/orders", // Fixed: Added leading slash
      icon: ShoppingCart,
    },
    {
      title: "Products",
      url: "/dashboard/products", // Fixed: Added leading slash
      icon: IconListDetails,
    },
    {
      title: "Users",
      url: "/dashboard/users", // Fixed: Added leading slash and proper path
      icon: IconUsers,
    },
    {
      title: "Extras",
      url: "/dashboard/extras", // Fixed: Added leading slash and proper path
      icon: SquarePlus,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                {" "}
                {/* Fixed: Added leading slash */}
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Monkey brew</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
