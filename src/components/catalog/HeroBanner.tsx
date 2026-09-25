'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Plus, Check, Info, Sparkles, Volume2, VolumeX, Globe, Film, Star } from 'lucide-react';
import { ContentItem } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { useToast } from '@/components/ui/Toast';

interface HeroBannerProps {
  item: ContentItem;
  onOpenDetails: (item: ContentItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ item, onOpenDetails }) => {
  const { activeProfile } = useProfile();
  const { toast } = useToast();
  const [isInList, setIsInList] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);

  React.useEffect(() => {
    if (activeProfile) {
      const list = catalogService.getMyListIds(activeProfile.id);
      setIsInList(list.includes(item.id));
    }
  }, [activeProfile, item.id]);

  const handleToggleMyList = () => {
    if (!activeProfile) return;
    const added = catalogService.toggleMyList(activeProfile.id, item.id);
    setIsInList(added);
    toast({
      type: added ? 'success' : 'info',
      message: added ? `Added "${item.title}" to My List` : `Removed "${item.title}" from My List`,
      duration: 3000
    });
  };

  return (
    <div className="relative w-full h-[75vh] sm:h-[82vh] lg:h-[88vh] select-none overflow-hidden">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={item.backdropUrl || item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover object-top transition-transform duration-1000 scale-105"
        />
        {/* Cinematic Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Brand & Category Tag */}
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-cinemix-primary text-white shadow-lg shadow-indigo-500/30">
              Cinemix Premiere
            </span>
            {item.isProOnly && (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-black flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" /> Pro Exclusive
              </span>
            )}
            {item.score > 0 && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.score.toFixed(1)}</span>
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/10 backdrop-blur-md text-gray-200 border border-white/10">
              {item.maturityRating}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {Math.round(item.score * 10)}% Match
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
            {item.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-300">
            <span>{item.releaseYear}</span>
            <span>•</span>
            <span className="uppercase">{item.type.replace('_', ' ')}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold text-emerald-400">
              {item.maxQuality}
            </span>
            {item.duration ? (
              <>
                <span>•</span>
                <span>{item.duration} min</span>
              </>
            ) : null}
            <span>•</span>
            <span className="text-gray-400">{item.genres.join(', ')}</span>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-gray-200 line-clamp-3 leading-relaxed drop-shadow max-w-xl">
            {item.longSynopsis || item.synopsis}
          </p>

          {/* Action Buttons (Cineby Style) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/watch/${item.id}`}
              className="py-3 px-6 sm:px-8 rounded-xl bg-white text-black hover:bg-gray-200 font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-xl hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Now
            </Link>

            <button
              onClick={() => onOpenDetails(item)}
              className="py-3 px-5 sm:px-6 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-bold text-sm sm:text-base border border-emerald-500/30 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 shadow-md"
            >
              <Globe className="w-4 h-4" /> Where to Watch
            </button>

            {item.trailerUrl && (
              <Link
                href={`/watch/${item.id}?server=trailer`}
                className="py-3 px-4 sm:px-5 rounded-xl bg-surface-100/80 hover:bg-surface-200 text-white font-semibold text-sm border border-white/10 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <Film className="w-4 h-4 text-cinemix-primary" /> Trailer
              </Link>
            )}

            <button
              onClick={handleToggleMyList}
              title={isInList ? 'Remove from My List' : 'Add to My List'}
              className="p-3 rounded-xl bg-surface-100/80 hover:bg-surface-200/90 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-105"
            >
              {isInList ? <Check className="w-5 h-5 text-green-400" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
