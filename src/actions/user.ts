'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(newRole: 'PUBLIC' | 'OWNER' | 'BROKER' | 'ADMIN') {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    // Don't allow changing to ADMIN role
    if (newRole === 'ADMIN') {
      return { success: false, error: 'Cannot change to admin role' };
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { role: newRole },
    });

    // Revalidate all dashboard paths to reflect the new role
    revalidatePath('/dashboard', 'layout');

    return { 
      success: true, 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        image: updatedUser.image,
      }
    };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update role' };
  }
}

export async function getUserProfile() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        address: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: 'Failed to get profile' };
  }
}
