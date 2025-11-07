'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import PetCard from '@/components/pet/PetCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { READY_TO_BREED_FEED_SUGGESTIONS } from '@/lib/graphql/queries';
import { Pet } from '@/types/pet';

export default function FeaturedPetsPage() {
  const { data, loading, refetch } = useQuery(READY_TO_BREED_FEED_SUGGESTIONS, {
    variables: { limit: 50 },
  });

  const pets: Pet[] = data?.pets || [];

  const shuffledPets = useMemo(() => {
    const arr = [...pets];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // Recompute only when the set of IDs changes
  }, [pets.map((p) => p.id).join(',')]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full bg-transparent">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-visible rounded-xl h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Utvalda hundar</h2>
              <p className="text-sm text-gray-600/90 mb-4">Bläddra bland utvalda hundar som är redo att para med varandra</p>
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : shuffledPets.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {shuffledPets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} onFavoriteChange={refetch} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium text-gray-900">No pets available at the moment</p>
                <p className="text-sm text-gray-600/90">Check back later for new listings</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
