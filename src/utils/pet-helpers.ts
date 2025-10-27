import { Pet } from '@/types/pet';

const normalize = (s: string) => s.toLowerCase().trim();

const fallbackByBreed = (breed?: string): string => {
  if (!breed) return '/assets/icons/default_picture.svg';
  // Attempt i) direct match by normalized breed file name with underscores
  const fileGuess = `/assets/breeds/${breed
    .toLowerCase()
    .replace(/[,()/]/g, ' ')
    .replace(/\s+/g, '_')}.png`;
  return fileGuess;
};

export const getPetProfileImage = (pet: Pet): string => {
  if (pet.images_pets && pet.images_pets.length > 0) {
    const firstImage = pet.images_pets[0];
    return firstImage.location || firstImage.dogImage || '';
  }
  
  // Fallback to local breed artwork when no user image
  return fallbackByBreed(pet.breed);
};

export const getBreedIcon = (breed: string): string => {
  // Convert breed name to filename format
  const breedFileName = breed.toLowerCase().replace(/\s+/g, '_');
  return `/assets/breeds/${breedFileName}.png`;
};

export const getPetTags = (pet: Pet): string[] => {
  const tags: string[] = [];
  
  if (pet.ready_to_breed) {
    tags.push('Ready to Breed');
  }
  
  if (pet.pregnant) {
    tags.push('Expecting Puppies');
  }
  
  if (pet.has_frozen_sperm) {
    tags.push('Frozen Sperm Available');
  }
  
  if (pet.vaccinated) {
    tags.push('Vaccinated');
  }
  
  if (pet.competitions_aggregate && pet.competitions_aggregate.aggregate.count > 0) {
    tags.push(`${pet.competitions_aggregate.aggregate.count} Competition${pet.competitions_aggregate.aggregate.count > 1 ? 's' : ''}`);
  }
  
  return tags;
};

export const getSexIcon = (sex: string): string => {
  return sex === 'male' ? '/assets/icons/male_icon.svg' : '/assets/icons/female_icon.svg';
};

export const extractCity = (postNumber?: string): string | null => {
  if (!postNumber) return null;
  
  // This is a simplified version - you may want to implement a proper city lookup
  // based on Swedish postal codes
  return postNumber;
};


