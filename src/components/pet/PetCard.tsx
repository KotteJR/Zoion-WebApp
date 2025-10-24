'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pet } from '@/types/pet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface PetCardProps {
  pet: Pet;
  onFavoriteChange?: () => void;
}

export default function PetCard({ pet, onFavoriteChange }: PetCardProps) {
  const [isFavorited, setIsFavorited] = useState(pet.favorites && pet.favorites.length > 0);
  
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement favorite mutation
    onFavoriteChange?.();
  };

  const getPetImage = () => {
    if (pet.images_pets && pet.images_pets.length > 0) {
      return pet.images_pets[0].location;
    }
    return '/assets/icons/default_picture.svg';
  };

  const getAge = () => {
    if (!pet.date_born) return 'Unknown';
    const birthDate = new Date(pet.date_born);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return ageInYears - 1;
    }
    return ageInYears;
  };

  const getStatusBadges = () => {
    const badges = [];
    
    if (pet.ready_to_breed) {
      badges.push(
        <span key="ready" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Ready to Breed
        </span>
      );
    }
    
    if (pet.pregnant) {
      badges.push(
        <span key="pregnant" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Pregnant
        </span>
      );
    }
    
    if (pet.has_frozen_sperm) {
      badges.push(
        <span key="sperm" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Frozen Sperm
        </span>
      );
    }
    
    if (pet.vaccinated) {
      badges.push(
        <span key="vaccinated" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Vaccinated
        </span>
      );
    }
    
    return badges;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={getPetImage()}
            alt={`${pet.name} - ${pet.breed}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <svg
              className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{pet.name}</h3>
            <span className="text-sm text-gray-500 capitalize">{pet.sex}</span>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Breed:</span> {pet.breed}</p>
            <p><span className="font-medium">Age:</span> {getAge()} years</p>
            {pet.kennel_name && (
              <p><span className="font-medium">Kennel:</span> {pet.kennel_name}</p>
            )}
            {pet.colour && (
              <p><span className="font-medium">Color:</span> {pet.colour}</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {getStatusBadges()}
          </div>
          
          {pet.competitions_aggregate && pet.competitions_aggregate.aggregate.count > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {pet.competitions_aggregate.aggregate.count} competitions
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="outline">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
