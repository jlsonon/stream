'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, ShieldCheck, Sparkles, Tv, Smartphone, Laptop, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide footer on watch player route for pure cinema immersion
  if (pathname.startsWith('/watch')) return null;

  return (
    <footer className="w-full bg-surface-50/80 border-t border-white/[0.06] pt-12 pb-16 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-gray-400">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-surface-200 border border-white/10 flex items-center justify-center shadow-cinema group-hover:border-cinemix-primary/50 transition-all">
                <div className="relative flex items-center justify-center">
                  <span className="font-mono text-sm font-black tracking-tighter text-white">C</span>
                  <span className="absolute -top-0.5 -right-1 w-1 h-1 rounded-full bg-cinemix-primary" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider text-white leading-none font-sans uppercase">
                  CINE<span className="text-cinemix-primary">MIX</span>
                </span>
                <span className="text-[7.5px] font-mono tracking-[0.2em] text-gray-500 uppercase leading-none mt-1">
                  ENTERTAINMENT
                </span>
              </div>
            </Link>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Cinemix is an installable, high-performance global streaming platform delivering movies, television series, anime, Philippine cinema, and documentaries in 4K Ultra HD with adaptive multi-server playback.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-200 text-gray-300 text-[10px] font-bold border border-white/[0.06]">
                <Globe className="w-3 h-3 text-cinemix-primary" /> Global CDN
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-200 text-gray-300 text-[10px] font-bold border border-white/[0.06]">
                <Sparkles className="w-3 h-3 text-amber-400" /> 4K Ultra HD
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-200 text-gray-300 text-[10px] font-bold border border-white/[0.06]">
                Dolby 5.1
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Catalog</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/browse?type=movie" className="hover:text-white transition-colors">
                  Movies & Blockbusters
                </Link>
              </li>
              <li>
                <Link href="/browse?type=series" className="hover:text-white transition-colors">
                  Global TV Series
                </Link>
              </li>
              <li>
                <Link href="/browse?type=anime" className="hover:text-white transition-colors">
                  Anime Masterpieces
                </Link>
              </li>
              <li>
                <Link href="/browse?type=ph_content" className="hover:text-white transition-colors">
                  Philippine Teleseryes & Cinema
                </Link>
              </li>
              <li>
                <Link href="/browse?type=documentary" className="hover:text-white transition-colors">
                  Documentaries
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/upgrade" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Cinemix Pro (₱399)
                </Link>
              </li>
              <li>
                <Link href="/profiles" className="hover:text-white transition-colors">
                  Profiles & Kids Mode
                </Link>
              </li>
              <li>
                <Link href="/my-list" className="hover:text-white transition-colors">
                  My Watchlist
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Global Search & TMDB
                </Link>
              </li>
              <li>
                <Link href="/superadmin" className="hover:text-purple-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Superadmin CMS
                </Link>
              </li>
            </ul>
          </div>

          {/* Devices & Compliance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Devices</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-gray-400" />
                <span>Web, macOS, Windows, Linux</span>
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                <span>iOS & Android PWA</span>
              </li>
              <li className="flex items-center gap-2">
                <Tv className="w-3.5 h-3.5 text-gray-400" />
                <span>Smart TVs & Android TV</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} Cinemix Media Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Powered by TMDB API</span>
            <span>Multi-Bitrate HLS</span>
            <span>Adaptive 4K UHD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
