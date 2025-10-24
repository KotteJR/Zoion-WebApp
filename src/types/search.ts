export interface SearchFilter {
  breeds?: string[];
  sex?: 'male' | 'female' | null;
  minAge?: number;
  maxAge?: number;
  readyToBreed?: boolean;
  hasFrozenSperm?: boolean;
  pregnant?: boolean;
  vaccinated?: boolean;
  city?: string;
}

export interface Breed {
  id: string;
  name: string;
  defaultImageUrl?: string;
}


