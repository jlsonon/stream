'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ContentItem, Episode } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { ArrowLeft, Film } from 'lucide-react';
import Link from 'next/link';

function WatchContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const contentId = params?.id as string;
  const seasonParam = searchParams.get('season');
  const episodeParam = searchParams.get('episode');

  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [hashSeason, setHashSeason] = useState<number | null>(null);
  const [hashEpisode, setHashEpisode] = useState<number | null>(null);

  // Check URL hash for Cineby format: #s1-e1
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const match = window.location.hash.match(/#s(\d+)-e(\d+)/i);
      if (match) {
        setHashSeason(parseInt(match[1], 10));
        setHashEpisode(parseInt(match[2], 10));
      }
    }
  }, []);

  useEffect(() => {
    async function load() {
      if (!contentId) return;
      setLoading(true);
      let item = await catalogService.getContentById(contentId);
      if (!item) {
        // Support direct TMDB ID or patterns: movie-550, tv-1396, series-breaking-bad-1396, etc.
        const tmdbMatch = contentId.match(/^(?:([a-z_]+)-)?(?:.+?-)?(\d+)$/);
        if (tmdbMatch) {
          const typePrefix = tmdbMatch[1];
          let rawType = (typePrefix === 'series' || typePrefix === 'anime' || typePrefix === 'tv') ? 'tv' : 'movie';
          const tmdbId = tmdbMatch[2];
          try {
            let res = await fetch(`/api/tmdb/details?id=${tmdbId}&type=${rawType}`);
            if (!res.ok) {
              const altType = rawType === 'tv' ? 'movie' : 'tv';
              res = await fetch(`/api/tmdb/details?id=${tmdbId}&type=${altType}`);
            }
            if (res.ok) {
              const data = await res.json();
              if (data.item) {
                catalogService.saveContent(data.item);
                item = data.item;
              }
            }
          } catch (err) {
            console.error('Failed to auto-fetch TMDB stream:', err);
          }
        }
      }

      // If TV series and has TMDB ID, ensure all seasons are populated
      if (item && item.tmdbId && (item.type === 'series' || item.type === 'anime' || (item.seasons && item.seasons.length <= 1))) {
        try {
          const detailsRes = await fetch(`/api/tmdb/details?id=${item.tmdbId}&type=tv`);
          if (detailsRes.ok) {
            const detailsData = await detailsRes.json();
            if (detailsData.item?.seasons && detailsData.item.seasons.length > (item.seasons?.length || 0)) {
              item = {
                ...item,
                seasons: detailsData.item.seasons
              };
              catalogService.saveContent(item);
            }
          }
        } catch (err) {
          // Non-blocking
        }
      }

      setContent(item);
      setLoading(false);
    }
    load();
  }, [contentId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cinemix-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-gray-400">Loading cinema stream...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center">
        <Film className="w-12 h-12 text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Video Not Found</h2>
        <p className="text-sm text-gray-400 mb-6">
          The requested title is not available or may have been unpublished.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-cinemix-primary text-white font-medium hover:bg-cinemix-primary/90 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    );
  }

  // Find active episode and next episode for episodic content
  let activeEpisode: Episode | undefined;
  let nextEpisode: Episode | undefined;

  if (content.seasons && content.seasons.length > 0) {
    const allEpisodes: Episode[] = [];
    for (const season of content.seasons) {
      if (season.episodes && season.episodes.length > 0) {
        allEpisodes.push(...season.episodes);
      }
    }

    const targetSeason = seasonParam ? parseInt(seasonParam, 10) : hashSeason;
    const targetEpisode = episodeParam ? (parseInt(episodeParam, 10) || null) : hashEpisode;

    // 1. Match by both Season and Episode number
    if (targetSeason !== null && targetSeason !== undefined && targetEpisode !== null && targetEpisode !== undefined) {
      const idx = allEpisodes.findIndex(
        e => e.seasonNumber === targetSeason && e.episodeNumber === targetEpisode
      );
      if (idx !== -1) {
        activeEpisode = allEpisodes[idx];
        nextEpisode = allEpisodes[idx + 1];
      }
    }

    // 2. Match by Episode ID or Episode Number
    if (!activeEpisode && episodeParam) {
      const idx = allEpisodes.findIndex(e => e.id === episodeParam || e.episodeNumber === parseInt(episodeParam, 10));
      if (idx !== -1) {
        activeEpisode = allEpisodes[idx];
        nextEpisode = allEpisodes[idx + 1];
      }
    }

    // 3. Match by Target Season first episode
    if (!activeEpisode && targetSeason !== null && targetSeason !== undefined) {
      const seasonObj = content.seasons.find(s => s.seasonNumber === targetSeason);
      if (seasonObj && seasonObj.episodes.length > 0) {
        activeEpisode = seasonObj.episodes[0];
        nextEpisode = seasonObj.episodes[1];
      }
    }

    // 4. Default to first available episode
    if (!activeEpisode && allEpisodes.length > 0) {
      activeEpisode = allEpisodes[0];
      nextEpisode = allEpisodes[1];
    }
  }

  return (
    <VideoPlayer
      content={content}
      episode={activeEpisode}
      nextEpisode={nextEpisode}
      onSelectEpisode={(ep) => {
        router.replace(`/watch/${content.id}?season=${ep.seasonNumber}&episode=${ep.episodeNumber}`, { scroll: false });
      }}
      onNextEpisode={() => {
        if (nextEpisode) {
          router.replace(`/watch/${content.id}?season=${nextEpisode.seasonNumber}&episode=${nextEpisode.episodeNumber}`, { scroll: false });
        }
      }}
      onBack={() => router.push('/')}
    />
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cinemix-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-gray-400">Preparing cinema stream...</p>
      </div>
    }>
      <WatchContent />
    </Suspense>
  );
}
