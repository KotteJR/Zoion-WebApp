'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pet } from '@/types/pet';
import { getPetProfileImage, getPetTags } from '@/utils/pet-helpers';
import { getAgeString } from '@/utils/date-helpers';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PetCardProps {
  pet: Pet;
  onFavoriteChange?: () => void;
}

export default function PetCard({ pet, onFavoriteChange }: PetCardProps) {
  const router = useRouter();
  const profileImage = getPetProfileImage(pet);
  const tags = getPetTags(pet);
  const ageString = pet.date_born ? getAgeString(pet.date_born) : 'Age unknown';
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    const encodedId = encodeURIComponent(pet.id);
    console.log('Navigating to pet:', pet.id, 'Encoded:', encodedId);
    router.push(`/pet/${encodedId}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert('Favorite feature coming soon!');
  };

  if (!pet.id) {
    console.error('PetCard - ERROR: Pet has no ID!', pet);
    return null;
  }

  return (
    <div onClick={handleCardClick} className="block cursor-pointer">
      <Card className="overflow-hidden transition-all duration-200 hover:border-white/30 border-white/20 bg-white/15 border border-white/10 text-white">
        <CardHeader className="p-0">
          <div className="relative h-48 bg-transparent">
            {/* Soft white glow behind the image */}
            <div className="pointer-events-none absolute inset-0 z-0 rounded-t-[inherit] blur-2xl bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.0)_65%)]" />
            {!imageError ? (
              <Image
                src={profileImage}
                alt={pet.name || 'Pet'}
                fill
                className="object-contain object-center relative z-10"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-white/70">No image</p>
                </div>
              </div>
            )}

            
            {/* Gender Badge */}
            {pet.sex && (
              <div className="absolute top-2 left-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 border border-white/30">
                  <span className="text-md font-bold text-white">
                    {pet.sex === 'male' ? '♂' : '♀'}
                  </span>
                </div>
              </div>
            )}

            {/* Favorite Button */}
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteClick}
                className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full"
              >
                <svg 
                  className={`w-4 h-4 ${pet.isFavorite ? 'fill-red-400 text-red-400' : 'text-white/80'}`} 
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
              </Button>
            </div>

            {/* Awards Badge */}
            {pet.competitions_aggregate && pet.competitions_aggregate.aggregate.count > 0 && (
              <div className="absolute bottom-3 right-3">
                <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 22L12 18.77L5.82 22L7 14L2 9L8.91 8.26L12 2Z"/>
                  </svg>
                  <span className="text-xs font-medium">
                    {pet.competitions_aggregate.aggregate.count}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Pet Name and Breed */}
            <div>
              <h3 className="text-lg font-semibold text-white truncate">{pet.name}</h3>
              <p className="text-sm text-white/80">{pet.breed}</p>
            </div>

            {/* Pet Details */}
            <div className="space-y-1 text-sm text-white/80">
              <p>{ageString}</p>
              {pet.owner && (
                <p className="truncate">
                  Owner: {pet.owner.given_name} {pet.owner.family_name}
                </p>
              )}
              {pet.kennel && (
                <p className="flex items-center gap-1 truncate">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {pet.kennel.address}
                </p>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/10 text-white border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
