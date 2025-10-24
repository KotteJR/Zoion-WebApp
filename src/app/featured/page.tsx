'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function FeaturedPetsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Featured Pets</h2>
              <p className="text-sm text-muted-foreground">Discover featured pets</p>
            </div>

            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Featured Pets</h3>
              <p className="text-gray-600 mb-4">
                This is a placeholder for featured pets functionality.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}