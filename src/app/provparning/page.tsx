'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { GET_PET_DETAILS } from '@/lib/graphql/queries';
import { CALCULATE_INBREEDING_COEFFICIENT } from '@/lib/graphql/mutations';
import { Pet } from '@/types/pet';

export default function ProvparningPage() {
  const searchParams = useSearchParams();
  const [pet1Id, setPet1Id] = useState('');
  const [pet2Id, setPet2Id] = useState('');
  const [inbreedingResult, setInbreedingResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compatibilityStatus, setCompatibilityStatus] = useState<string | null>(null);

  // GraphQL mutation for inbreeding calculation
  const [calculateInbreedingMutation, { loading: isCalculating }] = useMutation(CALCULATE_INBREEDING_COEFFICIENT);

  // Fetch pet details for both pets
  const { data: pet1Data, loading: pet1Loading } = useQuery(GET_PET_DETAILS, {
    variables: { petId: pet1Id },
    skip: !pet1Id,
  });

  const { data: pet2Data, loading: pet2Loading } = useQuery(GET_PET_DETAILS, {
    variables: { petId: pet2Id },
    skip: !pet2Id,
  });

  const pet1: Pet | undefined = pet1Data?.pets?.[0];
  const pet2: Pet | undefined = pet2Data?.pets?.[0];

  // Prefill from query string (?target=<id> or ?compatible=<id>)
  useEffect(() => {
    const target = searchParams?.get('target') || searchParams?.get('compatible');
    if (target) {
      setPet2Id(target);
    }
  }, [searchParams]);

  // Check compatibility when both pets are loaded
  const checkCompatibility = () => {
    if (!pet1 || !pet2) return;

    const errors: string[] = [];

    // Check if same breed
    if (pet1.breed !== pet2.breed) {
      errors.push('Hundarna måste vara av samma ras');
    }

    // Check if opposite sex
    if (pet1.sex === pet2.sex) {
      errors.push('Hundarna måste vara av motsatt kön');
    }

    if (errors.length > 0) {
      setError(errors.join('. '));
      setCompatibilityStatus('Inkompatibel');
      return false;
    }

    setError(null);
    setCompatibilityStatus('Kompatibel');
    return true;
  };

  // Simple client-side inbreeding calculation fallback using pedigree overlap
  const tryClientInbreeding = (a: Pet, b: Pet): string | null => {
    if (!a.family_tree || !b.family_tree) return null;
    try {
      const parseTree = (tree: string) => {
        const parsed = JSON.parse(tree);
        const generations: Record<string, Array<{ name: string; code: string }>> = Array.isArray(parsed)
          ? parsed.reduce((acc: any, obj: any) => Object.assign(acc, obj), {})
          : parsed;
        const ancestors = new Map<string, number>();
        Object.entries(generations).forEach(([gen, members]) => {
          const distance = Number(gen);
          if (Array.isArray(members)) {
            members.forEach((m) => {
              const key = `${m.name}|${m.code}`;
              const prev = ancestors.get(key);
              if (prev === undefined || distance < prev) ancestors.set(key, distance);
            });
          }
        });
        return ancestors;
      };

      const aAnc = parseTree(a.family_tree);
      const bAnc = parseTree(b.family_tree);

      let sum = 0;
      aAnc.forEach((aDist, key) => {
        const bDist = bAnc.get(key);
        if (bDist !== undefined) {
          const n = aDist + bDist; // total distance
          sum += Math.pow(0.5, n);
        }
      });

      return `${(sum * 100).toFixed(1)}%`;
    } catch (e) {
      return null;
    }
  };

  // Calculate inbreeding coefficient
  const calculateInbreeding = async () => {
    if (!pet1 || !pet2) {
      setError('Båda hund-ID:n måste anges');
      return;
    }

    if (!checkCompatibility()) {
      return;
    }

    setError(null);

    try {
      const result = await calculateInbreedingMutation({
        variables: {
          myPet: pet1Id,
          targetPet: pet2Id,
        },
      });

      const coefficient = result.data?.calculateInbreedingCoefficient;
      if (coefficient && (coefficient.percentage || coefficient.coefficient !== undefined)) {
        const pct = coefficient.percentage ?? `${(Number(coefficient.coefficient) * 100).toFixed(1)}%`;
        setInbreedingResult(pct);
      } else {
        // Fallback to client-calculated value
        const fallback = tryClientInbreeding(pet1, pet2);
        if (fallback) {
          setInbreedingResult(fallback);
        } else {
          throw new Error('Kunde inte beräkna inavelkoefficienten');
        }
      }
    } catch (err) {
      // Attempt client-side fallback when server mutation not present
      const msg = err instanceof Error ? err.message : 'Ett fel uppstod vid beräkning';
      if (/not found/i.test(msg) || /Unknown field/i.test(msg)) {
        const fallback = tryClientInbreeding(pet1, pet2);
        if (fallback) {
          setInbreedingResult(fallback);
          setError(null);
          return;
        }
      }
      setError(msg);
    }
  };

  // Auto-check compatibility when both pets are loaded
  useEffect(() => {
    if (pet1 && pet2) {
      checkCompatibility();
    }
  }, [pet1, pet2]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
    <div className="container mx-auto p-0 max-w-none">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Provparning</h1>
        <p className="text-gray-600 mt-2">
          Testa parning mellan två hundar och beräkna inavelkoefficienten för att säkerställa hälsosam avel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pet 1 Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Din hund</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Hund-ID</label>
              <Input
                type="text"
                placeholder="Ange hund-ID"
                value={pet1Id}
                onChange={(e) => setPet1Id(e.target.value)}
                className="w-full"
              />
              {pet1Loading && <p className="text-xs text-gray-500 mt-1">Laddar hund...</p>}
            </div>
            
            {pet1 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Hundinformation</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Namn:</strong> {pet1.name}</p>
                  <p><strong>Ras:</strong> {pet1.breed}</p>
                  <p><strong>Kön:</strong> {pet1.sex === 'male' ? 'Hane' : 'Tik'}</p>
                  <p><strong>Född:</strong> {pet1.date_born ? new Date(pet1.date_born).toLocaleDateString('sv-SE') : 'Okänt'}</p>
                  {pet1.inbreed_rate && (
                    <p><strong>Nuvarande inavel:</strong> {pet1.inbreed_rate}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pet 2 Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kompatibel hund</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Hund-ID</label>
              <Input
                type="text"
                placeholder="Ange hund-ID"
                value={pet2Id}
                onChange={(e) => setPet2Id(e.target.value)}
                className="w-full"
              />
              {pet2Loading && <p className="text-xs text-gray-500 mt-1">Laddar hund...</p>}
            </div>
            
            {pet2 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Hundinformation</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Namn:</strong> {pet2.name}</p>
                  <p><strong>Ras:</strong> {pet2.breed}</p>
                  <p><strong>Kön:</strong> {pet2.sex === 'male' ? 'Hane' : 'Tik'}</p>
                  <p><strong>Född:</strong> {pet2.date_born ? new Date(pet2.date_born).toLocaleDateString('sv-SE') : 'Okänt'}</p>
                  {pet2.inbreed_rate && (
                    <p><strong>Nuvarande inavel:</strong> {pet2.inbreed_rate}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resultat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Compatibility Status */}
            {compatibilityStatus && (
              <div className={`p-4 rounded-lg text-sm ${
                compatibilityStatus === 'Kompatibel' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <h3 className="font-semibold mb-1">Kompatibilitet:</h3>
                <p>{compatibilityStatus}</p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-lg text-sm bg-red-50 border border-red-200 text-red-800">
                <h3 className="font-semibold mb-1">Fel:</h3>
                <p>{error}</p>
              </div>
            )}

            {/* Inbreeding Result */}
            {inbreedingResult && (() => {
              const rateNum = (() => {
                const cleaned = String(inbreedingResult).replace('%', '').trim().replace(',', '.');
                const n = parseFloat(cleaned);
                return isNaN(n) ? 0 : n;
              })();
              const isGood = rateNum < 6.25;
              const isWarning = rateNum >= 6.25 && rateNum < 12.5;
              const isBad = rateNum >= 12.5;
              const boxClasses = isGood
                ? 'bg-green-50 border-green-200 text-green-800'
                : isWarning
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : 'bg-red-50 border-red-200 text-red-800';
              const label = isGood ? 'Låg (rekommenderad)' : isWarning ? 'Måttlig (varning)' : 'Hög (inte rekommenderad)';
              return (
                <div className={`p-4 rounded-lg text-sm border ${boxClasses}`}>
                  <h3 className="font-semibold mb-1">Beräknad inavelkoefficient:</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold">{inbreedingResult}</p>
                    <span className="text-xs opacity-80">{label}</span>
                  </div>
                  <p className="text-xs mt-1 opacity-90">
                    Denna procent anger risken för genetiska problem hos avkomman.
                  </p>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={calculateInbreeding}
                disabled={!pet1 || !pet2 || isCalculating || compatibilityStatus === 'Inkompatibel'}
                className="flex-1"
                size="lg"
              >
                {isCalculating ? 'Beräknar...' : 'Beräkna inavelkoefficient'}
              </Button>
              <Button
                onClick={() => {
                  setPet1Id('');
                  setPet2Id('');
                  setInbreedingResult(null);
                  setError(null);
                  setCompatibilityStatus(null);
                }}
                variant="outline"
                size="lg"
              >
                Rensa alla
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Section */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Information om provparning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 mb-3">
                Provparning hjälper dig att bedöma kompatibiliteten mellan två hundar innan faktisk parning.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li><strong>Kompatibilitet:</strong> Hundarna måste vara av samma ras och motsatt kön</li>
                <li><strong>Inavelkoefficient:</strong> Visar risken för genetiska problem hos avkomman</li>
                <li><strong>Rekommendation:</strong> En inavelkoefficient under 6.25% anses vara säker</li>
                <li><strong>Varning:</strong> Högre värden kan öka risken för genetiska sjukdomar</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
