'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Plus, 
  Check, 
  Info, 
  Sparkles, 
  Star, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { ContentItem } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { useToast } from '@/components/ui/Toast';

interface HeroBannerProps {
  items?: ContentItem[];
  item?: ContentItem;
  onOpenDetails: (item: ContentItem) => void;
  autoPlayInterval?: number; // default 6500ms
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  items, 
  item, 
  onOpenDetails,
  autoPlayInterval = 6500 
}) => {
  const { activeProfile } = useProfile();
  const { toast } = useToast();

  // Normalize items array
  const slideItems = React.useMemo(() => {
    if (items && items.length > 0) return items;
    if (item) return [item];
    return [];
  }, [items, item]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInList, setIsInList] = useState(false);

  // Active item
  const currentItem = slideItems[currentIndex] || slideItems[0];

  // Auto-play timer with smooth 100ms tick for progress bar
  useEffect(() => {
    if (slideItems.length <= 1 || isPaused) return;

    const tickInterval = 100;
    const step = (tickInterval / autoPlayInterval) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % slideItems.length);
          return 0;
        }
        return prev + step;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, slideItems.length, autoPlayInterval]);

  // Reset progress when index changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (slideItems.length <= 1) return;
    setCurrentIndex((idx) => (idx + 1) % slideItems.length);
    setProgress(0);
  }, [slideItems.length]);

  const handlePrev = useCallback(() => {
    if (slideItems.length <= 1) return;
    setCurrentIndex((idx) => (idx - 1 + slideItems.length) % slideItems.length);
    setProgress(0);
  }, [slideItems.length]);

  const handleSelectIndex = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  // Watchlist status
  useEffect(() => {
    if (activeProfile && currentItem) {
      const list = catalogService.getMyListIds(activeProfile.id);
      setIsInList(list.includes(currentItem.id));
    }
  }, [activeProfile, currentItem?.id]);

  const handleToggleMyList = () => {
    if (!activeProfile || !currentItem) return;
    const added = catalogService.toggleMyList(activeProfile.id, currentItem.id);
    setIsInList(added);
    toast({
      type: added ? 'success' : 'info',
      message: added ? `Added "${currentItem.title}" to My List` : `Removed "${currentItem.title}" from My List`,
      duration: 3000
    });
  };

  if (!currentItem) return null;

  return (
    <div 
      className="group relative w-full h-[75vh] sm:h-[82vh] lg:h-[88vh] select-none overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Background Backdrops with Crossfade */}
      {slideItems.map((sItem, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={sItem.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            <img
              src={sItem.backdropUrl || sItem.posterUrl}
              alt={sItem.title}
              className={`w-full h-full object-cover object-top transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        );
      })}

      {/* Cinematic Gradient Scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent w-full md:w-3/4 z-[1]" />

      {/* Slide Navigation Arrows (Desktop & Tablet) */}
      {slideItems.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Featured Title"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl hidden sm:flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Featured Title"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl hidden sm:flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Brand & Category Tag */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold tracking-wider uppercase bg-cinemix-primary text-black shadow-glow-primary">
              Cinemix Premiere
            </span>
            {currentItem.isProOnly && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase bg-surface-200 text-cinemix-primary border border-cinemix-primary/30 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-current" /> Pro Exclusive
              </span>
            )}
            {currentItem.score > 0 && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-black bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{currentItem.score.toFixed(1)}</span>
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-white/10 backdrop-blur-md text-gray-200 border border-white/10 uppercase">
              {currentItem.maturityRating}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {Math.round(currentItem.score * 10)}% Match
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-tight transition-all duration-300">
            {currentItem.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-300">
            <span>{currentItem.releaseYear}</span>
            <span>•</span>
            <span className="uppercase">{currentItem.type.replace('_', ' ')}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold text-emerald-400">
              {currentItem.maxQuality}
            </span>
            {currentItem.duration ? (
              <>
                <span>•</span>
                <span>{currentItem.duration} min</span>
              </>
            ) : null}
            <span>•</span>
            <span className="text-gray-400">{currentItem.genres.join(', ')}</span>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-gray-200 line-clamp-3 leading-relaxed drop-shadow max-w-xl transition-all duration-300">
            {currentItem.longSynopsis || currentItem.synopsis}
          </p>

          {/* Action Buttons (Cineby Style) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/watch/${currentItem.id}`}
              className="py-3 px-6 sm:px-8 rounded-xl bg-white text-black hover:bg-gray-200 font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Now
            </Link>

            <button
              onClick={() => onOpenDetails(currentItem)}
              className="py-3 px-5 sm:px-6 rounded-xl bg-surface-100/80 hover:bg-surface-200 text-white font-bold text-sm sm:text-base border border-white/10 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <Info className="w-4 h-4 text-cinemix-primary" /> Details & Episodes
            </button>

            <button
              onClick={handleToggleMyList}
              title={isInList ? 'Remove from My List' : 'Add to My List'}
              className="p-3 rounded-xl bg-surface-100/80 hover:bg-surface-200/90 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              {isInList ? <Check className="w-5 h-5 text-green-400" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
