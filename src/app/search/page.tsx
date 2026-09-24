'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, X, Film, Sparkles } from 'lucide-react';
import { ContentItem } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { ContentCard } from '@/components/catalog/ContentCard';
import { TitleDetailsModal } from '@/components/catalog/TitleDetailsModal';
import { COMPREHENSIVE_CATALOG } from '@/lib/catalog-data';

const POPULAR_SEARCHES = ['Breaking Bad', 'Attack on Titan', 'Batang Quiapo', 'Stranger Things', 'Oppenheimer', 'Squid Game', 'Demon Slayer', 'Rewind', 'Dune', 'Interstellar'];

export default function SearchPage() {
  const { isKidsMode } = useProfile();
  const [query, setQuery] = useState('');
  const [allContent, setAllContent] = useState<ContentItem[]>(() => COMPREHENSIVE_CATALOG);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    async function load() {
      const items = await catalogService.getAllContent();
      setAllContent(items);
    }
    load();
  }, []);

  const results = useMemo(() => {
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
            placeholder="Search by title, genre, actor, director, or studio..."
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

      {/* Results Header */}
      {query.trim() && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Results for &ldquo;{query}&rdquo;
          </h2>
          <span className="text-xs text-gray-400">
            {results.length} {results.length === 1 ? 'title' : 'titles'} found
          </span>
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {results.map((item) => (
            <div key={item.id} className="flex justify-center">
              <ContentCard
                item={item}
                onOpenDetails={(i) => setSelectedItem(i)}
              />
            </div>
          ))}
        </div>
      ) : query.trim() ? (
        <div className="py-24 text-center space-y-4 bg-surface-50/50 rounded-3xl border border-white/[0.04] p-8 max-w-md mx-auto">
          <Film className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No titles found</h3>
          <p className="text-xs text-gray-400">
            We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try another title, actor, or genre.
          </p>
        </div>
      ) : (
        /* Empty Query Showcase */
        <div className="py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-surface-100 border border-white/10 flex items-center justify-center mx-auto text-cinemix-primary shadow-xl">
            <SearchIcon className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-white">Find your next favorite watch</h3>
            <p className="text-xs text-gray-400">
              Search across our expanding library of movies, anime, Philippine blockbusters, and 4K documentaries.
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
