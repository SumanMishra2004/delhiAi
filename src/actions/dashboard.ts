'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface Activity {
  id: string;
  action: string;
  property: string;
  time: Date | string;
  type: string;
  icon: string;
  message?: string;
  createdAt?: Date;
}

export async function getDashboardStats() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const stats = {
      totalProperties: 0,
      userProperties: 0,
      notifications: 0,
      profileViews: 0,
      leads: 0,
      commissionEarned: 0,
      conversionRate: 0,
      avgPricePerSqft: 0,
    };

    // Get total properties count
    stats.totalProperties = await prisma.property.count({
      where: {
        status: 'ACTIVE'
      }
    });

    // Get user-specific properties
    if (user.role === 'OWNER' || user.role === 'BROKER') {
      stats.userProperties = await prisma.property.count({
        where: {
          userId: user.id,
          status: { in: ['ACTIVE', 'PENDING'] }
        }
      });
    }

    // Get notifications count
    stats.notifications = await prisma.propertyNotification.count({
      where: {
        userId: user.id,
        isRead: false
      }
    });

    // Calculate average price per sqft
    const avgPriceResult = await prisma.property.aggregate({
      where: {
        status: 'ACTIVE',
        area: { gt: 0 }
      },
      _avg: {
        price: true,
        area: true
      }
    });

    if (avgPriceResult._avg.price && avgPriceResult._avg.area) {
      stats.avgPricePerSqft = Math.round(avgPriceResult._avg.price / avgPriceResult._avg.area);
    }

    // Role-specific stats
    if (user.role === 'BROKER') {
      // Get leads count (using property count as placeholder)
      stats.leads = await prisma.property.count({
        where: {
          userId: user.id,
        }
      });

      // Calculate commission earned (placeholder - implement based on your commission model)
      stats.commissionEarned = 420000; // This should be calculated from actual transactions

      // Calculate conversion rate (placeholder - set to 0 since views field doesn't exist)
      stats.conversionRate = 0;
    }

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
}

export async function getRecentActivity(limit: number = 10) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const activities: Activity[] = [];

    // Get recent property updates for owners/brokers
    if (user.role === 'OWNER' || user.role === 'BROKER') {
      const recentProperties = await prisma.property.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: limit,
        select: {
          id: true,
          title: true,
          updatedAt: true,
          createdAt: true,
          status: true,
        }
      });

      recentProperties.forEach(property => {
        activities.push({
          id: `property-${property.id}`,
          action: property.createdAt.getTime() === property.updatedAt.getTime() 
            ? 'Property listed successfully' 
            : 'Property updated successfully',
          property: property.title,
          time: property.updatedAt,
          type: property.createdAt.getTime() === property.updatedAt.getTime() ? 'created' : 'updated',
          icon: 'Building2'
        });
      });
    }

    // Get recent notifications
    const notifications = await prisma.propertyNotification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: Math.max(1, limit - activities.length),
      select: {
        id: true,
        message: true,
        createdAt: true,
        propertyId: true,
        property: {
          select: {
            title: true
          }
        }
      }
    });

    notifications.forEach(notification => {
      activities.push({
        id: `notification-${notification.id}`,
        action: notification.message,
        property: notification.property?.title || 'System notification',
        time: notification.createdAt,
        type: 'notification',
        icon: 'Bell'
      });
    });

    // Sort by time and limit
    const sortedActivities = activities
      .sort((a, b) => {
        const timeA = a.time instanceof Date ? a.time : new Date(a.time);
        const timeB = b.time instanceof Date ? b.time : new Date(b.time);
        return timeB.getTime() - timeA.getTime();
      })
      .slice(0, limit)
      .map(activity => ({
        ...activity,
        message: activity.action,
        createdAt: activity.time instanceof Date ? activity.time : new Date(activity.time)
      }));

    return { success: true, data: sortedActivities };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return { success: false, error: 'Failed to fetch recent activity' };
  }
}

export async function getUserProperties(userId?: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const targetUserId = userId || user.id;

    const properties = await prisma.property.findMany({
      where: {
        userId: targetUserId,
      },
      include: {
        images: {
          take: 1,
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            notifications: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { success: true, data: properties };
  } catch (error) {
    console.error('Error fetching user properties:', error);
    return { success: false, error: 'Failed to fetch properties' };
  }
}

export async function getPropertyInquiries() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get all notifications for user's properties (as inquiries)
    const inquiries = await prisma.propertyNotification.findMany({
      where: {
        userId: user.id,
      },
      include: {
        property: {
          select: {
            title: true,
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    return { success: true, data: inquiries };
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return { success: false, error: 'Failed to fetch inquiries' };
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}