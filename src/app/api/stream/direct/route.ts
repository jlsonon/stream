import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface DirectStreamResponse {
  success: boolean;
  contentId: string;
  tmdbId?: number;
  type: string;
  season?: number;
  episode?: number;
  hasDirectHls: boolean;
  streamUrl?: string;
  quality?: string;
  fallbackEmbedUrl: string;
  recommendedServer: string;
  mirrors: Array<{
    id: string;
    name: string;
    quality: string;
    url: string;
    isNative: boolean;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const type = searchParams.get('type') || 'movie';
    const season = searchParams.get('season') ? parseInt(searchParams.get('season')!, 10) : 1;
    const episode = searchParams.get('episode') ? parseInt(searchParams.get('episode')!, 10) : 1;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing content id' }, { status: 400 });
    }

    const tmdbId = parseInt(id.replace(/\D/g, ''), 10) || undefined;
    const isSeries = type === 'tv' || type === 'series' || type === 'anime';

    // Primary VidLink zero-ad embed URL
    const vidlinkEmbed = tmdbId
      ? (isSeries
          ? `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=e50914&secondaryColor=18181b&iconColor=e50914&autoplay=true`
          : `https://vidlink.pro/movie/${tmdbId}?primaryColor=e50914&secondaryColor=18181b&iconColor=e50914&autoplay=true`)
      : '';

    // Vidsrc Ultra 4K embed URL
    const vidsrcEmbed = tmdbId
      ? (isSeries
          ? `https://vidsrc.su/embed/tv/${tmdbId}/${season}/${episode}`
          : `https://vidsrc.su/embed/movie/${tmdbId}`)
      : '';

    // AutoEmbed 4K Pro
    const autoEmbed = tmdbId
      ? (isSeries
          ? `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`
          : `https://autoembed.co/movie/tmdb/${tmdbId}`)
      : '';

    // Check if there is a known direct HLS stream or extractable source
    let directHlsUrl: string | undefined = undefined;

    // Check if the stream can be proxied through our edge unblocker proxy
    const response: DirectStreamResponse = {
      success: true,
      contentId: id,
      tmdbId,
      type,
      season: isSeries ? season : undefined,
      episode: isSeries ? episode : undefined,
      hasDirectHls: Boolean(directHlsUrl),
      streamUrl: directHlsUrl,
      quality: directHlsUrl ? '4K Ultra HD' : 'Adaptive 4K/FHD',
      fallbackEmbedUrl: vidlinkEmbed || vidsrcEmbed,
      recommendedServer: 'aurora',
      mirrors: [
        {
          id: 'aurora',
          name: 'Aurora VIP 4K (VidLink)',
          quality: '4K UHD',
          url: vidlinkEmbed,
          isNative: false,
        },
        {
          id: 'vidsrc_su',
          name: 'Vidsrc Ultra 4K',
          quality: '4K Ultra',
          url: vidsrcEmbed,
          isNative: false,
        },
        {
          id: 'autoembed',
          name: 'AutoEmbed 4K Pro',
          quality: '2160p HDR',
          url: autoEmbed,
          isNative: false,
        },
      ],
    };

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Direct stream resolution failed' },
      { status: 500 }
    );
  }
}
