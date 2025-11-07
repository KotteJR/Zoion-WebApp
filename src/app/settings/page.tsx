'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Flag, Info, ChevronLeft } from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'privacy',
      title: 'Integritetspolicy',
      icon: Shield,
      description: 'Hur vi samlar in, använder och skyddar dina data',
    },
    {
      id: 'terms',
      title: 'Villkor & Regler',
      icon: FileText,
      description: 'Användarvillkor och avtal',
    },
    {
      id: 'report',
      title: 'Rapportera ett problem',
      icon: Flag,
      description: 'Rapportera buggar, problem eller olämpligt innehåll',
    },
    {
      id: 'about',
      title: 'Om',
      icon: Info,
      description: 'Läs mer om Zoion',
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">Integritetspolicy</h3>
            <div className="space-y-6 text-sm text-gray-700">
              <p className="text-gray-600/70">Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}</p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Information vi samlar in</h4>
                <p className="mb-2 text-gray-700">Vi samlar in information som du tillhandahåller direkt till oss, till exempel när du skapar ett konto, lägger till husdjursinformation eller kontaktar oss för support. Detta kan inkludera:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2 text-gray-700">
                  <li>Namn, e-postadress och kontaktinformation</li>
                  <li>Husdjursinformation inklusive foton, medicinska journaler och avelshistorik</li>
                  <li>Kommunikationspreferenser och supportförfrågningar</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Hur vi använder din information</h4>
                <p className="mb-2 text-gray-700">Vi använder den information vi samlar in för att:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2 text-gray-700">
                  <li>Leverera och underhålla våra tjänster</li>
                  <li>Bearbeta transaktioner och skicka relaterad information</li>
                  <li>Skicka tekniska meddelanden och supportmeddelanden</li>
                  <li>Svara på dina kommentarer och frågor</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Datasäkerhet</h4>
                <p className="text-gray-700">Vi implementerar lämpliga säkerhetsåtgärder för att skydda din personliga information mot obehörig åtkomst, ändring, avslöjande eller förstörelse.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Kontakta oss</h4>
                <p className="text-gray-700">Om du har några frågor om denna integritetspolicy, vänligen kontakta oss på privacy@zoion.com</p>
              </div>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">Villkor & Regler</h3>
            <div className="space-y-6 text-sm text-gray-700">
              <p className="text-gray-600/70">Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}</p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Godkännande av villkor</h4>
                <p className="text-gray-700">Genom att komma åt och använda Zoion accepterar och godkänner du att vara bunden av villkoren och bestämmelserna i detta avtal.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Användningslicens</h4>
                <p className="text-gray-700">Tillstånd beviljas att tillfälligt ladda ner en kopia av Zoion endast för personlig, icke-kommersiell tillfällig visning. Detta är en beviljande av en licens, inte en överföring av äganderätt.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Användaransvar</h4>
                <ul className="list-disc list-inside space-y-1 ml-2 text-gray-700">
                  <li>Lämna korrekt och komplett information om dina husdjur</li>
                  <li>Respektera andra användare och upprätthålla lämpligt uppförande</li>
                  <li>Inte använda tjänsten för olagliga eller obehöriga ändamål</li>
                  <li>Upprätthålla säkerheten för dina kontouppgifter</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Förbjudna användningar</h4>
                <p className="mb-2 text-gray-700">Du får inte använda vår tjänst:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2 text-gray-700">
                  <li>För något olagligt ändamål eller för att uppmana andra att utföra olagliga handlingar</li>
                  <li>För att bryta mot internationella, federala, provinsiella eller statliga regler, lagar eller lokala förordningar</li>
                  <li>För att kränka eller bryta mot våra immateriella rättigheter eller andras immateriella rättigheter</li>
                  <li>För att trakassera, missbruka, förolämpa, skada, förtala, förtala, förringa, skrämma eller diskriminera</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Friskrivning</h4>
                <p className="text-gray-700">Informationen på denna tjänst tillhandahålls "som den är". I den utsträckning som lagen tillåter, utesluter detta företag alla representationer, garantier, villkor och termer relaterade till vår tjänst.</p>
              </div>
            </div>
          </div>
        );

      case 'report':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">Rapportera ett problem</h3>
            <div className="space-y-6 text-sm text-gray-700">
              <p className="text-gray-700">Vi uppskattar din feedback och vill hjälpa till att lösa eventuella problem du stöter på.</p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Vad att rapportera</h4>
                <ul className="list-disc list-inside space-y-1 ml-2 text-gray-700">
                  <li>Tekniska buggar eller appkrascher</li>
                  <li>Olämpligt innehåll eller beteende</li>
                  <li>Säkerhetsproblem</li>
                  <li>Funktionsförfrågningar eller förbättringar</li>
                  <li>Konto- eller betalningsproblem</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Hur man rapporterar</h4>
                <p className="mb-2 text-gray-700">Vänligen inkludera följande information när du rapporterar:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2 text-gray-700">
                  <li>Detaljerad beskrivning av problemet</li>
                  <li>Steg för att återskapa problemet (om tillämpligt)</li>
                  <li>Enhet och webbläsarinformation</li>
                  <li>Skärmdumpar eller felmeddelanden</li>
                  <li>Din kontaktinformation för uppföljning</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Kontaktmetoder</h4>
                <div className="space-y-2 text-gray-700">
                  <p><strong className="text-gray-900">E-post:</strong> support@zoion.com</p>
                  <p><strong className="text-gray-900">Svarstid:</strong> Vi svarar vanligtvis inom 24-48 timmar</p>
                  <p><strong className="text-gray-900">Prioritet:</strong> Säkerhetsproblem hanteras omedelbart</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => window.open('mailto:support@zoion.com?subject=Problemrapport', '_blank')}
                  className="bg-gray-300/20 text-gray-900 border border-gray-300/30 hover:bg-gray-300/30 hover:border-gray-300/50 hover:shadow-sm"
                >
                  Skicka rapport via e-post
                </Button>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">Om Zoion</h3>
            <div className="space-y-6 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Vårt uppdrag</h4>
                <p className="text-gray-700">Zoion är en omfattande plattform designad för att koppla samman ansvarsfulla husdjursuppfödare och ägare, underlätta hälsosamma avelspraktiker och husdjurshantering genom avancerad teknik och gemenskapssupport.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Versionsinformation</h4>
                <div className="bg-gray-300/20 p-4 rounded-lg border border-gray-300/30 shadow-sm">
                  <div className="space-y-2 text-gray-700">
                    <p><strong className="text-gray-900">Version:</strong> 1.0.0</p>
                    <p><strong className="text-gray-900">Build:</strong> 2024.1.0</p>
                    <p><strong className="text-gray-900">Plattform:</strong> Webbapplikation</p>
                    <p><strong className="text-gray-900">Senast uppdaterad:</strong> {new Date().toLocaleDateString('sv-SE')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Huvudfunktioner</h4>
                <ul className="list-disc list-inside space-y-1 ml-2 text-gray-700">
                  <li>AI-driven husdjursökning och matchning</li>
                  <li>Avancerad filtrering och avelskompatibilitet</li>
                  <li>Husdjursprofilhantering med medicinska journaler</li>
                  <li>Gemenskapsfunktioner och uppfödaranlutningar</li>
                  <li>Favoriter och personliga rekommendationer</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Teknologistack</h4>
                <p className="text-gray-700">Byggd med moderna webbtekniker inklusive Next.js, React, TypeScript och GraphQL för optimal prestanda och användarupplevelse.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Kontaktinformation</h4>
                <div className="space-y-1 text-gray-700">
                  <p><strong className="text-gray-900">Webbplats:</strong> www.zoion.com</p>
                  <p><strong className="text-gray-900">E-post:</strong> info@zoion.com</p>
                  <p><strong className="text-gray-900">Support:</strong> support@zoion.com</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Upphovsrätt</h4>
                <p className="text-gray-700">© 2024 Zoion. Alla rättigheter förbehållna. Denna applikation och dess innehåll skyddas av upphovsrätt och andra immateriella rättigheter.</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="p-4 rounded-lg border border-gray-300/30 bg-gray-300/20 text-gray-900 text-left hover:bg-gray-300/30 hover:border-gray-300/50 hover:shadow-sm transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-gray-900" />
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600/90">{item.description}</p>
                </button>
              );
            })}
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full bg-transparent">
          <div className="flex flex-col gap-6 overflow-y-auto overflow-x-visible rounded-xl h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-6 w-full">
            <div className="flex items-center gap-4">
              {activeSection && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2 bg-gray-300/20 text-gray-900 border border-gray-300/30 hover:bg-gray-300/30 hover:border-gray-300/50 hover:shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Tillbaka
                </Button>
              )}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Inställningar</h2>
                <p className="text-sm text-gray-600/90">
                  {activeSection ? 'Visa detaljer och information' : 'Hantera dina preferenser och appinformation'}
                </p>
              </div>
            </div>

            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
