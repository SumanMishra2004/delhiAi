import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { NotificationsListClient } from './notifications-client';

export const dynamic = 'force-dynamic';

async function NotificationsList() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/signin');
  }

  const notifications = await prisma.propertyNotification.findMany({
    where: {
      userId: user.id
    },
    include: {
      property: {
        include: {
          images: {
            take: 1,
            orderBy: { order: 'asc' }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationsListClient notifications={notifications} unreadCount={unreadCount} />
  );
}

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-blue-100 p-2">
            <Bell className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
        </div>
        <p className="text-muted-foreground">
          Stay updated on properties near you awaiting community validation
        </p>
      </div>

      {/* Notifications */}
      <Suspense fallback={
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      }>
        <NotificationsList />
      </Suspense>
    </div>
  );
}
