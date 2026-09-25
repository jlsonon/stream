'use client';

import React, { useEffect, useState } from 'react';
import { ContentItem } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { HeroBanner } from '@/components/catalog/HeroBanner';
import { ContentRow } from '@/components/catalog/ContentRow';
import { TitleDetailsModal } from '@/components/catalog/TitleDetailsModal';
import { COMPREHENSIVE_CATALOG } from '@/lib/catalog-data';
import { Sparkles, Film, ArrowRight, Play, RefreshCw, Globe, Zap, Tv, Clapperboard } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { activeProfile, isKidsMode } = useProfile();
  const [allContent, setAllContent] = useState<ContentItem[]>(() => COMPREHENSIVE_CATALOG);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [continueWatchingItems, setContinueWatchingItems] = useState<ContentItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

    // Fire non-blocking auto-refresh if catalog hasn't updated in >4 hours
    catalogService.checkAutoRefresh();

    const handleCatalogRefreshed = async () => {
      const items = await catalogService.getAllContent();
      setAllContent(items);
    };

    window.addEventListener('cinemix:catalog-refreshed', handleCatalogRefreshed);
    return () => {
      window.removeEventListener('cinemix:catalog-refreshed', handleCatalogRefreshed);
    };
  }, [activeProfile]);

  // Filter content for Kids profile if active
  const filteredContent = isKidsMode
    ? allContent.filter(item => {
        const rating = item.maturityRating;
        return rating === 'G' || rating === 'PG';
      })
    : allContent;

  // Rail Categories & Cineby-Style Rotating Hero Showcase
  const trendingItems = filteredContent.filter(i => i.trending);
  const featuredItems = React.useMemo(() => {
    const list: ContentItem[] = [];
    const explicitlyFeatured = filteredContent.filter(i => i.featured);
    list.push(...explicitlyFeatured);
    for (const item of trendingItems) {
      if (!list.some(i => i.id === item.id) && (item.backdropUrl || item.posterUrl)) {
        list.push(item);
      }
    }
    for (const item of filteredContent) {
      if (!list.some(i => i.id === item.id) && (item.backdropUrl || item.posterUrl)) {
        list.push(item);
      }
      if (list.length >= 8) break;
    }
    return list.slice(0, 8);
  }, [filteredContent, trendingItems]);
  const featuredItem = featuredItems[0];
  const tvSeriesItems = filteredContent.filter(i => i.type === 'series' && !i.tags.includes('K-Drama'));
  const kdramaItems = filteredContent.filter(i => i.tags.includes('K-Drama'));
  const animeItems = filteredContent.filter(i => i.type === 'anime' || i.genres.includes('Animation'));
  const phItems = filteredContent.filter(i => 
    i.type === 'ph_content' || 
    i.genres.includes('Philippine Cinema') ||
    i.audioTracks?.some(a => a.language === 'fil') ||
    i.tags.some(t => t.toLowerCase().includes('philippine') || t.toLowerCase().includes('pinoy'))
  );
  const blockbusterMovies = filteredContent.filter(i => i.type === 'movie' || (i.type as any) === 'film');
  const actionItems = filteredContent.filter(i => i.genres.includes('Action') || i.genres.includes('Sci-Fi'));
  const docItems = filteredContent.filter(i => i.type === 'documentary');

  // My List
  const myListIds = (mounted && activeProfile) ? catalogService.getMyListIds(activeProfile.id) : [];
  const myListItems = (mounted && activeProfile) ? filteredContent.filter(i => myListIds.includes(i.id)) : [];

  const handleSeed = async () => {
    await catalogService.seedStarterCatalog();
    await loadData();
  };

  // Ultra-Fast Shimmer Skeletons (Zero CLS, Emil-Grade Perceived Speed)
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20">
        {/* Hero Banner Skeleton */}
        <div className="relative h-[65vh] sm:h-[75vh] w-full bg-gradient-to-b from-surface-100 to-background overflow-hidden animate-pulse">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background/40 to-background" />
          <div className="absolute bottom-16 left-6 sm:left-12 space-y-4 max-w-xl">
            <div className="h-6 w-32 bg-white/10 rounded-full" />
            <div className="h-10 sm:h-14 w-3/4 bg-white/10 rounded-2xl" />
            <div className="h-4 w-full bg-white/5 rounded-md" />
            <div className="h-4 w-2/3 bg-white/5 rounded-md" />
            <div className="flex gap-3 pt-2">
              <div className="h-12 w-32 bg-white/15 rounded-xl" />
              <div className="h-12 w-32 bg-white/10 rounded-xl" />
            </div>
          </div>
        </div>
        {/* Rail Skeletons */}
        <div className="relative -mt-8 sm:-mt-12 z-20 space-y-8 px-4 sm:px-8">
          <div className="space-y-3">
            <div className="h-5 w-48 bg-white/10 rounded-md animate-pulse" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex-shrink-0 w-44 sm:w-52 md:w-60 aspect-[2/3] bg-surface-200 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Cineby-Style Auto-Rotating Hero Carousel Banner */}
      {featuredItems.length > 0 ? (
        <HeroBanner
          items={featuredItems}
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
      <div className="relative -mt-10 sm:-mt-16 z-20 space-y-6 sm:space-y-8">
        {/* Continue Watching (Only if client mounted and progress exists) */}
        {mounted && continueWatchingItems.length > 0 && (
          <ContentRow
            title="Continue Watching"
            badge="Resume"
            items={continueWatchingItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            progressMap={progressMap}
          />
        )}

        {/* Highlighted Philippine Cinema Rail */}
        {phItems.length > 0 && (
          <ContentRow
            title="Philippine Cinema & Primetime Series"
            badge="Pinoy Exclusives"
            items={phItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?type=ph_content"
            progressMap={progressMap}
          />
        )}

        {/* Trending Now */}
        {trendingItems.length > 0 && (
          <ContentRow
            title="Trending Now Worldwide"
            badge="Top 10"
            items={trendingItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?filter=trending"
            progressMap={progressMap}
          />
        )}

        {/* My List (Only if client mounted and items exist) */}
        {mounted && myListItems.length > 0 && (
          <ContentRow
            title="My Watchlist"
            items={myListItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/my-list"
            progressMap={progressMap}
          />
        )}

        {/* Binge-Worthy Global TV Series */}
        {tvSeriesItems.length > 0 && (
          <ContentRow
            title="Binge-Worthy Global TV Series"
            badge="Series"
            items={tvSeriesItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?type=series"
            progressMap={progressMap}
          />
        )}

        {/* Anime & Animation */}
        {animeItems.length > 0 && (
          <ContentRow
            title="Anime Superstars & Animation"
            badge="Anime"
            items={animeItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?type=anime"
            progressMap={progressMap}
          />
        )}

        {/* Korean Dramas */}
        {kdramaItems.length > 0 && (
          <ContentRow
            title="Top Korean Dramas & Asian Hits"
            badge="K-Drama"
            items={kdramaItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?genre=Drama"
            progressMap={progressMap}
          />
        )}

        {/* Hollywood Blockbuster Masterpieces */}
        {blockbusterMovies.length > 0 && (
          <ContentRow
            title="Hollywood Blockbuster Masterpieces"
            badge="Blockbusters"
            items={blockbusterMovies}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?type=movie"
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
              Experience the full cinema library in uncompressed 4K bitrate, Dolby 5.1 surround sound, and unlimited simultaneous screens for only ₱399/month.
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
