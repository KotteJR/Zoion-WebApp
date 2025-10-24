'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Calendar, Trophy, Stethoscope } from 'lucide-react';
import { Pet } from '@/types/pet';
import { cn } from '@/lib/utils';

interface PetCardProps {
  pet: Pet;
  showOwner?: boolean;
  className?: string;
  onFavoriteChange?: () => void;
}

export default function PetCard({ pet, showOwner = true, className, onFavoriteChange }: PetCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  const primaryImage = pet.images_pets?.find(img => img.profile_picture) || pet.images_pets?.[0];
  const competitionCount = pet.competitions_aggregate?.aggregate?.count || 0;
  const medicalCount = pet.medical_records_aggregate?.aggregate?.count || 0;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavoriteChange?.();
  };

  return (
    <Link href={`/pet/${pet.id}`} className={cn("block", className)}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          {primaryImage && !imageError ? (
            <Image
              src={primaryImage.location}
              alt={pet.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
          
          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </button>

          {/* Status badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {pet.ready_to_breed && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Ready to Breed
              </span>
            )}
            {pet.pregnant && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Pregnant
              </span>
            )}
            {pet.has_frozen_sperm && (
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                Frozen Sperm
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
              <p className="text-gray-600 text-sm">{pet.breed}</p>
            </div>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              pet.sex === 'male' 
                ? "bg-blue-100 text-blue-800" 
                : "bg-pink-100 text-pink-800"
            )}>
              {pet.sex}
            </span>
          </div>

          {/* Owner info */}
          {showOwner && pet.owner && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {pet.owner.given_name?.[0]}{pet.owner.family_name?.[0]}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {pet.owner.given_name} {pet.owner.family_name}
              </span>
            </div>
          )}

          {/* Location */}
          {pet.kennel?.address && (
            <div className="flex items-center gap-1 mb-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{pet.kennel.address}</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {competitionCount > 0 && (
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                <span>{competitionCount} competition{competitionCount !== 1 ? 's' : ''}</span>
              </div>
            )}
            {medicalCount > 0 && (
              <div className="flex items-center gap-1">
                <Stethoscope className="h-4 w-4" />
                <span>{medicalCount} record{medicalCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}