'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import PetCard from '@/components/pet/PetCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FETCH_USER_BY_ID } from '@/lib/graphql/queries';
import { Pet } from '@/types/pet';

export default function BreederProfilePage() {
  const params = useParams();
  const breederId = params.id as string;

  const { data, loading } = useQuery(FETCH_USER_BY_ID, {
    variables: { userId: breederId },
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

  const breeder = data?.v1?.user;

  if (!breeder) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-full flex-col gap-4 p-4 pt-0">
            <div className="flex h-[calc(100vh-2rem)] flex-col items-center justify-center gap-4 overflow-auto rounded-xl border bg-background p-6 mt-4 text-center">
              <p className="text-lg font-medium">Breeder not found</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const pets: Pet[] = breeder.pets || [];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full flex-col gap-4 p-4 pt-0">
          <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 overflow-auto rounded-xl border bg-background p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Breeder Profile</h2>
              <p className="text-sm text-muted-foreground">{breeder.given_name} {breeder.family_name}</p>
            </div>

            {/* Breeder Profile Header */}
            <div className="bg-card rounded-xl border p-6">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted">
                  {breeder.profile_picture ? (
                    <Image src={breeder.profile_picture} alt="Breeder" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl font-bold">
                      {breeder.given_name?.[0]}{breeder.family_name?.[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">
                    {breeder.given_name} {breeder.family_name}
                  </h1>
                  {breeder.type === 'kennel' && (
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mt-2">
                      Certified Kennel
                    </span>
                  )}
                  {breeder.address && (
                    <p className="text-muted-foreground text-sm mt-2 flex items-center gap-1">
                      <Image src="/assets/icons/locationIcon.svg" alt="Location" width={14} height={14} />
                      {breeder.address}
                    </p>
                  )}
                </div>
              </div>
              {breeder.bio && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-foreground">{breeder.bio}</p>
                </div>
              )}
            </div>

            {/* Breeder's Pets */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {breeder.given_name}'s Pets ({pets.length})
              </h3>
              {pets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} onFavoriteChange={() => {}} />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-xl border p-12 text-center">
                  <p className="text-muted-foreground text-lg">No pets available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


