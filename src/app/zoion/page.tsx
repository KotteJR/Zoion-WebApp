import Image from 'next/image';
import Link from 'next/link';
import { Dog, Dna, MessageCircle, Stethoscope } from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata = {
  title: 'Zoion – Marknadens smartaste app för uppfödare och hundägare',
  description:
    'Med Zoion blir ditt hundliv enklare. Här möter du hundägare, uppfödare och deras hundar på ett helt nytt sätt.',
};

export default function ZoionMarketingPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full bg-transparent">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-visible rounded-xl md:border border-gray-100/30 bg-white/5 h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-6">
      {/* Hero */}
      <section className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-12">
        <h1 className="text-3xl text-center md:text-4xl font-bold text-white mb-12">
                Sveriges smartaste app för uppfödare och hundägare
              </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-white/90 text-base md:text-lg max-w-xl">
                Med Zoion blir ditt hundliv enklare – här möter du hundägare, uppfödare och deras hundar på ett helt nytt sätt. Unika möjligheter att se härstamning i många led, hälsodata och inavelsgrad gör Zoion till ett avancerat verktyg för att planera en valpkull. Nyfiken? Ladda ned appen redan idag.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" rel="noopener noreferrer" className="block">
                  <img
                    src="/assets/badges/app-store-badge.svg"
                    alt="Download on the App Store"
                    className="h-12 md:h-14 w-auto block"
                    loading="eager"
                  />
                </Link>
                <Link href="https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME" target="_blank" rel="noopener noreferrer" className="block">
                  <img
                    src="/assets/badges/google-play-badge.svg"
                    alt="Get it on Google Play"
                    className="h-12 md:h-14 w-auto block"
                    loading="eager"
                  />
                </Link>
              </div>
            </div>
            <div className="relative w-full h-56 md:h-80 rounded-3xl overflow-hidden">
              <Image
                src="/assets/images/png/main.png"
                alt="Zoion"
                fill
                className="object-cover rounded-3xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visual About: how Zoion works without images */}
      <section className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-12">Så funkar Zoion – steg för steg</h2>

            {/* Process — 4 columns with headline, subtitle and pills */}
            <div className="relative pt-6">
              {/* top progress rail with nodes */}
              <div className="hidden md:block absolute -top-4 left-0 right-0 h-2">
                <div className="h-px bg-gray-300 mt-2" />
                <div className="grid grid-cols-4 gap-8 -mt-[7px]">
                  {[0,1,2,3].map((i) => (
                    <div key={i} className="flex justify-start">
                      <div className="w-3 h-3 rounded-full bg-[#3d7c6f]" />
                    </div>
                  ))}
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative mt-0">
                {/* Part 1 */}
                 <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Skapa konto</h3>
                  <p className="text-white/80">Logga in med BankID eller e‑post.</p>
                  <div className="mt-6 flex flex-wrap gap-2">

                  </div>
                </div>

                {/* Part 2 */}
                 <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Lägg till din hund</h3>
                  <p className="text-white/80">Registreringsnummer, bilder och grunddata.</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                  </div>
                </div>

                {/* Part 3 */}
                 <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Sök & filtrera/AI‑fråga</h3>
                  <p className="text-white/80">Beskriv vad du söker eller använd filter.</p>
                  <div className="mt-6 flex flex-wrap gap-2">
            
                  </div>
                </div>

                {/* Part 4 */}
                 <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Få träffar & planera</h3>
                  <p className="text-white/80">Se inavelsgrad och gör provparning för rekommendationer.</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                  </div>
                </div>
              </div>
            </div>

            {/* Text-only feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200/70">
                <Dog className="mb-2 text-[#2d5a4f]" size={24} />
                <div className="font-medium text-white">Ras & egenskaper</div>
                <div className="text-sm text-white/80">Hitta rätt hund med tydliga fakta och filter.</div>
              </div>
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200/70">
                <Dna className="mb-2 text-[#2d5a4f]" size={24} />
                <div className="font-medium text-white">Inavelsgrad & släkt</div>
                <div className="text-sm text-white/80">Stamtavla i flera led direkt i sökresultatet.</div>
              </div>
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200/70">
                <MessageCircle className="mb-2 text-[#2d5a4f]" size={24} />
                <div className="font-medium text-white">Dialog & matchning</div>
                <div className="text-sm text-white/80">Kontakta ägare och provpara för rekommendationer.</div>
              </div>
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200/70">
                <Stethoscope className="mb-2 text-[#2d5a4f]" size={24} />
                <div className="font-medium text-white">Hälsa & tävling</div>
                <div className="text-sm text-white/80">Se medicinsk data och tävlingsresultat samlat.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

     



      {/* Why Zoion – feature grid */}
      <section className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">Varför Zoion?</h2>
              <p className="text-white/80 mt-3 max-w-sm">Det här är varför uppfödare och hundägare väljer Zoion – fakta, trygghet och smarta verktyg på ett ställe.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-2">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#2d5a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                  <div className="font-medium text-white">Trygg avel med fakta</div>
                  <div className="text-sm text-white/80">Inavelsgrad, stamtavlor i flera led och medicinska data samlat.</div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#2d5a4f]" />
                <div>
                  <div className="font-medium text-white">Community & nätverk</div>
                  <div className="text-sm text-white/80">Chatta med ägare och uppfödare, bygg relationer och planera.</div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="flex items-start gap-3">
                <Dog className="w-5 h-5 text-[#2d5a4f]" />
                <div>
                  <div className="font-medium text-white">Kraftfull sök & matchning</div>
                  <div className="text-sm text-white/80">Filtrera efter ras, ålder, kön och få rekommenderade partners.</div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-[#2d5a4f]" />
                <div>
                  <div className="font-medium text-white">AI‑stöd när du behöver</div>
                  <div className="text-sm text-white/80">Tre guider ger snabba och relevanta svar även på svåra frågor.</div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="flex items-start gap-3">
                <Dog className="w-5 h-5 text-[#2d5a4f]" />
                <div>
                  <div className="font-medium text-white">Data från uppfödare</div>
                  <div className="text-sm text-white/80">Stort uppfödarregister och uppdaterad hunddata för bättre beslut.</div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#2d5a4f]" />
                <div>
                  <div className="font-medium text-white">Lätt att använda</div>
                  <div className="text-sm text-white/80">Modern, tydlig och enkel – byggd av veterinärer och uppfödare.</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      

      

      
  
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


