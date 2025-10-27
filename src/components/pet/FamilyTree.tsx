'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';

interface FamilyMember {
  name: string;
  code: string;
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
  const [expandedGenerations, setExpandedGenerations] = useState<Set<string>>(new Set(['32', '16']));

  const parsedData = useMemo(() => {
    if (!familyTreeData) return null;
    
    try {
      return JSON.parse(familyTreeData) as FamilyTreeData;
    } catch (error) {
      console.error('Error parsing family tree data:', error);
      return null;
    }
  }, [familyTreeData]);

  const generations = useMemo(() => {
    if (!parsedData) return [];
    
    // Sort generations by number (descending - most recent first)
    return Object.entries(parsedData)
      .map(([gen, members]) => ({
        generation: parseInt(gen),
        members: members.filter(member => member.name && member.name !== 'ingen uppgift')
      }))
      .sort((a, b) => b.generation - a.generation);
  }, [parsedData]);

  const displayGenerations = showFullTree ? generations : generations.slice(0, 4);

  const toggleGeneration = (generation: number) => {
    const genStr = generation.toString();
    setExpandedGenerations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(genStr)) {
        newSet.delete(genStr);
      } else {
        newSet.add(genStr);
      }
      return newSet;
    });
  };

  const getGenerationLabel = (generation: number) => {
    switch (generation) {
      case 32: return 'Parents';
      case 16: return 'Grandparents';
      case 8: return 'Great-Grandparents';
      case 4: return 'Great-Great-Grandparents';
      case 2: return 'Great-Great-Great-Grandparents';
      case 1: return 'Ancestors';
      default: return `Generation ${generation}`;
    }
  };

  if (!parsedData || generations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No family tree data available for {petName}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Family Tree
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullTree(!showFullTree)}
            className="flex items-center gap-2"
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
        <div className="space-y-6">
          {displayGenerations.map(({ generation, members }) => (
            <div key={generation} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg">{getGenerationLabel(generation)}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleGeneration(generation)}
                  className="flex items-center gap-1"
                >
                  {expandedGenerations.has(generation.toString()) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {expandedGenerations.has(generation.toString()) ? 'Collapse' : 'Expand'}
                </Button>
              </div>
              
              {expandedGenerations.has(generation.toString()) ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {members.map((member, index) => (
                    <div
                      key={`${generation}-${index}`}
                      className="text-center p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {member.name.split(' ')[0][0]}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-900 truncate" title={member.name}>
                        {member.name}
                      </p>
                      {member.code && (
                        <p className="text-xs text-gray-500 truncate" title={member.code}>
                          {member.code}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{members.length} ancestor{members.length !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>Click to expand</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!showFullTree && generations.length > 4 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing 4 generations. Click "Show Full Tree" to see all {generations.length} generations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
