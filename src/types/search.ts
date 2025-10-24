export interface Breed {
  id: string;
  name: string;
  default_image_url?: string;
}

export interface SearchFilter {
  breeds?: string[];
  sex?: 'male' | 'female' | null;
  readyToBreed?: boolean;
  pregnant?: boolean;
  hasFrozenSperm?: boolean;
}
