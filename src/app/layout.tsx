import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import waaLogo from '/public/images/waaLogo.png';

import { Toaster } from 'react-hot-toast';
import Providers from '@/providers';

import '@/styles/globals.css';
import { freePixelFont, supplyMediumFont } from '@/assets/fonts';

const ppSupplyMono = localFont({
  src: [
    {
      path: './fonts/PPSupplyMono-Ultralight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/PPSupplyMono-Regular.otf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-pp-supply-mono',
});

export const metadata: Metadata = {
  title: 'AFEL',
  description: 'AFEL WEBSITE',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${ppSupplyMono.variable} ${freePixelFont.variable} ${supplyMediumFont.variable}  antialiased`}
      >
        <Providers>
          <div className="relative min-h-screen w-full">
            <Navbar logo={waaLogo} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Toaster position="bottom-right" />
        {/* <MusicPlayer /> */}
      </body>
    </html>
  );
}
