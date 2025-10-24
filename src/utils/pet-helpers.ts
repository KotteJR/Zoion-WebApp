import { Pet } from '@/types/pet';

export const getPetProfileImage = (pet: Pet): string => {
  if (pet.images_pets && pet.images_pets.length > 0) {
    return pet.images_pets[0].location;
  }
  return '/assets/icons/default_picture.svg';
};

export const getPetTags = (pet: Pet): string[] => {
  const tags: string[] = [];
  
  if (pet.ready_to_breed) {
    tags.push('Ready to Breed');
  }
  
  if (pet.pregnant) {
    tags.push('Pregnant');
  }
  
  if (pet.has_frozen_sperm) {
    tags.push('Frozen Sperm Available');
  }
  
  if (pet.vaccinated) {
    tags.push('Vaccinated');
  }
  
  return tags;
};

export const getPetAge = (pet: Pet): number => {
  if (!pet.date_born) return 0;
  
  const birthDate = new Date(pet.date_born);
  const today = new Date();
  const ageInYears = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return ageInYears - 1;
  }
  
  return ageInYears;
};

export const getPetDisplayName = (pet: Pet): string => {
  return `${pet.name} (${pet.breed})`;
};

export const isPetAvailableForBreeding = (pet: Pet): boolean => {
  return pet.ready_to_breed && !pet.pregnant;
};
