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
  const episodeId = searchParams.get('episode');

  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!contentId) return;
      setLoading(true);
      const item = await catalogService.getContentById(contentId);
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
      allEpisodes.push(...season.episodes);
    }

    if (episodeId) {
      const idx = allEpisodes.findIndex(e => e.id === episodeId);
      if (idx !== -1) {
        activeEpisode = allEpisodes[idx];
        nextEpisode = allEpisodes[idx + 1];
      }
    }

    // Default to the very first episode if none specified or matched
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
      onNextEpisode={() => {
        if (nextEpisode) {
          router.push(`/watch/${content.id}?episode=${nextEpisode.id}`);
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
