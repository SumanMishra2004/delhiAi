"use client"

import { useState, useTransition } from "react"
import { signOut } from "next-auth/react"
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconRefresh,
} from "@tabler/icons-react"
import { UserRole } from "@prisma/client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { updateUserRole } from "@/actions/user"
import type { User } from "@/types"

const roleLabels: Record<UserRole, string> = {
  PUBLIC: "Public User",
  OWNER: "Property Owner", 
  BROKER: "Real Estate Broker",
  ADMIN: "Administrator"
}

const roleColors: Record<UserRole, string> = {
  PUBLIC: "bg-gray-100 text-gray-800",
  OWNER: "bg-blue-100 text-blue-800",
  BROKER: "bg-green-100 text-green-800", 
  ADMIN: "bg-purple-100 text-purple-800"
}

export function NavUser({
  user,
}: {
  user: User
}) {
  const { isMobile } = useSidebar()
  const [isPending, startTransition] = useTransition()

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === user.role) return
    
    startTransition(async () => {
      try {
        const result = await updateUserRole(newRole)
        if (result.success) {
          // Reload the page to reflect the new role
          window.location.reload()
        } else {
          console.error('Failed to update role:', result.error)
        }
      } catch (error) {
        console.error('Error updating role:', error)
      }
    })
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const availableRoles: UserRole[] = ["PUBLIC", "OWNER", "BROKER"]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar || user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name || "User"}</span>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${roleColors[user.role]}`}
                >
                  {roleLabels[user.role]}
                </Badge>
                <IconDotsVertical className="size-4" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar || user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name || "User"}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs w-fit mt-1 ${roleColors[user.role]}`}
                  >
                    {roleLabels[user.role]}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={isPending}>
                <IconRefresh className={isPending ? "animate-spin" : ""} />
                Switch Role
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {availableRoles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    disabled={role === user.role || isPending}
                    className="flex items-center justify-between"
                  >
                    <span>{roleLabels[role]}</span>
                    {role === user.role && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
