'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { GET_PET_TROPHIES, GET_PET_DETAILS } from '@/lib/graphql/queries';
import { formatDateShort } from '@/utils/date-helpers';

export default function PetTrophiesPage() {
  const params = useParams();
  const petId = params.id as string;

  const { data: petData } = useQuery(GET_PET_DETAILS, {
    variables: { petId },
  });
  
  const { data, loading } = useQuery(GET_PET_TROPHIES, {
    variables: { petId },
  });

  const petName = petData?.pets_by_pk?.name || 'Pet';
  const trophies = data?.competitions || [];

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full flex-col gap-4 p-4 pt-0">
          <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 overflow-auto rounded-xl border bg-background p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Trophies</h2>
              <p className="text-sm text-muted-foreground">{petName}'s competition achievements</p>
            </div>
            {trophies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trophies.map((trophy: any) => (
                  <div key={trophy.id} className="bg-card rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 relative flex-shrink-0">
                        <Image
                          src="/assets/icons/awardIcon.svg"
                          alt="Trophy"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{trophy.name}</h3>
                        {trophy.placement && (
                          <p className="text-primary font-medium mb-1">
                            {trophy.placement}
                          </p>
                        )}
                        <div className="text-sm text-muted-foreground space-y-1">
                          {trophy.competition_date && (
                            <p>{formatDateShort(trophy.competition_date)}</p>
                          )}
                          {trophy.location && (
                            <p className="flex items-center gap-1">
                              <Image
                                src="/assets/icons/locationIcon.svg"
                                alt="Location"
                                width={14}
                                height={14}
                              />
                              {trophy.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative opacity-30">
                  <Image
                    src="/assets/icons/awardIcon.svg"
                    alt="No trophies"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-muted-foreground text-lg mb-2">No trophies yet</p>
                <p className="text-muted-foreground">Compete in shows to earn trophies!</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


