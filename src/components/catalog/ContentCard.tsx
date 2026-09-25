'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Plus, Check, Info, ShieldAlert, Sparkles, Star } from 'lucide-react';
import { ContentItem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { useToast } from '@/components/ui/Toast';

interface ContentCardProps {
  item: ContentItem;
  onOpenDetails?: (item: ContentItem) => void;
  progressPercent?: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
  item, 
  onOpenDetails,
  progressPercent 
}) => {
  const router = useRouter();
  const { activeProfile } = useProfile();
  const { toast } = useToast();
  const [isInList, setIsInList] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  React.useEffect(() => {
    if (activeProfile) {
      const list = catalogService.getMyListIds(activeProfile.id);
      setIsInList(list.includes(item.id));
    }
  }, [activeProfile, item.id]);

  const handleToggleMyList = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!activeProfile) return;
    const added = catalogService.toggleMyList(activeProfile.id, item.id);
    setIsInList(added);
    toast({
      type: added ? 'success' : 'info',
      message: added ? `Added "${item.title}" to My List` : `Removed "${item.title}" from My List`,
      duration: 3000
    });
  };

  // Pre-warm route cache on hover for instant playback transition
  const handleMouseEnter = () => {
    router.prefetch(`/watch/${item.id}`);
  };

  const isPinoy = item.type === 'ph_content' || 
    item.genres.includes('Philippine Cinema') || 
    item.audioTracks?.some(a => a.language === 'fil') ||
    item.tags?.some(t => t.toLowerCase().includes('philippine') || t.toLowerCase().includes('pinoy'));

  return (
    <div 
      className="group relative flex-shrink-0 w-44 sm:w-52 md:w-60 cursor-pointer select-none rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-2xl hover:shadow-indigo-500/20"
      onClick={() => onOpenDetails?.(item)}
      onMouseEnter={handleMouseEnter}
    >
      {/* Poster Image Container with Smooth Shimmer Skeleton */}
      <div className="relative aspect-[2/3] w-full bg-surface-200 overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-surface-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-cinemix-primary animate-spin" />
          </div>
        )}
        <img
          src={item.posterUrl}
          alt={item.title}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          loading="lazy"
        />

        {/* Top Badges (Cineby Style) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1">
            {item.isProOnly ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> PRO
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                {item.maxQuality === '2160p' ? '4K' : 'HD'}
              </span>
            )}
            {isPinoy && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                Pinoy
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {item.score > 0 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{item.score.toFixed(1)}</span>
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
              {item.maturityRating}
            </span>
          </div>
        </div>

        {/* Watch Progress Bar */}
        {progressPercent !== undefined && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60 z-10">
            <div 
              className="h-full bg-cinemix-primary transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(3, progressPercent))}%` }}
            />
          </div>
        )}

        {/* Hover / Touch Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end z-20">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">
              {item.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="text-green-400 font-semibold">{Math.round(item.score * 10)}% Match</span>
              <span>{item.releaseYear}</span>
              {item.duration ? <span>{item.duration}m</span> : null}
            </div>

            <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
              {item.synopsis}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/watch/${item.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 py-1.5 px-3 rounded-lg bg-white text-black hover:bg-gray-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Play
              </Link>

              <button
                onClick={handleToggleMyList}
                title={isInList ? 'Remove from My List' : 'Add to My List'}
                className="p-2 rounded-lg bg-surface-100/80 hover:bg-surface-200 border border-white/10 text-white transition-colors"
              >
                {isInList ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Plus className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails?.(item);
                }}
                title="More Information & Where to Watch"
                className="p-2 rounded-lg bg-surface-100/80 hover:bg-surface-200 border border-white/10 text-white transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cineby-Style Persistent Card Footer */}
      <div className="pt-2 px-1 pb-1">
        <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-cinemix-primary transition-colors">
          {item.title}
        </h4>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
          <span>{item.releaseYear}</span>
          <span>•</span>
          <span className="capitalize">{item.type.replace('_', ' ')}</span>
          {item.genres?.[0] && (
            <>
              <span>•</span>
              <span className="text-gray-400 truncate max-w-[85px]">{item.genres[0]}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
