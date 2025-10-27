'use client';

import { useState, useRef, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import PetCard from '@/components/pet/PetCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SEARCH_PETS } from '@/lib/graphql/queries';
import { Pet } from '@/types/pet';
import { Send } from 'lucide-react';

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  pets?: Pet[];
  filters?: ParsedFilters;
  timestamp: Date;
}

interface ParsedFilters {
  breeds?: string[];
  sex?: 'male' | 'female';
  readyToBreed?: boolean;
  pregnant?: boolean;
  hasFrozenSperm?: boolean;
  vaccinated?: boolean | null;
  inbreedRate?: {
    operator: 'less' | 'greater' | 'equal';
    value: number;
  };
  ageRange?: {
    min?: number;
    max?: number;
  };
  weight?: {
    operator: 'less' | 'greater' | 'equal';
    value: number;
  };
  // Additional searchable fields shown in the pet details
  color?: string; // maps to DB field 'colour'
  kennelName?: string; // maps to DB field 'kennel_name' (and kennel.name fallback)
  nameContains?: string; // maps to DB field 'name'
  petId?: string; // maps to DB field 'id'
}

// Natural language query parser
function parseNaturalLanguageQuery(query: string): ParsedFilters {
  const filters: ParsedFilters = {};
  const queryLower = query.toLowerCase();
  
  // Special case for "show me all dogs" - return empty filters to show all
  if (queryLower.includes('show me all dogs') || queryLower.includes('all dogs')) {
    return {}; // Empty filters will show all pets
  }
  
  // Special case for "show all breeds" - return empty filters to show all
  if (queryLower.includes('show all breeds')) {
    return {}; // Empty filters will show all pets
  }
  
  // Breed detection
  const breedPatterns = [
    { pattern: /bichon\s*fris[eé]/i, breed: 'Bichon Frisé' },
    { pattern: /golden\s*retriever/i, breed: 'Golden Retriever' },
    { pattern: /german\s*shepherd/i, breed: 'German Shepherd' },
    { pattern: /labrador/i, breed: 'Labrador' },
    { pattern: /bulldog/i, breed: 'Bulldog' },
    { pattern: /poodle/i, breed: 'Poodle' },
    { pattern: /beagle/i, breed: 'Beagle' },
    { pattern: /rottweiler/i, breed: 'Rottweiler' },
    { pattern: /yorkshire/i, breed: 'Yorkshire Terrier' },
    { pattern: /chihuahua/i, breed: 'Chihuahua' },
    { pattern: /husky/i, breed: 'Siberian Husky' },
    { pattern: /border\s*collie/i, breed: 'Border Collie' },
  ];
  
  const foundBreeds: string[] = [];
  breedPatterns.forEach(({ pattern, breed }) => {
    if (pattern.test(query)) {
      foundBreeds.push(breed);
    }
  });
  
  if (foundBreeds.length > 0) {
    filters.breeds = foundBreeds;
  }
  
  // Sex detection
  if (/\b(female|girl|she|her)\b/.test(queryLower)) {
    filters.sex = 'female';
  } else if (/\b(male|boy|he|him|his)\b/.test(queryLower)) {
    filters.sex = 'male';
  }

  // Pet ID detection - look for patterns like "SE12149/2015" or "NO37204/14"
  const idPattern = /\b[A-Z]{2}\d{5}\/\d{4}\b|\b[A-Z]{2}\d{5}\/\d{2}\b|\b[A-Z]{2}\d{4}\/\d{4}\b|\b[A-Z]{2}\d{4}\/\d{2}\b/;
  const idMatch = query.match(idPattern);
  if (idMatch) {
    filters.petId = idMatch[0];
  }
  
  // Ready to breed
  if (/\b(ready\s*to\s*breed|available\s*for\s*breeding|breeding\s*ready)\b/.test(queryLower)) {
    filters.readyToBreed = true;
  }
  
  // Pregnant
  if (/\b(pregnant|expecting|puppies)\b/.test(queryLower)) {
    filters.pregnant = true;
  }
  
  // Frozen sperm
  if (/\b(frozen\s*sperm|sperm\s*available)\b/.test(queryLower)) {
    filters.hasFrozenSperm = true;
  }
  
  // Vaccinated
  if (/\b(vaccinated|vaccines|shots)\b/.test(queryLower)) {
    filters.vaccinated = true;
  } else if (/\b(not\s*vaccinated|unvaccinated)\b/.test(queryLower)) {
    filters.vaccinated = false;
  }
  
  // Inbreed rate detection
  const inbreedPatterns = [
    // allow comma or dot decimals and optional double %
    { pattern: /inbreed\s*rate\s*(?:less\s*than|under|below)\s*(\d+[\.,]?\d*)\s*%+?/i, operator: 'less' as const },
    { pattern: /inbreed\s*rate\s*(?:greater\s*than|over|above)\s*(\d+[\.,]?\d*)\s*%+?/i, operator: 'greater' as const },
    { pattern: /inbreed\s*rate\s*(?:of|equal\s*to)?\s*(\d+[\.,]?\d*)\s*%+?/i, operator: 'equal' as const },
    { pattern: /(\d+[\.,]?\d*)\s*%+?\s*inbreed\s*rate/i, operator: 'equal' as const },
  ];
  
  for (const { pattern, operator } of inbreedPatterns) {
    const match = query.match(pattern);
    if (match) {
      const raw = match[1].replace(',', '.');
      filters.inbreedRate = { operator, value: parseFloat(raw) };
      break;
    }
  }
  
  // Age detection
  const agePatterns = [
    { pattern: /(?:under|below|less\s*than)\s*(\d+)\s*(?:years?|yrs?)\s*(?:old|of\s*age)?/i, type: 'max' as const },
    { pattern: /(?:over|above|greater\s*than|more\s*than)\s*(\d+)\s*(?:years?|yrs?)\s*(?:old|of\s*age)?/i, type: 'min' as const },
    { pattern: /(\d+)\s*(?:to|-)\s*(\d+)\s*(?:years?|yrs?)\s*(?:old|of\s*age)?/i, type: 'range' as const },
    { pattern: /(\d+)\s*(?:years?|yrs?)\s*(?:old|of\s*age)/i, type: 'exact' as const },
  ];
  
  for (const { pattern, type } of agePatterns) {
    const match = query.match(pattern);
    if (match) {
      if (type === 'max') {
        filters.ageRange = { max: parseInt(match[1]) };
      } else if (type === 'min') {
        filters.ageRange = { min: parseInt(match[1]) };
      } else if (type === 'range') {
        filters.ageRange = { min: parseInt(match[1]), max: parseInt(match[2]) };
      } else if (type === 'exact') {
        const age = parseInt(match[1]);
        filters.ageRange = { min: age, max: age };
      }
      break;
    }
  }
  
  // Weight detection
  const weightPatterns = [
    { pattern: /(?:under|below|less\s*than)\s*(\d+[\.,]?\d*)\s*kg/i, operator: 'less' as const },
    { pattern: /(?:over|above|greater\s*than|more\s*than)\s*(\d+[\.,]?\d*)\s*kg/i, operator: 'greater' as const },
    { pattern: /(\d+[\.,]?\d*)\s*kg/i, operator: 'equal' as const },
  ];
  
  for (const { pattern, operator } of weightPatterns) {
    const match = query.match(pattern);
    if (match) {
      filters.weight = { operator, value: parseFloat(match[1].replace(',', '.')) };
      break;
    }
  }

  // Color detection: look for "color/colour <word>"
  const colorMatch = query.match(/\b(?:color|colour)\s*:?\s*([a-zA-ZåäöÅÄÖéÉ\-]+)/i);
  if (colorMatch) {
    filters.color = colorMatch[1];
  }

  // Kennel detection: "kennel <name>" or "from kennel <name>"
  const kennelMatch = query.match(/\bkennel\s*:?\s*([\w\s'’\-]+)/i);
  if (kennelMatch) {
    filters.kennelName = kennelMatch[1].trim();
  }

  // Name contains: "named <x>" or "called <x>"
  const nameMatch = query.match(/\b(?:named|called|name)\s*:?\s*([\w\s'’\-]+)/i);
  if (nameMatch) {
    filters.nameContains = nameMatch[1].trim();
  }
  
  return filters;
}

// Generate a few tolerant variants for breed matching (handles common diacritics)
function generateBreedVariants(breed: string): string[] {
  const base = breed.trim();
  const variants = new Set<string>();
  variants.add(base);
  // Lower/upper tolerant
  variants.add(base.toLowerCase());
  variants.add(base.replace(/\s+/g, ' ').trim());
  // Specific: frise <-> frisé
  variants.add(base.replace(/frise/gi, 'frisé'));
  variants.add(base.replace(/frisé/gi, 'frise'));
  // Specific: bichon frise common typo variants
  variants.add(base.replace(/bichon\s*frise/gi, 'bichon frisé'));
  variants.add(base.replace(/bichon\s*frisé/gi, 'bichon frise'));
  return Array.from(variants).filter(Boolean);
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasRestored = useRef(false);

  const [searchPets, { loading: searchLoading }] = useLazyQuery(SEARCH_PETS);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Restore once on mount
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? sessionStorage.getItem('aiChatConversation') : null;
      if (saved) {
        const parsed: ConversationMessage[] = JSON.parse(saved);
        if (Array.isArray(parsed)) setConversation(parsed);
      }
      const savedInput = typeof window !== 'undefined' ? sessionStorage.getItem('aiChatInput') : null;
      if (savedInput) setSearchQuery(savedInput);
    } finally {
      hasRestored.current = true;
    }
  }, []);

  // Scroll when conversation changes
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Persist conversation and input whenever they change
  useEffect(() => {
    if (!hasRestored.current) return;
    try {
      sessionStorage.setItem('aiChatConversation', JSON.stringify(conversation));
    } catch {}
  }, [conversation]);

  useEffect(() => {
    try {
      sessionStorage.setItem('aiChatInput', searchQuery);
    } catch {}
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const currentQuery = searchQuery;
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentQuery,
      timestamp: new Date(),
    };

    setConversation(prev => [...prev, userMessage]);
    setSearchQuery('');
    setIsSearching(true);

    try {
      // Prefer OpenAI parsing; fallback to local parser if it fails
      let filters: ParsedFilters | undefined;
      try {
        const aiRes = await Promise.race([
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: currentQuery }),
          }),
          new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('search timeout')), 6000)) as unknown as Promise<Response>,
        ]);
        if (aiRes && (aiRes as Response).ok) {
          const json = await (aiRes as Response).json();
          filters = json.filters as ParsedFilters;
        }
      } catch (e) {
        console.warn('OpenAI parse failed or timed out, using local parser');
      }

      if (!filters) {
        filters = parseNaturalLanguageQuery(currentQuery);
      }
      console.log('Parsed filters:', filters);
      
      // Convert filters to GraphQL where clause
      const whereConditions: any[] = [];
      
      // Breed filtering
      if (filters.breeds && filters.breeds.length > 0) {
        whereConditions.push({ breed: { _in: filters.breeds } });
      }
      
      // Sex filtering
      if (filters.sex) {
        whereConditions.push({ sex: { _eq: filters.sex } });
      }
      
      // Ready to breed
      if (filters.readyToBreed) {
        whereConditions.push({ ready_to_breed: { _eq: true } });
      }
      
      // Pregnant
      if (filters.pregnant) {
        whereConditions.push({ pregnant: { _eq: true } });
      }
      
      // Has frozen sperm
      if (filters.hasFrozenSperm) {
        whereConditions.push({ has_frozen_sperm: { _eq: true } });
      }
      
      // Vaccinated
      if (filters.vaccinated !== null) {
        whereConditions.push({ vaccinated: { _eq: filters.vaccinated } });
      }
      
      // Inbreed rate filtering
      if (filters.inbreedRate) {
        if (filters.inbreedRate.operator === 'less') {
          whereConditions.push({ inbreed_rate: { _lt: filters.inbreedRate.value } });
        } else if (filters.inbreedRate.operator === 'greater') {
          whereConditions.push({ inbreed_rate: { _gt: filters.inbreedRate.value } });
        } else if (filters.inbreedRate.operator === 'equal') {
          whereConditions.push({ inbreed_rate: { _eq: filters.inbreedRate.value } });
        }
      }
      
      // Age filtering
      if (filters.ageRange) {
        const currentDate = new Date();
        if (filters.ageRange.max !== undefined) {
          const minDate = new Date(currentDate.getFullYear() - filters.ageRange.max, currentDate.getMonth(), currentDate.getDate());
          whereConditions.push({ date_born: { _gte: minDate.toISOString().split('T')[0] } });
        }
        if (filters.ageRange.min !== undefined) {
          const maxDate = new Date(currentDate.getFullYear() - filters.ageRange.min, currentDate.getMonth(), currentDate.getDate());
          whereConditions.push({ date_born: { _lte: maxDate.toISOString().split('T')[0] } });
        }
      }
      
      // Weight filtering
      if (filters.weight) {
        if (filters.weight.operator === 'less') {
          whereConditions.push({ weight: { _lt: filters.weight.value } });
        } else if (filters.weight.operator === 'greater') {
          whereConditions.push({ weight: { _gt: filters.weight.value } });
        } else if (filters.weight.operator === 'equal') {
          whereConditions.push({ weight: { _eq: filters.weight.value } });
        }
      }

      // Build a combined where clause exactly like Advanced Filters
      const andConditions: any[] = [];

      // Breeds: allow fuzzy match to tolerate spacing/case/diacritics
      if (filters.breeds && filters.breeds.length > 0) {
        const orBreeds: any[] = [];
        for (const b of filters.breeds) {
          const variants = generateBreedVariants(b);
          for (const v of variants) {
            orBreeds.push({ breed: { _ilike: `%${v}%` } });
          }
        }
        andConditions.push({ _or: orBreeds });
      }

      if (filters.sex) {
        andConditions.push({ sex: { _eq: filters.sex } });
      }

      if (filters.readyToBreed) {
        andConditions.push({ ready_to_breed: { _eq: true } });
      }

      if (filters.pregnant) {
        andConditions.push({ pregnant: { _eq: true } });
      }

      if (filters.hasFrozenSperm) {
        andConditions.push({ has_frozen_sperm: { _eq: true } });
      }

      if (filters.vaccinated !== null && filters.vaccinated !== undefined) {
        andConditions.push({ vaccinated: { _eq: filters.vaccinated } });
      }

      if (filters.inbreedRate) {
        const op = filters.inbreedRate.operator;
        // inbreed_rate might be stored as number OR string (e.g., "0.0 %"). Build tolerant OR clause.
        const numericClause =
          op === 'less'
            ? { inbreed_rate: { _lt: filters.inbreedRate.value } }
            : op === 'greater'
            ? { inbreed_rate: { _gt: filters.inbreedRate.value } }
            : { inbreed_rate: { _eq: filters.inbreedRate.value } };

        const stringClause =
          op === 'less'
            ? { inbreed_rate_string: { _ilike: `%${filters.inbreedRate.value - 0.0001}%` } }
            : op === 'greater'
            ? { inbreed_rate_string: { _ilike: `%${filters.inbreedRate.value + 0.0001}%` } }
            : { inbreed_rate_string: { _ilike: `%${filters.inbreedRate.value}%` } };

        andConditions.push({ _or: [numericClause, stringClause] });
      }

      if (filters.color) {
        // DB uses 'colour'
        andConditions.push({ colour: { _ilike: `%${filters.color}%` } });
      }

      if (filters.kennelName) {
        // Match either flat kennel_name or nested kennel.name
        andConditions.push({ _or: [
          { kennel_name: { _ilike: `%${filters.kennelName}%` } },
          { kennel: { name: { _ilike: `%${filters.kennelName}%` } } }
        ]});
      }

      if (filters.nameContains) {
        andConditions.push({ name: { _ilike: `%${filters.nameContains}%` } });
      }

      if (filters.petId) {
        // For Pet ID, use exact match and limit to 1 result
        andConditions.push({ id: { _eq: filters.petId } });
      }

      // Age: convert years to date boundaries (same logic we used earlier)
      if (filters.ageRange) {
        const currentDate = new Date();
        if (filters.ageRange.max !== undefined) {
          const minDate = new Date(currentDate.getFullYear() - filters.ageRange.max, currentDate.getMonth(), currentDate.getDate());
          andConditions.push({ date_born: { _gte: minDate.toISOString().split('T')[0] } });
        }
        if (filters.ageRange.min !== undefined) {
          const maxDate = new Date(currentDate.getFullYear() - filters.ageRange.min, currentDate.getMonth(), currentDate.getDate());
          andConditions.push({ date_born: { _lte: maxDate.toISOString().split('T')[0] } });
        }
      }

      if (filters.weight) {
        const op = filters.weight.operator;
        if (op === 'less') andConditions.push({ weight: { _lt: filters.weight.value } });
        if (op === 'greater') andConditions.push({ weight: { _gt: filters.weight.value } });
        if (op === 'equal') andConditions.push({ weight: { _eq: filters.weight.value } });
      }

      const whereClause: any = andConditions.length > 0 ? { _and: andConditions } : {};

      console.log('Searching with where clause:', JSON.stringify(whereClause, null, 2));
      console.log('Parsed filters:', JSON.stringify(filters, null, 2));

      const { data } = await searchPets({
        variables: {
          where: whereClause,
          limit: filters.petId ? 1 : 12, // Limit to 1 result when searching by Pet ID
        },
      });

      const pets: Pet[] = data?.pets || [];
      console.log('Found pets count:', pets.length);
      console.log('Pet breeds found:', pets.map(p => p.breed));
      console.log('Pet names and breeds:', pets.map(p => `${p.name} (${p.breed})`));

      // No fallback to unrelated results — show zero and let user open Advanced Filters
      const finalPets = pets;

      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: finalPets.length > 0 
          ? (filters.petId 
              ? `Found pet with ID ${filters.petId}:`
              : `First ${finalPets.length} pets matching your criteria:`)
          : (filters.petId 
              ? `No pet found with ID ${filters.petId}.`
              : `No pets found matching your criteria.`),
        pets: finalPets,
        filters: filters,
        timestamp: new Date(),
      };

      setConversation(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while searching. Please try again.',
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSeeMore = (filters: ParsedFilters) => {
    // Store filters and also pass via URL for reliability
    try {
      const json = JSON.stringify(filters);
      sessionStorage.setItem('aiSearchFilters', json);
      const encoded = encodeURIComponent(typeof window !== 'undefined' ? btoa(json) : '');
      router.push(`/advanced-filters?ai=${encoded}`);
    } catch {
      router.push('/advanced-filters');
    }
  };

  const exampleQueries = [
    "Show me all dogs",
    "Show all breeds",
    "Female dogs",
    "Male dogs", 
    "Ready to breed",
    "Golden retrievers"
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            {conversation.length === 0 ? (
              // Initial state - ChatGPT-like interface
              <div className="flex flex-col items-center justify-center flex-1 text-center">
                <div className="mb-8">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">What can I help you find?</h2>
                  <p className="text-gray-600">Describe the perfect pet you're looking for</p>
                </div>

                {/* Search Input */}
                <div className="w-full max-w-2xl mb-8">
                  <div className="relative">
                    <Input
                      placeholder="Ask anything"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-12 pl-4 pr-16 text-lg rounded-full border border-gray-300 focus:border-[#3d7c6f] focus:outline-none ring-0 ring-offset-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={isSearching || searchLoading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-8 w-8"
                        onClick={handleSearch}
                        disabled={isSearching || searchLoading || !searchQuery.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Example Queries */}
                <div className="w-full max-w-4xl">
                  <p className="text-sm text-gray-500 mb-4">Try these examples:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exampleQueries.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(example)}
                        className="text-left p-4 rounded-lg border border-gray-200 hover:border-[#3d7c6f] hover:bg-[#3d7c6f]/5 transition-colors"
                      >
                        <p className="text-sm text-gray-700">{example}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Conversation view
              <div className="flex flex-col flex-1">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                  {conversation.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-2xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                        {message.type === 'user' ? (
                          <div className="bg-[#3d7c6f] text-white p-3 rounded-xl rounded-br-md">
                            <p>{message.content}</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-gray-100 p-3 rounded-xl rounded-bl-md">
                              <p className="text-gray-800">{message.content}</p>
                            </div>
                            {message.pets && message.pets.length > 0 && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                  {message.pets.map((pet) => (
                                    <PetCard key={pet.id} pet={pet} />
                                  ))}
                                </div>
                                {message.filters && (
                                  <div className="flex justify-center pt-4">
                                    <Button 
                                      onClick={() => handleSeeMore(message.filters!)}
                                      variant="outline"
                                      className="flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                      </svg>
                                      See More Results
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {(isSearching || searchLoading) && (
                    <div className="flex justify-start">
                      <div className="max-w-3xl mr-12">
                        <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-md">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-[#3d7c6f] border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-600">Searching for pets...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Bottom Search Input */}
                <div className="sticky bottom-0 bg-white pt-4">
                  <div className="relative">
                    <Input
                      placeholder="Ask anything"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-12 pl-4 pr-16 text-lg rounded-full border border-gray-200 focus:border-[#3d7c6f] focus:outline-none ring-0 ring-offset-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={isSearching || searchLoading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-8 w-8"
                        onClick={handleSearch}
                        disabled={isSearching || searchLoading || !searchQuery.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}