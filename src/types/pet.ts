export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  breed: string;
  date_born: string;
  inbreed_rate?: number;
  sex: 'male' | 'female';
  last_period_date?: string;
  kennel_name?: string;
  colour?: string;
  weight?: number;
  vaccinated?: boolean;
  has_frozen_sperm?: boolean;
  ready_to_breed?: boolean;
  next_breeding_date?: string;
  pregnant?: boolean;
  pregnant_expecting_puppies_count?: number;
  chip_id?: string;
  owner?: {
    id: string;
    given_name: string;
    family_name: string;
    address?: string;
    profile_picture?: string;
  };
  kennel?: {
    id: string;
    name: string;
    address?: string;
    post_number?: string;
  };
  images_pets?: Array<{
    id: string;
    location: string;
    profile_picture?: boolean;
  }>;
  competitions?: Array<{
    id: string;
    name: string;
    competition_date: string;
    location?: string;
    placement?: string;
  }>;
  competitions_aggregate?: {
    aggregate: {
      count: number;
    };
  };
  medical_records_aggregate?: {
    aggregate: {
      count: number;
    };
  };
  favorites?: Array<{
    id: string;
  }>;
}

export interface Competition {
  id: string;
  name: string;
  competition_date: string;
  location?: string;
  placement?: string;
  pet_id: string;
}

export interface MedicalRecord {
  id: string;
  pet_id: string;
  record_type: string;
  description?: string;
  date: string;
  veterinarian?: string;
}

export interface PetPedigree {
  id: string;
  name: string;
  breed: string;
  sex: 'male' | 'female';
  images_pets?: Array<{
    location: string;
  }>;
  father?: PetPedigree | null;
  mother?: PetPedigree | null;
}