import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

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
        {/* Global light, fluid background */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* Base soft white */}
          <div className="absolute inset-0" style={{ backgroundColor: '#ffffff' }} />

          {/* moving fluid highlights */}
          <div className="absolute inset-0 bg-fluid-dark" />

          {/* soft edge vignette */}
          <div className="absolute inset-0 bg-vignette pointer-events-none" />

          {/* subtle film grain */}
          <div className="absolute inset-0 bg-grain pointer-events-none" />
        </div>


        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
