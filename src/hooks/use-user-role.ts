"use client";

import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";

/**
 * Hook to get the current user's role
 * Returns "PUBLIC" as default if not authenticated
 */
export function useUserRole(): UserRole {
  const { data: session } = useSession();
  
  // Return the user's role from session, default to PUBLIC
  return (session?.user as any)?.role || "PUBLIC";
}
