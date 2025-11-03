'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface TopNavBarProps {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
  rightAction?: React.ReactNode;
}

export default function TopNavBar({
  title,
  showBack = false,
  showSettings = false,
  rightAction,
}: TopNavBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {showBack ? (
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ← Back
              </button>
            ) : (
              <Link
                href="/home"
                className="flex items-center"
                onClick={() => {
                  try {
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('aiChatConversation');
                      sessionStorage.removeItem('aiChatInput');
                    }
                  } catch {}
                  try { router.refresh(); } catch {}
                }}
              >
                <Image
                  src="/assets/images/png/zoionplatform.png"
                  alt="Zoion"
                  width={120}
                  height={28}
                  priority
                />
              </Link>
            )}
          </div>

          {title && (
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          )}

          <div className="flex items-center gap-4">
            {rightAction}
            {showSettings && (
              <Link
                href="/settings"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ⚙️ Settings
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


