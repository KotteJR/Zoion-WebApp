import { create } from 'zustand';
import { SearchFilter } from '@/types/search';

interface SearchState {
  filter: SearchFilter;
  setFilter: (filter: SearchFilter) => void;
  resetFilter: () => void;
}

const defaultFilter: SearchFilter = {
  breeds: [],
  sex: null,
  readyToBreed: false,
  hasFrozenSperm: false,
  pregnant: false,
  vaccinated: false,
};

export const useSearchStore = create<SearchState>((set) => ({
  filter: defaultFilter,
  setFilter: (filter) => set({ filter }),
  resetFilter: () => set({ filter: defaultFilter }),
}));


