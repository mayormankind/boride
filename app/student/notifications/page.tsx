'use client';

import { useState } from 'react';
import { Bell, Car, Check, Gift, AlertCircle, Info, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StudentBottomNav from '@/components/shared/StudentBottomNav';

interface Notification {
  id: string;
  type: 'ride_accepted' | 'driver_arrived' | 'trip_started' | 'trip_completed' | 'promo' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const NOTIFICATION_ICONS = {
  ride_accepted: Car,
  driver_arrived: AlertCircle,
  trip_started: Navigation,
  trip_completed: Check,
  promo: Gift,
  system: Info,
};

const NOTIFICATION_COLORS = {
  ride_accepted: 'text-blue-500',
  driver_arrived: 'text-orange-500',
  trip_started: 'text-green-500',
  trip_completed: 'text-student-primary',
  promo: 'text-purple-500',
  system: 'text-gray-500',
};

// Mock data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'ride_accepted',
    title: 'Ride Accepted!',
    message: 'John Doe has accepted your ride request. He will be there in 5 minutes.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
  },
  {
    id: '2',
    type: 'driver_arrived',
    title: 'Driver Arrived',
    message: 'Your driver has arrived at the pickup location.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
  },
  {
    id: '3',
    type: 'trip_completed',
    title: 'Trip Completed',
    message: 'Your ride to Main Library has been completed. Total fare: ₦1,500',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '4',
    type: 'promo',
    title: 'Special Offer! 🎉',
    message: 'Get 20% off on your next ride. Use code: BORIDE20',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'App Update Available',
    message: 'A new version of BoRide is available. Update now for better features!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-student-bg via-white to-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-student-primary to-student-dark p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-jakarta">Notifications</h1>
            <p className="text-emerald-100 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              className="bg-white text-student-primary hover:bg-emerald-50"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type];
              const iconColor = NOTIFICATION_COLORS[notification.type];

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    'transition-all cursor-pointer hover:shadow-md',
                    !notification.read && 'border-l-4 border-l-student-primary bg-emerald-50/50'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', 
                        !notification.read ? 'bg-student-primary/10' : 'bg-gray-100'
                      )}>
                        <Icon className={cn('w-5 h-5', iconColor)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={cn('font-semibold text-sm', !notification.read && 'text-student-dark')}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-student-primary flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Notifications</h3>
              <p className="text-gray-500 text-sm">
                You're all caught up! New notifications will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <StudentBottomNav />
    </div>
  );
}
