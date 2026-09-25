import { NextRequest, NextResponse } from 'next/server';
import { Episode } from '@/types';

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'bd32fd534e7f46e7bb4b3caf090d970b';
const DEFAULT_HLS_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const seasonNumber = parseInt(searchParams.get('season') || '1', 10);

  if (!id) {
    return NextResponse.json({ error: 'Missing TMDB series ID' }, { status: 400 });
  }

  try {
    const url = `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch season from TMDB' }, { status: res.status });
    }

    const data = await res.json();
    const rawEpisodes = data.episodes || [];

    const episodes: Episode[] = rawEpisodes.map((ep: any) => ({
      id: `tmdb-tv-${id}-s${seasonNumber}e${ep.episode_number}`,
      seasonNumber,
      episodeNumber: ep.episode_number,
      title: ep.name || `Episode ${ep.episode_number}`,
      synopsis: ep.overview || `Season ${seasonNumber}, Episode ${ep.episode_number}`,
      duration: ep.runtime || 45,
      thumbnailUrl: ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : '',
      airDate: ep.air_date || '',
      videoSources: [
        { quality: '1080p', url: DEFAULT_HLS_STREAM, bitrate: 5500, codec: 'H.264' }
      ]
    }));

    return NextResponse.json({
      success: true,
      seasonNumber,
      name: data.name || `Season ${seasonNumber}`,
      overview: data.overview || '',
      episodes
    });
  } catch (error: any) {
    console.error('Error fetching TMDB season:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
