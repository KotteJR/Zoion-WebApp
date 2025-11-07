'use client';

import { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { GET_ALL_BREEDS, SEARCH_PETS } from '@/lib/graphql/queries';
import { useSearchStore } from '@/store/search-store';
import { Breed } from '@/types/search';

export default function SearchPage() {
  const router = useRouter();
  const { filter, setFilter } = useSearchStore();
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(filter.breeds || []);
  const [selectedSex, setSelectedSex] = useState<'male' | 'female' | null>(filter.sex || null);
  const [readyToBreed, setReadyToBreed] = useState(filter.readyToBreed || false);
  const [pregnant, setPregnant] = useState(filter.pregnant || false);
  const [hasFrozenSperm, setHasFrozenSperm] = useState(filter.hasFrozenSperm || false);

  const { data: breedsData, loading: breedsLoading } = useQuery(GET_ALL_BREEDS);
  const [searchPets, { loading: searchLoading }] = useLazyQuery(SEARCH_PETS);

  const breeds: Breed[] = breedsData?.breeds || [];

  const toggleBreed = (breedName: string) => {
    setSelectedBreeds((prev) =>
      prev.includes(breedName) ? prev.filter((b) => b !== breedName) : [...prev, breedName]
    );
  };

  const handleSearch = async () => {
    // Build the where clause for GraphQL
    const whereConditions: any[] = [];
    
    if (selectedBreeds.length > 0) {
      whereConditions.push({ breed: { _in: selectedBreeds } });
    }
    
    if (selectedSex) {
      whereConditions.push({ sex: { _eq: selectedSex } });
    }
    
    if (readyToBreed) {
      whereConditions.push({ ready_to_breed: { _eq: true } });
    }
    
    if (pregnant) {
      whereConditions.push({ pregnant: { _eq: true } });
    }
    
    if (hasFrozenSperm) {
      whereConditions.push({ has_frozen_sperm: { _eq: true } });
    }

    const searchFilter = {
      breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined,
      sex: selectedSex || undefined,
      readyToBreed: readyToBreed || undefined,
      pregnant: pregnant || undefined,
      hasFrozenSperm: hasFrozenSperm || undefined,
    };

    setFilter(searchFilter);

    try {
      const { data } = await searchPets({
        variables: {
          limit: 50,
          where: whereConditions.length > 0 ? { _and: whereConditions } : {},
        },
      });

      if (data?.pets) {
        router.push('/search/results');
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleReset = () => {
    setSelectedBreeds([]);
    setSelectedSex(null);
    setReadyToBreed(false);
    setPregnant(false);
    setHasFrozenSperm(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <div className="flex h-full bg-transparent">
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-visible rounded-xl h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Search</h2>
              <p className="text-sm text-gray-600/90">Find the perfect breeding partner for your pet</p>
            </div>

            <div className="grid gap-6">
              {/* Sex Selection */}
              <div className="grid gap-3">
                <label className="text-sm font-medium text-gray-900">Sex</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedSex === 'male' ? 'default' : 'outline'}
                    onClick={() => setSelectedSex(selectedSex === 'male' ? null : 'male')}
                    className={`justify-start ${
                      selectedSex === 'male' 
                        ? 'bg-gray-300/20 text-gray-900 border-gray-300/30 hover:bg-gray-300/30 hover:border-gray-300/50 hover:shadow-sm' 
                        : 'bg-gray-300/20 text-gray-900 border-gray-300/30 hover:bg-gray-300/30 hover:border-gray-300/50 hover:shadow-sm'
                    }`}
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Male
                  </Button>
                  <Button
                    variant={selectedSex === 'female' ? 'default' : 'outline'}
                    onClick={() => setSelectedSex(selectedSex === 'female' ? null : 'female')}
                    className={`justify-start ${
                      selectedSex === 'female' 
                        ? 'bg-gray-300/20 text-gray-900 border-gray-300/30 hover:bg-gray-300/30 hover:border-gray-300/50 hover:shadow-sm' 
                        : 'bg-gray-300/20 text-gray-900 border-gray-300/30 hover:bg-gray-300/30 hover:border-gray-300/50 hover:shadow-sm'
                    }`}
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    </svg>
                    Female
                  </Button>
                </div>
              </div>

              {/* Breed Selection */}
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">Breeds</label>
                  {selectedBreeds.length > 0 && (
                    <span className="text-sm text-gray-600/90">{selectedBreeds.length} selected</span>
                  )}
                </div>
                {breedsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid max-h-[300px] grid-cols-2 gap-2 overflow-auto rounded-md border border-gray-300/30 bg-white/10 p-3 md:grid-cols-3 lg:grid-cols-4">
                    {breeds.map((breed) => (
                      <Button
                        key={breed.id}
                        variant={selectedBreeds.includes(breed.name) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleBreed(breed.name)}
                        className={`justify-start text-xs ${
                          selectedBreeds.includes(breed.name)
                            ? 'bg-white/20 text-gray-900 border-gray-300/50 hover:bg-white/30'
                            : 'bg-white/10 text-gray-900 border-gray-300/30 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm'
                        }`}
                      >
                        {breed.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Filters */}
              <div className="grid gap-3">
                <label className="text-sm font-medium text-gray-900">Additional Filters</label>
                <div className="grid gap-3">
                  <label className="flex items-center gap-2 rounded-md border border-gray-300/30 bg-white/10 p-3 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={readyToBreed}
                      onChange={(e) => setReadyToBreed(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-900 leading-none">
                      Ready to Breed
                    </span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border border-gray-300/30 bg-white/10 p-3 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pregnant}
                      onChange={(e) => setPregnant(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-900 leading-none">
                      Pregnant
                    </span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border border-gray-300/30 bg-white/10 p-3 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasFrozenSperm}
                      onChange={(e) => setHasFrozenSperm(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-900 leading-none">
                      Has Frozen Sperm
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-gray-300/30 pt-4">
                <Button 
                  onClick={handleReset} 
                  variant="outline" 
                  className="flex-1 bg-white/10 text-gray-900 border border-gray-300/30 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm"
                >
                  Reset
                </Button>
                <Button 
                  onClick={handleSearch} 
                  disabled={searchLoading} 
                  className="flex-1 bg-white/10 text-gray-900 border border-gray-300/30 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
