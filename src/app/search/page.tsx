'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search as SearchIcon, 
  X, 
  Film, 
  Sparkles, 
  Globe, 
  Play, 
  Loader2, 
  Star, 
  Tv,
  Info,
  Check
} from 'lucide-react';
import { ContentItem } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { useToast } from '@/components/ui/Toast';
import { ContentCard } from '@/components/catalog/ContentCard';
import { TitleDetailsModal } from '@/components/catalog/TitleDetailsModal';
import { COMPREHENSIVE_CATALOG } from '@/lib/catalog-data';

const POPULAR_SEARCHES = [
  'Breaking Bad', 
  'Attack on Titan', 
  'Batang Quiapo', 
  'Stranger Things', 
  'Oppenheimer', 
  'Squid Game', 
  'Demon Slayer', 
  'Rewind', 
  'Dune', 
  'Interstellar'
];

interface TmdbSearchResult {
  id: number;
  title: string;
  originalTitle?: string;
  type: 'movie' | 'series';
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  score: number;
  popularity: number;
}

export default function SearchPage() {
  const router = useRouter();
  const { isKidsMode } = useProfile();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [allContent, setAllContent] = useState<ContentItem[]>(() => COMPREHENSIVE_CATALOG);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // TMDB Global Live Search State
  const [tmdbResults, setTmdbResults] = useState<TmdbSearchResult[]>([]);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'local' | 'global'>('all');

  useEffect(() => {
    async function load() {
      const items = await catalogService.getAllContent();
      setAllContent(items);
    }
    load();
  }, []);

  // Filter local catalog items
  const localResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();

    return allContent.filter((item) => {
      if (isKidsMode && (item.maturityRating === 'R' || item.maturityRating === 'NC-17')) {
        return false;
      }

      const matchTitle = item.title.toLowerCase().includes(q) || (item.originalTitle?.toLowerCase().includes(q) ?? false);
      const matchGenre = item.genres.some(g => g.toLowerCase().includes(q));
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      const matchCast = item.cast?.some(c => c.name.toLowerCase().includes(q)) ?? false;
      const matchDirector = item.directors?.some(d => d.toLowerCase().includes(q)) ?? false;
      const matchType = item.type.toLowerCase().includes(q);

      return matchTitle || matchGenre || matchTags || matchCast || matchDirector || matchType;
    });
  }, [allContent, query, isKidsMode]);

  // Debounced TMDB Live Search across all world movies & TV shows
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setTmdbResults([]);
      setIsSearchingTmdb(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingTmdb(true);
      try {
        const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setTmdbResults(data.results || []);
        }
      } catch (err) {
        console.error('TMDB Live Search error:', err);
      } finally {
        setIsSearchingTmdb(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Handler to stream or view any title directly from TMDB
  const handleTmdbAction = async (item: TmdbSearchResult, action: 'play' | 'details' = 'play') => {
    // Check if item already exists locally
    const existing = allContent.find(c => c.tmdbId === item.id);
    if (existing) {
      if (action === 'play') {
        router.push(`/watch/${existing.id}`);
      } else {
        setSelectedItem(existing);
      }
      return;
    }

    setImportingId(item.id);
    try {
      const res = await fetch(`/api/tmdb/details?id=${item.id}&type=${item.type}`);
      if (!res.ok) throw new Error('Could not load title data from TMDB');
      const data = await res.json();
      
      if (data.item) {
        await catalogService.saveContent(data.item);
        setAllContent(prev => [data.item, ...prev.filter(x => x.id !== data.item.id)]);
        toast({
          type: 'success',
          message: `Ready to stream "${data.item.title}"!`,
          duration: 3000
        });

        if (action === 'play') {
          router.push(`/watch/${data.item.id}`);
        } else {
          setSelectedItem(data.item);
        }
      }
    } catch (err: any) {
      toast({
        type: 'error',
        message: err.message || 'Failed to prepare video stream',
        duration: 4000
      });
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Search Input Bar */}
      <div className="relative max-w-3xl mx-auto mb-8">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-5 w-6 h-6 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any movie, anime, series, or actor worldwide..."
            autoFocus
            className="w-full pl-14 pr-12 py-4 rounded-2xl bg-surface-100 border border-white/10 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-cinemix-primary focus:ring-2 focus:ring-cinemix-primary/20 transition-all shadow-xl"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Popular Search Suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 hide-scrollbar">
          <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">Suggested:</span>
          {POPULAR_SEARCHES.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-surface-200/70 hover:bg-surface-200 text-gray-300 hover:text-white border border-white/[0.04] whitespace-nowrap transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Query Header & Source Filter Tabs */}
      {query.trim() && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Results for &ldquo;{query}&rdquo;
              {isSearchingTmdb && <Loader2 className="w-4 h-4 text-cinemix-primary animate-spin" />}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {localResults.length} in featured catalog · {tmdbResults.length} live from TMDB global library
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-cinemix-primary text-white shadow-md'
                  : 'bg-surface-200 text-gray-400 hover:text-white'
              }`}
            >
              All Results ({localResults.length + tmdbResults.length})
            </button>
            <button
              onClick={() => setActiveTab('local')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'local'
                  ? 'bg-cinemix-primary text-white shadow-md'
                  : 'bg-surface-200 text-gray-400 hover:text-white'
              }`}
            >
              Featured Library ({localResults.length})
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                activeTab === 'global'
                  ? 'bg-cinemix-primary text-white shadow-md'
                  : 'bg-surface-200 text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> TMDB Global ({tmdbResults.length})
            </button>
          </div>
        </div>
      )}

      {/* Content Display */}
      {query.trim() ? (
        <div className="space-y-12">
          {/* Section 1: Featured In-Catalog Results */}
          {(activeTab === 'all' || activeTab === 'local') && localResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Featured & Verified Library
                </h3>
                <span className="text-xs text-gray-400">{localResults.length} titles</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {localResults.map((item) => (
                  <div key={item.id} className="flex justify-center">
                    <ContentCard
                      item={item}
                      onOpenDetails={(i) => setSelectedItem(i)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Global TMDB Worldwide Results */}
          {(activeTab === 'all' || activeTab === 'global') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cinemix-primary" /> Worldwide Library (TMDB Real-Time Stream Engine)
                </h3>
                <span className="text-xs text-gray-400">
                  {isSearchingTmdb ? 'Searching globe...' : `${tmdbResults.length} titles`}
                </span>
              </div>

              {tmdbResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {tmdbResults.map((item) => {
                    const isAlreadyImported = allContent.some(c => c.tmdbId === item.id);
                    const isImportingThis = importingId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="group relative flex flex-col rounded-2xl bg-surface-100 border border-white/[0.08] overflow-hidden hover:border-cinemix-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cinemix-primary/10 hover:-translate-y-1"
                      >
                        {/* Poster Image */}
                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-200">
                          <img
                            src={item.posterUrl}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                            <button
                              onClick={() => handleTmdbAction(item, 'play')}
                              disabled={isImportingThis}
                              className="w-full py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-200 transition-colors shadow-lg"
                            >
                              {isImportingThis ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-current" />
                              )}
                              Stream Now
                            </button>
                            <button
                              onClick={() => handleTmdbAction(item, 'details')}
                              disabled={isImportingThis}
                              className="w-full py-1.5 rounded-xl bg-surface-200/80 hover:bg-surface-300 text-white font-medium text-xs flex items-center justify-center gap-1 backdrop-blur-md transition-colors"
                            >
                              <Info className="w-3.5 h-3.5" /> Details
                            </button>
                          </div>

                          {/* Top Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                              {item.type === 'movie' ? <Film className="w-2.5 h-2.5" /> : <Tv className="w-2.5 h-2.5" />}
                              {item.type}
                            </span>
                            {isAlreadyImported && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-500/80 backdrop-blur-md text-white flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Library
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2 right-2 pointer-events-none">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-amber-400 border border-white/10 flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              {item.score}
                            </span>
                          </div>
                        </div>

                        {/* Title & Info */}
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-cinemix-primary transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>{item.releaseYear}</span>
                            <span className="capitalize text-gray-500">{item.type}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : isSearchingTmdb ? (
                <div className="py-16 text-center space-y-3 bg-surface-50/50 rounded-2xl border border-white/[0.04]">
                  <Loader2 className="w-8 h-8 text-cinemix-primary animate-spin mx-auto" />
                  <p className="text-xs text-gray-400">Searching global TMDB database for matching movies and shows...</p>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-gray-500">
                  No additional titles found on TMDB matching this query.
                </div>
              )}
            </div>
          )}

          {/* Empty state if both have 0 results and search is done */}
          {localResults.length === 0 && tmdbResults.length === 0 && !isSearchingTmdb && (
            <div className="py-24 text-center space-y-4 bg-surface-50/50 rounded-3xl border border-white/[0.04] p-8 max-w-md mx-auto">
              <Film className="w-12 h-12 text-gray-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No titles found</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We couldn&apos;t find anything matching &ldquo;{query}&rdquo; across either local catalog or the global TMDB library. Try searching by movie title, actor, or franchise name.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Empty Query Showcase */
        <div className="py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-surface-100 border border-white/10 flex items-center justify-center mx-auto text-cinemix-primary shadow-xl">
            <SearchIcon className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-white">Find your next favorite watch</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Search across our verified catalog or millions of worldwide movies, television series, and anime with instant multi-server streaming.
            </p>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <TitleDetailsModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
