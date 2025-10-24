'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
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

  const toggleBreed = (breedName: string) => {
    setSelectedBreeds((prev) =>
      prev.includes(breedName) ? prev.filter((b) => b !== breedName) : [...prev, breedName]
    );
  };

  const handleSearch = () => {
    alert('Search functionality will be implemented here');
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
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Search</h2>
              <p className="text-sm text-muted-foreground">Find the perfect breeding partner for your pet</p>
            </div>

            <div className="grid gap-6">
              {/* Sex Selection */}
              <div className="grid gap-3">
                <label className="text-sm font-medium">Sex</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedSex === 'male' ? 'default' : 'outline'}
                    onClick={() => setSelectedSex(selectedSex === 'male' ? null : 'male')}
                    className="justify-start"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Male
                  </Button>
                  <Button
                    variant={selectedSex === 'female' ? 'default' : 'outline'}
                    onClick={() => setSelectedSex(selectedSex === 'female' ? null : 'female')}
                    className="justify-start"
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
                  <label className="text-sm font-medium">Breeds</label>
                  {selectedBreeds.length > 0 && (
                    <span className="text-sm text-muted-foreground">{selectedBreeds.length} selected</span>
                  )}
                </div>
                <div className="grid max-h-[300px] grid-cols-2 gap-2 overflow-auto rounded-md border p-3 md:grid-cols-3 lg:grid-cols-4">
                  {breeds.map((breed) => (
                    <Button
                      key={breed}
                      variant={selectedBreeds.includes(breed) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleBreed(breed)}
                      className="justify-start text-xs"
                    >
                      {breed}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="grid gap-3">
                <label className="text-sm font-medium">Additional Filters</label>
                <div className="grid gap-3">
                  <label className="flex items-center gap-2 rounded-md border p-3 hover:bg-accent">
                    <input
                      type="checkbox"
                      checked={readyToBreed}
                      onChange={(e) => setReadyToBreed(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Ready to Breed
                    </span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border p-3 hover:bg-accent">
                    <input
                      type="checkbox"
                      checked={pregnant}
                      onChange={(e) => setPregnant(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Pregnant
                    </span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border p-3 hover:bg-accent">
                    <input
                      type="checkbox"
                      checked={hasFrozenSperm}
                      onChange={(e) => setHasFrozenSperm(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Has Frozen Sperm
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t pt-4">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Reset
                </Button>
                <Button onClick={handleSearch} className="flex-1">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}