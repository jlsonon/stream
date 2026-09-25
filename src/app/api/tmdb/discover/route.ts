import { NextRequest, NextResponse } from 'next/server';
import { ContentItem, ContentType } from '@/types';

export const dynamic = 'force-dynamic';

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'bd32fd534e7f46e7bb4b3caf090d970b';

const GENRE_NAME_TO_ID: Record<string, { movie: number; tv: number }> = {
  action: { movie: 28, tv: 10759 },
  adventure: { movie: 12, tv: 10759 },
  animation: { movie: 16, tv: 16 },
  comedy: { movie: 35, tv: 35 },
  crime: { movie: 80, tv: 80 },
  documentary: { movie: 99, tv: 99 },
  drama: { movie: 18, tv: 18 },
  family: { movie: 10751, tv: 10751 },
  fantasy: { movie: 14, tv: 10765 },
  history: { movie: 36, tv: 36 },
  horror: { movie: 27, tv: 9648 },
  mystery: { movie: 9648, tv: 9648 },
  romance: { movie: 10749, tv: 10766 },
  'sci-fi': { movie: 878, tv: 10765 },
  thriller: { movie: 53, tv: 9648 },
  war: { movie: 10752, tv: 10768 },
  western: { movie: 37, tv: 37 },
};

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
    const type = searchParams.get('type') || 'all';
    const genre = searchParams.get('genre') || 'All';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = searchParams.get('sort_by') || 'popularity.desc';

    // Determine target TMDB endpoint: movie or tv
    let targetType: 'movie' | 'tv' = 'movie';
    let forcedContentType: ContentType = 'movie';
    let extraParams = '';

    if (type === 'movie') {
      targetType = 'movie';
      forcedContentType = 'movie';
    } else if (type === 'series') {
      targetType = 'tv';
      forcedContentType = 'series';
    } else if (type === 'anime') {
      targetType = 'tv';
      forcedContentType = 'anime';
      extraParams += '&with_genres=16&with_original_language=ja';
    } else if (type === 'ph_content') {
      // Alternate between movie and tv based on page or default to movie
      targetType = page % 2 === 0 ? 'tv' : 'movie';
      forcedContentType = 'ph_content';
      extraParams += '&with_original_language=tl';
    } else if (type === 'kdrama') {
      targetType = 'tv';
      forcedContentType = 'series';
      extraParams += '&with_original_language=ko';
    } else if (type === 'documentary') {
      targetType = 'movie';
      forcedContentType = 'documentary';
      extraParams += '&with_genres=99';
    } else {
      // 'all': balance movies and series
      targetType = page % 2 === 0 ? 'tv' : 'movie';
      forcedContentType = targetType === 'movie' ? 'movie' : 'series';
    }

    // Apply genre filter if specified
    const genreKey = genre.toLowerCase();
    if (genre !== 'All' && GENRE_NAME_TO_ID[genreKey]) {
      const gId = GENRE_NAME_TO_ID[genreKey][targetType] || GENRE_NAME_TO_ID[genreKey].movie;
      if (gId) {
        extraParams += `&with_genres=${gId}`;
      }
    } else if (genreKey === 'k-drama' || genreKey === 'korean drama') {
      targetType = 'tv';
      forcedContentType = 'series';
      extraParams += '&with_original_language=ko';
    } else if (genreKey === 'philippine cinema') {
      extraParams += '&with_original_language=tl';
    }

    const tmdbUrl = `https://api.themoviedb.org/3/discover/${targetType}?api_key=${TMDB_API_KEY}&page=${page}&sort_by=${sortBy}&include_adult=false&without_companies=150066${extraParams}`;

    const res = await fetch(tmdbUrl);
    if (!res.ok) {
      return NextResponse.json({ success: false, items: [], totalPages: 0 }, { status: 500 });
    }

    const data = await res.json();
    const rawResults = data.results || [];

    const items: ContentItem[] = [];

    for (const r of rawResults) {
      if (!r || !r.id || !r.poster_path) continue;

      // Strict Vivamax and adult content exclusion
      const fullText = `${r.title || ''} ${r.name || ''} ${r.original_title || ''} ${r.original_name || ''} ${r.overview || ''}`.toLowerCase();
      if (
        fullText.includes('vivamax') ||
        fullText.includes('viva max') ||
        fullText.includes('viva prime') ||
        fullText.includes('vmx') ||
        r.adult
      ) {
        continue;
      }

      const title = r.title || r.name || 'Untitled';
      const isMovie = targetType === 'movie';
      const dateStr = r.release_date || r.first_air_date || '';
      const releaseYear = dateStr ? parseInt(dateStr.slice(0, 4), 10) : new Date().getFullYear();

      const genres = (r.genre_ids || [])
        .map((gid: number) => GENRE_MAP[gid])
        .filter(Boolean);

      if (type === 'ph_content' || r.original_language === 'tl') {
        genres.push('Philippine Cinema');
      }
      if (type === 'kdrama' || r.original_language === 'ko') {
        genres.push('K-Drama');
      }
      if (type === 'anime' || (r.original_language === 'ja' && genres.includes('Animation'))) {
        genres.push('Anime');
      }

      const item: ContentItem = {
        id: `${forcedContentType}-${r.id}`,
        tmdbId: r.id,
        title,
        description: r.overview || 'Stream this title in Ultra High Definition exclusively on Cinemix.',
        type: forcedContentType,
        genres: genres.length > 0 ? genres : ['Entertainment', 'Drama'],
        releaseYear,
        duration: isMovie ? 124 : 45,
        rating: 'PG-13',
        maturityRating: 'PG-13',
        score: r.vote_average ? Math.round(r.vote_average * 10) : 85,
        matchScore: r.vote_average ? Math.round(r.vote_average * 10) : 88,
        popularity: r.popularity || 100,
        thumbnailUrl: `https://image.tmdb.org/t/p/w500${r.poster_path}`,
        posterUrl: `https://image.tmdb.org/t/p/w500${r.poster_path}`,
        backdropUrl: r.backdrop_path
          ? `https://image.tmdb.org/t/p/original${r.backdrop_path}`
          : `https://image.tmdb.org/t/p/w500${r.poster_path}`,
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isFeatured: r.vote_average > 7.8,
        isTrending: r.popularity > 80,
        isPhilippineExclusive: type === 'ph_content' || r.original_language === 'tl',
        requiredPlan: 'FREE',
        videoSources: [
          {
            id: 'src-1',
            label: 'Cinemix FHD Adaptive Master',
            quality: '1080p',
            url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            type: 'hls',
          },
        ],
      };

      items.push(item);
    }

    return NextResponse.json({
      success: true,
      page: data.page || page,
      totalPages: data.total_pages || 1,
      totalResults: data.total_results || items.length,
      items,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Discover failed' },
      { status: 500 }
    );
  }
}
