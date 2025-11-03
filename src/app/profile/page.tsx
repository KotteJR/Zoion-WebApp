'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Input from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/auth-store';
import { USER_QUERY_FOR_FEED, FAVORITE_PETS } from '@/lib/graphql/queries';
import { User as UserType } from '@/types/user';
import { Pet } from '@/types/pet';
import PetCard from '@/components/pet/PetCard';
import { Edit, Save, X, LogIn, UserPlus, Heart, User } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    given_name: '',
    family_name: '',
    bio: '',
    address: '',
    phone: '',
  });

  // Fetch user data if authenticated
  const { data: userData, loading: userLoading, refetch: refetchUser } = useQuery(USER_QUERY_FOR_FEED, {
    skip: !isAuthenticated,
  });

  // Fetch favorites if authenticated
  const { data: favoritesData, loading: favoritesLoading, refetch: refetchFavorites } = useQuery(FAVORITE_PETS, {
    skip: !isAuthenticated,
  });

  const currentUser: UserType | null = userData?.me || null;
  const userPets: Pet[] = currentUser?.pets || [];
  const favoritePets: Pet[] = favoritesData?.favorites?.map((fav: any) => fav.pet) || [];

  // Initialize edit form when user data loads
  useEffect(() => {
    if (currentUser) {
      setEditForm({
        given_name: currentUser.firstName || '',
        family_name: currentUser.lastName || '',
        bio: currentUser.bio || '',
        address: currentUser.address || '',
        phone: currentUser.phoneNumber || '',
      });
    }
  }, [currentUser]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentUser) {
      setEditForm({
        given_name: currentUser.firstName || '',
        family_name: currentUser.lastName || '',
        bio: currentUser.bio || '',
        address: currentUser.address || '',
        phone: currentUser.phoneNumber || '',
      });
    }
  };

  const handleSave = async () => {
    // TODO: Implement update user mutation
    console.log('Saving user profile:', editForm);
    setIsEditing(false);
    // refetchUser();
  };

  const handleLogout = () => {
    logout();
    router.push('/home');
  };

  if (!isAuthenticated) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
            <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-8 mt-4 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome to Zoion</h1>
                <p className="text-muted-foreground max-w-md">
                  Log-in functionality coming soon!
                </p>
              </div>
              
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (userLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
            <div className="flex flex-1 flex-col items-center justify-center overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
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
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-6 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  {currentUser?.profilePicture ? (
                    <img 
                      src={currentUser.profilePicture} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h1>
                  <p className="text-muted-foreground">{currentUser?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="sm" className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm" className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleEdit} variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    {isEditing ? (
                      <Input
                        value={editForm.given_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, given_name: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{currentUser?.firstName || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    {isEditing ? (
                      <Input
                        value={editForm.family_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, family_name: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{currentUser?.lastName || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    {isEditing ? (
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{currentUser?.phoneNumber || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    {isEditing ? (
                      <Input
                        value={editForm.address}
                        onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{currentUser?.address || 'Not provided'}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{currentUser?.bio || 'No bio provided'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* My Pets */}
            <Card>
              <CardHeader>
                <CardTitle>My Pets ({userPets.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {userPets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userPets.map((pet) => (
                      <PetCard key={pet.id} pet={pet} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pets added yet</p>
                    <Button className="mt-2" onClick={() => router.push('/home')}>
                      Browse Pets
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  My Favorites ({favoritePets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoritePets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoritePets.map((pet) => (
                      <PetCard key={pet.id} pet={pet} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-muted-foreground">No favorites yet</p>
                    <Button className="mt-2" onClick={() => router.push('/home')}>
                      Browse Pets
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


