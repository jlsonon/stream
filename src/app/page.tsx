'use client';

import React, { useEffect, useState } from 'react';
import { ContentItem } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { HeroBanner } from '@/components/catalog/HeroBanner';
import { ContentRow } from '@/components/catalog/ContentRow';
import { TitleDetailsModal } from '@/components/catalog/TitleDetailsModal';
import { COMPREHENSIVE_CATALOG } from '@/lib/catalog-data';
import { Sparkles, Film, ArrowRight, Play, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { activeProfile, isKidsMode } = useProfile();
  const [allContent, setAllContent] = useState<ContentItem[]>(() => COMPREHENSIVE_CATALOG);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [continueWatchingItems, setContinueWatchingItems] = useState<ContentItem[]>([]);

  const loadData = async () => {
    setLoading(true);
    const items = await catalogService.getAllContent();
    setAllContent(items);

    if (activeProfile) {
      const progressList = catalogService.getAllContinueWatching(activeProfile.id);
      const pMap: Record<string, number> = {};
      const cwList: ContentItem[] = [];

      for (const p of progressList) {
        pMap[p.contentId] = Math.round((p.progressSeconds / p.totalSeconds) * 100);
        const item = items.find(i => i.id === p.contentId);
        if (item && !cwList.some(ci => ci.id === item.id)) {
          cwList.push(item);
        }
      }
      setProgressMap(pMap);
      setContinueWatchingItems(cwList);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [activeProfile]);

  // Filter content for Kids profile if active
  const filteredContent = isKidsMode
    ? allContent.filter(item => {
        const rating = item.maturityRating;
        return rating === 'G' || rating === 'PG';
      })
    : allContent;

  // Rail Categories
  const featuredItem = filteredContent.find(i => i.featured) || filteredContent[0];
  const trendingItems = filteredContent.filter(i => i.trending);
  const phItems = filteredContent.filter(i => i.type === 'ph_content' || i.genres.includes('Philippine Cinema'));
  const animeItems = filteredContent.filter(i => i.type === 'anime' || i.genres.includes('Animation'));
  const actionItems = filteredContent.filter(i => i.genres.includes('Action') || i.genres.includes('Sci-Fi'));
  const docItems = filteredContent.filter(i => i.type === 'documentary');

  // My List
  const myListIds = activeProfile ? catalogService.getMyListIds(activeProfile.id) : [];
  const myListItems = filteredContent.filter(i => myListIds.includes(i.id));

  const handleSeed = async () => {
    await catalogService.seedStarterCatalog();
    await loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-cinemix-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-gray-400">Loading Cinemix Catalog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Featured Hero Banner */}
      {featuredItem ? (
        <HeroBanner
          item={featuredItem}
          onOpenDetails={(item) => setSelectedItem(item)}
        />
      ) : (
        <div className="h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-surface-100 to-background">
          <Film className="w-12 h-12 text-cinemix-primary" />
          <h2 className="text-2xl font-bold text-white">Welcome to Cinemix</h2>
          <p className="text-gray-400 max-w-md text-sm">
            The catalog is currently empty. Click below to load initial legal Creative Commons 4K/1080p HLS streaming titles.
          </p>
          <button
            onClick={handleSeed}
            className="px-6 py-2.5 rounded-xl bg-cinemix-primary text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
          >
            <RefreshCw className="w-4 h-4" /> Seed Starter Catalog
          </button>
        </div>
      )}

      {/* Main Content Rails */}
      <div className="relative -mt-12 sm:-mt-20 z-20 space-y-6 sm:space-y-8">
        {/* Continue Watching (Only if progress exists) */}
        {continueWatchingItems.length > 0 && (
          <ContentRow
            title="Continue Watching"
            badge="Resume"
            items={continueWatchingItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            progressMap={progressMap}
          />
        )}

        {/* Trending Now */}
        {trendingItems.length > 0 && (
          <ContentRow
            title="Trending Now"
            badge="Top 10"
            items={trendingItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?filter=trending"
            progressMap={progressMap}
          />
        )}

        {/* My List */}
        {myListItems.length > 0 && (
          <ContentRow
            title="My Watchlist"
            items={myListItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/my-list"
            progressMap={progressMap}
          />
        )}

        {/* Anime & Animation */}
        {animeItems.length > 0 && (
          <ContentRow
            title="Anime & Animation Originals"
            items={animeItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?type=anime"
            progressMap={progressMap}
          />
        )}

        {/* Philippine Cinema & Exclusives (hidden in strict kids mode if rated R) */}
        {phItems.length > 0 && (
          <ContentRow
            title="Philippine Cinema & Series"
            badge="Pinoy"
            items={phItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?type=ph_content"
            progressMap={progressMap}
          />
        )}

        {/* Action & Sci-Fi */}
        {actionItems.length > 0 && (
          <ContentRow
            title="Action & Sci-Fi Thrillers"
            items={actionItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?genre=Action"
            progressMap={progressMap}
          />
        )}

        {/* Documentaries */}
        {docItems.length > 0 && (
          <ContentRow
            title="Nature & Documentaries in 4K"
            items={docItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?type=documentary"
            progressMap={progressMap}
          />
        )}
      </div>

      {/* Pro Subscription Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface-100 via-surface-200 to-indigo-950/40 border border-white/10 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Cinemix Pro Subscription
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Unlock 4K Ultra HD & Zero Advertisements
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Experience the full cinema library in uncompressed 4K bitrate, Dolby 5.1 surround sound, and unlimited simultaneous screens for only ₱349/month.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/upgrade"
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-2"
            >
              Get Cinemix Pro <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Title Details Modal */}
      <TitleDetailsModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
