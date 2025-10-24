'use client';

import { useQuery } from '@apollo/client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import PetCard from '@/components/pet/PetCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { READY_TO_BREED_FEED_SUGGESTIONS } from '../../lib/graphql/queries';
import { Pet } from '@/types/pet';

export default function FeaturedPetsPage() {
  const { data, loading, refetch } = useQuery(READY_TO_BREED_FEED_SUGGESTIONS, {
    variables: { limit: 50 },
  });

  const pets: Pet[] = data?.pets || [];

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
            {loading ? (
              <LoadingSpinner />
            ) : pets.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} onFavoriteChange={refetch} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium">No pets available at the moment</p>
                <p className="text-sm text-muted-foreground">Check back later for new listings</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
