'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Film, Tv, Sparkles, Star, ArrowRight, Clock, Play } from 'lucide-react';
import { ContentItem } from '@/types';
import { catalogService } from '@/lib/catalog-service';

const POPULAR_SEARCHES = [
  'Breaking Bad',
  'Attack on Titan',
  'Oppenheimer',
  'Batang Quiapo',
  'Squid Game',
  'Arcane',
  'Interstellar',
  'Jujutsu Kaisen'
];

export const SpotlightSearch: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Global Keyboard Shortcuts (Cmd+K, Ctrl+K, or '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in another form field
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      if (e.key === '/' && !isInputField) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('cinelog:open-spotlight', handleCustomOpen);
    window.addEventListener('cinemix:open-spotlight', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('cinelog:open-spotlight', handleCustomOpen);
      window.removeEventListener('cinemix:open-spotlight', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Query TMDB Search API with local catalog fallback
        const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            setResults(data.results.slice(0, 8));
            setSelectedIndex(0);
            setLoading(false);
            return;
          }
        }

        // Local catalog fallback search
        const localMatches = await catalogService.searchContent(query.trim());
        setResults(localMatches.slice(0, 8));
        setSelectedIndex(0);
      } catch (err) {
        // Silently fallback to local
        const localMatches = await catalogService.searchContent(query.trim());
        setResults(localMatches.slice(0, 8));
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Arrow key navigation
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  const handleSelect = (item: ContentItem) => {
    setIsOpen(false);
    catalogService.saveContent(item);
    router.push(`/watch/${item.id}`);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6 animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-surface-100/95 border border-white/15 rounded-2xl sm:rounded-3xl shadow-cinema overflow-hidden flex flex-col backdrop-blur-2xl animate-scale-in"
      >
        {/* Search Input Header */}
        <div className="relative flex items-center px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/[0.08] bg-black/40">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyNavigation}
            placeholder="Search movies, TV shows, anime, directors, or paste TMDB ID..."
            className="w-full bg-transparent border-0 px-3 sm:px-4 text-sm sm:text-base font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-0"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-gray-400 border border-white/10">
              ESC
            </kbd>
          )}
        </div>

        {/* Search Body Content */}
        <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 hide-scrollbar">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-cinelog-primary border-t-transparent animate-spin" />
              <p className="text-xs font-medium text-gray-400">Searching global streaming index...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                Top Results ({results.length}) · Use ↑↓ arrows to navigate, Enter to stream
              </div>
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const isMovie = item.type === 'movie' || (item.type as any) === 'film';
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full p-2.5 sm:p-3 rounded-xl flex items-center gap-3 sm:gap-4 text-left transition-all ${
                      isSelected 
                        ? 'bg-cinelog-primary/15 border border-cinelog-primary/30 text-white shadow-md' 
                        : 'hover:bg-white/5 border border-transparent text-gray-300'
                    }`}
                  >
                    {/* Poster Thumbnail */}
                    <div className="w-10 sm:w-12 h-14 sm:h-16 rounded-lg bg-surface-200 overflow-hidden flex-shrink-0 relative">
                      <img
                        src={item.posterUrl || item.backdropUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isMovie 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-xs font-mono text-gray-400">
                          {item.releaseYear}
                        </span>
                        {item.score && (
                          <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                            <Star className="w-3 h-3 fill-current" /> {item.score}
                          </span>
                        )}
                        <span className="text-[10px] font-mono font-bold text-gray-400 ml-auto hidden sm:inline">
                          {item.maxQuality || '4K UHD'}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-white truncate">
                        {item.title}
                      </h4>

                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {item.synopsis || 'Ready to stream on Cinelog.'}
                      </p>
                    </div>

                    {/* Action Icon */}
                    <div className={`p-2 rounded-lg ${isSelected ? 'text-cinelog-primary' : 'text-gray-500'}`}>
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : query ? (
            <div className="py-12 text-center space-y-2">
              <Film className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-sm font-bold text-white">No titles matched &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-gray-400">Try searching with a broader title or actor name.</p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <Sparkles className="w-3.5 h-3.5 text-cinelog-primary" /> Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-200/80 hover:bg-surface-300 text-gray-300 hover:text-white border border-white/10 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-gray-300">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-gray-300">↓</kbd> to select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-gray-300">↵</kbd> to play
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
