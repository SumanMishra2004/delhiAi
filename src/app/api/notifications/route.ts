import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

/**
 * Get user notifications
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const whereClause: any = { userId: user.id };
    if (unreadOnly) {
      whereClause.isRead = false;
    }

    const notifications = await prisma.propertyNotification.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            price: true,
            propertyType: true,
            verificationStatus: true,
            images: {
              select: { url: true },
              orderBy: { order: 'asc' },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const totalCount = await prisma.propertyNotification.count({
      where: whereClause
    });

    const unreadCount = await prisma.propertyNotification.count({
      where: { userId: user.id, isRead: false }
    });

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      unreadCount
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to get notifications' },
      { status: 500 }
    );
  }
}

/**
 * Mark notifications as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { notificationIds, markAllAsRead } = await request.json();

    if (markAllAsRead) {
      // Mark all notifications as read
      await prisma.propertyNotification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true }
      });

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    }

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'Notification IDs array is required' },
        { status: 400 }
      );
    }

    // Mark specific notifications as read
    await prisma.propertyNotification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: user.id
      },
      data: { isRead: true }
    });

    return NextResponse.json({
      success: true,
      message: `${notificationIds.length} notifications marked as read`
    });

  } catch (error) {
    console.error('Mark notifications as read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}