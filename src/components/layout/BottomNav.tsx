'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, Bookmark, User as UserIcon } from 'lucide-react';
import { useProfile } from '@/lib/profile-context';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { activeProfile } = useProfile();

  // Hide bottom nav while on the full-screen watch player
  if (pathname.startsWith('/watch')) return null;

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Browse', href: '/browse', icon: Compass },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'My List', href: '/my-list', icon: Bookmark },
    { name: 'Profile', href: '/profiles', icon: UserIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-100/90 backdrop-blur-lg border-t border-white/[0.06] px-2 py-2">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-cinemix-primary font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
