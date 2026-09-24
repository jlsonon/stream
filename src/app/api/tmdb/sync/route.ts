import { NextRequest, NextResponse } from 'next/server';
import { ContentItem, ContentType, Episode, Season } from '@/types';

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'bd32fd534e7f46e7bb4b3caf090d970b';
const DEFAULT_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics'
};

export async function GET(req: NextRequest) {
  try {
    const endpoints = [
      {
        type: 'movie' as ContentType,
        tag: 'New in Theaters & Streaming',
        url: `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}`
      },
      {
        type: 'series' as ContentType,
        tag: 'Airing Today',
        url: `https://api.themoviedb.org/3/tv/airing_today?api_key=${TMDB_API_KEY}`
      },
      {
        type: 'series' as ContentType,
        tag: 'On The Air Now',
        url: `https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDB_API_KEY}`
      },
      {
        type: 'movie' as ContentType,
        tag: 'Trending Blockbusters',
        url: `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
      },
      {
        type: 'series' as ContentType,
        tag: 'Global TV Series',
        url: `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`
      },
      {
        type: 'anime' as ContentType,
        tag: 'Top Anime',
        url: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc`
      },
      {
        type: 'ph_content' as ContentType,
        tag: 'Philippine Cinema',
        url: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=tl&sort_by=popularity.desc`
      },
      {
        type: 'movie' as ContentType,
        tag: 'Top Rated All-Time',
        url: `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&page=1`
      }
    ];

    const results = await Promise.all(
      endpoints.map(async (ep) => {
        try {
          const res = await fetch(ep.url);
          if (!res.ok) return [];
          const data = await res.json();
          return (data.results || []).map((r: any) => ({ ...r, forcedType: ep.type, categoryTag: ep.tag }));
        } catch {
          return [];
        }
      })
    );

    const flattened = results.flat();
    const seenTmdbIds = new Set<number>();
    const formattedItems: ContentItem[] = [];

    for (const r of flattened) {
      if (!r || !r.id || seenTmdbIds.has(r.id) || !r.poster_path) continue;
      seenTmdbIds.add(r.id);

      const title = r.title || r.name || 'Untitled';
      const isMovie = r.forcedType === 'movie' || r.forcedType === 'ph_content';
      const contentType: ContentType = r.forcedType;
      const dateStr = r.release_date || r.first_air_date || '';
      const releaseYear = dateStr ? parseInt(dateStr.slice(0, 4), 10) : new Date().getFullYear();

      const posterUrl = `https://image.tmdb.org/t/p/w500${r.poster_path}`;
      const backdropUrl = r.backdrop_path
        ? `https://image.tmdb.org/t/p/original${r.backdrop_path}`
        : posterUrl;

      const genres = (r.genre_ids || [])
        .map((gid: number) => GENRE_MAP[gid])
        .filter(Boolean);

      const cleanSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const contentId = `${contentType}-${cleanSlug}-${r.id}`;

      // Build episodic seasons for series and anime
      let seasons: Season[] | undefined = undefined;
      if (!isMovie) {
        const episodes: Episode[] = Array.from({ length: 8 }, (_, i) => ({
          id: `${contentId}-s1e${i + 1}`,
          seasonNumber: 1,
          episodeNumber: i + 1,
          title: `Episode ${i + 1}`,
          synopsis: `${title} — Season 1 Episode ${i + 1}`,
          duration: 45,
          thumbnailUrl: backdropUrl,
          videoSources: [
            {
              quality: '1080p',
              url: DEFAULT_STREAM,
              bitrate: 5500,
              codec: 'H.264'
            }
          ]
        }));

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
        originalTitle: r.original_title || r.original_name,
        type: contentType,
        status: 'PUBLISHED',
        synopsis: r.overview || `${title} streaming now on Cinemix in 4K Ultra HD.`,
        longSynopsis: r.overview || `${title} streaming now on Cinemix in 4K Ultra HD.`,
        posterUrl,
        backdropUrl,
        tmdbId: r.id,
        trailerUrl: undefined,
        maturityRating: r.adult ? 'R' : 'PG-13',
        score: Number((r.vote_average || 8.0).toFixed(1)),
        releaseYear: isNaN(releaseYear) ? 2024 : releaseYear,
        genres: genres.length > 0 ? genres : ['Entertainment', 'Drama'],
        tags: [r.categoryTag, '4K UHD', 'Dolby Audio', 'TMDB Verified'],
        isProOnly: false,
        maxQuality: '2160p',
        audioTracks: [
          { language: 'en', label: 'English (Dolby 5.1)', isDefault: true },
          { language: 'fil', label: 'Filipino / Tagalog', isDefault: false }
        ],
        subtitles: [
          { language: 'en', label: 'English CC', url: '', isDefault: true },
          { language: 'fil', label: 'Tagalog Subtitles', url: '', isDefault: false }
        ],
        videoSources: [
          {
            quality: '1080p',
            url: DEFAULT_STREAM,
            bitrate: 5500,
            codec: 'H.264'
          }
        ],
        trending: true,
        featured: false,
        newRelease: true,
        cast: [],
        directors: [],
        producers: [],
        regionAvailability: ['GLOBAL'],
        seasons,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'tmdb_sync'
      };

      formattedItems.push(item);
    }

    return NextResponse.json({
      items: formattedItems,
      count: formattedItems.length,
      success: true
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
  }
}
