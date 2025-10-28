export interface Pet {
  id: string;
  owner_id?: string;
  name?: string;
  breed?: string;
  date_born?: string;
  inbreed_rate?: string;
  sex?: 'male' | 'female';
  last_period_date?: string;
  next_breeding_date?: string;
  kennel_name?: string;
  weight?: number;
  vaccinated?: boolean;
  colour?: string;
  has_frozen_sperm?: boolean;
  ready_to_breed?: boolean;
  pregnant?: boolean;
  pregnant_expecting_puppies_count?: number;
  chip_id?: number;
  isFavorite?: boolean;
  competitions_aggregate?: CompetitionsAggregate;
  competitions?: Competition[];
  images_pets?: DogImage[];
  owner?: Owner;
  kennel?: Breeder;
  favorites?: { id: string }[];
  family_tree?: string | null;
}

export interface CompetitionsAggregate {
  aggregate: {
    count: number;
  };
}

export interface Competition {
  id: string;
  name: string;
  competitionDate?: string;
}

export interface Owner {
  id?: string;
  given_name?: string;
  family_name?: string;
  profile_picture?: string;
  address?: string;
}

export interface DogImage {
  id?: string;
  dogImage?: string;
  location?: string;
}

export interface Breeder {
  id?: string;
  name?: string;
  address?: string;
  post_number?: string;
}

export interface PetPedigree {
  id: string;
  name: string;
  breed?: string;
  sex?: string;
  profilePicture?: string;
  father?: PetPedigree;
  mother?: PetPedigree;
}

export interface PetTrophy {
  id: string;
  name: string;
  competitionDate?: string;
  location?: string;
  placement?: string;
}


