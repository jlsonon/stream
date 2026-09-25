'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Play, 
  Plus, 
  Check, 
  Sparkles, 
  Film, 
  Tv, 
  Clock, 
  Loader2,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { ContentItem, Episode, Season } from '@/types';
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
  const [modalItem, setModalItem] = useState<ContentItem | null>(item);
  const [isFetchingSeason, setIsFetchingSeason] = useState(false);

  // Sync state when item or profile changes
  useEffect(() => {
    setModalItem(item);
    if (item && activeProfile) {
      const list = catalogService.getMyListIds(activeProfile.id);
      setIsInList(list.includes(item.id));
      setSelectedSeason(item.seasons?.[0]?.seasonNumber || 1);
    }
  }, [item, activeProfile]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Background season list expansion from TMDB if series
  useEffect(() => {
    if (!item?.tmdbId) return;
    const isSeries = item.type === 'series' || item.type === 'anime' || (item.seasons && item.seasons.length <= 1);
    if (!isSeries) return;

    let cancelled = false;
    async function hydrateSeasons() {
      try {
        const res = await fetch(`/api/tmdb/details?id=${item!.tmdbId}&type=tv`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          if (data.item?.seasons && data.item.seasons.length > 0) {
            setModalItem(prev => {
              if (!prev) return null;
              if (data.item.seasons.length >= (prev.seasons?.length || 0)) {
                return { ...prev, seasons: data.item.seasons };
              }
              return prev;
            });
          }
        }
      } catch (err) {
        // Non-blocking background sync
      }
    }
    hydrateSeasons();
    return () => { cancelled = true; };
  }, [item?.id, item?.tmdbId, item?.type]);

  // Fetch episodes for selected season if not yet populated with real titles
  useEffect(() => {
    if (!modalItem?.tmdbId) return;
    const targetSeasonObj = modalItem.seasons?.find(s => s.seasonNumber === selectedSeason);
    const hasRealEpisodes = targetSeasonObj?.episodes && targetSeasonObj.episodes.length > 0 && targetSeasonObj.episodes[0].title !== 'Episode 1';

    if (!hasRealEpisodes) {
      setIsFetchingSeason(true);
      fetch(`/api/tmdb/season?id=${modalItem.tmdbId}&season=${selectedSeason}`)
        .then(res => res.json())
        .then(data => {
          if (data.episodes && data.episodes.length > 0) {
            setModalItem(prev => {
              if (!prev) return prev;
              const currentSeasons = prev.seasons ? [...prev.seasons] : [];
              const idx = currentSeasons.findIndex(s => s.seasonNumber === selectedSeason);
              if (idx !== -1) {
                currentSeasons[idx] = { ...currentSeasons[idx], episodes: data.episodes };
              } else {
                currentSeasons.push({
                  seasonNumber: selectedSeason,
                  title: data.name || `Season ${selectedSeason}`,
                  episodes: data.episodes
                });
              }
              return { ...prev, seasons: currentSeasons };
            });
          }
        })
        .catch(err => console.warn('Failed to load season episodes:', err))
        .finally(() => setIsFetchingSeason(false));
    }
  }, [selectedSeason, modalItem?.tmdbId]);

  const activeItem = modalItem || item;
  const isSeries = activeItem ? (activeItem.type === 'series' || activeItem.type === 'anime' || (activeItem.seasons && activeItem.seasons.length > 0)) : false;
  const currentSeason = activeItem?.seasons?.find(s => s.seasonNumber === selectedSeason) || activeItem?.seasons?.[0];

  // Resolve current episode from profile watch progress
  const watchProgress = item && activeProfile ? catalogService.getWatchProgress(activeProfile.id, item.id) : null;
  const currentEpNumber = watchProgress?.episodeId 
    ? (currentSeason?.episodes?.find(e => e.id === watchProgress.episodeId)?.episodeNumber || 1)
    : 1;

  // Always auto-scroll to the current episode in the right-column episodes list
  useEffect(() => {
    if (isOpen && isSeries) {
      const timer = setTimeout(() => {
        const activeEpEl = document.getElementById(`modal-ep-${selectedSeason}-${currentEpNumber}`);
        if (activeEpEl) {
          activeEpEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSeries, selectedSeason, currentEpNumber, isFetchingSeason]);

  if (!isOpen || !item || !activeItem) return null;

  const firstEpisode = currentSeason?.episodes?.[0];

  const primaryPlayUrl = isSeries && firstEpisode
    ? `/watch/${activeItem.id}?season=${firstEpisode.seasonNumber}&episode=${firstEpisode.episodeNumber}`
    : `/watch/${activeItem.id}`;

  const handleToggleMyList = () => {
    if (!activeProfile || !activeItem) return;
    const added = catalogService.toggleMyList(activeProfile.id, activeItem.id);
    setIsInList(added);
    toast({
      type: added ? 'success' : 'info',
      message: added ? `Added "${activeItem.title}" to My List` : `Removed "${activeItem.title}" from My List`,
      duration: 3000
    });
  };

  const totalEpisodesCount = activeItem.seasons
    ? activeItem.seasons.reduce((acc, s) => acc + (s.episodes?.length || 0), 0)
    : 0;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col overflow-hidden animate-fade-in"
      onClick={onClose}
    >
      {/* Top Seamless Full-Screen Navigation Bar */}
      <div 
        className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-white/[0.08] bg-surface-50/95 backdrop-blur-xl flex-shrink-0 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-white font-bold text-xs sm:text-sm transition-all border border-white/10 hover:border-cinemix-primary/50"
            title="Back to Catalog (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cinemix-primary px-2.5 py-0.5 rounded-full bg-cinemix-primary/10 border border-cinemix-primary/25 flex items-center gap-1.5 flex-shrink-0">
              {isSeries ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
              {isSeries ? 'Series & Episodes' : 'Feature Presentation'}
            </span>
            <span className="text-xs text-gray-500 font-mono hidden sm:inline">
              Cinema Hub
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-gray-400 hover:text-white transition-colors border border-white/10 flex-shrink-0"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Responsive Two-Column Layout (Full Screen Height, No Left Scrollbar) */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-12 flex-1 h-[calc(100vh-65px)] w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Title, Thumbnail, Actions, Details (No Scrollbar) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-4 p-5 sm:p-8 flex flex-col justify-start space-y-4 sm:space-y-5 border-b lg:border-b-0 lg:border-r border-white/[0.08] overflow-y-auto lg:overflow-hidden hide-scrollbar bg-surface-100/40">
          
          {/* 1. Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {activeItem.title}
            </h1>
            {activeItem.originalTitle && activeItem.originalTitle !== activeItem.title && (
              <p className="text-xs text-gray-400 mt-0.5 italic">
                Original: {activeItem.originalTitle}
              </p>
            )}
          </div>

          {/* 2. Thumbnail with Badges and Hover Play Button */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-surface-300 border border-white/10 shadow-xl group flex-shrink-0">
            <img
              src={activeItem.backdropUrl || activeItem.posterUrl}
              alt={activeItem.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            
            {/* Badges on Thumbnail */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
              {activeItem.isProOnly && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-black flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" /> Cinemix Pro
                </span>
              )}
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/10 uppercase">
                {activeItem.maturityRating}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {activeItem.maxQuality || '1080p FHD'}
              </span>
            </div>

            {/* Hover Center Play Button */}
            <Link
              href={primaryPlayUrl}
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              title="Watch Now"
            >
              <div className="p-3.5 rounded-full bg-white text-black shadow-2xl scale-95 group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </Link>
          </div>

          {/* 3. Primary Action Buttons (No Trailer Button) */}
          <div className="flex items-center gap-3">
            <Link
              href={primaryPlayUrl}
              className="flex-1 py-3 px-6 rounded-xl bg-white text-black hover:bg-gray-200 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-102"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isSeries ? 'Watch Series' : 'Watch Movie'}</span>
            </Link>

            <button
              onClick={handleToggleMyList}
              title={isInList ? 'Remove from My List' : 'Add to My List'}
              className="p-3 rounded-xl bg-surface-200/90 hover:bg-surface-200 text-white border border-white/10 transition-colors"
            >
              {isInList ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          {/* 4. Details of the Series / Movie (No Audio / Subtitles, No Scrollbar) */}
          <div className="space-y-3 text-xs text-gray-300">
            {/* Meta Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-emerald-400">{Math.round(activeItem.score * 10)}% Match</span>
              <span>•</span>
              <span className="font-bold text-white">{activeItem.releaseYear}</span>
              <span>•</span>
              <span className="text-gray-300">
                {isSeries 
                  ? `${activeItem.seasons?.length || 1} Season${(activeItem.seasons?.length || 1) > 1 ? 's' : ''}`
                  : `${activeItem.duration || 115}m`
                }
              </span>
              {totalEpisodesCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-cinemix-primary font-semibold">{totalEpisodesCount} Episodes</span>
                </>
              )}
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal line-clamp-4">
              {activeItem.longSynopsis || activeItem.synopsis}
            </p>

            {/* Genre Pills */}
            {activeItem.genres && activeItem.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeItem.genres.map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-lg bg-surface-200 text-[11px] font-medium text-gray-200 border border-white/5">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Cast and Creators */}
            <div className="space-y-3 pt-3 border-t border-white/[0.08]">
              {activeItem.cast && activeItem.cast.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Starring Cast</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.cast.slice(0, 5).map(c => (
                      <span key={c.name} className="px-2.5 py-1 rounded-lg bg-surface-200 text-xs border border-white/5 text-gray-300">
                        <strong className="text-white font-medium">{c.name}</strong>
                        {c.role && <span className="text-gray-400 font-normal"> · {c.role}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeItem.directors && activeItem.directors.length > 0 && (
                <div className="text-xs">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Directed By</span>
                  <span className="text-white font-medium">{activeItem.directors.join(', ')}</span>
                </div>
              )}

              {activeItem.studio && (
                <div className="text-xs">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Production Studio</span>
                  <span className="text-gray-300">{activeItem.studio}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Season Selector at Top + Episode List Below */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col p-5 sm:p-8 bg-black/40 h-full overflow-hidden">
          
          {isSeries ? (
            <>
              {/* TOP OF RIGHT COLUMN: Interactive Season Selector Header */}
              <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.08] flex-shrink-0">
                <div className="flex items-center gap-3">
                  {/* Season Dropdown Selector */}
                  <div className="relative">
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(Number(e.target.value))}
                      className="bg-surface-200/90 hover:bg-surface-200 border border-white/15 text-white font-extrabold text-sm sm:text-base py-2.5 pl-4 pr-10 rounded-2xl appearance-none cursor-pointer focus:outline-none focus:border-cinemix-primary transition-all shadow-lg"
                    >
                      {activeItem.seasons?.map((s) => (
                        <option key={s.seasonNumber} value={s.seasonNumber} className="bg-surface-100 text-white font-bold">
                          {s.title || `Season ${s.seasonNumber}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Right Meta Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-cinemix-primary/15 text-cinemix-primary border border-cinemix-primary/30">
                    {currentSeason?.episodes?.length || 0} Episodes
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Full HD / 4K
                  </span>
                </div>
              </div>

              {/* Episodes List Scrollable Body */}
              <div className="flex-1 overflow-y-auto pr-1 sm:pr-3 space-y-3.5 custom-scrollbar">
                {isFetchingSeason ? (
                  /* Skeletons while loading TMDB Season Episodes */
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-4 p-3.5 rounded-2xl bg-surface-100 border border-white/[0.04] animate-pulse">
                        <div className="aspect-video w-full sm:w-44 rounded-xl bg-white/5 flex-shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-white/10 rounded w-1/3" />
                          <div className="h-3 bg-white/5 rounded w-4/5" />
                          <div className="h-3 bg-white/5 rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : currentSeason?.episodes && currentSeason.episodes.length > 0 ? (
                  currentSeason.episodes.map((ep) => {
                    const isCurrent = ep.episodeNumber === currentEpNumber;
                    return (
                      <Link
                        key={ep.id || `${ep.seasonNumber}-${ep.episodeNumber}`}
                        id={`modal-ep-${ep.seasonNumber}-${ep.episodeNumber}`}
                        href={`/watch/${activeItem.id}?season=${ep.seasonNumber}&episode=${ep.episodeNumber}`}
                        className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 p-3 sm:p-3.5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-xl ${
                          isCurrent
                            ? 'bg-surface-200/90 border-2 border-cinemix-primary shadow-cinemix-primary/10'
                            : 'bg-surface-100/90 hover:bg-surface-200 border border-white/[0.05] hover:border-cinemix-primary/50'
                        }`}
                      >
                        {/* Episode Thumbnail */}
                        <div className="relative aspect-video w-full sm:w-44 sm:min-w-[176px] rounded-xl overflow-hidden bg-surface-300 border border-white/5 flex-shrink-0">
                          <img
                            src={ep.thumbnailUrl || activeItem.backdropUrl || activeItem.posterUrl}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                            <div className="p-2.5 rounded-full bg-white/95 text-black shadow-xl group-hover:scale-110 transition-transform">
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                          </div>
                          {ep.duration && (
                            <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10">
                              {ep.duration}m
                            </span>
                          )}
                        </div>

                        {/* Episode Meta & Synopsis */}
                        <div className="flex-1 min-w-0 py-0.5">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h4 className="font-extrabold text-white text-sm group-hover:text-cinemix-primary transition-colors line-clamp-1">
                              <span className="text-gray-400 font-semibold mr-1.5">{ep.episodeNumber}.</span>
                              {ep.title}
                            </h4>
                            {ep.airDate && (
                              <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap hidden sm:inline">
                                {new Date(ep.airDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors">
                            {ep.synopsis || `Episode ${ep.episodeNumber} of ${activeItem.title}`}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="py-16 text-center text-gray-400 space-y-2">
                    <p className="text-sm font-semibold">No episodes cataloged for this season yet.</p>
                    <p className="text-xs text-gray-500">Live stream mirrors remain active in player.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Movie Feature Presentation View in Right Column */
            <div className="flex flex-col h-full justify-between space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2 mb-1">
                  <span>Feature Presentation</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Ready to Stream
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  Direct access via Cinemix Aurora CDN & High-Bandwidth Cloud Mirrors
                </p>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-surface-300 border border-white/10 shadow-2xl group">
                <img
                  src={activeItem.backdropUrl || activeItem.posterUrl}
                  alt={activeItem.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cinemix-primary text-black">
                        4K Ultra HD Master
                      </span>
                      <span className="text-xs text-gray-300 font-medium">Dolby Atmos Audio</span>
                    </div>
                    <h4 className="text-xl sm:text-3xl font-black text-white">{activeItem.title}</h4>
                    <Link
                      href={`/watch/${activeItem.id}`}
                      className="inline-flex items-center gap-2 py-3 px-7 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-gray-200 transition-all shadow-xl hover:scale-105"
                    >
                      <Play className="w-4 h-4 fill-current" /> Stream Now
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-100 border border-white/[0.06] space-y-2 text-xs text-gray-300">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-semibold">Streaming Pipeline:</span>
                  <span className="text-emerald-400 font-bold">Cinemix Aurora CDN 1080p / 4K</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-semibold">Runtime:</span>
                  <span className="text-white font-medium">{activeItem.duration || 115} minutes</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-semibold">Zero Ads:</span>
                  <span className="text-amber-400 font-bold">Guaranteed on Cinemix Pro</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
