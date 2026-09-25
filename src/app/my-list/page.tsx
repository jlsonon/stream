'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Film, Play, Trash2, ArrowRight } from 'lucide-react';
import { ContentItem } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { ContentCard } from '@/components/catalog/ContentCard';
import { TitleDetailsModal } from '@/components/catalog/TitleDetailsModal';

export default function MyListPage() {
  const { activeProfile } = useProfile();
  const [listItems, setListItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const loadList = async () => {
    if (!activeProfile) return;
    setLoading(true);
    const all = await catalogService.getAllContent();
    const ids = catalogService.getMyListIds(activeProfile.id);
    const saved = all.filter(item => ids.includes(item.id));
    setListItems(saved);
    setLoading(false);
  };

  useEffect(() => {
    loadList();
  }, [activeProfile]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Bookmark className="w-6 h-6 text-cinemix-primary fill-current" />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              My Watchlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Titles saved for {activeProfile?.name || 'this profile'}
          </p>
        </div>

        {listItems.length > 0 && (
          <span className="text-xs font-semibold text-gray-400 bg-surface-100 px-3 py-1.5 rounded-xl border border-white/[0.04]">
            {listItems.length} {listItems.length === 1 ? 'Title' : 'Titles'}
          </span>
        )}
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-surface-100 animate-pulse" />
          ))}
        </div>
      ) : listItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {listItems.map((item) => (
            <div key={item.id} className="flex justify-center">
              <ContentCard
                item={item}
                onOpenDetails={(i) => setSelectedItem(i)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 bg-surface-50/50 rounded-3xl border border-white/[0.04] p-8 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Your list is empty</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Browse movies, anime, and series, and click the &ldquo;+&rdquo; button to keep track of what you want to watch.
          </p>
          <div className="pt-2">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cinemix-primary hover:bg-cinemix-primary-hover text-black font-extrabold text-xs transition-all shadow-glow-primary hover:scale-105 active:scale-95"
            >
              Explore Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <TitleDetailsModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => {
          setSelectedItem(null);
          loadList();
        }}
      />
    </div>
  );
}
