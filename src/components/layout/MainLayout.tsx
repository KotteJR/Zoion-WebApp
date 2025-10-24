'use client';

// Legacy layout kept for pages not yet migrated to the new shell
import TopNavBar from './TopNavBar';

interface MainLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  showTopNav?: boolean;
  topNavProps?: {
    title?: string;
    showBack?: boolean;
    showSettings?: boolean;
    rightAction?: React.ReactNode;
  };
}

export default function MainLayout({
  children,
  showBottomNav = false,
  showTopNav = true,
  topNavProps,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showTopNav && <TopNavBar {...topNavProps} />}
      {/* Header separator */}
      <div className="w-full">
        <img src="/assets/images/svg/gradientLine.svg" alt="" className="w-full h-[2px]" />
      </div>
      <main className={`${showBottomNav ? 'pb-20' : ''} ${showTopNav ? 'pt-0' : ''}`}>
        {children}
      </main>
      {/* Footer separator if bottom nav hidden, otherwise the bar already has a border */}
      {!showBottomNav && (
        <div className="w-full">
          <img src="/assets/images/svg/gradientLine.svg" alt="" className="w-full h-[2px]" />
        </div>
      )}
      {showBottomNav && <BottomNavBar />}
    </div>
  );
}


