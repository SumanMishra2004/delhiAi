'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getPendingProperties(page: number = 1, limit: number = 20) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: {
          verificationStatus: 'PENDING'
        },
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          opinionGroup: {
            include: {
              aggregation: true
            }
          },
          validationComments: {
            where: { isVisible: true },
            orderBy: { createdAt: 'desc' }
          },
          urbanSprawlData: {
            orderBy: { year: 'asc' }
          }
        },
        orderBy: {
          createdAt: 'asc' // Oldest first for FIFO processing
        },
        skip,
        take: limit
      }),
      prisma.property.count({
        where: { verificationStatus: 'PENDING' }
      })
    ]);

    return {
      success: true,
      data: properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching pending properties:', error);
    return { success: false, error: 'Failed to fetch pending properties' };
  }
}

export async function approveProperty(propertyId: string, notes?: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        verificationStatus: 'APPROVED',
        isVerified: true,
        status: 'ACTIVE',
        verifiedAt: new Date(),
        verifiedBy: user.id,
        verificationNotes: notes
      }
    });

    // Deactivate opinion group
    await prisma.propertyOpinionGroup.updateMany({
      where: { propertyId },
      data: { isActive: false }
    });

    revalidatePath('/dashboard/admin');
    revalidatePath('/properties');
    revalidatePath(`/properties/${propertyId}`);

    return { success: true, message: 'Property approved successfully' };
  } catch (error) {
    console.error('Error approving property:', error);
    return { success: false, error: 'Failed to approve property' };
  }
}

export async function rejectProperty(propertyId: string, reason: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        verificationStatus: 'REJECTED',
        status: 'REJECTED',
        verifiedAt: new Date(),
        verifiedBy: user.id,
        verificationNotes: reason
      }
    });

    // Deactivate opinion group
    await prisma.propertyOpinionGroup.updateMany({
      where: { propertyId },
      data: { isActive: false }
    });

    revalidatePath('/dashboard/admin');
    revalidatePath('/properties');

    return { success: true, message: 'Property rejected' };
  } catch (error) {
    console.error('Error rejecting property:', error);
    return { success: false, error: 'Failed to reject property' };
  }
}

export async function requestPropertyReview(propertyId: string, feedback: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        verificationStatus: 'NEEDS_REVIEW',
        verificationNotes: feedback
      }
    });

    // Notify property owner
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { userId: true, title: true }
    });

    if (property) {
      await prisma.propertyNotification.create({
        data: {
          userId: property.userId,
          propertyId,
          message: `Admin requested changes to "${property.title}": ${feedback}`
        }
      });
    }

    revalidatePath('/dashboard/admin');
    revalidatePath(`/properties/${propertyId}`);

    return { success: true, message: 'Review request sent to owner' };
  } catch (error) {
    console.error('Error requesting review:', error);
    return { success: false, error: 'Failed to request review' };
  }
}

export async function getAdminStats() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const [
      pendingCount,
      approvedCount,
      rejectedCount,
      totalUsers,
      activeProperties,
      totalOpinions
    ] = await Promise.all([
      prisma.property.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.property.count({ where: { verificationStatus: 'APPROVED' } }),
      prisma.property.count({ where: { verificationStatus: 'REJECTED' } }),
      prisma.user.count(),
      prisma.property.count({ where: { status: 'ACTIVE' } }),
      prisma.opinionVote.count()
    ]);

    return {
      success: true,
      data: {
        pendingCount,
        approvedCount,
        rejectedCount,
        totalUsers,
        activeProperties,
        totalOpinions,
        approvalRate: approvedCount + rejectedCount > 0 
          ? Math.round((approvedCount / (approvedCount + rejectedCount)) * 100) 
          : 0
      }
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

export async function hideValidationComment(commentId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.propertyValidationComment.update({
      where: { id: commentId },
      data: { isVisible: false }
    });

    revalidatePath('/dashboard/admin');

    return { success: true, message: 'Comment hidden' };
  } catch (error) {
    console.error('Error hiding comment:', error);
    return { success: false, error: 'Failed to hide comment' };
  }
}

export async function getVerificationQueue() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const properties = await prisma.property.findMany({
      where: {
        verificationStatus: { in: ['PENDING', 'NEEDS_REVIEW'] }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        },
        opinionGroup: {
          include: {
            aggregation: true
          }
        },
        _count: {
          select: {
            validationComments: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return { success: true, data: properties };
  } catch (error) {
    console.error('Error fetching verification queue:', error);
    return { success: false, error: 'Failed to fetch queue' };
  }
}
