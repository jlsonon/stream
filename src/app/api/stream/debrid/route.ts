import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface DebridStreamItem {
  name: string;
  title: string;
  quality: string;
  size?: string;
  source: string;
  streamUrl: string;
  isDirect: boolean;
}

// Endpoint to verify API key and fetch active cached streams
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { apiKey, provider = 'realdebrid', tmdbId, imdbId, type = 'movie', season = 1, episode = 1 } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Debrid API key is required' },
        { status: 400 }
      );
    }

    // 1. Verify User API Key with Real-Debrid
    if (provider === 'realdebrid') {
      const userRes = await fetch('https://api.real-debrid.com/rest/1.0/user', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!userRes.ok) {
        return NextResponse.json(
          { success: false, error: 'Invalid Real-Debrid API token or expired account' },
          { status: 401 }
        );
      }

      const userData = await userRes.json();

      // If no tmdbId is provided, this was just an account verification call
      if (!tmdbId && !imdbId) {
        return NextResponse.json({
          success: true,
          verified: true,
          provider: 'Real-Debrid',
          username: userData.username,
          premium: userData.type === 'premium',
          expiration: userData.expiration,
        });
      }

      // 2. Fetch Cached Torrents from Torrentio Scraper
      const queryId = imdbId || `tmdb:${tmdbId}`;
      const torrentioPath =
        type === 'movie'
          ? `https://torrentio.strem.fun/stream/movie/${queryId}.json`
          : `https://torrentio.strem.fun/stream/series/${queryId}:${season}:${episode}.json`;

      const torrentioRes = await fetch(torrentioPath, {
        headers: {
          'User-Agent': 'Cinelog-Stream/1.0',
        },
      });

      if (!torrentioRes.ok) {
        return NextResponse.json({
          success: true,
          streams: [],
          message: 'No cached debrid streams found for this title',
        });
      }

      const torrentioData = await torrentioRes.json();
      const rawStreams = torrentioData.streams || [];

      const streams: DebridStreamItem[] = [];

      // Sort and map the top 4K UHD and 1080p cached streams
      for (const s of rawStreams.slice(0, 10)) {
        const title = s.title || s.name || '4K Remux Direct';
        let quality = '1080p';
        if (title.includes('2160p') || title.includes('4K') || title.includes('UHD')) {
          quality = '4K UHD';
        } else if (title.includes('1440p') || title.includes('2K')) {
          quality = '2K QHD';
        }

        // Torrentio provides stream URL or infoHash
        if (s.url) {
          streams.push({
            name: s.name || 'Real-Debrid 4K',
            title,
            quality,
            source: 'Torrentio + Real-Debrid',
            streamUrl: s.url,
            isDirect: true,
          });
        }
      }

      return NextResponse.json({
        success: true,
        verified: true,
        username: userData.username,
        streamsCount: streams.length,
        streams,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported debrid provider' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Debrid resolution failed' },
      { status: 500 }
    );
  }
}
