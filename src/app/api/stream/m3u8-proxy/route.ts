import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function resolveAbsoluteUrl(base: string, relative: string): string {
  try {
    return new URL(relative, base).toString();
  } catch {
    return relative;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    const referer = searchParams.get('referer');

    if (!targetUrl) {
      return NextResponse.json({ error: 'Missing target url parameter' }, { status: 400 });
    }

    let parsedTarget: URL;
    try {
      parsedTarget = new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const headers: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': '*/*',
    };

    if (referer) {
      headers['Referer'] = referer;
    } else {
      headers['Referer'] = `${parsedTarget.protocol}//${parsedTarget.host}/`;
    }

    const res = await fetch(targetUrl, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch upstream m3u8 playlist', status: res.status },
        { status: res.status }
      );
    }

    const playlistText = await res.text();
    const originHost = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseProxyUrl = `${protocol}://${originHost}/api/stream`;

    // Rewrite m3u8 playlist lines
    const lines = playlistText.split('\n');
    const rewrittenLines = lines.map((line) => {
      const trimmed = line.trim();

      // Handle comments or tag lines
      if (trimmed.startsWith('#')) {
        // Rewrite URI in tags such as #EXT-X-KEY:METHOD=...,URI="url" or #EXT-X-MAP:URI="url"
        return trimmed.replace(/URI="([^"]+)"/g, (match, uri) => {
          const absolute = resolveAbsoluteUrl(targetUrl, uri);
          const encoded = encodeURIComponent(absolute);
          const refParam = referer ? `&referer=${encodeURIComponent(referer)}` : '';
          return `URI="${baseProxyUrl}/proxy?url=${encoded}${refParam}"`;
        });
      }

      // If empty line, preserve
      if (!trimmed) {
        return line;
      }

      // If the line is a URL or relative path to a sub-playlist or segment
      const absoluteUrl = resolveAbsoluteUrl(targetUrl, trimmed);
      const encodedUrl = encodeURIComponent(absoluteUrl);
      const refParam = referer ? `&referer=${encodeURIComponent(referer)}` : '';

      // If sub-playlist, route through m3u8-proxy again
      if (trimmed.includes('.m3u8') || trimmed.includes('playlist')) {
        return `${baseProxyUrl}/m3u8-proxy?url=${encodedUrl}${refParam}`;
      }

      // Otherwise it's a media segment (e.g. .ts, .m4s, .mp4, .aac), route through proxy
      return `${baseProxyUrl}/proxy?url=${encodedUrl}${refParam}`;
    });

    const rewrittenContent = rewrittenLines.join('\n');

    return new Response(rewrittenContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Playlist rewrite error', message: err.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    },
  });
}
