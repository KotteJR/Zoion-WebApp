'use client';

import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { GET_ALL_BREEDS, SEARCH_PETS } from '@/lib/graphql/queries';
import { useSearchStore } from '@/store/search-store';
import { Breed } from '@/types/search';

export default function AdvancedFiltersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filter, setFilter } = useSearchStore();
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(filter.breeds || []);
  const [selectedSex, setSelectedSex] = useState<'male' | 'female' | null>(filter.sex || null);
  const [readyToBreed, setReadyToBreed] = useState(filter.readyToBreed || false);
  const [pregnant, setPregnant] = useState(filter.pregnant || false);
  const [hasFrozenSperm, setHasFrozenSperm] = useState(filter.hasFrozenSperm || false);

  const { data: breedsData, loading: breedsLoading } = useQuery(GET_ALL_BREEDS);
  const [searchPets, { loading: searchLoading }] = useLazyQuery(SEARCH_PETS);

  const breeds: Breed[] = breedsData?.breeds || [];

  // Load AI search filters from session storage
  useEffect(() => {
    const aiFilters = sessionStorage.getItem('aiSearchFilters');
    // Also accept filters via URL (?ai=base64json) for reliability
    const aiParam = searchParams?.get('ai');
    if (aiFilters) {
      try {
        const parsedFilters = JSON.parse(aiFilters);
        
        // Pre-fill the form with AI search filters
        if (parsedFilters.breeds) {
          setSelectedBreeds(parsedFilters.breeds);
        }
        if (parsedFilters.sex) {
          setSelectedSex(parsedFilters.sex);
        }
        if (parsedFilters.readyToBreed) {
          setReadyToBreed(parsedFilters.readyToBreed);
        }
        if (parsedFilters.pregnant) {
          setPregnant(parsedFilters.pregnant);
        }
        if (parsedFilters.hasFrozenSperm) {
          setHasFrozenSperm(parsedFilters.hasFrozenSperm);
        }
        
        // Clear the session storage after loading
        sessionStorage.removeItem('aiSearchFilters');
      } catch (error) {
        console.error('Error parsing AI search filters:', error);
      }
    } else if (aiParam) {
      try {
        const json = typeof window !== 'undefined' ? atob(aiParam) : '';
        if (json) {
          const parsedFilters = JSON.parse(json);
          if (parsedFilters.breeds) setSelectedBreeds(parsedFilters.breeds);
          if (parsedFilters.sex !== undefined) setSelectedSex(parsedFilters.sex);
          if (parsedFilters.readyToBreed !== undefined) setReadyToBreed(parsedFilters.readyToBreed);
          if (parsedFilters.pregnant !== undefined) setPregnant(parsedFilters.pregnant);
          if (parsedFilters.hasFrozenSperm !== undefined) setHasFrozenSperm(parsedFilters.hasFrozenSperm);
        }
      } catch (e) {
        console.error('Failed to read ai filters from URL', e);
      }
    }
  }, []);

  const handleBreedToggle = (breed: string) => {
    setSelectedBreeds(prev => 
      prev.includes(breed) 
        ? prev.filter(b => b !== breed)
        : [...prev, breed]
    );
  };

  const handleSearch = async () => {
    const searchFilter = {
      breeds: selectedBreeds,
      sex: selectedSex,
      readyToBreed,
      pregnant,
      hasFrozenSperm,
    };

    setFilter(searchFilter);

    // Build the where clause for GraphQL
    const whereClause: any = {};

    if (selectedBreeds.length > 0) {
      whereClause.breed = { _in: selectedBreeds };
    }

    if (selectedSex) {
      whereClause.sex = { _eq: selectedSex };
    }

    if (readyToBreed) {
      whereClause.ready_to_breed = { _eq: true };
    }

    if (pregnant) {
      whereClause.pregnant = { _eq: true };
    }

    if (hasFrozenSperm) {
      whereClause.has_frozen_sperm = { _eq: true };
    }

    try {
      const { data } = await searchPets({
        variables: {
          where: whereClause,
          limit: 50,
        },
      });

      if (data?.pets) {
        router.push('/advanced-filters/results');
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const clearFilters = () => {
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
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Advanced Filters</h2>
              <p className="text-sm text-muted-foreground">Use specific filters to find exactly what you're looking for</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Breed Selection */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Breed</h3>
                  {breedsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                      <div className="divide-y divide-gray-100">
                        {breeds.map((breed) => {
                          const selected = selectedBreeds.includes(breed.name);
                          return (
                            <button
                              type="button"
                              key={breed.id}
                              onClick={() => handleBreedToggle(breed.name)}
                              className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                                selected
                                  ? 'bg-[#e8f3f0] text-[#175c51]'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-sm">{breed.name}</span>
                              <span
                                className={`ml-3 inline-block h-4 w-4 rounded border ${
                                  selected ? 'bg-[#3d7c6f] border-[#3d7c6f]' : 'border-gray-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Other Filters */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Sex</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'male', label: 'Male' },
                      { key: 'female', label: 'Female' },
                      { key: null, label: 'Any' },
                    ].map((opt) => (
                      <button
                        key={String(opt.key)}
                        onClick={() => setSelectedSex(opt.key as 'male' | 'female' | null)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                          selectedSex === opt.key
                            ? 'bg-[#e8f3f0] border-[#3d7c6f] text-[#175c51]'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                        type="button"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setReadyToBreed((v) => !v)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        readyToBreed ? 'bg-[#e8f3f0] border-[#3d7c6f] text-[#175c51]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Ready to Breed
                    </button>
                    <button
                      type="button"
                      onClick={() => setPregnant((v) => !v)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        pregnant ? 'bg-[#e8f3f0] border-[#3d7c6f] text-[#175c51]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Pregnant
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasFrozenSperm((v) => !v)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        hasFrozenSperm ? 'bg-[#e8f3f0] border-[#3d7c6f] text-[#175c51]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Has Frozen Sperm
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={handleSearch} 
                disabled={searchLoading}
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </Button>
              <Button 
                onClick={clearFilters} 
                variant="outline"
                disabled={searchLoading}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
