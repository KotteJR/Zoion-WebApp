export interface SearchFilter {
  breeds?: string[];
  sex?: 'male' | 'female' | null;
  minAge?: number;
  maxAge?: number;
  readyToBreed?: boolean;
  hasFrozenSperm?: boolean;
  pregnant?: boolean;
  vaccinated?: boolean | null;
  inbreedRate?: {
    operator: 'less' | 'greater' | 'equal';
    value: number;
  } | null;
  ageRange?: {
    min?: number;
    max?: number;
  } | null;
  weight?: {
    operator: 'less' | 'greater' | 'equal';
    value: number;
  } | null;
  color?: string;
  kennelName?: string;
  nameContains?: string;
  petId?: string;
  city?: string;
}

export interface Breed {
  id: string;
  name: string;
  defaultImageUrl?: string;
}


