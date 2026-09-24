import { NextRequest, NextResponse } from 'next/server';
import { ContentItem, Season, Episode, ContentType } from '@/types';

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'bd32fd534e7f46e7bb4b3caf090d970b';
const DEFAULT_HLS_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'movie'; // 'movie' | 'tv'

  if (!id) {
    return NextResponse.json({ error: 'Missing TMDB ID' }, { status: 400 });
  }

  try {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const url = `https://api.themoviedb.org/3/${endpoint}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`;
    
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: res.status });
    }

    const data = await res.json();
    const isMovie = type === 'movie';
    const title = data.title || data.name || 'Untitled';
    const dateStr = data.release_date || data.first_air_date || '';
    const releaseYear = dateStr ? parseInt(dateStr.slice(0, 4), 10) : new Date().getFullYear();

    // Check if anime
    const isAnime = data.original_language === 'ja' && data.genres?.some((g: any) => g.name === 'Animation');
    const contentType: ContentType = isAnime ? 'anime' : isMovie ? 'movie' : 'series';

    // Trailer
    let trailerUrl = '';
    if (data.videos && data.videos.results?.length > 0) {
      const trailer = data.videos.results.find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || data.videos.results[0];
      if (trailer && trailer.key) {
        trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
      }
    }

    // Cast
    const cast = (data.credits?.cast || []).slice(0, 6).map((c: any) => ({
      name: c.name,
      role: c.character || 'Actor'
    }));

    // Genres
    const genres = (data.genres || []).map((g: any) => g.name);

    // Poster & Backdrop
    const posterUrl = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '';
    const backdropUrl = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : posterUrl;

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const contentId = `${contentType}-${baseSlug}-${data.id}`;

    // Seasons for TV Series
    let seasons: Season[] | undefined = undefined;
    if (!isMovie) {
      // Create Season 1 with episodes
      const epCount = data.number_of_episodes ? Math.min(data.number_of_episodes, 10) : 6;
      const episodes: Episode[] = [];
      for (let i = 1; i <= epCount; i++) {
        episodes.push({
          id: `${contentId}-s1e${i}`,
          seasonNumber: 1,
          episodeNumber: i,
          title: `Episode ${i}`,
          synopsis: `${title} — Season 1, Episode ${i}`,
          duration: data.episode_run_time?.[0] || 45,
          thumbnailUrl: backdropUrl,
          videoSources: [
            { quality: '1080p', url: DEFAULT_HLS_STREAM, bitrate: 5500, codec: 'H.264' }
          ]
        });
      }
      seasons = [
        {
          seasonNumber: 1,
          title: 'Season 1',
          episodes
        }
      ];
    }

    const item: ContentItem = {
      id: contentId,
      title,
      originalTitle: data.original_title || data.original_name,
      type: contentType,
      status: 'PUBLISHED',
      synopsis: data.overview || `${title} streaming now on Cinemix.`,
      longSynopsis: data.overview || `${title} streaming now on Cinemix.`,
      posterUrl,
      backdropUrl,
      trailerUrl: trailerUrl || undefined,
      tmdbId: data.id,
      maturityRating: data.adult ? 'NC-17' : 'PG-13',
      score: Number((data.vote_average || 8.0).toFixed(1)),
      releaseYear: isNaN(releaseYear) ? 2024 : releaseYear,
      duration: isMovie ? (data.runtime || 120) : undefined,
      genres: genres.length > 0 ? genres : ['Drama'],
      tags: ['Trending', 'TMDB Verified', 'Full HD'],
      isProOnly: false,
      maxQuality: '2160p',
      audioTracks: [
        { language: data.original_language || 'en', label: 'Original Audio (Dolby 5.1)', isDefault: true }
      ],
      subtitles: [
        { language: 'en', label: 'English CC', url: '', isDefault: true }
      ],
      cast,
      directors: [],
      producers: (data.production_companies || []).slice(0, 2).map((c: any) => c.name),
      studio: data.production_companies?.[0]?.name || 'Cinemix Studios',
      regionAvailability: ['GLOBAL'],
      featured: false,
      trending: true,
      newRelease: true,
      videoSources: [
        { quality: '2160p', url: DEFAULT_HLS_STREAM, bitrate: 14000, codec: 'H.264' },
        { quality: '1080p', url: DEFAULT_HLS_STREAM, bitrate: 6000, codec: 'H.264' }
      ],
      seasons,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'tmdb-importer'
    };

    return NextResponse.json({ item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
