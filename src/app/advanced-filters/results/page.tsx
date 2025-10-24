'use client';

import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export default function AdvancedFiltersResultsPage() {
  const router = useRouter();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            {/* Back Button */}
            <div className="mb-4">
              <Button
                onClick={() => router.push('/advanced-filters')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Filters
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Search Results</h2>
              <p className="text-sm text-muted-foreground">
                Search results will be displayed here
              </p>
            </div>

            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search Results</h3>
              <p className="text-gray-600 mb-4">
                This is a placeholder for search results functionality.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
