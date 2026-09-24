'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentItem, ContentType } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { ContentCard } from '@/components/catalog/ContentCard';
import { TitleDetailsModal } from '@/components/catalog/TitleDetailsModal';
import { COMPREHENSIVE_CATALOG } from '@/lib/catalog-data';
import { SlidersHorizontal, Sparkles, Film } from 'lucide-react';

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
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [sortBy, setSortBy] = useState<'match' | 'year' | 'title'>('match');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const items = await catalogService.getAllContent();
      setAllContent(items);
      setLoading(false);
    }
    load();
  }, []);

  const filteredItems = useMemo(() => {
    return allContent.filter((item) => {
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

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-surface-100 border border-white/10 text-white text-xs font-semibold rounded-xl px-3 py-2 focus-ring"
          >
            <option value="match">Match Score (High to Low)</option>
            <option value="year">Release Year (Newest)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Content Type Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar">
        {TYPE_OPTIONS.map((t) => (
          <button
            key={t.value}
            onClick={() => setSelectedType(t.value)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              selectedType === t.value
                ? 'bg-cinemix-primary text-white shadow-lg shadow-indigo-500/25'
                : 'bg-surface-100/70 hover:bg-surface-200 text-gray-300 border border-white/[0.04]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Genre Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
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
