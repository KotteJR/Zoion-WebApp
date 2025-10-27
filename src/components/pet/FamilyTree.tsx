'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Users, Maximize2, Minimize2 } from 'lucide-react';

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

interface TreeNode {
  id: string;
  name: string;
  code: string;
  generation: number;
  x: number;
  y: number;
  children: TreeNode[];
  parents: TreeNode[];
}

export default function FamilyTree({ familyTreeData, petName, petId }: FamilyTreeProps) {
  const [showFullTree, setShowFullTree] = useState(false);
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  // Debug logging
  console.log('FamilyTree component received:', { familyTreeData, petName, petId });

  const parsedData = useMemo(() => {
    if (!familyTreeData) return null;
    
    try {
      const parsed = JSON.parse(familyTreeData);
      console.log('Parsed family tree:', parsed, 'Type:', typeof parsed, 'Is Array:', Array.isArray(parsed));
      
      // Handle if data is an array of objects - merge into single object
      if (Array.isArray(parsed)) {
        const merged: FamilyTreeData = {};
        parsed.forEach(obj => {
          if (obj && typeof obj === 'object') {
            Object.assign(merged, obj);
          }
        });
        console.log('Merged family tree data:', merged);
        return merged;
      }
      
      return parsed as FamilyTreeData;
    } catch (error) {
      console.error('Error parsing family tree data:', error);
      return null;
    }
  }, [familyTreeData]);

  const treeNodes = useMemo(() => {
    if (!parsedData || typeof parsedData !== 'object') {
      console.log('❌ No parsedData or not an object');
      return [];
    }

    const nodes: TreeNode[] = [];
    const nodeMap = new Map<string, TreeNode>();

    console.log('📊 Processing family tree data. Keys:', Object.keys(parsedData));

    // Create nodes for each generation
    Object.entries(parsedData).forEach(([gen, members]) => {
      const generation = parseInt(gen);
      console.log(`Generation ${gen}:`, members, 'Type:', typeof members, 'Is Array:', Array.isArray(members));
      
      if (Array.isArray(members)) {
        members.forEach((member, index) => {
          if (member && typeof member === 'object' && member.name && member.name !== 'ingen uppgift') {
            const nodeId = `${generation}-${index}`;
            const node: TreeNode = {
              id: nodeId,
              name: member.name,
              code: member.code || '',
              generation,
              x: 0,
              y: 0,
              children: [],
              parents: []
            };
            nodes.push(node);
            nodeMap.set(nodeId, node);
            console.log(`✅ Created node: ${member.name} (${member.code})`);
          }
        });
      }
    });

    console.log(`📦 Total nodes created: ${nodes.length}`);
    // Sort by generation (ascending for proper tree structure)
    return nodes.sort((a, b) => a.generation - b.generation);
  }, [parsedData]);

  const displayNodes = useMemo(() => {
    if (!showFullTree) {
      // Show only the first 4 generations
      const maxGeneration = Math.min(...treeNodes.map(n => n.generation)) + 3;
      return treeNodes.filter(node => node.generation <= maxGeneration);
    }
    return treeNodes;
  }, [treeNodes, showFullTree]);

  const positionedNodes = useMemo(() => {
    if (displayNodes.length === 0) return [];

    // Group nodes by generation
    const generations = new Map<number, TreeNode[]>();
    displayNodes.forEach(node => {
      if (!generations.has(node.generation)) {
        generations.set(node.generation, []);
      }
      generations.get(node.generation)!.push(node);
    });

    const generationArray = Array.from(generations.entries()).sort((a, b) => a[0] - b[0]);
    const positioned: TreeNode[] = [];

    generationArray.forEach(([gen, nodes], genIndex) => {
      const y = genIndex * 120; // Vertical spacing between generations
      const totalWidth = (nodes.length - 1) * 150; // Horizontal spacing
      const startX = -totalWidth / 2;

      nodes.forEach((node, nodeIndex) => {
        node.x = startX + nodeIndex * 150;
        node.y = y;
        positioned.push(node);
      });
    });

    return positioned;
  }, [displayNodes]);

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

  const getConnectingLines = () => {
    const lines: JSX.Element[] = [];
    
    // Create lines between generations (simplified - connecting each node to nodes in the next generation)
    const generations = new Map<number, TreeNode[]>();
    positionedNodes.forEach(node => {
      if (!generations.has(node.generation)) {
        generations.set(node.generation, []);
      }
      generations.get(node.generation)!.push(node);
    });

    const generationArray = Array.from(generations.entries()).sort((a, b) => a[0] - b[0]);
    
    for (let i = 0; i < generationArray.length - 1; i++) {
      const currentGen = generationArray[i][1];
      const nextGen = generationArray[i + 1][1];
      
      // Connect each node to the next generation (simplified tree structure)
      currentGen.forEach((parentNode, parentIndex) => {
        const childIndex = Math.floor((parentIndex / currentGen.length) * nextGen.length);
        const childNode = nextGen[childIndex];
        
        if (childNode) {
          lines.push(
            <line
              key={`line-${parentNode.id}-${childNode.id}`}
              x1={parentNode.x}
              y1={parentNode.y + 30}
              x2={childNode.x}
              y2={childNode.y - 30}
              stroke="#3d7c6f"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          );
        }
      });
    }

    return lines;
  };

  if (!parsedData || treeNodes.length === 0) {
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

  const svgWidth = 800;
  const svgHeight = Math.max(400, positionedNodes.length * 40 + 200);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Family Tree
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
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
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-auto">
          <div className="inline-block min-w-full">
            <svg
              ref={svgRef}
              width={svgWidth}
              height={svgHeight}
              viewBox={`-400 -100 ${svgWidth} ${svgHeight}`}
              className="border rounded-lg bg-gray-50"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#3d7c6f"
                  />
                </marker>
              </defs>

              {/* Connecting lines */}
              {getConnectingLines()}

              {/* Generation labels */}
              {Array.from(new Set(positionedNodes.map(n => n.generation))).map(gen => {
                const genNodes = positionedNodes.filter(n => n.generation === gen);
                const avgY = genNodes.reduce((sum, n) => sum + n.y, 0) / genNodes.length;
                return (
                  <text
                    key={`label-${gen}`}
                    x={-380}
                    y={avgY}
                    className="text-sm font-medium fill-gray-600"
                    textAnchor="start"
                  >
                    {getGenerationLabel(gen)}
                  </text>
                );
              })}

              {/* Nodes */}
              {positionedNodes.map(node => (
                <g key={node.id}>
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill="white"
                    stroke="#3d7c6f"
                    strokeWidth="2"
                    className="hover:fill-gray-100 transition-colors cursor-pointer"
                  />
                  
                  {/* Node initial */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="text-sm font-bold fill-gray-700"
                  >
                    {node.name.split(' ')[0][0]}
                  </text>
                  
                  {/* Node name */}
                  <text
                    x={node.x}
                    y={node.y + 45}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-800"
                  >
                    {node.name.length > 12 ? node.name.substring(0, 12) + '...' : node.name}
                  </text>
                  
                  {/* Node code */}
                  {node.code && (
                    <text
                      x={node.x}
                      y={node.y + 60}
                      textAnchor="middle"
                      className="text-xs fill-gray-500"
                    >
                      {node.code}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>
        
        {!showFullTree && treeNodes.length > displayNodes.length && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {displayNodes.length} ancestors. Click "Show Full Tree" to see all {treeNodes.length} ancestors.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
