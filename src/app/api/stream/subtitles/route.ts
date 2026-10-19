import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  url: string;
  isDefault?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get('tmdbId') || searchParams.get('id');
    const type = searchParams.get('type') || 'movie';
    const season = searchParams.get('season') ? parseInt(searchParams.get('season')!, 10) : 1;
    const episode = searchParams.get('episode') ? parseInt(searchParams.get('episode')!, 10) : 1;

    if (!tmdbId) {
      return NextResponse.json({ success: false, error: 'Missing tmdbId parameter' }, { status: 400 });
    }

    const numericId = parseInt(tmdbId.replace(/\D/g, ''), 10);
    const isSeries = type === 'tv' || type === 'series' || type === 'anime';

    const tracks: SubtitleTrack[] = [];

    // Attempt to query open subtitle providers (e.g. Wyzie / SubDL)
    try {
      const wyzieUrl = isSeries
        ? `https://sub.wyzie.ru/search?id=${numericId}&season=${season}&episode=${episode}`
        : `https://sub.wyzie.ru/search?id=${numericId}`;

      const res = await fetch(wyzieUrl, {
        headers: {
          'User-Agent': 'Cinelog/1.0 (Macintosh; Apple WebKit)',
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          for (const item of data) {
            if (item.url && item.display) {
              const langCode = item.display.toLowerCase();
              tracks.push({
                id: `wyzie-${item.id || tracks.length}`,
                label: item.display,
                language: langCode.slice(0, 2),
                url: item.url,
                isDefault: langCode.includes('english'),
              });
            }
          }
        }
      }
    } catch {
      // Non-blocking provider fallback
    }

    // Ensure essential standard language tracks are present if remote returned empty
    if (tracks.length === 0) {
      tracks.push(
        {
          id: 'sub-en',
          label: 'English (CC)',
          language: 'en',
          url: '',
          isDefault: true,
        },
        {
          id: 'sub-tl',
          label: 'Filipino (Tagalog)',
          language: 'tl',
          url: '',
        },
        {
          id: 'sub-es',
          label: 'Spanish (Español)',
          language: 'es',
          url: '',
        },
        {
          id: 'sub-ja',
          label: 'Japanese (日本語)',
          language: 'ja',
          url: '',
        }
      );
    }

    return NextResponse.json({
      success: true,
      tmdbId: numericId,
      type,
      season: isSeries ? season : undefined,
      episode: isSeries ? episode : undefined,
      subtitles: tracks,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch subtitles' },
      { status: 500 }
    );
  }
}
