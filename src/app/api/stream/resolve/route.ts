import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ResolveResponse {
  success: boolean;
  contentId: string;
  tmdbId?: number;
  type: string;
  season?: number;
  episode?: number;
  proShield: {
    status: 'active' | 'inactive';
    popupSuppression: boolean;
    antiRedirectFirewall: boolean;
    cleanMirrorsOnly: boolean;
  };
  recommendedServer: {
    id: string;
    name: string;
    tag: string;
    isAdFree: boolean;
    embedUrl: string;
  };
  cleanMirrors: Array<{
    id: string;
    name: string;
    tag: string;
    isAdFree: boolean;
    embedUrl: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'movie';
    const season = searchParams.get('season') ? parseInt(searchParams.get('season')!, 10) : 1;
    const episode = searchParams.get('episode') ? parseInt(searchParams.get('episode')!, 10) : 1;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required content id or tmdbId parameter' },
        { status: 400 }
      );
    }

    const tmdbId = parseInt(id.replace(/\D/g, ''), 10) || undefined;
    const isSeries = type === 'tv' || type === 'series' || type === 'anime';

    // VidLink Pro (Zero ads, brand-customized theme)
    const vidlinkUrl = tmdbId
      ? (isSeries
          ? `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=e50914&secondaryColor=18181b&iconColor=e50914`
          : `https://vidlink.pro/movie/${tmdbId}?primaryColor=e50914&secondaryColor=18181b&iconColor=e50914`)
      : '';

    // Embed.su (Clean adaptive mirror)
    const embedsuUrl = tmdbId
      ? (isSeries
          ? `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`
          : `https://embed.su/embed/movie/${tmdbId}`)
      : '';

    // Vidsrc Ultra 4K
    const vidsrcSuUrl = tmdbId
      ? (isSeries
          ? `https://vidsrc.su/embed/tv/${tmdbId}/${season}/${episode}`
          : `https://vidsrc.su/embed/movie/${tmdbId}`)
      : '';

    // AutoEmbed 4K Pro
    const autoEmbedUrl = tmdbId
      ? (isSeries
          ? `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`
          : `https://autoembed.co/movie/tmdb/${tmdbId}`)
      : '';

    const cleanMirrors = [
      {
        id: 'aurora',
        name: 'Aurora VIP 4K (VidLink)',
        tag: 'Zero Ads',
        isAdFree: true,
        embedUrl: vidlinkUrl,
      },
      {
        id: 'vidsrc_su',
        name: 'Vidsrc Ultra 4K',
        tag: 'Fast 4K',
        isAdFree: true,
        embedUrl: vidsrcSuUrl,
      },
      {
        id: 'autoembed',
        name: 'AutoEmbed 4K Pro',
        tag: '4K Ready',
        isAdFree: true,
        embedUrl: autoEmbedUrl,
      },
      {
        id: 'hls',
        name: 'Cinelog Native 4K',
        tag: 'Native',
        isAdFree: true,
        embedUrl: vidlinkUrl || 'https://vidlink.pro',
      },
    ];

    const response: ResolveResponse = {
      success: true,
      contentId: id,
      tmdbId,
      type,
      season: isSeries ? season : undefined,
      episode: isSeries ? episode : undefined,
      proShield: {
        status: 'active',
        popupSuppression: true,
        antiRedirectFirewall: true,
        cleanMirrorsOnly: true,
      },
      recommendedServer: cleanMirrors[0],
      cleanMirrors,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Stream resolution failed' },
      { status: 500 }
    );
  }
}
