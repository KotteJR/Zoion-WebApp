'use client';

import { useQuery } from '@apollo/client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SEARCH_PETS, GET_ALL_BREEDS } from '../../lib/graphql/queries';

export default function DebugSearchPage() {
  // Test search with no filters (should return all pets)
  const { data: allPetsData, loading: allPetsLoading } = useQuery(SEARCH_PETS, {
    variables: {
      limit: 10,
      where: {},
    },
  });

  // Test search with sex filter
  const { data: malePetsData, loading: malePetsLoading } = useQuery(SEARCH_PETS, {
    variables: {
      limit: 10,
      where: {
        _and: [{ sex: { _eq: 'male' } }]
      },
    },
  });

  // Test breeds query
  const { data: breedsData, loading: breedsLoading } = useQuery(GET_ALL_BREEDS);

  const allPets = allPetsData?.pets || [];
  const malePets = malePetsData?.pets || [];
  const breeds = breedsData?.breeds || [];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full flex-col gap-4 p-4 pt-0">
          <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 overflow-auto rounded-xl border bg-background p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Debug Search</h2>
              <p className="text-sm text-muted-foreground">Testing GraphQL queries and filters</p>
            </div>

            <div className="grid gap-6">
              {/* All Pets */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">All Pets (No Filters)</h3>
                {allPetsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Found {allPets.length} pets:</p>
                    <div className="space-y-1">
                      {allPets.map((pet: any) => (
                        <div key={pet.id} className="text-sm">
                          {pet.name} - {pet.breed} - {pet.sex} - Ready to breed: {pet.ready_to_breed ? 'Yes' : 'No'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Male Pets Only */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Male Pets Only</h3>
                {malePetsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Found {malePets.length} male pets:</p>
                    <div className="space-y-1">
                      {malePets.map((pet: any) => (
                        <div key={pet.id} className="text-sm">
                          {pet.name} - {pet.breed} - {pet.sex} - Ready to breed: {pet.ready_to_breed ? 'Yes' : 'No'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Breeds */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Available Breeds</h3>
                {breedsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Found {breeds.length} breeds:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {breeds.slice(0, 12).map((breed: any) => (
                        <div key={breed.id} className="text-sm p-2 bg-white rounded border">
                          {breed.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
