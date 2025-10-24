import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

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
    <html lang="en">
      <body className={dmSans.variable}>
        {children}
      </body>
    </html>
  );
}


