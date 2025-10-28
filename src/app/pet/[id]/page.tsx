'use client';

import { useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { GET_PET_DETAILS } from '@/lib/graphql/queries';
import { getPetProfileImage, getPetTags } from '@/utils/pet-helpers';
import { getAgeString, formatDateShort } from '@/utils/date-helpers';
import FamilyTree from '@/components/pet/FamilyTree';
import { Trophy, Stethoscope } from 'lucide-react';

export default function PetProfilePage() {
  const params = useParams();
  const router = useRouter();
  // Decode in case the id contains a slash or special chars
  const petId = decodeURIComponent(params.id as string);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data, loading, error } = useQuery(GET_PET_DETAILS, {
    variables: { petId },
  });

  // Log any errors for debugging
  if (error) {
    console.error('GraphQL Error fetching pet details:', error);
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6">
              <LoadingSpinner />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const pet = data?.pets?.[0];

  // Debug logging
  console.log('Pet data:', pet);
  console.log('Family tree data:', pet?.family_tree);
  console.log('Raw GraphQL response:', data);

  if (!pet && !loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 text-center">
              <div className="text-6xl mb-4">🐕</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pet Not Found</h2>
              <p className="text-gray-600 text-base mb-4">
                We couldn't find a pet with ID: {petId}
              </p>
              {error && (
                <p className="text-sm text-red-600 mb-4">Error: {error.message}</p>
              )}
              <Button onClick={() => router.push('/home')}>
                Back to Home
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const images = pet.images_pets || [];
  const currentImage = images[currentImageIndex]?.location || getPetProfileImage(pet);
  const tags = getPetTags(pet);
  const ageString = pet.date_born ? getAgeString(pet.date_born) : 'Age unknown';

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => router.back()}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </Button>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:items-stretch">
              {/* Left Column - Image Gallery */}
              <div>
                <Card className="overflow-hidden h-full flex flex-col">
                  <CardHeader className="p-0 flex-1">
                    {/* Keep a stable aspect to avoid odd crops and ensure full fit */}
                    <div className="relative h-full min-h-[260px] md:min-h-[360px] lg:min-h-[420px] bg-white">
                      <Image
                        src={currentImage}
                        alt={pet.name}
                        fill
                        className="object-contain object-center bg-white"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                        unoptimized
                      />
                      {/* Gender Badge */}
                      {pet.sex && (
                        <div className="absolute top-3 left-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 border border-gray-200">
                            <span className="text-sm font-bold text-[#3d7c6f]">
                              {pet.sex === 'male' ? '♂' : '♀'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  {images.length > 1 && (
                    <CardContent className="p-4 flex-shrink-0">
                      <div className="flex gap-2 overflow-x-auto">
                        {images.map((img: any, index: number) => (
                          <button
                            key={img.id}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                              index === currentImageIndex ? 'border-[#3d7c6f]' : 'border-gray-200'
                            }`}
                          >
                            <Image src={img.location} alt={`${pet.name} ${index + 1}`} fill className="object-cover" unoptimized />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>

              {/* Right Column - Pet Info and Owner */}
              <div className="flex flex-col space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">{pet.name}</h1>
                        <p className="text-xl text-muted-foreground mb-1">{pet.breed}</p>
                        <p className="text-sm text-gray-600 font-mono">{pet.id}</p>
                      </div>
                      {pet.competitions_aggregate?.aggregate.count > 0 && (
                        <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 px-3 py-2 rounded-full">
                          <Trophy className="w-4 h-4 text-yellow-800" />
                          <span className="text-sm font-medium text-yellow-800">
                            {pet.competitions_aggregate.aggregate.count}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Age</p>
                        <p className="text-base font-medium text-gray-900">{ageString}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Sex</p>
                        <p className="text-base font-medium text-gray-900 capitalize">{pet.sex}</p>
                      </div>
                      {pet.colour && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Color</p>
                          <p className="text-base font-medium text-gray-900">{pet.colour}</p>
                        </div>
                      )}
                      {pet.weight && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Weight</p>
                          <p className="text-base font-medium text-gray-900">{pet.weight} kg</p>
                        </div>
                      )}
                      {pet.inbreed_rate && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Inbreed Rate</p>
                          <p className="text-base font-medium text-gray-900">{pet.inbreed_rate}%</p>
                        </div>
                      )}
                      {pet.kennel_name && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Kennel</p>
                          <p className="text-base font-medium text-gray-900">{pet.kennel_name}</p>
                        </div>
                      )}
                      {pet.vaccinated !== null && pet.vaccinated !== undefined && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Vaccinated</p>
                          <p className="text-base font-medium text-gray-900">{pet.vaccinated ? 'Yes' : 'No'}</p>
                        </div>
                      )}
                      {pet.date_born && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                          <p className="text-base font-medium text-gray-900">{formatDateShort(pet.date_born)}</p>
                        </div>
                      )}
                      {pet.next_breeding_date && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Next Breeding Date</p>
                          <p className="text-base font-medium text-gray-900">{formatDateShort(pet.next_breeding_date)}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4 border-t">
                      <div className="flex gap-3">
                        {pet.competitions_aggregate?.aggregate.count > 0 && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex-1">
                                <Trophy className="w-4 h-4 mr-2" />
                                Trophies ({pet.competitions_aggregate.aggregate.count})
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                                  <Trophy className="w-5 h-5 text-yellow-600" />
                                  {pet.name}'s Trophies
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3">
                                {pet.competitions?.map((competition: any) => (
                                  <div key={competition.id} className="p-4 border rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-semibold text-lg">{competition.name}</h3>
                                      <span className="text-sm text-gray-600">{formatDateShort(competition.competition_date)}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      {competition.location && (
                                        <div><strong>Location:</strong> {competition.location}</div>
                                      )}
                                      {competition.organization && (
                                        <div><strong>Organization:</strong> {competition.organization}</div>
                                      )}
                                      {competition.type && (
                                        <div><strong>Type:</strong> {competition.type}</div>
                                      )}
                                      {competition.value && (
                                        <div><strong>Value:</strong> {competition.value}</div>
                                      )}
                                    </div>
                                    {competition.meaning && (
                                      <div className="mt-2 rounded-md bg-green-50 border border-green-200 p-2 text-sm text-green-800">
                                        <strong>Result:</strong> {competition.meaning}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        {pet.medical_records_aggregate?.aggregate.count > 0 && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex-1">
                                <Stethoscope className="w-4 h-4 mr-2" />
                                Medical Records ({pet.medical_records_aggregate.aggregate.count})
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                                  <Stethoscope className="w-5 h-5 text-blue-700" />
                                  {pet.name}'s Medical Records
                                </DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-1 gap-4">
                                {pet.medical_records?.map((record: any) => (
                                  <div key={record.id} className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <h3 className="text-base font-semibold text-gray-900">{record.diagnose}</h3>
                                      <span className="text-xs rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700 border border-blue-200">
                                        {formatDateShort(record.date)}
                                      </span>
                                    </div>
                                    <div className="mt-3 text-sm text-gray-700">
                                      <div className="inline-flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1">
                                        <span className="text-gray-500">Veterinary:</span> {record.veterinary}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => router.push(`/provparning?target=${encodeURIComponent(petId)}`)}
                        className="bg-[#3d7c6f] hover:bg-[#2f6a5e] text-white flex items-center gap-2 flex-1"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        Provparning
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Owner Info Card */}
                {pet.owner && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                          {pet.owner.profile_picture ? (
                            <Image src={pet.owner.profile_picture} alt="Owner" fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                              {pet.owner.given_name?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {pet.owner.given_name} {pet.owner.family_name}
                          </p>
                          {pet.owner.address && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {pet.owner.address}
                            </p>
                          )}
                        </div>
                        <Button onClick={() => router.push(`/breeder/${pet.owner_id}`)} variant="outline">View Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Family Tree */}
            <FamilyTree 
              familyTreeData={pet.family_tree} 
              petName={pet.name} 
              petId={petId} 
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}