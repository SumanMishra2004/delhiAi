'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-config";
import { prisma } from './prisma';
import type { User } from '@/types';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
