'use client';

import { useState, useRef, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import PetCard from '@/components/pet/PetCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SEARCH_PETS, SEARCH_KENNELS } from '@/lib/graphql/queries';
import { Pet } from '@/types/pet';
import { Send, Menu } from 'lucide-react';
function MobileHamburger() {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300/60 bg-white/70 text-gray-700 shadow-sm hover:text-gray-900"
      aria-label="Öppna meny"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
import KennelCard from '@/components/kennel/KennelCard';
import KennelMap from '@/components/maps/KennelMap';

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  pets?: Pet[];
  kennels?: any[];
  kennelCoords?: { id: string; latitude: number; longitude: number; name?: string }[];
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
  city?: string; // maps to user.address or kennel.address ilike city
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
  const colorMatch = query.match(/\b(?:color|colour)\s*:?:?\s*([a-zA-ZåäöÅÄÖéÉ\-]+)/i);
  if (colorMatch) {
    filters.color = colorMatch[1];
  }

  // Kennel detection: "kennel <name>" or "from kennel <name>"
  const kennelMatch = query.match(/\bkennel\s*:?:?\s*([\w\s'’\-]+)/i);
  if (kennelMatch) {
    filters.kennelName = kennelMatch[1].trim();
  }

  // Name contains: "named <x>" or "called <x>"
  const nameMatch = query.match(/\b(?:named|called|name)\s*:?:?\s*([\w\s'’\-]+)/i);
  if (nameMatch) {
    filters.nameContains = nameMatch[1].trim();
  }

  // City / location detection: "near/close to/around/in <city>" or Swedish "i <stad>"
  const cityMatch = query.match(/\b(?:near|close\s*to|around|in|i)\s+([A-Za-zÅÄÖåäö\-\s]+)/i);
  if (cityMatch) {
    let city = cityMatch[1].trim();
    if (/^malmo$/i.test(city)) city = 'Malmö';
    filters.city = city;
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
  const [searchKennels] = useLazyQuery(SEARCH_KENNELS);

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
      
      // Detect kennel intent
      const qLower = currentQuery.toLowerCase();
      const isKennelIntent = qLower.includes('kennel') || qLower.includes('kennels');

      // If the user asked for kennels, handle that separately
      if (isKennelIntent) {
        let kennels: any[] = [];

        // If breed mentioned, get kennels from pet results filtered by breed
        if (filters.breeds && filters.breeds.length > 0) {
          const breedOr: any[] = [];
          for (const b of filters.breeds) {
            const variants = generateBreedVariants(b);
            for (const v of variants) breedOr.push({ breed: { _ilike: `%${v}%` } });
          }
          const { data } = await searchPets({
            variables: {
              where: { _or: breedOr },
              limit: 100,
            },
          });
          const pets: Pet[] = data?.pets || [];
          const unique = new Map<string, any>();
          for (const p of pets) {
            const k = (p as any).kennel;
            if (k && k.id && !unique.has(k.id)) unique.set(k.id, k);
          }
          kennels = Array.from(unique.values()).slice(0, 12);
        } else {
          // Otherwise use kennel name / city detection
          const and: any[] = [];
          if (filters.kennelName) and.push({ name: { _ilike: `%${filters.kennelName}%` } });
          const cityMatch = currentQuery.match(/\b(?:in|i)\s+([A-Za-zÅÄÖåäö\-\s]+)/i);
          if (cityMatch) and.push({ address: { _ilike: `%${cityMatch[1].trim()}%` } });

          const { data } = await searchKennels({
            variables: { where: and.length > 0 ? { _and: and } : {}, limit: 12 },
          });
          kennels = data?.kennels || [];
        }

        // Geocode addresses (best-effort, parallel)
        const toGeocode = kennels
          .map(k => ({ id: k.id, name: k.name, address: `${k.address || ''} ${k.post_number || ''} Sweden`.trim() }))
          .filter(k => k.address);

        const results = await Promise.allSettled(
          toGeocode.map(async k => {
            const res = await fetch('/api/geocode', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address: k.address }),
            });
            const json = await res.json();
            if (json?.latitude && json?.longitude) {
              return { id: k.id, name: k.name, latitude: json.latitude, longitude: json.longitude };
            }
            return null;
          })
        );

        const kennelCoords = results
          .map(r => (r.status === 'fulfilled' ? r.value : null))
          .filter(Boolean) as { id: string; latitude: number; longitude: number; name?: string }[];

        const assistantMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content:
            kennels.length > 0
              ? `Hittade ${kennels.length} kennlar som matchar din förfrågan:`
              : 'Inga kennlar hittades för din förfrågan.',
          kennels,
          kennelCoords,
          filters,
          timestamp: new Date(),
        };
        setConversation(prev => [...prev, assistantMessage]);
        return;
      }

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
        // inbreed_rate is stored as a STRING like '0,0 %' or '2,5 %'
        const rateStr = filters.inbreedRate.value.toString().replace('.', ',');
        andConditions.push({ inbreed_rate: { _ilike: `${rateStr}%` } });
      }

      if (filters.color) {
        // Search both 'color' and 'colour' fields
        andConditions.push({ 
          _or: [
            { color: { _ilike: `%${filters.color}%` } },
            { colour: { _ilike: `%${filters.color}%` } }
          ]
        });
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

      // City filter: match owner address or kennel address or kennel_name
      if (filters.city) {
        andConditions.push({ _or: [
          { user: { address: { _ilike: `%${filters.city}%` } } },
          { kennel: { address: { _ilike: `%${filters.city}%` } } },
          { kennel_name: { _ilike: `%${filters.city}%` } }
        ]});
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

      let pets: Pet[] = data?.pets || [];
      console.log('Found pets count:', pets.length);
      console.log('Pet breeds found:', pets.map(p => p.breed));
      console.log('Pet names and breeds:', pets.map(p => `${p.name} (${p.breed})`));

      // If a location was specified, sort pets by proximity (best-effort geocode)
      const locationQuery = (filters as any).locationQuery || (filters as any).city;
      if (locationQuery && pets.length > 0) {
        try {
          // 1) Geocode the query place (assume Sweden)
          const originRes = await fetch('/api/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: `${locationQuery}, Sweden` }),
          });
          const originJson = await originRes.json();
          if (originJson?.latitude && originJson?.longitude) {
            const origin = { lat: originJson.latitude as number, lng: originJson.longitude as number };

            // 2) Build geocoding targets from pet addresses (user/kennel/kennel_name)
            const addressCache = new Map<string, { lat: number; lng: number } | null>();
            const petWithAddress = pets.map((p) => {
              const userAddr = (p as any).owner?.address as string | undefined;
              const kennelAddr = (p as any).kennel?.address as string | undefined;
              const kennelName = (p as any).kennel_name as string | undefined;
              const addressCandidate = [userAddr, kennelAddr, kennelName]
                .filter(Boolean)
                .map(a => String(a))
                .find(a => a.trim().length > 0) || '';
              const full = addressCandidate ? `${addressCandidate} Sweden` : '';
              return { pet: p, address: full };
            });

            // 3) Geocode distinct addresses in parallel (best-effort)
            const uniqueAddresses = Array.from(new Set(petWithAddress.map(x => x.address))).filter(a => a);
            await Promise.allSettled(uniqueAddresses.map(async (addr) => {
              try {
                const res = await fetch('/api/geocode', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ address: addr }),
                });
                const json = await res.json();
                if (json?.latitude && json?.longitude) {
                  addressCache.set(addr, { lat: json.latitude, lng: json.longitude });
                } else {
                  addressCache.set(addr, null);
                }
              } catch {
                addressCache.set(addr, null);
              }
            }));

            // 4) Compute distances and sort
            function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
              const toRad = (x: number) => (x * Math.PI) / 180;
              const R = 6371; // km
              const dLat = toRad(b.lat - a.lat);
              const dLon = toRad(b.lng - a.lng);
              const lat1 = toRad(a.lat);
              const lat2 = toRad(b.lat);
              const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
              return 2 * R * Math.asin(Math.sqrt(h));
            }

            const petsWithDistance = petWithAddress.map(({ pet, address }) => {
              const coord = address ? addressCache.get(address) : null;
              const distanceKm = coord ? haversine(origin, coord) : Number.POSITIVE_INFINITY;
              return { pet, distanceKm };
            });

            petsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);
            pets = petsWithDistance.map(x => x.pet);
          }
        } catch (e) {
          console.warn('Distance sort failed:', e);
        }
      }

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
    {
      title: "Visa alla hundar",
      description: "Hitta alla tillgängliga hundar i systemet",
      query: "Visa alla hundar",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Visa alla raser",
      description: "Utforska hundraser från A till Ö",
      query: "Visa alla hundraser",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: "Tikar",
      description: "Hitta kvinnliga hundar redo för avel",
      query: "Visa tikar som är redo att para",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Hanar",
      description: "Hitta manliga hundar för avel",
      query: "Visa hanar som är redo att para",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Redo att para",
      description: "Hundar som är redo för avel just nu",
      query: "Visa hundar som är redo att para",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Golden Retrievers",
      description: "Populära familjehundar med guldgul päls",
      query: "Visa Golden Retrievers",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full bg-transparent">
          {/* Mobile hamburger placed on gray background */}
          <div className="md:hidden mb-2">
            <MobileHamburger />
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto border border-gray-100/30 overflow-x-visible rounded-xl bg-white/5 md:h-[calc(100vh-2rem)]">
            {conversation.length === 0 ? (
              // Initial state - ChatGPT-like interface
              <div className="flex flex-col items-center justify-center flex-1 text-center relative">
                <div className="mb-8 relative z-20">
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-3">
                    Vad kan jag hjälpa dig hitta?
                  </h2>
                  <p className="text-white mb-2 ext-base md:text-lg font-medium">
                    Beskriv den perfekta hunden du letar efter
                  </p>
                </div>

                {/* Search Input */}
                <div className="w-full max-w-2xl mb-20 relative bg-transparent">
                  {/* Fluid gradient shadow behind search box */}
                  <div className="relative z-10">
                    <Input
                      placeholder="Fråga oss om vad som helst"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="!bg-transparent !border-gray-200/20 !border h-10 pl-4 pr-16 text-sm text-white placeholder:text-gray-400 rounded-full focus:!border-gray-200/30 !outline-none !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0"
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
                        <Send className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Example Queries */}
                <div className="w-full max-w-5xl relative">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {exampleQueries.slice(0,4).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(example.query);
                          handleSearch();
                        }}
                        className="p-3 md:p-4 rounded-xl bg-transparent shadow-sm hover:shadow-md border border-gray-200/20 text-left transition-all duration-200 relative overflow-hidden"
                      >
                        {/* Flowy animated background inside each card */}
                        <div className="relative z-10">
                          <h3 className="font-medium text-white">
                            {example.title}
                          </h3>
                          <p className="text-xs md:text-sm text-white/95 mt-1 line-clamp-2">
                            {example.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Conversation view
              <div className="flex flex-col flex-1 p-4">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                  {conversation.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-2xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                        {message.type === 'user' ? (
                          <div className="bg-white/5 text-white px-3 py-3 rounded-xl rounded-br-md border border-white/20">
                            <p>{message.content}</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-white/5 text-white px-3 py-3 rounded-xl rounded-bl-md border border-white/20">
                              <p>{message.content}</p>
                            </div>
                            {message.kennelCoords && message.kennelCoords.length > 0 && (
                              <KennelMap points={message.kennelCoords} />
                            )}
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
                                      className="flex items-center gap-2 bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white/80"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                      </svg>
                                      Visa fler resultat
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                            {message.kennels && message.kennels.length > 0 && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                  {message.kennels.map((k) => (
                                    <KennelCard key={k.id} kennel={k} />
                                  ))}
                                </div>
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
                        <div className="bg-white/5 text-white px-5 py-4 rounded-2xl rounded-bl-md border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                            <p>Söker efter hundar...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Bottom Search Input */}
                <div className="bottom pt-4">
                  <div className="relative">
                    <Input
                      placeholder="Fråga vad som helst"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="!bg-transparent !border-white/20 !border h-12 pl-4 pr-16 text-sm text-white placeholder:text-white/60 rounded-full focus:!border-white/30 !outline-none !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0"
                      disabled={isSearching || searchLoading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-8 w-8 text-white hover:bg-white/10"
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