"use client"

import * as React from "react"
import { Building2 } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { RoleSwitcher } from "@/components/role-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getSidebarLinksByRole } from "@/types/dashboardSidebarLinks"
import type { User } from "@/types"

export function AppSidebar({ 
  user, 
  ...props 
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  // Get role-based sidebar links
  const sidebarSections = getSidebarLinksByRole(user.role);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <Building2 className="size-5!" />
                <span className="text-base font-semibold">Nestiva</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-4 px-2">
          <RoleSwitcher currentRole={user.role} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={sidebarSections} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
