'use client';

import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import PetCard from '@/components/pet/PetCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SEARCH_PETS } from '@/lib/graphql/queries';
import { useSearchStore } from '@/store/search-store';
import { Pet } from '@/types/pet';

export default function SearchResultsPage() {
  const router = useRouter();
  const { filter } = useSearchStore();
  
  // Build the where clause for GraphQL
  const whereConditions: any[] = [];
  
  if (filter.breeds && filter.breeds.length > 0) {
    whereConditions.push({ breed: { _in: filter.breeds } });
  }
  
  if (filter.sex) {
    whereConditions.push({ sex: { _eq: filter.sex } });
  }
  
  if (filter.readyToBreed) {
    whereConditions.push({ ready_to_breed: { _eq: true } });
  }
  
  if (filter.pregnant) {
    whereConditions.push({ pregnant: { _eq: true } });
  }
  
  if (filter.hasFrozenSperm) {
    whereConditions.push({ has_frozen_sperm: { _eq: true } });
  }
  
  const { data, loading, refetch } = useQuery(SEARCH_PETS, {
    variables: {
      limit: 50,
      where: whereConditions.length > 0 ? { _and: whereConditions } : {},
    },
  });

  const pets: Pet[] = data?.pets || [];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full bg-transparent">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-visible rounded-xl h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Sökresultat</h2>
                <p className="text-sm text-gray-600/90">Hittade {pets.length} hund(ar) som matchar dina kriterier</p>
              </div>
              <Button 
                onClick={() => router.push('/search')} 
                variant="outline"
                className="flex items-center gap-2 bg-gray-300/20 text-gray-900 border border-gray-300/30 hover:bg-gray-300/30 hover:border-gray-300/50 hover:shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tillbaka till sökning
              </Button>
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
                <p className="text-lg font-medium text-gray-900">Inga hundar hittades som matchar dina kriterier.</p>
                <p className="text-sm text-gray-600/90">Försök justera dina sökfilter.</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


