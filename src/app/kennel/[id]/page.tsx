'use client';

import { useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { GET_KENNEL_DETAILS } from '@/lib/graphql/queries';
import PetCard from '@/components/pet/PetCard';

export default function KennelPage() {
  const params = useParams();
  const router = useRouter();
  const kennelId = decodeURIComponent(params.id as string);

  const { data, loading, error, refetch } = useQuery(GET_KENNEL_DETAILS, {
    variables: { kennelId },
  });

  const kennel = data?.kennel_by_pk;
  const pets = data?.pets || [];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Tillbaka
              </Button>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>
            ) : error ? (
              <div className="text-sm text-red-600">{error.message}</div>
            ) : !kennel ? (
              <div className="text-sm text-muted-foreground">Kennel hittades inte.</div>
            ) : (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-semibold text-gray-900">{kennel.name}</h1>
                        <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                          {kennel.address && <div><span className="text-muted-foreground">Adress:</span> {kennel.address}</div>}
                          {kennel.post_number && <div><span className="text-muted-foreground">Postnummer:</span> {kennel.post_number}</div>}
                          {kennel.phone_number && <div><span className="text-muted-foreground">Telefon:</span> {kennel.phone_number}</div>}
                          {kennel.email && <div><span className="text-muted-foreground">E‑post:</span> {kennel.email}</div>}
                          {kennel.website && <div><span className="text-muted-foreground">Webb:</span> {kennel.website}</div>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-lg font-semibold mt-4 mb-2">Hundar</h2>
                  {pets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Inga hundar kopplade till denna kennel.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {pets.map((pet: any) => (
                        <PetCard key={pet.id} pet={pet} onFavoriteChange={refetch} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


