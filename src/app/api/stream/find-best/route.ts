import { NextRequest, NextResponse } from 'next/server';
import { resolveTmdbId, buildMirrorEmbedUrl, AUTO_FALLBACK_SERVERS, CINELOG_SERVERS, ServerType } from '@/lib/stream-utils';

export const dynamic = 'force-dynamic';

interface ProbeResult {
  id: ServerType;
  name: string;
  url: string;
  status: number;
  latencyMs: number;
  available: boolean;
}

// In-memory cache for fast responsive lookups
const probeCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id') || searchParams.get('tmdbId');
    const typeParam = searchParams.get('type') || 'movie';
    const season = parseInt(searchParams.get('season') || '1', 10);
    const episode = parseInt(searchParams.get('episode') || '1', 10);

    const tmdbId = resolveTmdbId(idParam);
    if (!tmdbId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to resolve TMDB ID for content',
          bestServer: 'vidsrc_su',
          fallbackServers: AUTO_FALLBACK_SERVERS,
        },
        { status: 400 }
      );
    }

    const isSeries = typeParam === 'tv' || typeParam === 'series' || typeParam === 'anime';
    const cacheKey = `${tmdbId}-${isSeries ? `s${season}e${episode}` : 'movie'}`;

    const cached = probeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    // Candidate mirrors to probe
    const candidates = AUTO_FALLBACK_SERVERS.slice(0, 6);

    const probePromises = candidates.map(async (serverId): Promise<ProbeResult> => {
      const serverMeta = CINELOG_SERVERS.find((s) => s.id === serverId);
      const embedUrl = buildMirrorEmbedUrl(serverId, tmdbId, isSeries, season, episode);

      const startTime = Date.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1400);

        const res = await fetch(embedUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
          signal: controller.signal,
          redirect: 'follow',
        });

        clearTimeout(timeout);
        const latencyMs = Date.now() - startTime;

        const isOk = res.status >= 200 && res.status < 400;

        return {
          id: serverId,
          name: serverMeta?.name || serverId,
          url: embedUrl,
          status: res.status,
          latencyMs,
          available: isOk,
        };
      } catch {
        return {
          id: serverId,
          name: serverMeta?.name || serverId,
          url: embedUrl,
          status: 0,
          latencyMs: 999,
          available: false,
        };
      }
    });

    const results = await Promise.all(probePromises);

    // Rank responsive servers by latency
    const sorted = [...results].sort((a, b) => {
      if (a.available && !b.available) return -1;
      if (!a.available && b.available) return 1;
      return a.latencyMs - b.latencyMs;
    });

    const bestServer = sorted.find((s) => s.available)?.id || 'vidsrc_su';

    const responsePayload = {
      success: true,
      tmdbId,
      bestServer,
      rankedServers: sorted,
      allFallbackOrder: AUTO_FALLBACK_SERVERS,
    };

    probeCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Server probe failed',
        bestServer: 'vidsrc_su',
        allFallbackOrder: AUTO_FALLBACK_SERVERS,
      },
      { status: 500 }
    );
  }
}
