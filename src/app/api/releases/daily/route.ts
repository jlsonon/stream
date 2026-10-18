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
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Thirty days range for latest releases
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);
    const pastStr = pastDate.toISOString().split('T')[0];

    // Fetch newly released movies and newly airing TV shows
    const [moviesRes, tvRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_date.gte=${pastStr}&primary_release_date.lte=${todayStr}&sort_by=popularity.desc&page=1`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&air_date.gte=${pastStr}&air_date.lte=${todayStr}&sort_by=popularity.desc&page=1`,
        { next: { revalidate: 3600 } }
      )
    ]);

    const [moviesData, tvData] = await Promise.all([
      moviesRes.ok ? moviesRes.json() : { results: [] },
      tvRes.ok ? tvRes.json() : { results: [] }
    ]);

    const rawMovies = (moviesData.results || []).filter((r: any) => !r.adult).map((r: any) => ({ ...r, media_type: 'movie' }));
    const rawTv = (tvData.results || []).filter((r: any) => !r.adult).map((r: any) => ({ ...r, media_type: 'tv' }));

    // Interleave newly released movies and TV series
    const combined: any[] = [];
    const maxLen = Math.max(rawMovies.length, rawTv.length);
    for (let i = 0; i < maxLen; i++) {
      if (rawTv[i]) combined.push(rawTv[i]);
      if (rawMovies[i]) combined.push(rawMovies[i]);
    }

    const items: ContentItem[] = combined.slice(0, 15).map((r: any) => {
      const isTv = r.media_type === 'tv' || !!r.first_air_date;
      const title = r.title || r.name || 'Untitled';
      const releaseDate = r.release_date || r.first_air_date || todayStr;
      const releaseYear = parseInt(releaseDate.slice(0, 4), 10) || today.getFullYear();
      const genres = (r.genre_ids || []).map((id: number) => GENRE_MAP[id] || 'General').filter(Boolean);

      return {
        id: `${isTv ? 'series' : 'movie'}-${r.id}`,
        title,
        originalTitle: r.original_title || r.original_name,
        type: isTv ? 'series' : 'movie',
        status: 'PUBLISHED',
        synopsis: r.overview || 'Newly added to Cinelog.',
        longSynopsis: r.overview || 'Newly added to Cinelog.',
        posterUrl: r.poster_path 
          ? `https://image.tmdb.org/t/p/w500${r.poster_path}` 
          : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80',
        backdropUrl: r.backdrop_path 
          ? `https://image.tmdb.org/t/p/original${r.backdrop_path}` 
          : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&q=80',
        tmdbId: r.id,
        trailerUrl: '',
        maturityRating: 'PG-13',
        score: Math.min(10, Math.round((r.vote_average || 7.0) * 10) / 10),
        releaseYear,
        genres: genres.length > 0 ? genres : [isTv ? 'Drama' : 'Action'],
        tags: ['New Release', 'Added Today', isTv ? 'New Episode' : 'New Movie', '4K UHD'],
        isProOnly: false,
        maxQuality: '2160p',
        audioTracks: [{ language: 'en', label: 'English (Dolby 5.1)', isDefault: true }],
        subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
        cast: [],
        directors: [],
        producers: [],
        studio: 'Cinelog Global Studios',
        regionAvailability: ['GLOBAL'],
        featured: false,
        trending: false,
        newRelease: true,
        videoSources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system_tmdb_daily_releases'
      };
    });

    return NextResponse.json({
      success: true,
      updatedAt: new Date().toISOString(),
      dateString: todayStr,
      total: items.length,
      items
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error: any) {
    console.error('Error in daily releases route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
