'use client';

import { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Accordion } from '@/components/ui/accordion';
import { MultiSelect } from '@/components/ui/multi-select';
import { Slider } from '@/components/ui/slider';
import { GET_ALL_BREEDS, SEARCH_PETS } from '@/lib/graphql/queries';
import { useSearchStore } from '@/store/search-store';
import { Breed } from '@/types/search';
import { cn } from '@/lib/utils';

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
  const [vaccinated, setVaccinated] = useState<boolean | null>(null); // Default: Alla
  const [inbreedRate, setInbreedRate] = useState<{ operator: 'less' | 'greater' | 'equal'; value: number } | null>(null);
  const [ageRange, setAgeRange] = useState<{ min?: number; max?: number } | null>(null);
  const [weight, setWeight] = useState<{ operator: 'less' | 'greater' | 'equal'; value: number } | null>(null);
  const [color, setColor] = useState<string>('');
  const [kennelName, setKennelName] = useState<string>('');
  const [nameContains, setNameContains] = useState<string>('');
  const [petId, setPetId] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [resultCount, setResultCount] = useState<number | null>(null);

  const { data: breedsData, loading: breedsLoading } = useQuery(GET_ALL_BREEDS);
  const [searchPets, { loading: searchLoading }] = useLazyQuery(SEARCH_PETS);

  const breeds: Breed[] = breedsData?.breeds || [];
  
  // Top 8 popular breeds (you can customize this list)
  const topBreeds = breeds.slice(0, 8).map(b => b.name);

  // Convert breeds to MultiSelect format
  const breedOptions = breeds.map(breed => ({
    value: breed.name,
    label: breed.name,
  }));

  // Load AI search filters from session storage
  useEffect(() => {
    const aiFilters = sessionStorage.getItem('aiSearchFilters');
    const aiParam = searchParams?.get('ai');
    
    const applyFilters = (parsedFilters: ParsedFilters) => {
      if (parsedFilters.breeds) setSelectedBreeds(parsedFilters.breeds);
      if (parsedFilters.sex !== undefined) setSelectedSex(parsedFilters.sex);
      if (parsedFilters.readyToBreed !== undefined) setReadyToBreed(parsedFilters.readyToBreed);
      if (parsedFilters.pregnant !== undefined) setPregnant(parsedFilters.pregnant);
      if (parsedFilters.hasFrozenSperm !== undefined) setHasFrozenSperm(parsedFilters.hasFrozenSperm);
      if (parsedFilters.vaccinated !== undefined) setVaccinated(parsedFilters.vaccinated);
      if (parsedFilters.inbreedRate) setInbreedRate(parsedFilters.inbreedRate);
      if (parsedFilters.ageRange) setAgeRange(parsedFilters.ageRange);
      if (parsedFilters.weight) setWeight(parsedFilters.weight);
      if (parsedFilters.color) setColor(parsedFilters.color);
      if (parsedFilters.kennelName) setKennelName(parsedFilters.kennelName);
      if (parsedFilters.nameContains) setNameContains(parsedFilters.nameContains);
    };
    
    if (aiFilters) {
      try {
        const parsedFilters = JSON.parse(aiFilters);
        applyFilters(parsedFilters);
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

  // Build where clause for GraphQL
  const buildWhereClause = useCallback(() => {
    const andConditions: any[] = [];

    if (id) {
      return { id: { _eq: id } };
    }

    if (selectedBreeds.length > 0) {
      const breedLikeConditions = selectedBreeds.flatMap(breed => {
        const normalizedBreed = breed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const variants = [breed, breed.toLowerCase(), normalizedBreed, normalizedBreed.toLowerCase()];
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
      const rateStr = inbreedRate.value.toString().replace('.', ',');
      andConditions.push({ inbreed_rate: { _ilike: `${rateStr}%` } });
    }

    if (color) {
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
      andConditions.push({ id: { _ilike: `%${petId}%` } });
    }

    if (ageRange) {
      const currentDate = new Date();
      if (ageRange.max !== undefined) {
        const minDate = new Date(currentDate.getFullYear() - ageRange.max, currentDate.getMonth(), currentDate.getDate());
        andConditions.push({ date_born: { _lte: minDate.toISOString().split('T')[0] } });
      }
      if (ageRange.min !== undefined) {
        const maxDate = new Date(currentDate.getFullYear() - ageRange.min, currentDate.getMonth(), currentDate.getDate());
        andConditions.push({ date_born: { _gte: maxDate.toISOString().split('T')[0] } });
      }
    }

    if (weight) {
      const opMap: { [key: string]: string } = { less: '_lt', greater: '_gt', equal: '_eq' };
      const graphQLOp = opMap[weight.operator];
      andConditions.push({ weight: { [graphQLOp]: weight.value } });
    }

    return andConditions.length > 0 ? { _and: andConditions } : {};
  }, [id, selectedBreeds, selectedSex, readyToBreed, pregnant, hasFrozenSperm, vaccinated, inbreedRate, color, kennelName, nameContains, petId, ageRange, weight]);


  const handleSearch = async () => {
    const whereClause = buildWhereClause();
    
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

    if (id) {
      try {
        const { data } = await searchPets({
          variables: {
            where: { id: { _eq: id } },
            limit: 1,
          },
        });
        if (data?.pets) {
          setResultCount(data.pets.length);
          router.push('/advanced-filters/results');
        }
        return;
      } catch (error) {
        console.error('Search error:', error);
        return;
      }
    }

    try {
      const { data } = await searchPets({
        variables: {
          where: whereClause,
          limit: 50,
        },
      });
      if (data?.pets) {
        setResultCount(data.pets.length);
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
    setResultCount(null);
  };

  // Get applied filters for the chip bar
  const appliedFilters = useMemo(() => {
    const filters: Array<{ key: string; label: string; onRemove: () => void }> = [];
    
    selectedBreeds.forEach(breed => {
      filters.push({
        key: `breed-${breed}`,
        label: `Ras: ${breed}`,
        onRemove: () => setSelectedBreeds(prev => prev.filter(b => b !== breed))
      });
    });
    
    if (selectedSex) {
      filters.push({
        key: 'sex',
        label: `Kön: ${selectedSex === 'male' ? 'Hane' : 'Tik'}`,
        onRemove: () => setSelectedSex(null)
      });
    }
    
    if (readyToBreed) {
      filters.push({
        key: 'readyToBreed',
        label: 'Redo att para',
        onRemove: () => setReadyToBreed(false)
      });
    }
    
    if (pregnant) {
      filters.push({
        key: 'pregnant',
        label: 'Dräktig',
        onRemove: () => setPregnant(false)
      });
    }
    
    if (hasFrozenSperm) {
      filters.push({
        key: 'hasFrozenSperm',
        label: 'Har fryst sperma',
        onRemove: () => setHasFrozenSperm(false)
      });
    }
    
    if (vaccinated !== null) {
      filters.push({
        key: 'vaccinated',
        label: `Vaccination: ${vaccinated ? 'Vaccinerad' : 'Ej vaccinerad'}`,
        onRemove: () => setVaccinated(null)
      });
    }
    
    if (inbreedRate) {
      const opLabels: Record<string, string> = { less: '≤', greater: '≥', equal: '=' };
      filters.push({
        key: 'inbreedRate',
        label: `Inavelsgrad: ${opLabels[inbreedRate.operator]} ${inbreedRate.value}%`,
        onRemove: () => setInbreedRate(null)
      });
    }
    
    if (ageRange) {
      const parts: string[] = [];
      if (ageRange.min !== undefined) parts.push(`≥ ${ageRange.min} år`);
      if (ageRange.max !== undefined) parts.push(`≤ ${ageRange.max} år`);
      if (parts.length > 0) {
        filters.push({
          key: 'ageRange',
          label: `Ålder: ${parts.join(', ')}`,
          onRemove: () => setAgeRange(null)
        });
      }
    }
    
    if (weight) {
      const opLabels: Record<string, string> = { less: '≤', greater: '≥', equal: '=' };
      filters.push({
        key: 'weight',
        label: `Vikt: ${opLabels[weight.operator]} ${weight.value} kg`,
        onRemove: () => setWeight(null)
      });
    }
    
    if (color) {
      filters.push({
        key: 'color',
        label: `Färg: ${color}`,
        onRemove: () => setColor('')
      });
    }
    
    if (kennelName) {
      filters.push({
        key: 'kennelName',
        label: `Kennel: ${kennelName}`,
        onRemove: () => setKennelName('')
      });
    }
    
    if (nameContains) {
      filters.push({
        key: 'nameContains',
        label: `Namn: ${nameContains}`,
        onRemove: () => setNameContains('')
      });
    }
    
    if (petId) {
      filters.push({
        key: 'petId',
        label: `ID innehåller: ${petId}`,
        onRemove: () => setPetId('')
      });
    }
    
    if (id) {
      filters.push({
        key: 'id',
        label: `Exakt ID: ${id}`,
        onRemove: () => setId('')
      });
    }
    
    return filters;
  }, [selectedBreeds, selectedSex, readyToBreed, pregnant, hasFrozenSperm, vaccinated, inbreedRate, ageRange, weight, color, kennelName, nameContains, petId, id]);

  const handleInbreedRateChange = (value: number | [number, number]) => {
    const numValue = typeof value === 'number' ? value : value[0];
    setInbreedRate(prev => prev ? { ...prev, value: numValue } : { operator: 'less', value: numValue });
  };

  const handleWeightChange = (value: number | [number, number]) => {
    const numValue = typeof value === 'number' ? value : value[0];
    setWeight(prev => prev ? { ...prev, value: numValue } : { operator: 'less', value: numValue });
  };

  const handleAgeRangeChange = (value: number | [number, number]) => {
    if (Array.isArray(value)) {
      setAgeRange({ min: value[0], max: value[1] });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full bg-transparent">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-visible rounded-xl border border-gray-100/30 bg-white/5 md:h-[calc(100vh-2rem)]">
            {/* Header with result count */}
            <div className="p-6 pb-4 border-b border-white/20 relative">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Avancerade Filter
                  {resultCount !== null && (
                    <span className="ml-2 text-lg font-normal text-white/70">
                      — {resultCount} resultat
                    </span>
                  )}
                </h2>
                {appliedFilters.length > 0 && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Rensa alla
                  </Button>
                )}
              </div>
              
              {/* Applied filters bar - always reserve space to prevent layout shift */}
              <div className="min-h-[40px] flex flex-wrap gap-2 mt-3">
                {appliedFilters.length > 0 && appliedFilters.map((filter) => (
                  <div
                    key={filter.key}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-white/10 text-white border border-white/20"
                  >
                    <span>{filter.label}</span>
                    <button
                      type="button"
                      onClick={filter.onRemove}
                      className="hover:bg-white/20 rounded p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Breeds (tall) */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium mb-3 text-white">Ras</h3>
                    {breedsLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <MultiSelect
                        options={breedOptions}
                        selected={selectedBreeds}
                        onChange={setSelectedBreeds}
                        placeholder="Sök raser..."
                        searchPlaceholder="Sök raser..."
                        maxHeight="400px"
                        topBreeds={topBreeds}
                      />
                    )}
                  </div>
                </div>

                {/* Right Column - All other filters */}
                <div className="space-y-4">
                  {/* Sex */}
                  <div>
                    <h3 className="text-base font-medium mb-2 text-white">Kön</h3>
                    <div className="flex gap-2">
                      {[
                        { key: 'male', label: 'Hane' },
                        { key: 'female', label: 'Tik' },
                        { key: null, label: 'Alla' },
                      ].map((opt) => (
                        <button
                          key={String(opt.key)}
                          onClick={() => setSelectedSex(opt.key as 'male' | 'female' | null)}
                          className={cn(
                            'px-3 py-1.5 rounded border text-sm transition-colors text-white',
                            selectedSex === opt.key
                              ? 'bg-white/10 border-white/30'
                              : 'bg-white/5 border-white/20 hover:border-white/30'
                          )}
                          type="button"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status - Compact chips in one row */}
                  <div>
                    <h3 className="text-base font-medium mb-2 text-white">Status</h3>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setReadyToBreed((v) => !v)}
                        className={cn(
                          'px-3 py-1.5 rounded border text-sm transition-colors text-white',
                          readyToBreed
                            ? 'bg-white/10 border-white/30'
                            : 'bg-white/5 border-white/20 hover:border-white/30'
                        )}
                      >
                        Redo att para
                      </button>
                      <button
                        type="button"
                        onClick={() => setPregnant((v) => !v)}
                        className={cn(
                          'px-3 py-1.5 rounded border text-sm transition-colors text-white',
                          pregnant
                            ? 'bg-white/10 border-white/30'
                            : 'bg-white/5 border-white/20 hover:border-white/30'
                        )}
                      >
                        Dräktig
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasFrozenSperm((v) => !v)}
                        className={cn(
                          'px-3 py-1.5 rounded border text-sm transition-colors text-white',
                          hasFrozenSperm
                            ? 'bg-white/10 border-white/30'
                            : 'bg-white/5 border-white/20 hover:border-white/30'
                        )}
                      >
                        Har fryst sperma
                      </button>
                    </div>
                  </div>

                  {/* Vaccination */}
                  <div>
                    <h3 className="text-base font-medium mb-2 text-white">Vaccination</h3>
                    <div className="flex gap-2">
                      {[
                        { key: true, label: 'Vaccinerad' },
                        { key: false, label: 'Ej vaccinerad' },
                        { key: null, label: 'Alla' },
                      ].map((opt) => (
                        <button
                          key={String(opt.key)}
                          onClick={() => setVaccinated(opt.key as boolean | null)}
                          className={cn(
                            'px-3 py-1.5 rounded border text-sm transition-colors text-white',
                            vaccinated === opt.key
                              ? 'bg-white/10 border-white/30'
                              : 'bg-white/5 border-white/20 hover:border-white/30'
                          )}
                          type="button"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inbreeding Rate - Slider with operator */}
                  <div>
                    <h3 className="text-base font-medium mb-2 text-white">Inavelsgrad (%)</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {[
                          { key: 'less', label: '≤' },
                          { key: 'greater', label: '≥' },
                          { key: 'equal', label: '=' },
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => setInbreedRate(prev => prev ? { ...prev, operator: opt.key as 'less' | 'greater' | 'equal' } : { operator: opt.key as 'less' | 'greater' | 'equal', value: 0 })}
                            className={cn(
                              'px-3 py-1.5 rounded border text-sm transition-colors text-white',
                              inbreedRate?.operator === opt.key
                                ? 'bg-white/10 border-white/30'
                                : 'bg-white/5 border-white/20 hover:border-white/30'
                            )}
                            type="button"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {inbreedRate && (
                        <div className="px-2">
                          <Slider
                            value={inbreedRate.value}
                            onChange={handleInbreedRateChange}
                            min={0}
                            max={15}
                            step={0.1}
                            formatValue={(v) => `${v.toFixed(1)}%`}
                          />
                          <div className="text-xs text-white/70 mt-1 text-center">
                            {inbreedRate.value.toFixed(1)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Age Range - Dual-handle slider */}
                  <div>
                    <h3 className="text-base font-medium mb-2 text-white">Ålder (år)</h3>
                    <div className="px-2">
                      <Slider
                        value={ageRange ? [ageRange.min || 0, ageRange.max || 15] : [0, 15]}
                        onChange={handleAgeRangeChange}
                        min={0}
                        max={15}
                        step={0.5}
                        dualHandle
                        formatValue={(v) => `${v.toFixed(1)} år`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/70 mt-1">
                      <span>{(ageRange?.min ?? 0).toFixed(1)} år</span>
                      <span>{(ageRange?.max ?? 15).toFixed(1)} år</span>
                    </div>
                  </div>

                  {/* Weight - Slider with operator */}
                  <div>
                    <h3 className="text-base font-medium mb-2 text-white">Vikt (kg)</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {[
                          { key: 'less', label: '≤' },
                          { key: 'greater', label: '≥' },
                          { key: 'equal', label: '=' },
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => setWeight(prev => prev ? { ...prev, operator: opt.key as 'less' | 'greater' | 'equal' } : { operator: opt.key as 'less' | 'greater' | 'equal', value: 0 })}
                            className={cn(
                              'px-3 py-1.5 rounded border text-sm transition-colors text-white',
                              weight?.operator === opt.key
                                ? 'bg-white/10 border-white/30'
                                : 'bg-white/5 border-white/20 hover:border-white/30'
                            )}
                            type="button"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {weight && (
                        <div className="px-2">
                          <Slider
                            value={weight.value}
                            onChange={handleWeightChange}
                            min={0}
                            max={100}
                            step={0.5}
                            formatValue={(v) => `${v.toFixed(1)} kg`}
                          />
                          <div className="text-xs text-white/70 mt-1 text-center">
                            {weight.value.toFixed(1)} kg
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <h3 className="text-base font-medium mb-2 text-white">Färg</h3>
                    <input
                      type="text"
                      placeholder="Färg"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full px-3 py-2 rounded text-sm bg-white/5 text-white placeholder:text-white/60 border border-white/20 focus:border-white/30 focus:outline-none"
                    />
                  </div>

                  {/* Advanced Accordion */}
                  <Accordion title="Avancerat" defaultOpen={false}>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-white/80 mb-1 block">Kennel</label>
                        <input
                          type="text"
                          placeholder="Kennelnamn"
                          value={kennelName}
                          onChange={(e) => setKennelName(e.target.value)}
                          className="w-full px-3 py-2 rounded text-sm bg-white/5 text-white placeholder:text-white/60 border border-white/20 focus:border-white/30 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/80 mb-1 block">Namn</label>
                        <input
                          type="text"
                          placeholder="Namn innehåller"
                          value={nameContains}
                          onChange={(e) => setNameContains(e.target.value)}
                          className="w-full px-3 py-2 rounded text-sm bg-white/5 text-white placeholder:text-white/60 border border-white/20 focus:border-white/30 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/80 mb-1 block">Hund-ID (Exakt)</label>
                        <input
                          type="text"
                          placeholder="Exakt Hund-ID"
                          value={id}
                          onChange={(e) => setId(e.target.value)}
                          className="w-full px-3 py-2 rounded text-sm bg-white/5 text-white placeholder:text-white/60 border border-white/20 focus:border-white/30 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/80 mb-1 block">Hund-ID (Innehåller)</label>
                        <input
                          type="text"
                          placeholder="Hund-ID innehåller"
                          value={petId}
                          onChange={(e) => setPetId(e.target.value)}
                          className="w-full px-3 py-2 rounded text-sm bg-white/5 text-white placeholder:text-white/60 border border-white/20 focus:border-white/30 focus:outline-none"
                        />
                      </div>
                    </div>
                  </Accordion>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 p-6 pt-4 border-t border-white/20 bg-white/5 backdrop-blur-sm">
              <div className="flex gap-3 items-center">
                <Button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="flex-1 bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 h-10"
                >
                  {searchLoading ? 'Söker...' : 'Visa resultat'}
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  disabled={searchLoading}
                  className="bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-white/30 h-10"
                >
                  Rensa
                </Button>
              </div>
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
