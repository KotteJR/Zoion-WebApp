'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Image from 'next/image';

export default function NotificationsPage() {
  // This would typically fetch notifications from your backend
  const notifications: any[] = [
    // Placeholder data structure
    // { id: '1', type: 'like', message: 'Someone liked your pet', time: '2 hours ago', read: false }
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full flex-col gap-4 p-4 pt-0">
          <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 overflow-auto rounded-xl border bg-background p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Notifications</h2>
              <p className="text-sm text-muted-foreground">Stay updated with the latest activity</p>
            </div>
            {notifications.length > 0 ? (
              <div className="w-full divide-y rounded-xl border bg-background">
                {notifications.map((notification: any) => (
                  <div key={notification.id} className="p-4 hover:bg-accent transition-colors">
                    {/* Notification content would go here */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="relative h-20 w-20 opacity-30">
                  <Image
                    src="/assets/icons/notificationBell.svg"
                    alt="No notifications"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm text-muted-foreground">We'll notify you when something new happens!</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


