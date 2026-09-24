import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'bd32fd534e7f46e7bb4b3caf090d970b';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const type = searchParams.get('type') || 'all'; // 'all' | 'movie' | 'tv'

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    let endpoint = 'search/multi';
    if (type === 'movie') endpoint = 'search/movie';
    if (type === 'tv') endpoint = 'search/tv';

    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: res.status });
    }

    const data = await res.json();
    const rawResults = data.results || [];

    const formatted = rawResults
      .filter((r: any) => r.poster_path && (r.media_type === 'movie' || r.media_type === 'tv' || type !== 'all'))
      .map((r: any) => {
        const isMovie = r.media_type ? r.media_type === 'movie' : type === 'movie';
        const title = r.title || r.name || 'Untitled';
        const dateStr = r.release_date || r.first_air_date || '';
        const year = dateStr ? parseInt(dateStr.slice(0, 4), 10) : new Date().getFullYear();

        return {
          id: r.id,
          title,
          originalTitle: r.original_title || r.original_name,
          type: isMovie ? 'movie' : 'series',
          overview: r.overview || '',
          posterUrl: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : '',
          backdropUrl: r.backdrop_path ? `https://image.tmdb.org/t/p/original${r.backdrop_path}` : '',
          releaseYear: isNaN(year) ? 2024 : year,
          score: Number((r.vote_average || 7.5).toFixed(1)),
          popularity: r.popularity || 0
        };
      });

    return NextResponse.json({ results: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
