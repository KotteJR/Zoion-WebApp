'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  {
    name: 'Home',
    path: '/home',
    iconActive: '/assets/icons/bottomBarHomeActive.svg',
    iconInactive: '/assets/icons/bottomBarHomeInactive.svg',
  },
  {
    name: 'Search',
    path: '/search',
    iconActive: '/assets/icons/bottomBarSearchActive.svg',
    iconInactive: '/assets/icons/bottomBarSearchInactive.svg',
  },
  {
    name: 'Feed',
    path: '/feed',
    iconActive: '/assets/icons/bottomBarFeedActive.svg',
    iconInactive: '/assets/icons/bottomBarFeedInactive.svg',
  },
  {
    name: 'Notifications',
    path: '/notifications',
    iconActive: '/assets/icons/bottomBarNotificationsActive.svg',
    iconInactive: '/assets/icons/bottomBarNotificationsInactive.svg',
  },
  {
    name: 'Profile',
    path: '/profile',
    iconActive: '/assets/icons/bottomBarProfileActive.svg',
    iconInactive: '/assets/icons/bottomBarProfileInactive.svg',
  },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`}
              >
                <div className="w-6 h-6 relative">
                  <Image
                    src={isActive ? item.iconActive : item.iconInactive}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}


