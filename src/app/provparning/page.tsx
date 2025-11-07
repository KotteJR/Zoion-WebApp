'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { GET_PET_DETAILS } from '@/lib/graphql/queries';
import { CALCULATE_INBREEDING_COEFFICIENT } from '@/lib/graphql/mutations';
import { Pet } from '@/types/pet';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Heart, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function ProvparningContent() {
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
        <div className="flex h-full bg-transparent">
          <div className="flex flex-col gap-6 overflow-y-auto overflow-x-visible rounded-xl h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-6 w-full">
            {/* Header */}
            <div className="flex flex-col gap-2">
             
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pet 1 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Din hund</h2>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Hund-ID</label>
                  <Input
                    type="text"
                    placeholder="Ange hund-ID"
                    value={pet1Id}
                    onChange={(e) => setPet1Id(e.target.value)}
                    className="w-full !bg-transparent !border-gray-300/60 !border text-gray-600 placeholder:text-gray-600 focus:!border-gray-300/60 focus:shadow-gray-300/20 focus:shadow-md !outline-none !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0"
                  />
                  {pet1Loading && <p className="text-xs text-gray-600/70 mt-1">Laddar hund...</p>}
                </div>
                
                {pet1 && (
                  <div className="p-4 bg-white/10 rounded-lg border border-gray-300/30 shadow-sm">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600/70">Namn:</span>
                        <span className="text-gray-900 font-medium">{pet1.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600/70">Ras:</span>
                        <span className="text-gray-900 font-medium">{pet1.breed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600/70">Kön:</span>
                        <span className="text-gray-900 font-medium">{pet1.sex === 'male' ? 'Hane' : 'Tik'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600/70">Född:</span>
                        <span className="text-gray-900 font-medium">
                          {pet1.date_born ? new Date(pet1.date_born).toLocaleDateString('sv-SE') : 'Okänt'}
                        </span>
                      </div>
                      {pet1.inbreed_rate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600/70">Nuvarande inavel:</span>
                          <span className="text-gray-900 font-medium">{pet1.inbreed_rate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Pet 2 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Kompatibel hund</h2>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Hund-ID</label>
                  <Input
                    type="text"
                    placeholder="Ange hund-ID"
                    value={pet2Id}
                    onChange={(e) => setPet2Id(e.target.value)}
                    className="w-full !bg-transparent !border-gray-300/60 !border text-gray-600 placeholder:text-gray-600 focus:!border-gray-300/60 focus:shadow-gray-300/20 focus:shadow-md !outline-none !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0"
                  />
                  {pet2Loading && <p className="text-xs text-gray-600/70 mt-1">Laddar hund...</p>}
                </div>
                
                {pet2 && (
                  <div className="p-4 bg-white/10 rounded-lg border border-gray-300/30 shadow-sm">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600/70">Namn:</span>
                        <span className="text-gray-900 font-medium">{pet2.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600/70">Ras:</span>
                        <span className="text-gray-900 font-medium">{pet2.breed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600/70">Kön:</span>
                        <span className="text-gray-900 font-medium">{pet2.sex === 'male' ? 'Hane' : 'Tik'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600/70">Född:</span>
                        <span className="text-gray-900 font-medium">
                          {pet2.date_born ? new Date(pet2.date_born).toLocaleDateString('sv-SE') : 'Okänt'}
                        </span>
                      </div>
                      {pet2.inbreed_rate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600/70">Nuvarande inavel:</span>
                          <span className="text-gray-900 font-medium">{pet2.inbreed_rate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Resultat</h2>
              
              {/* Compatibility Status */}
              {compatibilityStatus && (
                <div className={`p-4 rounded-lg border shadow-sm ${
                  compatibilityStatus === 'Kompatibel' 
                    ? 'bg-white/10 border-gray-300/50' 
                    : 'bg-white/10 border-gray-300/30'
                } text-gray-900`}>
                  <div className="flex items-center gap-3">
                    {compatibilityStatus === 'Kompatibel' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-900">Kompatibilitet:</h3>
                      <p className="text-sm text-gray-700">{compatibilityStatus}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 rounded-lg border border-gray-300/30 bg-white/10 text-gray-900 shadow-sm">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-900">Fel:</h3>
                      <p className="text-sm text-gray-700">{error}</p>
                    </div>
                  </div>
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
                const borderColor = isGood
                  ? 'border-green-500/50'
                  : isWarning
                  ? 'border-yellow-500/50'
                  : 'border-red-500/50';
                const iconColor = isGood
                  ? 'text-green-600'
                  : isWarning
                  ? 'text-yellow-600'
                  : 'text-red-600';
                const label = isGood ? 'Låg (rekommenderad)' : isWarning ? 'Måttlig (varning)' : 'Hög (inte rekommenderad)';
                return (
                  <div className={`p-4 rounded-lg border ${borderColor} bg-white/10 text-gray-900 shadow-sm`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 ${iconColor} mt-0.5`} />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 text-gray-900">Beräknad inavelkoefficient:</h3>
                        <div className="flex items-baseline gap-3 mb-2">
                          <p className="text-2xl font-bold text-gray-900">{inbreedingResult}</p>
                          <span className="text-sm text-gray-600/70">{label}</span>
                        </div>
                        <p className="text-xs text-gray-600/70">
                          Denna procent anger risken för genetiska problem hos avkomman.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={calculateInbreeding}
                  disabled={!pet1 || !pet2 || isCalculating || compatibilityStatus === 'Inkompatibel'}
                  className="flex-1 bg-white/10 text-gray-900 border border-gray-300/30 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm"
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
                  className="bg-white/10 text-gray-900 border border-gray-300/30 hover:bg-white/20 hover:border-gray-300/50 hover:shadow-sm"
                >
                  Rensa alla
                </Button>
              </div>
            </div>

            {/* Information Section */}
            <div className="p-4 rounded-lg border border-gray-300/30 bg-white/10 text-gray-900 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Information om provparning</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Provparning hjälper dig att bedöma kompatibiliteten mellan två hundar innan faktisk parning.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li><strong className="text-gray-900">Kompatibilitet:</strong> Hundarna måste vara av samma ras och motsatt kön</li>
                <li><strong className="text-gray-900">Inavelkoefficient:</strong> Visar risken för genetiska problem hos avkomman</li>
                <li><strong className="text-gray-900">Rekommendation:</strong> En inavelkoefficient under 6.25% anses vara säker</li>
                <li><strong className="text-gray-900">Varning:</strong> Högre värden kan öka risken för genetiska sjukdomar</li>
              </ul>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function ProvparningPage() {
  return (
    <Suspense fallback={
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-full bg-transparent">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto overflow-x-visible rounded-xl h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-6">
              <LoadingSpinner />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    }>
      <ProvparningContent />
    </Suspense>
  );
}
