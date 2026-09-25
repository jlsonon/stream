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

const HOME_CATEGORIES = [
  { label: 'All', href: '/browse' },
  { label: 'Action', href: '/browse?genre=Action' },
  { label: 'Sci-Fi', href: '/browse?genre=Sci-Fi' },
  { label: 'Fantasy', href: '/browse?genre=Fantasy' },
  { label: 'Animation', href: '/browse?genre=Animation' },
  { label: 'Drama', href: '/browse?genre=Drama' },
  { label: 'Comedy', href: '/browse?genre=Comedy' },
  { label: 'Thriller', href: '/browse?genre=Thriller' },
  { label: 'Adventure', href: '/browse?genre=Adventure' },
  { label: 'Family', href: '/browse?genre=Family' },
  { label: 'Philippine Cinema', href: '/browse?type=ph_content' },
  { label: 'K-Drama', href: '/browse?genre=Drama' },
  { label: 'Documentaries', href: '/browse?type=documentary' },
];

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
  const comedyItems = filteredContent.filter(i => i.genres.includes('Comedy'));
  const thrillerItems = filteredContent.filter(i => i.genres.includes('Thriller') || i.genres.includes('Crime') || i.genres.includes('Mystery'));
  const fantasyItems = filteredContent.filter(i => i.genres.includes('Fantasy') || i.genres.includes('Adventure'));
  const familyItems = filteredContent.filter(i => i.genres.includes('Family'));
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-background/40 to-background" />
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
    <div className="min-h-screen bg-background text-foreground pb-20 w-full max-w-[100vw] overflow-x-hidden">
      {/* Cineby-Style Auto-Rotating Hero Carousel Banner */}
      {featuredItems.length > 0 ? (
        <HeroBanner
          items={featuredItems}
          item={featuredItem}
          onOpenDetails={(item) => setSelectedItem(item)}
          autoPlayInterval={5000}
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

      {/* Category Quick Jump Bar */}
      <div className="relative -mt-4 sm:-mt-10 mb-2 sm:mb-4 z-30 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 px-0.5 hide-scrollbar touch-pan-x overscroll-x-contain">
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-surface-100/90 hover:bg-surface-200 text-gray-200 hover:text-white border border-white/10 hover:border-cinemix-primary/50 backdrop-blur-md whitespace-nowrap transition-all shadow-md hover:scale-105 active:scale-95"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Rails */}
      <div className="relative z-20 space-y-4 sm:space-y-8 w-full max-w-[100vw] overflow-x-hidden">
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
            items={phItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?type=ph_content"
            progressMap={progressMap}
          />
        )}

        {/* Trending Now Ranked Leaderboard Rail */}
        {trendingItems.length > 0 && (
          <ContentRow
            title="Trending Now Worldwide"
            badge="Top 10"
            items={trendingItems.slice(0, 10)}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?filter=trending"
            progressMap={progressMap}
            isTop10={true}
          />
        )}

        {/* Editorial Spotlight Billboard */}
        {filteredContent.length > 0 && (() => {
          const spotlight = filteredContent.find(i => i.id === 'movie-oppenheimer' || i.id === 'series-breaking-bad') || blockbusterMovies[0] || filteredContent[0];
          if (!spotlight) return null;
          return (
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-surface-100 shadow-cinema group">
                <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden">
                  <img
                    src={spotlight.backdropUrl || spotlight.posterUrl}
                    alt={spotlight.title}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                  />
                  {/* Filmic Vignettes */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent md:w-3/5" />
                  
                  {/* Spotlight Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-2xl space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cinemix-primary text-black flex items-center gap-1 shadow-glow-primary">
                        <Sparkles className="w-3 h-3 fill-current" /> Editorial Spotlight
                      </span>
                      <span className="text-[11px] font-mono text-gray-300 font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
                        {spotlight.maxQuality} • Dolby Atmos
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow">
                      {spotlight.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed max-w-xl">
                      {spotlight.longSynopsis || spotlight.synopsis}
                    </p>

                    <div className="flex items-center gap-2 sm:gap-3 pt-1">
                      <Link
                        href={`/watch/${spotlight.id}`}
                        className="py-2 sm:py-2.5 px-4 sm:px-6 rounded-xl bg-white text-black hover:bg-gray-200 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" /> Stream Feature
                      </Link>

                      <button
                        onClick={() => setSelectedItem(spotlight)}
                        className="py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl bg-surface-200/90 hover:bg-surface-300 text-white font-bold text-xs sm:text-sm border border-white/15 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                      >
                        Details & Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

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

        {/* Thriller & Mystery */}
        {thrillerItems.length > 0 && (
          <ContentRow
            title="Suspense & Crime Thrillers"
            items={thrillerItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?genre=Thriller"
            progressMap={progressMap}
          />
        )}

        {/* Comedy Favorites */}
        {comedyItems.length > 0 && (
          <ContentRow
            title="Comedy & Feel-Good Hits"
            items={comedyItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?genre=Comedy"
            progressMap={progressMap}
          />
        )}

        {/* Fantasy & Adventure */}
        {fantasyItems.length > 0 && (
          <ContentRow
            title="Epic Fantasy & High Adventure"
            items={fantasyItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?genre=Fantasy"
            progressMap={progressMap}
          />
        )}

        {/* Family & Animation */}
        {familyItems.length > 0 && (
          <ContentRow
            title="Family & Animated Wonders"
            items={familyItems}
            onOpenDetails={(item) => setSelectedItem(item)}
            seeAllHref="/browse?genre=Family"
            progressMap={progressMap}
          />
        )}
      </div>

      {/* Executive Cinema Ticket Pro Subscription Callout */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-12 sm:mt-20">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface-100 border border-white/10 p-6 sm:p-12 shadow-cinema flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-cinemix-primary/10 blur-3xl pointer-events-none" />

          <div className="space-y-3.5 max-w-xl text-center md:text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-surface-200 text-cinemix-primary border border-cinemix-primary/30">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> Executive Cinema Membership
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Unlock Pure 4K Ultra HD & 100% Ad-Free Cinema
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Experience the entire global catalog in native uncompressed bitrate, multi-device sync, and 5 family profiles for only <strong className="text-white font-mono">₱399/month</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 flex-shrink-0">
            <Link
              href="/upgrade"
              className="py-3.5 px-8 rounded-2xl bg-cinemix-primary hover:bg-cinemix-primary-hover text-black font-extrabold text-sm sm:text-base shadow-glow-primary transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Join Cinemix Pro</span>
              <ArrowRight className="w-4 h-4" />
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
