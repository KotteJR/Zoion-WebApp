import { create } from 'zustand';
import { SearchFilter } from '@/types/search';

interface SearchStore {
  filter: SearchFilter;
  setFilter: (filter: SearchFilter) => void;
  clearFilter: () => void;
}

const defaultFilter: SearchFilter = {
  breeds: [],
  sex: null,
  readyToBreed: false,
  pregnant: false,
  hasFrozenSperm: false,
};

export const useSearchStore = create<SearchStore>((set) => ({
  filter: defaultFilter,
  setFilter: (filter) => set({ filter }),
  clearFilter: () => set({ filter: defaultFilter }),
}));
