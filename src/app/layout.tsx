import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ProfileProvider } from '@/lib/profile-context';
import { ToastProvider } from '@/components/ui/Toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';
import { SpotlightSearch } from '@/components/catalog/SpotlightSearch';

export const metadata: Metadata = {
  title: 'Cinelog — Stream Movies, Anime & Series in 4K UHD',
  description:
    'Experience high-definition anime, Philippine movies, Hollywood blockbusters, and 4K cinema on Cinelog.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cinelog',
  },
  openGraph: {
    title: 'Cinelog — Stream Movies, Anime & Series in 4K UHD',
    description:
      'Experience high-definition anime, Philippine movies, Hollywood blockbusters, and 4K cinema on Cinelog.',
    siteName: 'Cinelog',
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0b14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://vidlink.pro" />
        <link rel="dns-prefetch" href="https://vidsrc.me" />
        <link rel="dns-prefetch" href="https://vidsrc.to" />
        <link rel="dns-prefetch" href="https://autoembed.co" />
        <link rel="dns-prefetch" href="https://multiembed.mov" />
        <link rel="dns-prefetch" href="https://vidsrc.pm" />
        <link rel="dns-prefetch" href="https://vidjoy.pro" />
        <link rel="dns-prefetch" href="https://player.videasy.net" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body
        className="font-sans antialiased min-h-[100dvh] bg-background text-foreground flex flex-col pb-16 md:pb-0 overflow-x-hidden max-w-[100vw] w-full"
      >
        <AuthProvider>
          <ProfileProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1 flex flex-col w-full max-w-[100vw] overflow-x-hidden">{children}</main>
              <Footer />
              <BottomNav />
              <PwaInstallPrompt />
              <SpotlightSearch />
            </ToastProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
