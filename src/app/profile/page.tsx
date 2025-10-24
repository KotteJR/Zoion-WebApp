'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4 text-center">
            <div className="text-6xl">👤</div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">This feature is coming soon!</p>
            <p className="text-sm text-muted-foreground">Login and profile management will be available in a future update.</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


