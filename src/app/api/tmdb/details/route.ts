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
    const url = `https://api.themoviedb.org/3/${endpoint}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,watch/providers`;
    
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: res.status });
    }

    const data = await res.json();
    const isMovie = type === 'movie';
    const title = data.title || data.name || 'Untitled';
    const dateStr = data.release_date || data.first_air_date || '';
    const releaseYear = dateStr ? parseInt(dateStr.slice(0, 4), 10) : new Date().getFullYear();

    // Parse Watch Providers (Legitimate where-to-watch streaming destinations)
    const rawProviders = data['watch/providers']?.results || {};
    const parseCountryProviders = (countryCode: string, entry: any) => {
      if (!entry) {
        return {
          country: countryCode,
          stream: [],
          rent: [],
          buy: [],
          free: []
        };
      }
      const mapList = (arr: any[], providerType: 'stream' | 'rent' | 'buy' | 'free') => {
        return (arr || []).map((p: any) => ({
          id: p.provider_id,
          name: p.provider_name,
          logoUrl: p.logo_path ? `https://image.tmdb.org/t/p/original${p.logo_path}` : '',
          type: providerType,
          displayPriority: p.display_priority
        }));
      };
      return {
        country: countryCode,
        justWatchUrl: entry.link || undefined,
        stream: mapList(entry.flatrate, 'stream'),
        rent: mapList(entry.rent, 'rent'),
        buy: mapList(entry.buy, 'buy'),
        free: mapList(entry.free || entry.ads, 'free')
      };
    };

    const watchAvailability: Record<string, any> = {
      PH: parseCountryProviders('PH', rawProviders.PH),
      US: parseCountryProviders('US', rawProviders.US),
      GLOBAL: parseCountryProviders('GLOBAL', rawProviders.PH || rawProviders.US || Object.values(rawProviders)[0])
    };

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

    // Complete Seasons & Episodes for TV Series (All Seasons & All Episodes)
    let seasons: Season[] | undefined = undefined;
    if (!isMovie) {
      const rawSeasons = (data.seasons || []).filter((s: any) => s.season_number > 0);
      const totalSeasonsToBuild = rawSeasons.length > 0 
        ? rawSeasons 
        : [{ season_number: 1, name: 'Season 1', episode_count: data.number_of_episodes || 12 }];

      // Pre-fetch actual episode metadata for Season 1
      let season1RealEpisodes: Episode[] = [];
      try {
        const s1Res = await fetch(`https://api.themoviedb.org/3/tv/${data.id}/season/1?api_key=${TMDB_API_KEY}`);
        if (s1Res.ok) {
          const s1Data = await s1Res.json();
          season1RealEpisodes = (s1Data.episodes || []).map((ep: any) => ({
            id: `${contentId}-s1e${ep.episode_number}`,
            seasonNumber: 1,
            episodeNumber: ep.episode_number,
            title: ep.name || `Episode ${ep.episode_number}`,
            synopsis: ep.overview || `${title} — Season 1, Episode ${ep.episode_number}`,
            duration: ep.runtime || data.episode_run_time?.[0] || 45,
            thumbnailUrl: ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : backdropUrl,
            airDate: ep.air_date || '',
            videoSources: [
              { quality: '1080p', url: DEFAULT_HLS_STREAM, bitrate: 5500, codec: 'H.264' }
            ]
          }));
        }
      } catch (err) {
        // non-blocking fallback
      }

      seasons = totalSeasonsToBuild.map((s: any) => {
        const sNum = s.season_number;
        if (sNum === 1 && season1RealEpisodes.length > 0) {
          return {
            seasonNumber: 1,
            title: s.name || 'Season 1',
            episodes: season1RealEpisodes
          };
        }

        const count = Math.max(1, s.episode_count || 10);
        const epList: Episode[] = [];
        for (let ep = 1; ep <= count; ep++) {
          epList.push({
            id: `${contentId}-s${sNum}e${ep}`,
            seasonNumber: sNum,
            episodeNumber: ep,
            title: `Episode ${ep}`,
            synopsis: `${title} — Season ${sNum}, Episode ${ep}`,
            duration: data.episode_run_time?.[0] || 45,
            thumbnailUrl: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : backdropUrl,
            videoSources: [
              { quality: '1080p', url: DEFAULT_HLS_STREAM, bitrate: 5500, codec: 'H.264' }
            ]
          });
        }
        return {
          seasonNumber: sNum,
          title: s.name || `Season ${sNum}`,
          episodes: epList
        };
      });
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
      watchAvailability,
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
