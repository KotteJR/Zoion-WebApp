'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Home, Star, Filter, Heart, Settings } from 'lucide-react';

// Simple sidebar context
const SidebarContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
} | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ open, setOpen, isMobile, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, setOpen, isMobile } = useSidebar();

  const navMain = [
    {
      title: 'Hem',
      url: '/home',
      icon: <Home className="w-6 h-6" strokeWidth={1.5} />,
    },
    {
      title: 'Utvalda Hundar',
      url: '/featured',
      icon: <Star className="w-6 h-6" strokeWidth={1.5} />,
    },
    {
      title: 'Avancerade Filter',
      url: '/advanced-filters',
      icon: <Filter className="w-6 h-6" strokeWidth={1.5} />,
    },
    {
      title: 'Provparning',
      url: '/provparning',
      icon: <Heart className="w-6 h-6" strokeWidth={1.5} />,
    },
  ];

  const navSecondary = [
    {
      title: 'Inställningar',
      url: '/settings',
      icon: <Settings className="w-6 h-6" strokeWidth={1.5} />,
    },
  ];

  const isActive = (url: string) => {
    return pathname.startsWith(url) || (url === '/home' && pathname === '/');
  };

  const handleLinkClick = (url: string) => {
    if (url === '/home') {
                          try {
                            if (typeof window !== 'undefined') {
                              sessionStorage.removeItem('aiChatConversation');
                              sessionStorage.removeItem('aiChatInput');
                            }
                          } catch {}
                          setTimeout(() => {
                            try { router.refresh(); } catch {}
                          }, 0);
                        }
    if (isMobile) {
      setOpen(false);
    }
  };

  const sidebarContentDesktop = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center">
        <Image
          src="/assets/images/svg/dogPaw.svg"
          alt="Zoion"
          width={28}
          height={28}
          className="h-8 w-8"
        />
        
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex flex-1 flex-col gap-2 justify-center">
          {navMain.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              onClick={() => handleLinkClick(item.url)}
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-xl transition-colors",
                isActive(item.url)
                  ? "bg-gray-400/15 text-gray-800"
                  : "text-gray-700 hover:bg-gray-400/10 hover:text-gray-800"
              )}
            >
              {item.icon}
            </Link>
          ))}
        </div>

        {/* Secondary Navigation */}
        <div className="flex flex-col gap-2">
          {navSecondary.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              onClick={() => handleLinkClick(item.url)}
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-lg transition-colors",
                isActive(item.url)
                  ? "bg-gray-400/15 text-gray-800"
                  : "text-gray-700 hover:bg-gray-400/10 hover:text-gray-800"
              )}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );

  const sidebarContentMobile = (
    <div className="flex h-16 items-center justify-between px-4 w-full">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/assets/images/svg/dogPaw.svg"
          alt="Zoion"
          width={28}
          height={28}
          className="h-7 w-7"
        />
      </div>

      {/* Main Navigation - Horizontal */}
      <nav className="flex items-center gap-2 flex-1 justify-center">
        {navMain.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            onClick={() => handleLinkClick(item.url)}
            className={cn(
              "flex items-center justify-center h-10 w-10 rounded-xl transition-colors",
              isActive(item.url)
                ? "bg-gray-500/10 text-gray-800"
                : "text-gray-700 hover:bg-gray-900/10 hover:text-gray-900"
            )}
                    >
                      {item.icon}
                    </Link>
              ))}
      </nav>

      {/* Settings - Right side */}
      <div className="flex items-center">
              {navSecondary.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            onClick={() => handleLinkClick(item.url)}
            className={cn(
              "flex items-center justify-center h-10 w-10 rounded-lg transition-colors",
              isActive(item.url)
                ? "bg-gray-500/10 text-gray-800"
                : "text-gray-700 hover:bg-gray-900/10 hover:text-gray-900"
            )}
          >
                      {item.icon}
                    </Link>
        ))}
      </div>
    </div>
  );

  // Mobile: Card at top
  if (isMobile) {
    return (
      <header className="fixed top-4 left-4 right-4 z-50 h-16 rounded-xl overflow-hidden border shadow-lg shadow-gray-800/10 border-gray-300/30 bg-gray-300/15">
        {sidebarContentMobile}
      </header>
    );
  }

  // Desktop: Floating sidebar (always visible)
  return (
    <aside
      className="fixed left-4 top-4 bottom-4 z-50 w-16 rounded-xl overflow-hidden border shadow-lg shadow-gray-800/10 border-gray-300/30 bg-gray-300/15"
    >
      {sidebarContentDesktop}
    </aside>
  );
}

// Simple SidebarInset component for layout
export function SidebarInset({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isMobile } = useSidebar();
  return (
    <main className={cn(
      "flex-1",
      isMobile ? "pt-24" : "md:ml-24 md:mt-4 md:mb-4 md:mr-4",
      className
    )}>
      {children}
    </main>
  );
}
