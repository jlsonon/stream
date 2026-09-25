'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Film, 
  Sparkles, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut, 
  Settings, 
  Check 
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/profile-context';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, signOut, loginAsDemo } = useAuth();
  const { profiles, activeProfile, selectProfile } = useProfile();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide Navbar completely on the full-screen watch player route (after all hooks are registered)
  if (pathname.startsWith('/watch')) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Pinoy Hits', href: '/browse?type=ph_content' },
    { name: 'Series', href: '/browse?type=series' },
    { name: 'Movies', href: '/browse?type=movie' },
    { name: 'Anime', href: '/browse?type=anime' },
    { name: 'My List', href: '/my-list' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface-50/95 backdrop-blur-xl border-b border-white/[0.08] shadow-cinema' 
          : 'bg-gradient-to-b from-black/95 via-black/50 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8 lg:gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Monolithic Cinema Emblem */}
              <div className="w-9 h-9 rounded-xl bg-surface-200 border border-white/10 flex items-center justify-center shadow-cinema group-hover:border-cinemix-primary/50 group-hover:shadow-glow-primary transition-all">
                <div className="relative flex items-center justify-center">
                  <span className="font-mono text-base font-black tracking-tighter text-white">C</span>
                  <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full bg-cinemix-primary" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-white leading-none font-sans uppercase">
                  CINE<span className="text-cinemix-primary">MIX</span>
                </span>
                <span className="text-[8.5px] font-mono tracking-[0.22em] text-gray-400 uppercase leading-none mt-1">
                  ENTERTAINMENT
                </span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`relative text-xs lg:text-sm font-semibold tracking-wide transition-colors py-1 ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cinemix-primary rounded-full shadow-glow-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Upgrade Button or Pro Status */}
            {mounted && user?.plan === 'PRO' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cinemix-primary text-black shadow-glow-primary">
                <Sparkles className="w-3.5 h-3.5 fill-current" /> PRO VIP
              </span>
            ) : (
              <Link
                href="/upgrade"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-surface-200 hover:bg-surface-300 text-white border border-white/10 hover:border-cinemix-primary/50 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-cinemix-primary" />
                <span>Join Pro</span>
                <span className="text-cinemix-primary font-mono font-bold">₱399</span>
              </Link>
            )}

            {/* Search Icon */}
            <Link 
              href="/search"
              className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors focus-ring"
              title="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Superadmin Link Button */}
            <Link
              href="/superadmin"
              className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors focus-ring"
              title="Superadmin Dashboard"
            >
              <ShieldCheck className="w-5 h-5 text-cinemix-primary" />
            </Link>

            {/* Profile Avatar & Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 focus-ring rounded-full p-0.5"
              >
                <img
                  src={activeProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={activeProfile?.name || 'Profile'}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-white/20 hover:ring-cinemix-primary transition-all"
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-surface-100 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-scale-in text-xs">
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                    <p className="font-bold text-white text-sm">{activeProfile?.name || 'My Profile'}</p>
                    <div className="flex items-center justify-between text-gray-400 capitalize mt-0.5">
                      <span>{activeProfile?.isKids ? 'Kids Profile' : (user?.plan === 'PRO' ? 'Pro Member' : 'Free Member')}</span>
                      {user?.plan === 'PRO' && (
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">VIP</span>
                      )}
                    </div>
                  </div>

                  {/* 1-Click Demo Pro Activator */}
                  <div className="px-2 py-1 mb-1 border-b border-white/[0.06]">
                    {user?.plan === 'PRO' ? (
                      <button
                        onClick={() => {
                          loginAsDemo('free');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface-200/50 hover:bg-surface-200 text-gray-400 hover:text-white transition-colors text-[11px]"
                      >
                        <span>Active: Demo Pro</span>
                        <span className="text-[10px] text-amber-400 underline">Switch to Free</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          loginAsDemo('pro');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-bold transition-colors text-[11px]"
                      >
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Activate Demo Pro
                        </span>
                        <span className="text-[9px] bg-amber-500 text-black px-1 rounded font-black">1-CLICK</span>
                      </button>
                    )}
                  </div>

                  {/* Profile Switcher List */}
                  <div className="space-y-1 mb-2">
                    <div className="px-3 py-1 font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                      Switch Profile
                    </div>
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          selectProfile(p);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-200 hover:bg-surface-200 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={p.avatarUrl} alt={p.name} className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-medium">{p.name}</span>
                        </div>
                        {activeProfile?.id === p.id && <Check className="w-3.5 h-3.5 text-cinemix-primary" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-white/[0.06] pt-1 space-y-1">
                    <Link
                      href="/profiles"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-300 hover:bg-surface-200 hover:text-white transition-colors"
                    >
                      <UserIcon className="w-4 h-4" /> Manage Profiles
                    </Link>

                    <Link
                      href="/upgrade"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-400 hover:bg-amber-400/10 transition-colors font-semibold"
                    >
                      <Sparkles className="w-4 h-4" /> Pro Subscription
                    </Link>

                    <Link
                      href="/superadmin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-300 hover:bg-surface-200 hover:text-white transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" /> Superadmin CMS
                    </Link>

                    {user ? (
                      <button
                        onClick={() => {
                          signOut();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-cinemix-primary hover:bg-cinemix-primary/10 transition-colors font-semibold"
                      >
                        Sign In / Register
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus-ring"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-100 border-b border-white/[0.06] p-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-surface-200 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.08] space-y-2">
            <Link
              href="/upgrade"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4 fill-current" /> Join Cinemix Pro (₱399/mo)
            </Link>
            <Link
              href="/superadmin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-4 rounded-xl bg-surface-200 text-gray-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-surface-300"
            >
              <ShieldCheck className="w-4 h-4 text-cinemix-primary" /> Superadmin CMS
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
