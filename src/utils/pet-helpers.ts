import { Pet } from '@/types/pet';

export function calculateAge(birthDate: string | Date): string {
  const birth = new Date(birthDate);
  const today = new Date();
  const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  
  if (ageInMonths < 12) {
    return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
    }
  }
}

export function getPetStatus(pet: Pet): string[] {
  const statuses: string[] = [];
  
  if (pet.ready_to_breed) {
    statuses.push('Ready to Breed');
  }
  
  if (pet.pregnant) {
    statuses.push('Pregnant');
  }
  
  if (pet.has_frozen_sperm) {
    statuses.push('Has Frozen Sperm');
  }
  
  if (pet.vaccinated) {
    statuses.push('Vaccinated');
  }
  
  return statuses;
}

export function getPrimaryImage(pet: Pet): string | null {
  const primaryImage = pet.images_pets?.find(img => img.profile_picture);
  return primaryImage?.location || pet.images_pets?.[0]?.location || null;
}

export function getPetDisplayName(pet: Pet): string {
  return `${pet.name} (${pet.breed})`;
}

export function getOwnerDisplayName(pet: Pet): string {
  if (!pet.owner) return 'Unknown Owner';
  return `${pet.owner.given_name} ${pet.owner.family_name}`;
}

export function getKennelDisplayName(pet: Pet): string {
  if (!pet.kennel) return 'No Kennel';
  return pet.kennel.name;
}

export function getCompetitionCount(pet: Pet): number {
  return pet.competitions_aggregate?.aggregate?.count || 0;
}

export function getMedicalRecordCount(pet: Pet): number {
  return pet.medical_records_aggregate?.aggregate?.count || 0;
}

export function isPetReadyToBreed(pet: Pet): boolean {
  return pet.ready_to_breed === true;
}

export function isPetPregnant(pet: Pet): boolean {
  return pet.pregnant === true;
}

export function hasFrozenSperm(pet: Pet): boolean {
  return pet.has_frozen_sperm === true;
}

export function isVaccinated(pet: Pet): boolean {
  return pet.vaccinated === true;
}

export function getPetProfileImage(pet: Pet): string | null {
  return getPrimaryImage(pet);
}

export function getPetTags(pet: Pet): string[] {
  return getPetStatus(pet);
}