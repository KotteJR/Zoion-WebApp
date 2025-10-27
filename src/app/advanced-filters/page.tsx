'use client';

import { useState, useEffect, Suspense } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { GET_ALL_BREEDS, SEARCH_PETS } from '@/lib/graphql/queries';
import { useSearchStore } from '@/store/search-store';
import { Breed } from '@/types/search';

interface ParsedFilters {
  breeds?: string[];
  sex?: 'male' | 'female';
  readyToBreed?: boolean;
  pregnant?: boolean;
  hasFrozenSperm?: boolean;
  vaccinated?: boolean | null;
  inbreedRate?: {
    operator: 'less' | 'greater' | 'equal';
    value: number;
  };
  ageRange?: {
    min?: number;
    max?: number;
  };
  weight?: {
    operator: 'less' | 'greater' | 'equal';
    value: number;
  };
  color?: string;
  kennelName?: string;
  nameContains?: string;
}

function AdvancedFiltersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filter, setFilter } = useSearchStore();
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(filter.breeds || []);
  const [selectedSex, setSelectedSex] = useState<'male' | 'female' | null>(filter.sex || null);
  const [readyToBreed, setReadyToBreed] = useState(filter.readyToBreed || false);
  const [pregnant, setPregnant] = useState(filter.pregnant || false);
  const [hasFrozenSperm, setHasFrozenSperm] = useState(filter.hasFrozenSperm || false);
  const [vaccinated, setVaccinated] = useState<boolean | null>(null);
  const [inbreedRate, setInbreedRate] = useState<{ operator: 'less' | 'greater' | 'equal'; value: number } | null>(null);
  const [ageRange, setAgeRange] = useState<{ min?: number; max?: number } | null>(null);
  const [weight, setWeight] = useState<{ operator: 'less' | 'greater' | 'equal'; value: number } | null>(null);
  const [color, setColor] = useState<string>('');
  const [kennelName, setKennelName] = useState<string>('');
  const [nameContains, setNameContains] = useState<string>('');
  const [petId, setPetId] = useState<string>('');
  const [id, setId] = useState<string>('');

  const { data: breedsData, loading: breedsLoading } = useQuery(GET_ALL_BREEDS);
  const [searchPets, { loading: searchLoading }] = useLazyQuery(SEARCH_PETS);

  const breeds: Breed[] = breedsData?.breeds || [];

  // Load AI search filters from session storage
  useEffect(() => {
    const aiFilters = sessionStorage.getItem('aiSearchFilters');
    // Also accept filters via URL (?ai=base64json) for reliability
    const aiParam = searchParams?.get('ai');
    
    const applyFilters = (parsedFilters: ParsedFilters) => {
      // Basic filters
      if (parsedFilters.breeds) {
        setSelectedBreeds(parsedFilters.breeds);
      }
      if (parsedFilters.sex !== undefined) {
        setSelectedSex(parsedFilters.sex);
      }
      if (parsedFilters.readyToBreed !== undefined) {
        setReadyToBreed(parsedFilters.readyToBreed);
      }
      if (parsedFilters.pregnant !== undefined) {
        setPregnant(parsedFilters.pregnant);
      }
      if (parsedFilters.hasFrozenSperm !== undefined) {
        setHasFrozenSperm(parsedFilters.hasFrozenSperm);
      }
      if (parsedFilters.vaccinated !== undefined) {
        setVaccinated(parsedFilters.vaccinated);
      }
      
      // Complex filters
      if (parsedFilters.inbreedRate) {
        setInbreedRate(parsedFilters.inbreedRate);
      }
      if (parsedFilters.ageRange) {
        setAgeRange(parsedFilters.ageRange);
      }
      if (parsedFilters.weight) {
        setWeight(parsedFilters.weight);
      }
      if (parsedFilters.color) {
        setColor(parsedFilters.color);
      }
      if (parsedFilters.kennelName) {
        setKennelName(parsedFilters.kennelName);
      }
      if (parsedFilters.nameContains) {
        setNameContains(parsedFilters.nameContains);
      }
    };
    
    if (aiFilters) {
      try {
        const parsedFilters = JSON.parse(aiFilters);
        applyFilters(parsedFilters);
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
          applyFilters(parsedFilters);
        }
      } catch (e) {
        console.error('Failed to read ai filters from URL', e);
      }
    }
  }, [searchParams]);

  const handleBreedToggle = (breed: string) => {
    setSelectedBreeds(prev => 
      prev.includes(breed) 
        ? prev.filter(b => b !== breed)
        : [...prev, breed]
    );
  };

  const handleSearch = async () => {
    console.log('🔍 Search initiated with:', { id, petId, selectedBreeds, selectedSex });
    
    const searchFilter = {
      breeds: selectedBreeds,
      sex: selectedSex,
      readyToBreed,
      pregnant,
      hasFrozenSperm,
      vaccinated,
      inbreedRate,
      ageRange,
      weight,
      color,
      kennelName,
      nameContains,
      petId,
      id,
    };

    setFilter(searchFilter);

    // Build the where clause for GraphQL
    const andConditions: any[] = [];

    // If searching by Pet ID, make it exact match and limit to 1 result
    if (id) {
      console.log('✅ Using EXACT ID search for:', id);
      const exactIdWhere = { id: { _eq: id } };
      
      // Execute search with only ID filter for exact match
      try {
        console.log('📡 GraphQL query:', { where: exactIdWhere, limit: 1 });
        const { data } = await searchPets({
          variables: {
            where: exactIdWhere,
            limit: 1,
          },
        });

        console.log('📦 Received data:', data);
        if (data?.pets) {
          console.log('✅ Found', data.pets.length, 'pet(s)');
          router.push('/advanced-filters/results');
        }
        return;
      } catch (error) {
        console.error('Search error:', error);
        return;
      }
    }

    if (selectedBreeds.length > 0) {
      const breedLikeConditions = selectedBreeds.flatMap(breed => {
        const normalizedBreed = breed.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
        const variants = [
          breed,
          breed.toLowerCase(),
          normalizedBreed,
          normalizedBreed.toLowerCase(),
        ];
        return variants.map(v => ({ breed: { _ilike: `%${v}%` } }));
      });
      andConditions.push({ _or: breedLikeConditions });
    }

    if (selectedSex) {
      andConditions.push({ sex: { _eq: selectedSex } });
    }

    if (readyToBreed) {
      andConditions.push({ ready_to_breed: { _eq: true } });
    }

    if (pregnant) {
      andConditions.push({ pregnant: { _eq: true } });
    }

    if (hasFrozenSperm) {
      andConditions.push({ has_frozen_sperm: { _eq: true } });
    }

    if (vaccinated !== null && vaccinated !== undefined) {
      andConditions.push({ vaccinated: { _eq: vaccinated } });
    }

    if (inbreedRate) {
      // inbreed_rate is stored as a STRING like '0,0 %' or '2,5 %'
      // We need to search it as a string
      const rateStr = inbreedRate.value.toString().replace('.', ','); // Convert decimal point to comma
      andConditions.push({ inbreed_rate: { _ilike: `${rateStr}%` } });
    }

    if (color) {
      // Search both 'color' and 'colour' fields
      andConditions.push({ 
        _or: [
          { color: { _ilike: `%${color}%` } },
          { colour: { _ilike: `%${color}%` } }
        ]
      });
    }

    if (kennelName) {
      andConditions.push({ _or: [
        { kennel_name: { _ilike: `%${kennelName}%` } },
        { kennel: { name: { _ilike: `%${kennelName}%` } } }
      ]});
    }

    if (nameContains) {
      andConditions.push({ name: { _ilike: `%${nameContains}%` } });
    }

    if (petId) {
      console.log('🔍 Using CONTAINS ID search for:', petId);
      andConditions.push({ id: { _ilike: `%${petId}%` } });
    }

    if (ageRange) {
      const currentDate = new Date();
      if (ageRange.max !== undefined) {
        // Max age means older, so date_born should be LESS than (older than) this date
        const minDate = new Date(currentDate.getFullYear() - ageRange.max, currentDate.getMonth(), currentDate.getDate());
        andConditions.push({ date_born: { _lte: minDate.toISOString().split('T')[0] } });
      }
      if (ageRange.min !== undefined) {
        // Min age means younger, so date_born should be GREATER than (more recent than) this date
        const maxDate = new Date(currentDate.getFullYear() - ageRange.min, currentDate.getMonth(), currentDate.getDate());
        andConditions.push({ date_born: { _gte: maxDate.toISOString().split('T')[0] } });
      }
    }

    if (weight) {
      const weightValue = weight.value;
      const operator = weight.operator;
      // Map 'less'/'greater'/'equal' to GraphQL operators '_lt'/'_gt'/'_eq'
      const opMap: { [key: string]: string } = { less: '_lt', greater: '_gt', equal: '_eq' };
      const graphQLOp = opMap[operator];
      andConditions.push({ weight: { [graphQLOp]: weightValue } });
    }

    const whereClause = andConditions.length > 0 ? { _and: andConditions } : {};

    console.log('📡 Final GraphQL query:', { where: whereClause, limit: 50 });
    console.log('📋 andConditions:', JSON.stringify(andConditions, null, 2));

    try {
      const { data } = await searchPets({
        variables: {
          where: whereClause,
          limit: 50,
        },
      });

      console.log('📦 Received data:', data?.pets?.length, 'pets');
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
    setVaccinated(null);
    setInbreedRate(null);
    setAgeRange(null);
    setWeight(null);
    setColor('');
    setKennelName('');
    setNameContains('');
    setPetId('');
    setId('');
  };

  const handleInbreedRateOperatorChange = (operator: 'less' | 'greater' | 'equal') => {
    setInbreedRate(prev => prev ? { ...prev, operator } : { operator, value: 0 });
  };

  const handleInbreedRateValueChange = (value: number) => {
    setInbreedRate(prev => prev ? { ...prev, value } : { operator: 'less', value });
  };

  const handleWeightOperatorChange = (operator: 'less' | 'greater' | 'equal') => {
    setWeight(prev => prev ? { ...prev, operator } : { operator, value: 0 });
  };

  const handleWeightValueChange = (value: number) => {
    setWeight(prev => prev ? { ...prev, value } : { operator: 'less', value });
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

            {/* Compact Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Breed Selection */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">Breed</h3>
                {breedsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                    <div className="divide-y divide-gray-100">
                      {breeds.map((breed) => {
                        const selected = selectedBreeds.includes(breed.name);
                        return (
                          <button
                            type="button"
                            key={breed.id}
                            onClick={() => handleBreedToggle(breed.name)}
                            className={`w-full text-left px-2 py-1.5 flex items-center justify-between transition-colors text-sm ${
                              selected
                                ? 'bg-[#e8f3f0] text-[#175c51]'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="truncate">{breed.name}</span>
                            <span
                              className={`ml-2 inline-block h-3 w-3 rounded border ${
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

              {/* Middle Column - Basic Filters */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-medium mb-2">Sex</h3>
                  <div className="flex gap-1">
                    {[
                      { key: 'male', label: 'Male' },
                      { key: 'female', label: 'Female' },
                      { key: null, label: 'Any' },
                    ].map((opt) => (
                      <button
                        key={String(opt.key)}
                        onClick={() => setSelectedSex(opt.key as 'male' | 'female' | null)}
                        className={`px-2 py-1.5 rounded border text-xs transition-colors ${
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
                  <h3 className="text-base font-medium mb-2">Status</h3>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setReadyToBreed((v) => !v)}
                      className={`w-full px-2 py-1.5 rounded border text-xs transition-colors text-left ${
                        readyToBreed ? 'bg-[#e8f3f0] border-[#3d7c6f] text-[#175c51]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Ready to Breed
                    </button>
                    <button
                      type="button"
                      onClick={() => setPregnant((v) => !v)}
                      className={`w-full px-2 py-1.5 rounded border text-xs transition-colors text-left ${
                        pregnant ? 'bg-[#e8f3f0] border-[#3d7c6f] text-[#175c51]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Pregnant
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasFrozenSperm((v) => !v)}
                      className={`w-full px-2 py-1.5 rounded border text-xs transition-colors text-left ${
                        hasFrozenSperm ? 'bg-[#e8f3f0] border-[#3d7c6f] text-[#175c51]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Has Frozen Sperm
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Vaccination</h3>
                  <div className="flex gap-1">
                    {[
                      { key: true, label: 'Vaccinated' },
                      { key: false, label: 'Not Vaccinated' },
                      { key: null, label: 'Any' },
                    ].map((opt) => (
                      <button
                        key={String(opt.key)}
                        onClick={() => setVaccinated(opt.key as boolean | null)}
                        className={`px-2 py-1.5 rounded border text-xs transition-colors ${
                          vaccinated === opt.key
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
              </div>

              {/* Right Column - Advanced Filters */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-medium mb-2">Inbreed Rate</h3>
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[
                        { key: 'less', label: 'Less' },
                        { key: 'greater', label: 'Greater' },
                        { key: 'equal', label: 'Equal' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleInbreedRateOperatorChange(opt.key as 'less' | 'greater' | 'equal')}
                          className={`px-2 py-1 rounded border text-xs transition-colors ${
                            inbreedRate?.operator === opt.key
                              ? 'bg-[#e8f3f0] border-[#3d7c6f] text-[#175c51]'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                          type="button"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Value"
                        value={inbreedRate?.value || ''}
                        onChange={(e) => handleInbreedRateValueChange(parseFloat(e.target.value) || 0)}
                        className="px-2 py-1 border border-gray-200 rounded text-xs flex-1"
                      />
                      <span className="text-xs text-gray-500 self-center">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Weight</h3>
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[
                        { key: 'less', label: 'Less' },
                        { key: 'greater', label: 'Greater' },
                        { key: 'equal', label: 'Equal' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleWeightOperatorChange(opt.key as 'less' | 'greater' | 'equal')}
                          className={`px-2 py-1 rounded border text-xs transition-colors ${
                            weight?.operator === opt.key
                              ? 'bg-[#e8f3f0] border-[#3d7c6f] text-[#175c51]'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                          type="button"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Weight"
                        value={weight?.value || ''}
                        onChange={(e) => handleWeightValueChange(parseFloat(e.target.value) || 0)}
                        className="px-2 py-1 border border-gray-200 rounded text-xs flex-1"
                      />
                      <span className="text-xs text-gray-500 self-center">kg</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Age Range</h3>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={ageRange?.min || ''}
                      onChange={(e) => setAgeRange(prev => ({ ...prev, min: parseInt(e.target.value) || undefined }))}
                      className="px-2 py-1 border border-gray-200 rounded text-xs flex-1"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={ageRange?.max || ''}
                      onChange={(e) => setAgeRange(prev => ({ ...prev, max: parseInt(e.target.value) || undefined }))}
                      className="px-2 py-1 border border-gray-200 rounded text-xs flex-1"
                    />
                    <span className="text-xs text-gray-500 self-center">yrs</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Color</h3>
                  <input
                    type="text"
                    placeholder="Color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                  />
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Kennel</h3>
                  <input
                    type="text"
                    placeholder="Kennel name"
                    value={kennelName}
                    onChange={(e) => setKennelName(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                  />
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Name</h3>
                  <input
                    type="text"
                    placeholder="Name contains"
                    value={nameContains}
                    onChange={(e) => setNameContains(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                  />
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Pet ID (Exact)</h3>
                  <input
                    type="text"
                    placeholder="Exact Pet ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                  />
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2">Pet ID (Contains)</h3>
                  <input
                    type="text"
                    placeholder="Pet ID contains"
                    value={petId}
                    onChange={(e) => setPetId(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                  />
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

export default function AdvancedFiltersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdvancedFiltersContent />
    </Suspense>
  );
}
