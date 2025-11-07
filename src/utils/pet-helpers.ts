import { Pet } from '@/types/pet';

const normalize = (s: string) => s.toLowerCase().trim();

const fallbackByBreed = (breed?: string): string => {
  if (!breed) return '/assets/icons/default_picture.svg';
  
  // Try multiple variations of the breed name to match the actual files
  const variations = [
    // Direct match
    breed.toLowerCase().replace(/[,()/]/g, ' ').replace(/\s+/g, '_'),
    // Remove special characters and spaces
    breed.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    // Handle common breed name variations
    breed.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
    // Handle Swedish characters
    breed.toLowerCase()
      .replace(/å/g, 'a')
      .replace(/ä/g, 'a') 
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
  ];
  
  // For now, return the first variation - we'll add proper checking later
  return `/assets/breeds/${variations[0]}.png`;
};

// Normalize and validate image URLs
const normalizeImageUrl = (url: string | undefined | null): string | null => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }

  const trimmed = url.trim();
  
  // If it's already a relative path (starts with /), return as is
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // If it's a data URL, return as is
  if (trimmed.startsWith('data:')) {
    return trimmed;
  }

  try {
    // Try to parse as URL
    let parsedUrl: URL;
    
    // If URL doesn't have protocol, add https://
    if (!trimmed.match(/^https?:\/\//i)) {
      parsedUrl = new URL(`https://${trimmed}`);
    } else {
      parsedUrl = new URL(trimmed);
    }

    // Force HTTPS for external URLs
    if (parsedUrl.protocol === 'http:') {
      parsedUrl.protocol = 'https:';
    }

    return parsedUrl.toString();
  } catch (error) {
    // Invalid URL, return null to trigger fallback
    console.warn('Invalid image URL:', trimmed, error);
    return null;
  }
};

export const getPetProfileImage = (pet: Pet): string => {
  if (pet.images_pets && pet.images_pets.length > 0) {
    const firstImage = pet.images_pets[0];
    const imageUrl = normalizeImageUrl(firstImage.location || firstImage.dogImage);
    
    if (imageUrl) {
      return imageUrl;
    }
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


