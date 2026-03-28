'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, MapPin, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { PropertyValidationModal } from '@/components/property-validation-modal';

export function NotificationsListClient({ 
  notifications, 
  unreadCount 
}: { 
  notifications: any[]; 
  unreadCount: number;
}) {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleValidate = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Notifications</p>
                  <p className="text-3xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-spectron-teal" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-3xl font-bold">{unreadCount}</p>
                </div>
                <Badge variant="destructive" className="text-lg px-3 py-1">
                  {unreadCount}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Your Notifications</CardTitle>
            <CardDescription>
              Properties near you awaiting community validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium mb-2">No notifications yet</p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll be notified when properties are listed near your location
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      notification.isRead
                        ? 'bg-white border-gray-200'
                        : 'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Property Image */}
                      {notification.property.images[0] && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={notification.property.images[0].url}
                            alt={notification.property.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {notification.property.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <Badge variant="destructive" className="ml-2">
                              New
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4 text-spectron-teal" />
                            <span className="font-semibold">
                              ₹{(notification.property.price / 100000).toFixed(1)}L
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">Near you</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleValidate(notification.property)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Validate Property
                          </Button>
                          <Link href={`/properties/${notification.propertyId}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Validation Modal */}
      {selectedProperty && (
        <PropertyValidationModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </>
  );
}
