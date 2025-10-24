'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Welcome to Zoion</h2>
              <p className="text-sm text-muted-foreground">Your pet breeding platform</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={() => window.location.href = '/search'} className="h-20">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🔍</div>
                        <div>Search Pets</div>
                      </div>
                    </Button>
                    <Button onClick={() => window.location.href = '/featured'} variant="outline" className="h-20">
                      <div className="text-center">
                        <div className="text-2xl mb-2">⭐</div>
                        <div>Featured Pets</div>
                      </div>
                    </Button>
                    <Button onClick={() => window.location.href = '/advanced-filters'} variant="outline" className="h-20">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <div>Advanced Filters</div>
                      </div>
                    </Button>
                    <Button onClick={() => window.location.href = '/profile'} variant="outline" className="h-20">
                      <div className="text-center">
                        <div className="text-2xl mb-2">👤</div>
                        <div>Profile</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About Zoion</h3>
                  <p className="text-gray-600">
                    Zoion is a platform for pet owners to find breeding partners for their pets. 
                    Browse through our database of registered pets and connect with other breeders.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}