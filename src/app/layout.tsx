import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import AnimatedBackground from '@/components/background/AnimatedBackground';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zoion - Pet Breeding Social Network',
  description: 'Zoion is a social networking platform that helps you find the perfect pet for breeding.',
  icons: {
    icon: '/assets/icons/zoionAppIcon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className={`${dmSans.variable} h-full overflow-hidden`}>
        {/* Global animated background */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* Base white */}
          <div className="absolute inset-0" style={{ backgroundColor: '#ffffff' }} />

          {/* Gradient spheres - fewer, cleaner green spheres */}
          <div className="absolute inset-0 gradient-background">
            <div className="gradient-sphere sphere-1"></div>
            <div className="gradient-sphere sphere-2"></div>
            <div className="gradient-sphere sphere-3"></div>
          </div>

          {/* Noise overlay */}
          <div className="noise-overlay"></div>

          {/* Particles container */}
          <div id="particles-container" className="particles-container"></div>
        </div>

        <AnimatedBackground />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
