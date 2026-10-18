import { NextRequest, NextResponse } from 'next/server';
import { ContentItem } from '@/types';

export const dynamic = 'force-dynamic';

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'bd32fd534e7f46e7bb4b3caf090d970b';

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
  10765: 'Sci-Fi & Fantasy',
  10768: 'War & Politics',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaType = searchParams.get('type') || 'all'; // all, tv, movie

    const endpoint = mediaType === 'tv'
      ? `https://api.themoviedb.org/3/trending/tv/day?api_key=${TMDB_API_KEY}`
      : mediaType === 'movie'
      ? `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`
      : `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`;

    const res = await fetch(endpoint, {
      next: { revalidate: 3600 } // Hourly refresh of daily trend calculations
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Failed to fetch daily rankings from TMDB' }, { status: 502 });
    }

    const data = await res.json();
    const rawResults = (data.results || []).filter((r: any) => !r.adult);

    // Map to ContentItem with calculated daily rankings
    const rankings = rawResults.slice(0, 10).map((r: any, index: number) => {
      const isTv = r.media_type === 'tv' || !!r.first_air_date;
      const title = r.title || r.name || 'Untitled';
      const releaseDate = r.release_date || r.first_air_date || '';
      const releaseYear = releaseDate ? parseInt(releaseDate.slice(0, 4), 10) : new Date().getFullYear();
      const genres = (r.genre_ids || []).map((id: number) => GENRE_MAP[id] || 'General').filter(Boolean);

      const item: ContentItem & { rank: number; trend: string; rankChange: string } = {
        id: `${isTv ? 'series' : 'movie'}-${r.id}`,
        title,
        originalTitle: r.original_title || r.original_name,
        type: isTv ? 'series' : 'movie',
        status: 'PUBLISHED',
        synopsis: r.overview || 'No synopsis available.',
        longSynopsis: r.overview || 'No synopsis available.',
        posterUrl: r.poster_path 
          ? `https://image.tmdb.org/t/p/w500${r.poster_path}` 
          : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80',
        backdropUrl: r.backdrop_path 
          ? `https://image.tmdb.org/t/p/original${r.backdrop_path}` 
          : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&q=80',
        tmdbId: r.id,
        trailerUrl: '',
        maturityRating: r.adult ? 'NC-17' : 'PG-13',
        score: Math.min(10, Math.round((r.vote_average || 7.5) * 10) / 10),
        releaseYear,
        genres: genres.length > 0 ? genres : [isTv ? 'Drama' : 'Action'],
        tags: ['Daily Top 10', `Rank #${index + 1}`, 'Trending Today', '4K UHD'],
        isProOnly: false,
        maxQuality: '2160p',
        audioTracks: [{ language: 'en', label: 'English (Dolby 5.1)', isDefault: true }],
        subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
        cast: [],
        directors: [],
        producers: [],
        studio: 'Cinelog Global Studios',
        regionAvailability: ['GLOBAL'],
        featured: index < 3,
        trending: true,
        newRelease: false,
        videoSources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system_tmdb_daily_rankings',
        rank: index + 1,
        trend: index === 0 ? 'top' : (index < 4 ? 'up' : 'steady'),
        rankChange: index === 0 ? 'No. 1' : (index < 3 ? '+1' : 'Top 10')
      };

      return item;
    });

    const todayDate = new Date().toISOString().split('T')[0];

    return NextResponse.json({
      success: true,
      updatedAt: new Date().toISOString(),
      rankingDate: todayDate,
      total: rankings.length,
      rankings
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error: any) {
    console.error('Error in daily rankings route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
