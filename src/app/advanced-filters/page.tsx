'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export default function AdvancedFiltersPage() {
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [selectedSex, setSelectedSex] = useState<'male' | 'female' | null>(null);
  const [readyToBreed, setReadyToBreed] = useState(false);
  const [pregnant, setPregnant] = useState(false);
  const [hasFrozenSperm, setHasFrozenSperm] = useState(false);

  // Mock breeds data
  const breeds = [
    'Golden Retriever', 'German Shepherd', 'Labrador', 'Border Collie', 
    'Beagle', 'Poodle', 'Bulldog', 'Rottweiler', 'Siberian Husky', 'Dachshund'
  ];

  const handleBreedToggle = (breed: string) => {
    setSelectedBreeds(prev => 
      prev.includes(breed) 
        ? prev.filter(b => b !== breed)
        : [...prev, breed]
    );
  };

  const handleSearch = () => {
    alert('Search functionality will be implemented here');
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
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                    <div className="divide-y divide-gray-100">
                      {breeds.map((breed) => {
                        const selected = selectedBreeds.includes(breed);
                        return (
                          <button
                            type="button"
                            key={breed}
                            onClick={() => handleBreedToggle(breed)}
                            className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                              selected
                                ? 'bg-[#e8f3f0] text-[#175c51]'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-sm">{breed}</span>
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
              <Button onClick={handleSearch}>
                Search
              </Button>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}