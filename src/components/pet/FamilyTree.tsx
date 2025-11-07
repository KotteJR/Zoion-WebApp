'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLazyQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { GET_PET_DETAILS } from '@/lib/graphql/queries';

interface FamilyMember {
  name: string;
  code: string;
  id?: string; // Optional ID for dogs in database
}

interface FamilyTreeData {
  [generation: string]: FamilyMember[];
}

interface FamilyTreeProps {
  familyTreeData: string | null;
  petName: string;
  petId: string;
}

export default function FamilyTree({ familyTreeData, petName, petId }: FamilyTreeProps) {
  const [showFullTree, setShowFullTree] = useState(false);
  const [existingDogs, setExistingDogs] = useState<Set<string>>(new Set());
  const router = useRouter();
  
  const [checkPetExists] = useLazyQuery(GET_PET_DETAILS, {
    onCompleted: (data) => {
      if (data?.pets?.length > 0) {
        const petId = data.pets[0].id;
        setExistingDogs(prev => new Set([...prev, petId]));
      }
    },
    onError: () => {
      // Pet doesn't exist, don't add to existingDogs
    }
  });

  const parsedData = useMemo(() => {
    if (!familyTreeData) return null;
    
    try {
      const parsed = JSON.parse(familyTreeData);
      
      // Handle if data is an array of objects - merge into single object
      if (Array.isArray(parsed)) {
        const merged: FamilyTreeData = {};
        parsed.forEach(obj => {
          if (obj && typeof obj === 'object') {
            Object.assign(merged, obj);
          }
        });
        return merged;
      }
      
      return parsed as FamilyTreeData;
    } catch (error) {
      console.error('Error parsing family tree data:', error);
      return null;
    }
  }, [familyTreeData]);

  // Check which dogs exist in the database
  useEffect(() => {
    if (!parsedData) return;
    
    const allMembers = Object.values(parsedData).flat();
    const membersWithCodes = allMembers.filter(member => member.code && member.name !== 'ingen uppgift');
    
    // Check each member to see if they exist in the database
    membersWithCodes.forEach(member => {
      if (!existingDogs.has(member.code)) {
        checkPetExists({ variables: { petId: member.code } });
      }
    });
  }, [parsedData, checkPetExists, existingDogs]);

  // Sort generations from closest to furthest (32 -> 16 -> 8 -> 4 -> 2 -> 1)
  const sortedGenerations = useMemo(() => {
    if (!parsedData) return [];
    
    const generations = Object.keys(parsedData)
      .map(key => parseInt(key))
      .sort((a, b) => b - a); // Descending order (32, 16, 8, 4, 2, 1)
    
    return generations;
  }, [parsedData]);

  // Limit to first 3-4 generations if not showing full tree
  const displayGenerations = useMemo(() => {
    if (showFullTree) return sortedGenerations;
    return sortedGenerations.slice(0, 4); // Show first 4 generations
  }, [sortedGenerations, showFullTree]);

  const handleDogClick = (member: FamilyMember) => {
    if (member.code && existingDogs.has(member.code)) {
      router.push(`/pet/${encodeURIComponent(member.code)}`);
    }
  };

  const getGenerationLabel = (generation: number) => {
    switch (generation) {
      case 32: return 'Parents';
      case 16: return 'Grandparents';
      case 8: return 'Great-Grandparents';
      case 4: return 'Great-Great-Grandparents';
      case 2: return '3rd Great-Grandparents';
      case 1: return '4th Great-Grandparents';
      default: return `Generation ${generation}`;
    }
  };

  if (!parsedData || sortedGenerations.length === 0) {
    return (
      <Card className="bg-white/10 border border-gray-300/30 text-gray-900 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center text-gray-600/90">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p>No family tree data available for {petName}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalMembers = displayGenerations.reduce((sum, gen) => {
    const members = parsedData[gen] || [];
    return sum + members.filter(m => m.name && m.name !== 'ingen uppgift').length;
  }, 0);

  return (
    <Card className="w-full bg-white/10 border border-gray-300/30 text-gray-900 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Users className="w-5 h-5" />
            Family Tree
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullTree(!showFullTree)}
            className="flex items-center gap-2 bg-white/10 text-gray-900 border border-gray-300/30 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm"
          >
            {showFullTree ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Full Tree
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Current Dog - At the bottom center */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="px-6 py-3 bg-white/10 border border-gray-300/50 text-gray-900 rounded-lg shadow-sm text-center">
                <div className="font-bold text-lg">{petName}</div>
                <div className="text-sm text-gray-600/90">{petId}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ancestors - From bottom to top */}
        <div className="space-y-6">
          {displayGenerations.map((generation, genIndex) => {
            const members = parsedData[generation] || [];
            const validMembers = members.filter(m => m.name && m.name !== 'ingen uppgift');
            
            if (validMembers.length === 0) return null;

            return (
              <div key={generation} className="relative">
                {/* Connecting lines */}
                {genIndex === 0 && (
                  <div className="absolute top-0 left-1/2 w-0.5 h-6 bg-gray-400/40 -translate-x-1/2 -translate-y-6" />
                )}

                {/* Generation Label */}
                <div className="text-center mb-3">
                  <span className="inline-block px-3 py-1 bg-gray-200/30 text-gray-700 border border-gray-300/40 text-sm font-medium rounded-full">
                    {getGenerationLabel(generation)} ({validMembers.length})
                  </span>
                </div>

                {/* Family Members Grid */}
                <div className={`grid gap-3 ${
                  validMembers.length === 2 ? 'grid-cols-2' :
                  validMembers.length <= 4 ? 'grid-cols-2 md:grid-cols-4' :
                  validMembers.length <= 8 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8' :
                  'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'
                }`}>
                  {validMembers.map((member, memberIndex) => (
                    <div
                      key={`${generation}-${memberIndex}`}
                      className="relative group"
                    >
                      <div 
                        className={`p-3 bg-white/10 border border-gray-300/30 rounded-lg transition-all text-center shadow-sm ${
                          member.code && existingDogs.has(member.code)
                            ? 'hover:border-gray-400/60 hover:shadow-md cursor-pointer hover:bg-white/20' 
                            : 'opacity-75'
                        }`}
                        onClick={() => handleDogClick(member)}
                        title={
                          member.code && existingDogs.has(member.code)
                            ? `Click to view ${member.name}'s profile`
                            : member.code 
                              ? `${member.name} - Not in database`
                              : `${member.name} - No ID available`
                        }
                      >
                        <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center font-semibold ${
                          member.code && existingDogs.has(member.code)
                            ? 'bg-white/30 text-gray-900 border border-gray-400/50' 
                            : 'bg-white/10 text-gray-600/70 border border-gray-300/40'
                        }`}>
                          {member.name.split(' ')[0][0]}
                        </div>
                        <div className="font-medium text-xs text-gray-900 truncate" title={member.name}>
                          {member.name.length > 15 ? member.name.substring(0, 15) + '...' : member.name}
                        </div>
                        {member.code && (
                          <div className="text-xs text-gray-600/70 mt-1">
                            {member.code}
                          </div>
                        )}
                        {member.code && existingDogs.has(member.code) && (
                          <div className="text-xs text-gray-700 mt-1 font-medium">
                            View Profile
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connecting line to next generation */}
                {genIndex < displayGenerations.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="w-0.5 h-4 bg-gray-400/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-300/30 text-center text-sm text-gray-600/90">
          {showFullTree ? (
            <p>Showing complete family tree with {totalMembers} ancestors across {displayGenerations.length} generations</p>
          ) : (
            <p>
              Showing {totalMembers} ancestors across {displayGenerations.length} generations.
              {sortedGenerations.length > 4 && (
                <> Click "Show Full Tree" to see all {sortedGenerations.length} generations.</>
              )}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
