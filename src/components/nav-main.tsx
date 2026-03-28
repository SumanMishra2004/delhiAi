"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { SidebarSection } from "@/types/dashboardSidebarLinks"

export function NavMain({
  sections,
}: {
  sections: SidebarSection[]
}) {
  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            {section.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={link.description}
                    className={link.variant === "primary" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                  >
                    <Link href={link.href} className="flex items-center gap-2">
                      {link.icon}
                      <span>{link.title}</span>
                      {link.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
