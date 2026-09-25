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
  autoPlayInterval?: number; // default 5000ms (5 seconds)
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  items, 
  item, 
  onOpenDetails,
  autoPlayInterval = 5000 
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
      className="group relative w-full h-[56vh] sm:h-[75vh] lg:h-[85vh] select-none overflow-hidden bg-background"
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
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-16 lg:pb-20 z-10">
        <div className="max-w-2xl space-y-2.5 sm:space-y-4">
          {/* Brand & Category Tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-black tracking-wider uppercase bg-cinemix-primary text-black shadow-glow-primary">
              Cinemix Premiere
            </span>
            {currentItem.isProOnly && (
              <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-surface-200 text-cinemix-primary border border-cinemix-primary/30 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" /> Pro
              </span>
            )}
            {currentItem.score > 0 && (
              <span className="px-2 py-0.5 rounded text-[11px] sm:text-xs font-mono font-bold bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{currentItem.score.toFixed(1)}</span>
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-bold bg-white/10 backdrop-blur-md text-gray-200 border border-white/10 uppercase">
              {currentItem.maturityRating}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-emerald-400">
              {Math.round(currentItem.score * 10)}% Match
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-tight line-clamp-2 transition-all duration-300">
            {currentItem.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 font-mono">
            <span>{currentItem.releaseYear}</span>
            <span>•</span>
            <span className="uppercase">{currentItem.type === 'ph_content' ? 'Pinoy' : currentItem.type.replace('_', ' ')}</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold text-emerald-400 text-[10px]">
              {currentItem.maxQuality}
            </span>
            {currentItem.duration ? (
              <>
                <span>•</span>
                <span>{currentItem.duration}m</span>
              </>
            ) : null}
            <span>•</span>
            <span className="text-gray-400 truncate max-w-[130px] sm:max-w-none font-sans font-medium">
              {currentItem.genres.slice(0, 2).join(', ')}
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow max-w-xl transition-all duration-300">
            {currentItem.longSynopsis || currentItem.synopsis}
          </p>

          {/* Action Buttons (Cineby Side-by-Side Mobile Layout) */}
          <div className="flex items-center gap-2 sm:gap-3 pt-1 sm:pt-2 w-full sm:w-auto">
            <Link
              href={`/watch/${currentItem.id}`}
              className="flex-1 sm:flex-none justify-center py-2.5 sm:py-3 px-4 sm:px-8 rounded-xl bg-white text-black hover:bg-gray-200 font-extrabold text-xs sm:text-sm md:text-base flex items-center gap-2 transition-all shadow-xl active:scale-95"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>Watch Now</span>
            </Link>

            <button
              onClick={() => onOpenDetails(currentItem)}
              className="flex-1 sm:flex-none justify-center py-2.5 sm:py-3 px-3.5 sm:px-6 rounded-xl bg-surface-100/90 hover:bg-surface-200 text-white font-bold text-xs sm:text-sm md:text-base border border-white/10 backdrop-blur-md flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 shadow-md"
            >
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cinemix-primary" />
              <span>Details</span>
            </button>

            <button
              onClick={handleToggleMyList}
              title={isInList ? 'Remove from My List' : 'Add to My List'}
              className="p-2.5 sm:p-3 rounded-xl bg-surface-100/90 hover:bg-surface-200 text-white border border-white/10 backdrop-blur-md transition-all active:scale-95 flex-shrink-0"
            >
              {isInList ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

          {/* Cineby-Style Slide Indicators / Progress Dots */}
          {slideItems.length > 1 && (
            <div className="flex items-center gap-1.5 pt-1">
              {slideItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'w-6 bg-cinemix-primary shadow-glow-primary' 
                      : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
