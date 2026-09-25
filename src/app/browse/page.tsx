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
  'Family'
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

  const filteredItems = useMemo(() => {
    return allContent.filter((item) => {
      // Strict Vivamax exclusion
      const text = `${item.title} ${item.originalTitle || ''} ${item.synopsis || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
      if (text.includes('vivamax') || text.includes('viva max') || text.includes('viva prime')) {
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
        } else if (item.type !== selectedType) {
          return false;
        }
      }

      // Genre filter
      if (selectedGenre !== 'All') {
        if (!item.genres.includes(selectedGenre)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.score - a.score;
    });
  }, [allContent, isKidsMode, selectedType, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Explore Catalog
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Browse movies, anime, Philippine titles, and series in up to 4K Ultra HD
          </p>
        </div>

        {/* Actions: Sync & Sort */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleQuickSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 transition-all hover:scale-105 disabled:opacity-50"
            title="Load 80+ trending titles from global TMDB library"
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            <span>Sync TMDB Hits</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-surface-100 border border-white/10 text-white text-xs font-semibold rounded-xl px-3 py-2 focus-ring"
            >
              <option value="match">Match Score</option>
              <option value="year">Newest Year</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Type Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar">
        {TYPE_OPTIONS.map((t) => (
          <button
            key={t.value}
            onClick={() => setSelectedType(t.value)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
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
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
        {GENRE_CHIPS.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-surface-100 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex justify-center">
              <ContentCard
                item={item}
                onOpenDetails={(i) => setSelectedItem(i)}
              />
            </div>
          ))}
        </div>
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
