'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { GET_FAMILY_TREE } from '@/lib/graphql/queries';
import { PetPedigree } from '@/types/pet';

interface PetNodeProps {
  pet: PetPedigree | null;
  generation: number;
}

function PetNode({ pet, generation }: PetNodeProps) {
  if (!pet) {
    return (
      <div className="bg-gray-100 rounded-lg p-3 text-center text-gray-400 text-sm min-w-[120px]">
        Unknown
      </div>
    );
  }

  const image = pet.profilePicture || '/images/default-dog.png';

  return (
    <div className="bg-white rounded-lg shadow-md p-3 min-w-[120px] hover:shadow-lg transition-shadow">
      <div className="relative w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-200">
        <Image src={image} alt={pet.name} fill className="object-cover" unoptimized />
      </div>
      <p className="text-sm font-medium text-gray-800 text-center truncate">{pet.name}</p>
      <p className="text-xs text-gray-500 text-center">{pet.breed}</p>
    </div>
  );
}

export default function FamilyTreePage() {
  const params = useParams();
  const petId = params.id as string;

  const { data, loading } = useQuery(GET_FAMILY_TREE, {
    variables: { petId },
  });

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-full flex-col gap-4 p-4 pt-0">
            <div className="flex h-[calc(100vh-2rem)] flex-col items-center justify-center gap-4 overflow-auto rounded-xl border bg-background p-6 mt-4">
              <LoadingSpinner />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const pet = data?.pets_by_pk;

  if (!pet) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-full flex-col gap-4 p-4 pt-0">
            <div className="flex h-[calc(100vh-2rem)] flex-col items-center justify-center gap-4 overflow-auto rounded-xl border bg-background p-6 mt-4 text-center">
              <p className="text-lg font-medium">Family tree not available</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full flex-col gap-4 p-4 pt-0">
          <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 overflow-auto rounded-xl border bg-background p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Family Tree</h2>
              <p className="text-sm text-muted-foreground">{pet.name}'s family lineage</p>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Generation 0 - Current Pet */}
                <div className="flex justify-center mb-8">
                  <PetNode pet={pet} generation={0} />
                </div>

                {/* Generation 1 - Parents */}
                {(pet.father || pet.mother) && (
                  <div className="flex justify-center gap-8 mb-8">
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-muted-foreground mb-2">Father</p>
                      <PetNode pet={pet.father} generation={1} />
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-muted-foreground mb-2">Mother</p>
                      <PetNode pet={pet.mother} generation={1} />
                    </div>
                  </div>
                )}

                {/* Generation 2 - Grandparents */}
                {(pet.father?.father || pet.father?.mother || pet.mother?.father || pet.mother?.mother) && (
                  <div className="flex justify-center gap-4">
                    {/* Father's side */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-muted-foreground mb-2">Paternal Grandfather</p>
                        <PetNode pet={pet.father?.father || null} generation={2} />
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-muted-foreground mb-2">Paternal Grandmother</p>
                        <PetNode pet={pet.father?.mother || null} generation={2} />
                      </div>
                    </div>

                    {/* Mother's side */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-muted-foreground mb-2">Maternal Grandfather</p>
                        <PetNode pet={pet.mother?.father || null} generation={2} />
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-muted-foreground mb-2">Maternal Grandmother</p>
                        <PetNode pet={pet.mother?.mother || null} generation={2} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


