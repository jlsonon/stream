'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentItem, ContentType } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { ContentCard } from '@/components/catalog/ContentCard';
import { TitleDetailsModal } from '@/components/catalog/TitleDetailsModal';
import { COMPREHENSIVE_CATALOG } from '@/lib/catalog-data';
import { SlidersHorizontal, Sparkles, Film, Globe, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Content', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Series', value: 'series' },
  { label: 'Anime & Animation', value: 'anime' },
  { label: 'Philippine Cinema', value: 'ph_content' },
  { label: 'Korean Drama', value: 'kdrama' },
  { label: 'Documentaries', value: 'documentary' },
];

const GENRE_CHIPS = [
  'All',
  'Action',
  'Sci-Fi',
  'Fantasy',
  'Animation',
  'Drama',
  'Comedy',
  'Thriller',
  'Adventure',
  'Family',
  'Horror',
  'Romance',
  'Mystery',
  'Crime',
  'Documentary',
  'Philippine Cinema',
  'K-Drama',
  'History',
  'Western',
];

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  const initialGenre = searchParams.get('genre') || 'All';

  const { isKidsMode } = useProfile();
  const [allContent, setAllContent] = useState<ContentItem[]>(() => COMPREHENSIVE_CATALOG);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const { toast } = useToast();
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [sortBy, setSortBy] = useState<'match' | 'year' | 'title'>('match');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [discoverPage, setDiscoverPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleQuickSync = async () => {
    setIsSyncing(true);
    toast({
      type: 'info',
      message: 'Loading trending titles worldwide from TMDB...',
      duration: 3000
    });
    try {
      const res = await fetch('/api/tmdb/sync');
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await catalogService.saveContent(item);
        }
        const updated = await catalogService.getAllContent();
        setAllContent(updated);
        toast({
          type: 'success',
          message: `Loaded ${data.items.length} new worldwide titles into catalog!`,
          duration: 4000
        });
      }
    } catch {
      toast({
        type: 'error',
        message: 'Could not sync global titles.',
        duration: 3000
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const items = await catalogService.getAllContent();
      setAllContent(items);
      setLoading(false);
    }
    load();

    // Background staleness check
    catalogService.checkAutoRefresh();

    const handleCatalogRefreshed = async () => {
      const items = await catalogService.getAllContent();
      setAllContent(items);
    };

    window.addEventListener('cinemix:catalog-refreshed', handleCatalogRefreshed);
    return () => {
      window.removeEventListener('cinemix:catalog-refreshed', handleCatalogRefreshed);
    };
  }, []);

  // Auto-fetch from TMDB live discover if selected genre or type has few local results
  useEffect(() => {
    const matching = allContent.filter(item => {
      if (selectedGenre !== 'All') {
        const target = selectedGenre.toLowerCase();
        if (!item.genres.some(g => g.toLowerCase() === target || g.toLowerCase().includes(target))) {
          return false;
        }
      }
      if (selectedType !== 'all') {
        if (selectedType === 'ph_content') {
          return item.type === 'ph_content' || item.genres.includes('Philippine Cinema');
        }
        if (selectedType === 'kdrama') {
          return item.genres.some(g => g.toLowerCase().includes('k-drama') || g.toLowerCase().includes('korean'));
        }
        return item.type === selectedType;
      }
      return true;
    });

    if (matching.length < 10 && (selectedGenre !== 'All' || selectedType !== 'all')) {
      fetch(`/api/tmdb/discover?type=${selectedType}&genre=${encodeURIComponent(selectedGenre)}&page=1`)
        .then(res => res.json())
        .then(data => {
          if (data.items && data.items.length > 0) {
            for (const item of data.items) {
              catalogService.saveContent(item);
            }
            setAllContent(prev => {
              const existingIds = new Set(prev.map(i => i.id));
              const newItems = data.items.filter((i: ContentItem) => !existingIds.has(i.id));
              return [...prev, ...newItems];
            });
          }
        })
        .catch(() => {});
    }
  }, [selectedGenre, selectedType]);

  const handleLoadMoreWorldwide = async () => {
    setIsLoadingMore(true);
    const nextPage = discoverPage + 1;
    try {
      const res = await fetch(`/api/tmdb/discover?type=${selectedType}&genre=${encodeURIComponent(selectedGenre)}&page=${nextPage}`);
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          for (const item of data.items) {
            await catalogService.saveContent(item);
          }
          setAllContent(prev => {
            const existingIds = new Set(prev.map(i => i.id));
            const newItems = data.items.filter((i: ContentItem) => !existingIds.has(i.id));
            return [...prev, ...newItems];
          });
          setDiscoverPage(nextPage);
          toast({
            type: 'success',
            message: `Loaded ${data.items.length} more titles from TMDB!`,
            duration: 3000
          });
        } else {
          toast({
            type: 'info',
            message: 'All worldwide titles for this category loaded.',
            duration: 3000
          });
        }
      }
    } catch {
      toast({
        type: 'error',
        message: 'Failed to fetch more titles from TMDB network.',
        duration: 3000
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filteredItems = useMemo(() => {
    return allContent.filter((item) => {
      // Strict Vivamax exclusion
      const text = `${item.title} ${item.originalTitle || ''} ${item.synopsis || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
      if (text.includes('vivamax') || text.includes('viva max') || text.includes('viva prime') || text.includes('vmx')) {
        return false;
      }

      // Kids mode filter
      if (isKidsMode && (item.maturityRating === 'R' || item.maturityRating === 'NC-17')) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all') {
        if (selectedType === 'ph_content') {
          if (item.type !== 'ph_content' && !item.genres.includes('Philippine Cinema')) {
            return false;
          }
        } else if (selectedType === 'kdrama') {
          if (!item.genres.some(g => g.toLowerCase().includes('k-drama') || g.toLowerCase().includes('korean'))) {
            return false;
          }
        } else if (item.type !== selectedType) {
          return false;
        }
      }

      // Genre filter
      if (selectedGenre !== 'All') {
        const target = selectedGenre.toLowerCase();
        if (!item.genres.some(g => g.toLowerCase() === target || g.toLowerCase().includes(target))) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.score - a.score;
    });
  }, [allContent, isKidsMode, selectedType, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-18 sm:pt-28 pb-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-x-hidden">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Explore Catalog
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
            Browse movies, anime, Philippine titles, and series in up to 4K Ultra HD
          </p>
        </div>

        {/* Actions: Sync & Sort (Responsive Mobile Widths) */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleQuickSync}
            disabled={isSyncing}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Load 80+ trending titles from global TMDB library"
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            <span>Sync TMDB</span>
          </button>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-surface-100 border border-white/10 text-white text-xs font-semibold rounded-xl px-2.5 py-2 focus-ring"
            >
              <option value="match">Match Score</option>
              <option value="year">Newest Year</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Type Pill Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-3 hide-scrollbar touch-pan-x overscroll-x-contain">
        {TYPE_OPTIONS.map((t) => (
          <button
            key={t.value}
            onClick={() => setSelectedType(t.value)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
              selectedType === t.value
                ? 'bg-cinemix-primary text-black shadow-glow-primary'
                : 'bg-surface-100/70 hover:bg-surface-200 text-gray-300 border border-white/[0.04]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Genre Chips */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-4 sm:mb-6 hide-scrollbar touch-pan-x overscroll-x-contain">
        {GENRE_CHIPS.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedGenre === g
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-surface-200/50 hover:bg-surface-200 text-gray-400 hover:text-white border border-white/[0.04]'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-surface-100 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="w-full flex justify-center">
                <ContentCard
                  item={item}
                  className="w-full"
                  onOpenDetails={(i) => setSelectedItem(i)}
                />
              </div>
            ))}
          </div>

          {/* Load More Worldwide Titles from TMDB Global Network */}
          <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-2.5 text-center">
            <button
              onClick={handleLoadMoreWorldwide}
              disabled={isLoadingMore}
              className="px-6 py-3 rounded-2xl bg-surface-200/90 hover:bg-surface-300 text-white font-bold text-xs sm:text-sm border border-white/10 hover:border-cinemix-primary/50 flex items-center gap-2.5 transition-all shadow-xl disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-cinemix-primary border-t-transparent animate-spin" />
                  <span>Loading Worldwide Titles from TMDB...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-cinemix-primary" />
                  <span>Load More Worldwide Titles ({selectedGenre !== 'All' ? selectedGenre : 'All Global'})</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-gray-400">
              Instant access to 1,000,000+ movies, anime, teleseryes, and series via TMDB global library.
            </p>
          </div>
        </>
      ) : (
        <div className="py-24 text-center space-y-4 bg-surface-50/50 rounded-3xl border border-white/[0.04] p-8">
          <Film className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No titles match your filters</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try switching categories or choosing a different genre filter.
          </p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedGenre('All');
            }}
            className="px-5 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-white text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Title Details Modal */}
      <TitleDetailsModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-cinemix-primary border-t-transparent animate-spin" />
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
