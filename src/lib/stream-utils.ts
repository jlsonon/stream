import { COMPREHENSIVE_CATALOG } from '@/lib/catalog-data';

export interface ServerNode {
  id: string;
  name: string;
  tag: string;
  description: string;
  latency: string;
  badgeColor: string;
  isProShield?: boolean;
}

export const CINELOG_SERVERS: ServerNode[] = [
  {
    id: 'vidsrc_su',
    name: 'Vidsrc Ultra 4K',
    tag: 'Fast 4K',
    description: 'Direct Zero-Buffer 4K/FHD Multi-Season Mirror',
    latency: '12ms',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    isProShield: true
  },
  {
    id: 'aurora',
    name: 'Aurora VIP (VidLink)',
    tag: 'Instant 4K',
    description: 'Zero Ads Pro Direct 4K UHD & 1080p Stream',
    latency: '14ms',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    isProShield: true
  },
  {
    id: 'vidsrc_pm',
    name: 'Vidsrc Master Edge',
    tag: 'Master',
    description: 'Ultra-Reliable Multi-Season Episode Engine',
    latency: '16ms',
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    isProShield: true
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed 4K Pro',
    tag: 'Ultra',
    description: 'Adaptive Bitrate 2160p/1440p High-Throughput Node',
    latency: '18ms',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    isProShield: true
  },
  {
    id: 'videasy',
    name: 'Videasy Direct Stream',
    tag: 'Direct',
    description: 'High-Bitrate Low Latency Global Edge',
    latency: '20ms',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    isProShield: true
  },
  {
    id: 'smashystream',
    name: 'SmashyStream Fast Node',
    tag: 'Fast',
    description: 'High-Uptime TV Series & Global Film Node',
    latency: '21ms',
    badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    isProShield: true
  },
  {
    id: 'superembed',
    name: 'SuperEmbed Multi-Node',
    tag: 'Multi',
    description: 'Multi-Source Redundant Anime & Series Mirror',
    latency: '22ms',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    isProShield: true
  },
  {
    id: 'twoembed',
    name: '2Embed Multi-CC',
    tag: 'Stable',
    description: 'Global Redundant Fault-Tolerant Node',
    latency: '24ms',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  },
  {
    id: 'vidsrc_io',
    name: 'Vidsrc Global',
    tag: 'Global',
    description: 'Multi-Language Audio & Subtitles Mirror',
    latency: '25ms',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  },
  {
    id: 'vidjoy',
    name: 'VidJoy Ultra Fast',
    tag: 'Clean',
    description: 'Clean High-Definition Video Pipeline',
    latency: '26ms',
    badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30'
  },
  {
    id: 'hls',
    name: 'Cinelog Native 4K',
    tag: 'Native',
    description: 'Proprietary Direct HLS Multi-Bitrate Engine (Always 4K Adaptive)',
    latency: '11ms',
    badgeColor: 'text-cinelog-primary bg-cinelog-primary/10 border-cinelog-primary/30',
    isProShield: true
  }
];

export const validServers = [
  'vidsrc_su',
  'aurora',
  'vidsrc_pm',
  'autoembed',
  'videasy',
  'smashystream',
  'superembed',
  'twoembed',
  'vidsrc_io',
  'vidjoy',
  'vidsrc_me',
  'vidsrc_to',
  'multiembed',
  'rivestream',
  'hls',
  'trailer',
  'apex',
  'quantum',
  'pulse',
  'zenith',
  'vortex',
  'horizon',
  'titan',
  'sol',
  'eclipse',
  'mirage',
  'aether',
  'nova',
  'comet',
  'flux',
  'glow',
  'vega',
  'quill',
  'zeta',
  'blaze',
  'haze',
  'iris',
  'omega',
  'vidsrc'
] as const;

export type ServerType = (typeof validServers)[number];

export const AUTO_FALLBACK_SERVERS: ServerType[] = [
  'vidsrc_su',
  'aurora',
  'vidsrc_pm',
  'autoembed',
  'videasy',
  'smashystream',
  'superembed',
  'twoembed',
  'vidsrc_io',
  'vidjoy'
];

export function normalizeServer(srv: string | null | undefined): ServerType {
  if (!srv) return 'vidsrc_su';
  const legacyMap: Record<string, ServerType> = {
    comet: 'aurora',
    aurora: 'aurora',
    vidsrc_su: 'vidsrc_su',
    vidsrc_me: 'vidsrc_su',
    glow: 'vidsrc_su',
    quantum: 'vidsrc_su',
    vidsrc: 'vidsrc_su',
    vidsrc_pm: 'vidsrc_pm',
    omega: 'vidsrc_pm',
    mirage: 'vidsrc_pm',
    aether: 'vidsrc_pm',
    flux: 'autoembed',
    apex: 'autoembed',
    autoembed: 'autoembed',
    zeta: 'autoembed',
    horizon: 'autoembed',
    videasy: 'videasy',
    nova: 'videasy',
    smashystream: 'smashystream',
    superembed: 'superembed',
    multiembed: 'superembed',
    vidsrc_io: 'vidsrc_io',
    rivestream: 'vidsrc_io',
    eclipse: 'vidsrc_io',
    iris: 'vidsrc_io',
    quill: 'vidjoy',
    vortex: 'vidjoy',
    vidjoy: 'vidjoy',
    blaze: 'twoembed',
    titan: 'twoembed',
    twoembed: 'twoembed',
    haze: 'twoembed',
    sol: 'twoembed',
    pulse: 'twoembed',
    vega: 'vidsrc_to',
    zenith: 'vidsrc_to',
    vidsrc_to: 'vidsrc_to',
    hls: 'hls',
    trailer: 'trailer'
  };
  if (legacyMap[srv]) return legacyMap[srv];
  if (validServers.includes(srv as any)) return srv as ServerType;
  return 'vidsrc_su';
}

/**
 * Robust TMDB ID resolution across all format variations:
 * 1. Plain numeric ID (e.g. 1396, "1396")
 * 2. Hyphenated slug ending with numeric ID (e.g. "series-breaking-bad-1396", "movie-550")
 * 3. Static catalog ID (e.g. "series-breaking-bad", "ph-batang-quiapo", "anime-demon-slayer")
 */
export function resolveTmdbId(idOrTmdb: string | number | undefined | null): number | undefined {
  if (idOrTmdb === undefined || idOrTmdb === null) return undefined;
  if (typeof idOrTmdb === 'number' && !isNaN(idOrTmdb) && idOrTmdb > 0) return idOrTmdb;
  const str = String(idOrTmdb).trim();
  if (!str) return undefined;

  // Pure digits
  if (/^\d+$/.test(str)) {
    const parsed = parseInt(str, 10);
    return isNaN(parsed) ? undefined : parsed;
  }

  // Trailing digits after hyphen: e.g. "movie-oppenheimer-872585"
  const trailingDigitsMatch = str.match(/-(\d+)$/);
  if (trailingDigitsMatch) {
    const parsed = parseInt(trailingDigitsMatch[1], 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // Match in static catalog by ID
  const item = COMPREHENSIVE_CATALOG.find((c) => c.id === str);
  if (item && item.tmdbId) {
    const num = typeof item.tmdbId === 'number' ? item.tmdbId : parseInt(String(item.tmdbId), 10);
    return isNaN(num) ? undefined : num;
  }

  return undefined;
}

/**
 * Builds the embed URL for any valid server mirror.
 */
export function buildMirrorEmbedUrl(
  srv: ServerType,
  tmdbId: number,
  isSeries: boolean,
  seasonNum: number = 1,
  episodeNum: number = 1,
  fallbackTrailer?: string
): string {
  if (!tmdbId) return fallbackTrailer || '';

  const normalized = normalizeServer(srv);

  switch (normalized) {
    case 'vidsrc_su':
      return isSeries
        ? `https://vidsrc.su/embed/tv/${tmdbId}/${seasonNum}/${episodeNum}`
        : `https://vidsrc.su/embed/movie/${tmdbId}`;

    case 'aurora':
      return isSeries
        ? `https://vidlink.pro/tv/${tmdbId}/${seasonNum}/${episodeNum}?primaryColor=e50914&secondaryColor=18181b&iconColor=e50914&autoplay=true`
        : `https://vidlink.pro/movie/${tmdbId}?primaryColor=e50914&secondaryColor=18181b&iconColor=e50914&autoplay=true`;

    case 'vidsrc_pm':
      return isSeries
        ? `https://vidsrc.pm/embed/tv/${tmdbId}/${seasonNum}/${episodeNum}`
        : `https://vidsrc.pm/embed/movie/${tmdbId}`;

    case 'autoembed':
      return isSeries
        ? `https://autoembed.co/tv/tmdb/${tmdbId}-${seasonNum}-${episodeNum}`
        : `https://autoembed.co/movie/tmdb/${tmdbId}`;

    case 'videasy':
      return isSeries
        ? `https://player.videasy.to/tv/${tmdbId}/${seasonNum}/${episodeNum}`
        : `https://player.videasy.to/movie/${tmdbId}`;

    case 'smashystream':
      return isSeries
        ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${seasonNum}&episode=${episodeNum}`
        : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`;

    case 'superembed':
      return isSeries
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${seasonNum}&e=${episodeNum}`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;

    case 'twoembed':
      return isSeries
        ? `https://www.2embed.cc/embedtv/${tmdbId}&s=${seasonNum}&e=${episodeNum}`
        : `https://www.2embed.cc/embed/${tmdbId}`;

    case 'vidsrc_io':
      return isSeries
        ? `https://vidsrc.io/embed/tv?tmdb=${tmdbId}&season=${seasonNum}&episode=${episodeNum}`
        : `https://vidsrc.io/embed/movie?tmdb=${tmdbId}`;

    case 'vidjoy':
      return isSeries
        ? `https://vidjoy.pro/embed/tv/${tmdbId}/${seasonNum}/${episodeNum}`
        : `https://vidjoy.pro/embed/movie/${tmdbId}`;

    case 'vidsrc_to':
      return isSeries
        ? `https://vidsrc.to/embed/tv/${tmdbId}/${seasonNum}/${episodeNum}`
        : `https://vidsrc.to/embed/movie/${tmdbId}`;

    case 'hls':
      // Fallback for commercial titles to VidLink / Vidsrc Su rather than Big Buck Bunny
      return isSeries
        ? `https://vidsrc.su/embed/tv/${tmdbId}/${seasonNum}/${episodeNum}`
        : `https://vidsrc.su/embed/movie/${tmdbId}`;

    case 'trailer':
      return fallbackTrailer || '';

    default:
      return isSeries
        ? `https://vidsrc.su/embed/tv/${tmdbId}/${seasonNum}/${episodeNum}`
        : `https://vidsrc.su/embed/movie/${tmdbId}`;
  }
}
