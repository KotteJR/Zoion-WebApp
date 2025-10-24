import { create } from 'zustand';

export interface SearchFilter {
  breeds?: string[];
  sex?: 'male' | 'female' | null;
  readyToBreed?: boolean;
  pregnant?: boolean;
  hasFrozenSperm?: boolean;
  location?: string;
  ageRange?: {
    min: number;
    max: number;
  };
}

interface SearchStore {
  filter: SearchFilter;
  setFilter: (filter: SearchFilter) => void;
  clearFilter: () => void;
  results: any[];
  setResults: (results: any[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  filter: {},
  setFilter: (filter) => set({ filter }),
  clearFilter: () => set({ filter: {} }),
  results: [],
  setResults: (results) => set({ results }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
