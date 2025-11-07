'use client';

import { useQuery } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import PetCard from '@/components/pet/PetCard';
import KennelCard from '@/components/kennel/KennelCard';
import KennelMap from '@/components/maps/KennelMap';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SEARCH_PETS } from '@/lib/graphql/queries';
import { useSearchStore } from '@/store/search-store';
import { Pet } from '@/types/pet';

export default function AdvancedFiltersResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filter } = useSearchStore();
  const [kennels, setKennels] = useState<any[]>([]);
  const [kennelCoords, setKennelCoords] = useState<{ id: string; latitude: number; longitude: number; name?: string }[]>([]);
  const isKennelSearch = searchParams?.get('type') === 'kennels';
  
  // Build the where clause for GraphQL - must match exact logic from search page
  const whereConditions: any[] = [];
  
  // EXACT ID SEARCH - highest priority
  if (filter.id) {
    whereConditions.push({ id: { _eq: filter.id } });
  }
  
  // CONTAINS ID SEARCH
  if (filter.petId) {
    whereConditions.push({ id: { _ilike: `%${filter.petId}%` } });
  }
  
  if (filter.breeds && filter.breeds.length > 0) {
    const breedLikeConditions = filter.breeds.flatMap(breed => {
      const normalizedBreed = breed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const variants = [breed, breed.toLowerCase(), normalizedBreed, normalizedBreed.toLowerCase()];
      return variants.map(v => ({ breed: { _ilike: `%${v}%` } }));
    });
    whereConditions.push({ _or: breedLikeConditions });
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
  
  if (filter.vaccinated !== null && filter.vaccinated !== undefined) {
    whereConditions.push({ vaccinated: { _eq: filter.vaccinated } });
  }
  
  if (filter.inbreedRate) {
    const rateStr = filter.inbreedRate.value.toString().replace('.', ',');
    whereConditions.push({ inbreed_rate: { _ilike: `${rateStr}%` } });
  }
  
  if (filter.color) {
    whereConditions.push({ 
      _or: [
        { color: { _ilike: `%${filter.color}%` } },
        { colour: { _ilike: `%${filter.color}%` } }
      ]
    });
  }
  
  if (filter.kennelName) {
    whereConditions.push({ _or: [
      { kennel_name: { _ilike: `%${filter.kennelName}%` } },
      { kennel: { name: { _ilike: `%${filter.kennelName}%` } } }
    ]});
  }
  
  if (filter.nameContains) {
    whereConditions.push({ name: { _ilike: `%${filter.nameContains}%` } });
  }
  
  if (filter.ageRange) {
    const currentDate = new Date();
    if (filter.ageRange.max !== undefined) {
      const minDate = new Date(currentDate.getFullYear() - filter.ageRange.max, currentDate.getMonth(), currentDate.getDate());
      whereConditions.push({ date_born: { _lte: minDate.toISOString().split('T')[0] } });
    }
    if (filter.ageRange.min !== undefined) {
      const maxDate = new Date(currentDate.getFullYear() - filter.ageRange.min, currentDate.getMonth(), currentDate.getDate());
      whereConditions.push({ date_born: { _gte: maxDate.toISOString().split('T')[0] } });
    }
  }
  
  if (filter.weight) {
    const opMap: { [key: string]: string } = { less: '_lt', greater: '_gt', equal: '_eq' };
    const graphQLOp = opMap[filter.weight.operator];
    whereConditions.push({ weight: { [graphQLOp]: filter.weight.value } });
  }

  // Load kennels from session storage if this is a kennel search
  useEffect(() => {
    if (isKennelSearch) {
      try {
        const savedKennels = sessionStorage.getItem('advancedFiltersKennels');
        const savedCoords = sessionStorage.getItem('advancedFiltersKennelCoords');
        if (savedKennels) {
          setKennels(JSON.parse(savedKennels));
        }
        if (savedCoords) {
          setKennelCoords(JSON.parse(savedCoords));
        }
      } catch (error) {
        console.error('Error loading kennels from session storage:', error);
      }
    }
  }, [isKennelSearch]);

  const whereClause = whereConditions.length > 0 ? { _and: whereConditions } : {};
  
  // Use limit 1 for exact ID search, otherwise 50
  const searchLimit = filter.id ? 1 : 50;

  const { data, loading, refetch } = useQuery(SEARCH_PETS, {
    variables: {
      where: whereClause,
      limit: searchLimit,
    },
    skip: isKennelSearch, // Skip pet search if this is a kennel search
  });

  const pets: Pet[] = data?.pets || [];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full bg-transparent">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-visible rounded-xl h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-6">
            {/* Back Button */}
            <div className="mb-4">
              <Button
                onClick={() => router.push('/advanced-filters')}
                variant="outline"
                className="flex items-center gap-2 bg-white/10 text-gray-900 border border-gray-300/30 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tillbaka till filter
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Sökresultat</h2>
              <p className="text-sm text-gray-600/90">
                {isKennelSearch 
                  ? `Hittade ${kennels.length} kennlar som matchar dina kriterier`
                  : `Hittade ${pets.length} hundar som matchar dina kriterier`
                }
              </p>
            </div>

            {isKennelSearch ? (
              // Kennel search results
              kennels.length > 0 ? (
                <div className="space-y-4">
                  {/* Map */}
                  {kennelCoords.length > 0 && (
                    <KennelMap points={kennelCoords} height={400} />
                  )}
                  {/* Kennel Cards */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {kennels.map((kennel) => (
                      <KennelCard key={kennel.id} kennel={kennel} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg font-medium text-gray-900">Inga kennlar hittades</p>
                  <p className="text-sm text-gray-600/90">Försök justera dina sökkriterier</p>
                  <Button 
                    onClick={() => router.push('/advanced-filters')} 
                    variant="outline" 
                    className="mt-4 bg-white/10 text-gray-900 border border-gray-300/30 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm"
                  >
                    Ändra sökning
                  </Button>
                </div>
              )
            ) : (
              // Pet search results
              loading ? (
                <LoadingSpinner />
              ) : pets.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {pets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} onFavoriteChange={refetch} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg font-medium text-gray-900">Inga hundar hittades</p>
                  <p className="text-sm text-gray-600/90">Försök justera dina sökkriterier</p>
                  <Button 
                    onClick={() => router.push('/advanced-filters')} 
                    variant="outline" 
                    className="mt-4 bg-white/10 text-gray-900 border border-gray-300/30 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm"
                  >
                    Ändra sökning
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
