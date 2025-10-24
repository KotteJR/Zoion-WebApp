'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function FeedPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full flex-col gap-4 p-4 pt-0">
          <div className="flex h-[calc(100vh-2rem)] flex-col items-center justify-center gap-4 overflow-auto rounded-xl border bg-background p-6 mt-4 text-center">
            <div className="text-6xl">❤️</div>
            <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
            <p className="text-muted-foreground">This feature is coming soon!</p>
            <p className="text-sm text-muted-foreground">Save your favorite pets to view them here later.</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


