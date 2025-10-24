'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';

export default function FeaturedPetsPage() {
  // Mock data for featured pets
  const featuredPets = [
    { id: 1, name: "Buddy", breed: "Golden Retriever", age: "3 years", location: "Stockholm" },
    { id: 2, name: "Luna", breed: "German Shepherd", age: "2 years", location: "Gothenburg" },
    { id: 3, name: "Max", breed: "Labrador", age: "4 years", location: "Malmö" },
    { id: 4, name: "Bella", breed: "Border Collie", age: "2 years", location: "Uppsala" },
    { id: 5, name: "Charlie", breed: "Beagle", age: "3 years", location: "Linköping" },
    { id: 6, name: "Daisy", breed: "Poodle", age: "1 year", location: "Örebro" },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Featured Pets</h2>
              <p className="text-sm text-muted-foreground">Browse featured pets available for breeding</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredPets.map((pet) => (
                <Card key={pet.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <div className="text-6xl">🐕</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{pet.name}</h3>
                      <p className="text-sm text-muted-foreground">{pet.breed}</p>
                      <p className="text-sm text-muted-foreground">{pet.age}</p>
                      <p className="text-sm text-muted-foreground">{pet.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}