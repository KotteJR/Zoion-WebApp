'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { GET_FAMILY_TREE } from '@/lib/graphql/queries';

export default function PetFamilyTreePage() {
  const params = useParams();
  const petId = params.id as string;

  const { data, loading, error } = useQuery(GET_FAMILY_TREE, {
    variables: { petId },
    skip: !petId,
  });

  const pet = data?.pets_by_pk;

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen items-center justify-center">
            <LoadingSpinner />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Error</h2>
              <p className="text-gray-600">Failed to load family tree</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!pet) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Pet Not Found</h2>
              <p className="text-gray-600">The requested pet could not be found</p>
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
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Family Tree</h2>
              <p className="text-sm text-muted-foreground">
                Family lineage for {pet.name}
              </p>
            </div>

            <div className="flex flex-col items-center space-y-8">
              {/* Parents */}
              {(pet.father || pet.mother) && (
                <div className="flex space-x-8">
                  {pet.father && (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full mb-2 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">♂</span>
                      </div>
                      <p className="text-sm font-medium">{pet.father.name}</p>
                      <p className="text-xs text-gray-500">{pet.father.breed}</p>
                    </div>
                  )}
                  {pet.mother && (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-pink-100 rounded-full mb-2 flex items-center justify-center">
                        <span className="text-pink-600 font-semibold">♀</span>
                      </div>
                      <p className="text-sm font-medium">{pet.mother.name}</p>
                      <p className="text-xs text-gray-500">{pet.mother.breed}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Current Pet */}
              <div className="text-center">
                <div className={`w-24 h-24 rounded-full mb-2 flex items-center justify-center ${
                  pet.sex === 'male' ? 'bg-blue-200' : 'bg-pink-200'
                }`}>
                  <span className={`text-2xl font-semibold ${
                    pet.sex === 'male' ? 'text-blue-700' : 'text-pink-700'
                  }`}>
                    {pet.sex === 'male' ? '♂' : '♀'}
                  </span>
                </div>
                <p className="text-lg font-semibold">{pet.name}</p>
                <p className="text-sm text-gray-500">{pet.breed}</p>
              </div>

              {/* No family tree data message */}
              {!pet.father && !pet.mother && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No family tree information available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
