'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  Play, 
  Plus, 
  Check, 
  Sparkles, 
  Volume2, 
  Globe, 
  Film, 
  Tv, 
  Calendar, 
  Clock, 
  Star 
} from 'lucide-react';
import { ContentItem, Episode } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { useToast } from '@/components/ui/Toast';

interface TitleDetailsModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TitleDetailsModal: React.FC<TitleDetailsModalProps> = ({
  item,
  isOpen,
  onClose
}) => {
  const { activeProfile } = useProfile();
  const { toast } = useToast();
  const [isInList, setIsInList] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes'>('overview');

  React.useEffect(() => {
    if (item && activeProfile) {
      const list = catalogService.getMyListIds(activeProfile.id);
      setIsInList(list.includes(item.id));
      if (item.seasons && item.seasons.length > 0) {
        setActiveTab('episodes');
      } else {
        setActiveTab('overview');
      }
    }
  }, [item, activeProfile]);

  if (!isOpen || !item) return null;

  const handleToggleMyList = () => {
    if (!activeProfile || !item) return;
    const added = catalogService.toggleMyList(activeProfile.id, item.id);
    setIsInList(added);
    toast({
      type: added ? 'success' : 'info',
      message: added ? `Added "${item.title}" to My List` : `Removed "${item.title}" from My List`,
      duration: 3000
    });
  };

  const currentSeason = item.seasons?.find(s => s.seasonNumber === selectedSeason) || item.seasons?.[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-surface-100 border border-white/10 rounded-none sm:rounded-2xl overflow-hidden shadow-2xl shadow-black my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header / Backdrop Hero */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-surface-300">
          <img
            src={item.backdropUrl || item.posterUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-100 via-surface-100/40 to-transparent" />

          {/* Floating Actions on Backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {item.isProOnly && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-black flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" /> Cinemix Pro
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/10">
                  {item.maturityRating}
                </span>
                <span className="text-xs font-semibold text-green-400">
                  {Math.round(item.score * 10)}% Match
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md">
                {item.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/watch/${item.id}`}
                className="py-2.5 px-6 rounded-xl bg-white text-black hover:bg-gray-200 font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-lg hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" /> Play
              </Link>
              <button
                onClick={handleToggleMyList}
                className="p-3 rounded-xl bg-surface-200/80 hover:bg-surface-300 text-white border border-white/10 backdrop-blur-md transition-colors"
                title={isInList ? 'Remove from My List' : 'Add to My List'}
              >
                {isInList ? <Check className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Tabs if Series/Anime */}
        {item.seasons && item.seasons.length > 0 && (
          <div className="flex items-center gap-4 px-6 border-b border-white/[0.06] bg-surface-50/50">
            <button
              onClick={() => setActiveTab('episodes')}
              className={`py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === 'episodes'
                  ? 'border-cinemix-primary text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Episodes ({item.seasons.reduce((acc, s) => acc + s.episodes.length, 0)})
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-cinemix-primary text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Overview & Details
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'episodes' && item.seasons && item.seasons.length > 0 ? (
            <div className="space-y-4">
              {/* Season Selector */}
              {item.seasons.length > 1 && (
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-surface-200 border border-white/10 text-white px-3 py-1.5 rounded-lg text-sm font-medium focus-ring"
                  >
                    {item.seasons.map((s) => (
                      <option key={s.seasonNumber} value={s.seasonNumber}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-400">
                    {currentSeason?.episodes.length} Episodes
                  </span>
                </div>
              )}

              {/* Episodes List */}
              <div className="space-y-3">
                {currentSeason?.episodes.map((ep) => (
                  <Link
                    key={ep.id}
                    href={`/watch/${item.id}?episode=${ep.id}`}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl bg-surface-50 hover:bg-surface-200 border border-white/[0.04] transition-all"
                  >
                    <div className="relative aspect-video w-full sm:w-36 flex-shrink-0 rounded-lg overflow-hidden bg-surface-300">
                      <img
                        src={ep.thumbnailUrl || item.backdropUrl}
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                        <div className="p-2 rounded-full bg-white/90 text-black shadow-md group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-white text-sm group-hover:text-cinemix-primary transition-colors line-clamp-1">
                          {ep.episodeNumber}. {ep.title}
                        </h4>
                        <span className="text-xs text-gray-400 flex-shrink-0">{ep.duration}m</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {ep.synopsis}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column: Synopses */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-300">
                  <span className="font-bold text-white">{item.releaseYear}</span>
                  <span>•</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/10">{item.maxQuality}</span>
                  {item.duration && (
                    <>
                      <span>•</span>
                      <span>{item.duration} minutes</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-cinemix-primary font-semibold uppercase">{item.type.replace('_', ' ')}</span>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {item.longSynopsis || item.synopsis}
                </p>

                {/* Genres */}
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Genres</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.genres.map((g) => (
                      <span key={g} className="px-2.5 py-1 rounded-md bg-surface-200 text-xs text-gray-300 border border-white/[0.04]">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Audio & Subtitles */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Audio & Subtitles</h4>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-300">
                    <div>
                      <span className="text-gray-400">Audio:</span>{' '}
                      {item.audioTracks?.map(a => a.label).join(', ') || 'Original Sound'}
                    </div>
                    <div>
                      <span className="text-gray-400">Subtitles:</span>{' '}
                      {item.subtitles?.map(s => s.label).join(', ') || 'None available'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Cast & Crew */}
              <div className="space-y-4 p-4 rounded-xl bg-surface-50 border border-white/[0.04] text-xs space-y-3">
                {item.cast && item.cast.length > 0 && (
                  <div>
                    <span className="text-gray-400 block mb-1">Starring:</span>
                    <p className="text-gray-200 font-medium">
                      {item.cast.map(c => `${c.name} (${c.role})`).join(', ')}
                    </p>
                  </div>
                )}

                {item.directors && item.directors.length > 0 && (
                  <div>
                    <span className="text-gray-400 block mb-1">Director:</span>
                    <p className="text-gray-200 font-medium">{item.directors.join(', ')}</p>
                  </div>
                )}

                {item.studio && (
                  <div>
                    <span className="text-gray-400 block mb-1">Studio / Production:</span>
                    <p className="text-gray-200 font-medium">{item.studio}</p>
                  </div>
                )}

                <div>
                  <span className="text-gray-400 block mb-1">Maturity Rating:</span>
                  <p className="text-gray-200 font-medium">
                    Rated {item.maturityRating} for thematic elements.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
