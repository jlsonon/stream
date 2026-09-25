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
      className="group relative flex-shrink-0 w-40 sm:w-48 md:w-56 cursor-pointer select-none transition-all duration-300 hover:-translate-y-1.5"
      onClick={() => onOpenDetails?.(item)}
      onMouseEnter={handleMouseEnter}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-surface-200 border border-white/[0.07] group-hover:border-white/20 group-hover:shadow-cinema transition-all duration-300">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-surface-200 animate-pulse flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-cinemix-primary animate-spin" />
          </div>
        )}
        <img
          src={item.posterUrl}
          alt={item.title}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          loading="lazy"
        />

        {/* Minimalist Top Indicator: Single Micro Badge If Pro Only */}
        {item.isProOnly && (
          <div className="absolute top-2.5 right-2.5 pointer-events-none z-10">
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase bg-cinemix-primary text-black shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-current" /> PRO
            </span>
          </div>
        )}

        {/* Watch Progress Bar */}
        {progressPercent !== undefined && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 z-10">
            <div 
              className="h-full bg-cinemix-primary transition-all duration-300 shadow-glow-primary"
              style={{ width: `${Math.min(100, Math.max(3, progressPercent))}%` }}
            />
          </div>
        )}

        {/* Filmic Quick-Action Hover Overlay (No Redundant Text Clutter) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3.5 z-20">
          <div className="flex items-center justify-between pointer-events-auto">
            {isPinoy && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/20">
                Philippine Cinema
              </span>
            )}
            <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/75 backdrop-blur-md text-gray-300 border border-white/10 uppercase">
              {item.maturityRating}
            </span>
          </div>

          {/* Center Play Button Trigger */}
          <div className="flex items-center justify-center">
            <Link
              href={`/watch/${item.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center shadow-cinema scale-90 group-hover:scale-100 transition-all duration-200 hover:scale-105 active:scale-95"
              title="Quick Play"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </Link>
          </div>

          {/* Bottom Quick Action Utilities */}
          <div className="flex items-center justify-between pointer-events-auto pt-2">
            <button
              onClick={handleToggleMyList}
              title={isInList ? 'Remove from My List' : 'Add to My List'}
              className="p-2 rounded-xl bg-surface-100/90 hover:bg-surface-200 border border-white/15 text-white transition-all hover:scale-105"
            >
              {isInList ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails?.(item);
              }}
              title="Overview & Episodes"
              className="p-2 rounded-xl bg-surface-100/90 hover:bg-surface-200 border border-white/15 text-white transition-all hover:scale-105"
            >
              <Info className="w-3.5 h-3.5 text-cinemix-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabular Precision Specs Below Poster */}
      <div className="pt-2.5 px-0.5 space-y-1">
        <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 tracking-tight group-hover:text-cinemix-primary transition-colors">
          {item.title}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
          <span>{item.releaseYear}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-300 font-bold uppercase tracking-wider text-[10px]">
            {item.maxQuality === '2160p' ? '4K' : 'HD'}
          </span>
          {item.score > 0 && (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-current inline" />
                {item.score.toFixed(1)}
              </span>
            </>
          )}
          <span className="text-gray-600">•</span>
          <span className="text-gray-400 truncate max-w-[70px] font-sans font-medium capitalize">
            {item.type === 'ph_content' ? 'Pinoy' : item.type}
          </span>
        </div>
      </div>
    </div>
  );
};
