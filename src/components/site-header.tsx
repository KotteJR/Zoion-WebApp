'use client';

import Image from 'next/image';

export function SiteHeader({ title = 'Home' }: { title?: string }) {
  return (
    <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b bg-white">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        {/* Single brand placement handled by sidebar; header shows context title only */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">{title}</span>
        </div>
      </div>
    </header>
  );
}


