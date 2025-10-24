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

export default function AdvancedFiltersResultsPage() {
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

  const whereClause = whereConditions.length > 0 ? { _and: whereConditions } : {};

  const { data, loading, refetch } = useQuery(SEARCH_PETS, {
    variables: {
      where: whereClause,
      limit: 50,
    },
  });

  const pets: Pet[] = data?.pets || [];

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
                Found {pets.length} pets matching your criteria
              </p>
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
                <p className="text-lg font-medium">No pets found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                <Button 
                  onClick={() => router.push('/advanced-filters')} 
                  variant="outline" 
                  className="mt-4"
                >
                  Modify Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
