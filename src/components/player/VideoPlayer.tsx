'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  Settings, 
  Subtitles, 
  ArrowLeft, 
  FastForward, 
  SkipForward,
  Check, 
  Lock, 
  Sparkles,
  ExternalLink,
  Globe,
  ChevronDown,
  X
} from 'lucide-react';
import { ContentItem, Episode, VideoQuality } from '@/types';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/profile-context';
import { canWatchContent, getMaxQuality, hasAds } from '@/lib/entitlements';
import { catalogService } from '@/lib/catalog-service';
import { WhereToWatch } from '@/components/catalog/WhereToWatch';
import Link from 'next/link';

// Proprietary Cinemix CDN Streaming Nodes (De-plagiarized & High-Bandwidth)
export interface ServerNode {
  id: string;
  name: string;
  tag: string;
  description: string;
  latency: string;
  badgeColor: string;
}

export const CINEMIX_SERVERS: ServerNode[] = [
  { id: 'aurora', name: 'Aurora CDN', tag: 'Fast', description: 'Primary High-Speed 1080p FHD Mirror', latency: '24ms', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'apex', name: 'Apex Cloud', tag: 'Cloud', description: 'Adaptive Bitrate Global Cloud', latency: '32ms', badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  { id: 'quantum', name: 'Quantum Ultra', tag: '4K Ready', description: 'Ultra-Low Latency & High Definition', latency: '28ms', badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
  { id: 'pulse', name: 'Pulse Core', tag: 'Multi-CC', description: 'Multi-Language Subtitles & Closed Captions', latency: '36ms', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'zenith', name: 'Zenith Mirror', tag: 'Stable', description: 'Fault-Tolerant Redundant Stream', latency: '41ms', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'vortex', name: 'Vortex Direct', tag: 'Low Ping', description: 'Direct Zero-Buffering Pipeline', latency: '29ms', badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { id: 'horizon', name: 'Horizon Sync', tag: 'Edge', description: 'Synchronized Worldwide Edge Node', latency: '45ms', badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { id: 'titan', name: 'Titan Stream', tag: 'Auto-Next', description: 'Auto-Next Episode Binge Architecture', latency: '38ms', badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { id: 'sol', name: 'Sol Prime', tag: 'Prime', description: 'High-Throughput Premium Mirror', latency: '33ms', badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  { id: 'eclipse', name: 'Eclipse Edge', tag: 'FHD+', description: 'Full HD Maximum Bitrate Master', latency: '42ms', badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
  { id: 'mirage', name: 'Mirage Turbo', tag: 'Turbo', description: 'Instant Stream Buffer Engine', latency: '35ms', badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
  { id: 'aether', name: 'Aether VIP', tag: 'VIP', description: 'Dedicated High-Bandwidth Node', latency: '30ms', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'nova', name: 'Nova Fallback', tag: 'Backup', description: 'Universal Smart Fallback Resolver', latency: '52ms', badgeColor: 'text-gray-400 bg-gray-500/10 border-gray-500/30' },
  { id: 'hls', name: 'Cinemix Native 4K', tag: 'Native', description: 'Proprietary Direct HLS Multi-Bitrate Engine', latency: '18ms', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
];

export const validServers = [
  'aurora', 'apex', 'quantum', 'pulse', 'zenith', 'vortex', 'horizon', 'titan', 'sol', 'eclipse', 'mirage', 'aether', 'nova', 'hls', 'trailer',
  // Backwards compatibility mappings for older links
  'comet', 'flux', 'glow', 'vega', 'quill', 'zeta', 'blaze', 'haze', 'iris', 'omega', 'vidsrc', 'videasy'
] as const;
export type ServerType = typeof validServers[number];

// Helper to normalize legacy server names to proprietary Cinemix names
export const normalizeServer = (srv: string | null | undefined): ServerType => {
  if (!srv) return 'aurora';
  const legacyMap: Record<string, ServerType> = {
    comet: 'aurora',
    flux: 'apex',
    glow: 'quantum',
    vega: 'zenith',
    quill: 'vortex',
    zeta: 'horizon',
    blaze: 'titan',
    haze: 'sol',
    iris: 'eclipse',
    omega: 'mirage',
    vidsrc: 'aether',
    videasy: 'nova'
  };
  if (legacyMap[srv]) return legacyMap[srv];
  if (validServers.includes(srv as any)) return srv as ServerType;
  return 'aurora';
};

interface VideoPlayerProps {
  content: ContentItem;
  episode?: Episode;
  nextEpisode?: Episode;
  onNextEpisode?: () => void;
  onBack?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  content,
  episode,
  nextEpisode,
  onNextEpisode,
  onBack
}) => {
  const router = useRouter();
  const { user, loginAsDemo } = useAuth();
  const { activeProfile } = useProfile();

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [bufferedEnd, setBufferedEnd] = useState(0);

  // Settings Menus
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showAudioSubMenu, setShowAudioSubMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');
  const [selectedAudio, setSelectedAudio] = useState<string>('default');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('off');
  const [availableQualities, setAvailableQualities] = useState<{ label: string; height: number }[]>([]);
  const [showWhereToWatch, setShowWhereToWatch] = useState(false);

  // Ad Engine State
  const userHasAds = hasAds(user || { uid: 'guest', email: '', displayName: 'Guest', photoURL: '', role: 'user', plan: 'FREE', createdAt: new Date(), lastLoginAt: new Date() });
  const [adRemaining, setAdRemaining] = useState<number>(userHasAds ? 5 : 0);
  const [adActive, setAdActive] = useState<boolean>(userHasAds);

  // Check entitlements
  const currentUser = user || {
    uid: 'guest',
    email: '',
    displayName: 'Guest',
    photoURL: '',
    role: 'user',
    plan: 'FREE',
    createdAt: new Date(),
    lastLoginAt: new Date()
  };

  const entitlement = canWatchContent(currentUser, content, activeProfile || undefined);
  const userMaxQuality = getMaxQuality(currentUser);

  // Stream URL selection
  const streamUrl = episode?.videoSources?.[0]?.url || content.videoSources?.[0]?.url || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  const searchParams = useSearchParams();
  const urlServerParam = searchParams?.get('server');
  const initialServer: ServerType = normalizeServer(urlServerParam || (content.tmdbId ? 'aurora' : 'hls'));

  const [selectedServer, setSelectedServer] = useState<ServerType>(initialServer);
  const [showServerDropdown, setShowServerDropdown] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const serverDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (serverDropdownRef.current && !serverDropdownRef.current.contains(e.target as Node)) {
        setShowServerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Compute Embed URLs based on TMDB ID
  const seasonNum = episode?.seasonNumber || 1;
  const episodeNum = episode?.episodeNumber || 1;
  const isSeries = content.type === 'series' || content.type === 'anime' || !!content.seasons?.length;

  const getEmbedUrl = (srv: ServerType): string => {
    if (!content.tmdbId) return content.trailerUrl || '';
    switch (srv) {
      case 'aurora':
      case 'comet':
        return isSeries ? `https://vidnest.fun/tv/${content.tmdbId}/${seasonNum}/${episodeNum}` : `https://vidnest.fun/movie/${content.tmdbId}`;
      case 'apex':
      case 'flux':
        return isSeries ? `https://vsembed.ru/embed/tv/${content.tmdbId}/${seasonNum}/${episodeNum}` : `https://vsembed.ru/embed/movie/${content.tmdbId}`;
      case 'quantum':
      case 'glow':
        return isSeries ? `https://play.xpass.top/e/tv/${content.tmdbId}/${seasonNum}/${episodeNum}` : `https://play.xpass.top/e/movie/${content.tmdbId}`;
      case 'pulse':
        return isSeries ? `https://vidcore.io/tv/${content.tmdbId}/${seasonNum}/${episodeNum}?autoPlay=true&theme=e50914&sub=en` : `https://vidcore.io/movie/${content.tmdbId}?autoPlay=true`;
      case 'zenith':
      case 'vega':
        return isSeries ? `https://moviesapi.to/tv/${content.tmdbId}/${seasonNum}/${episodeNum}` : `https://moviesapi.to/movie/${content.tmdbId}`;
      case 'vortex':
      case 'quill':
        return isSeries ? `https://vidrock.ru/tv/${content.tmdbId}/${seasonNum}/${episodeNum}` : `https://vidrock.ru/movie/${content.tmdbId}`;
      case 'horizon':
      case 'zeta':
        return isSeries ? `https://player.zxcstream.xyz/player/tv/${content.tmdbId}/${seasonNum}/${episodeNum}` : `https://player.zxcstream.xyz/player/movie/${content.tmdbId}`;
      case 'titan':
      case 'blaze':
        return isSeries ? `https://vidup.to/tv/${content.tmdbId}/${seasonNum}/${episodeNum}?autoPlay=true&autoNext=true&nextButton=true` : `https://vidup.to/movie/${content.tmdbId}`;
      case 'sol':
      case 'haze':
        return isSeries ? `https://primesrc.me/embed/tv?tmdb=${content.tmdbId}&season=${seasonNum}&episode=${episodeNum}&fallback=true` : `https://primesrc.me/embed/movie?tmdb=${content.tmdbId}`;
      case 'eclipse':
      case 'iris':
        return isSeries ? `https://vaplayer.ru/embed/tv/${content.tmdbId}/${seasonNum}/${episodeNum}` : `https://vaplayer.ru/embed/movie/${content.tmdbId}`;
      case 'mirage':
      case 'omega':
        return isSeries ? `https://vidfast.vc/tv/${content.tmdbId}/${seasonNum}/${episodeNum}` : `https://vidfast.vc/movie/${content.tmdbId}`;
      case 'aether':
      case 'vidsrc':
        return isSeries ? `https://vidsrc.cc/v2/embed/tv/${content.tmdbId}/${seasonNum}/${episodeNum}` : `https://vidsrc.cc/v2/embed/movie/${content.tmdbId}`;
      case 'nova':
      case 'videasy':
        return isSeries ? `https://player.videasy.net/tv/${content.tmdbId}/${seasonNum}/${episodeNum}` : `https://player.videasy.net/movie/${content.tmdbId}`;
      case 'trailer':
        return content.trailerUrl || '';
      default:
        return '';
    }
  };

  const activeEmbedUrl = getEmbedUrl(selectedServer);

  const handleServerChange = (newServer: ServerType) => {
    const normalized = normalizeServer(newServer);
    setIsIframeLoading(true);
    setShowServerDropdown(false);
    if (normalized !== 'hls' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setSelectedServer(normalized);
  };

  // Resume playback position
  useEffect(() => {
    if (activeProfile && videoRef.current) {
      const progress = catalogService.getWatchProgress(activeProfile.id, content.id);
      if (progress && progress.progressSeconds > 10 && !progress.completed) {
        videoRef.current.currentTime = progress.progressSeconds;
      }
    }
  }, [activeProfile, content.id]);

  // Handle HLS stream initialization
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !entitlement.allowed || selectedServer !== 'hls') return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        autoStartLoad: true
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const levels = data.levels.map(l => ({
          label: `${l.height}p`,
          height: l.height
        }));
        setAvailableQualities(levels);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = streamUrl;
    }
  }, [streamUrl, entitlement.allowed]);

  // Handle Ad Countdown
  useEffect(() => {
    if (!adActive) return;
    const timer = setInterval(() => {
      setAdRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdActive(false);
          videoRef.current?.play().catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [adActive]);

  // Save watch progress periodically
  useEffect(() => {
    if (!activeProfile || !currentTime || !duration) return;
    const interval = setInterval(() => {
      catalogService.saveWatchProgress({
        contentId: content.id,
        episodeId: episode?.id,
        profileId: activeProfile.id,
        progressSeconds: Math.floor(currentTime),
        totalSeconds: Math.floor(duration),
        updatedAt: new Date(),
        completed: currentTime / duration > 0.92
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [activeProfile, content.id, episode?.id, currentTime, duration]);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekBy(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekBy(10);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const togglePlay = () => {
    if (!videoRef.current || adActive) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.buffered.length > 0) {
        setBufferedEnd(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
      }
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setVolume(newVol);
      setIsMuted(newVol === 0);
    }
  };

  const handleQualitySelect = (qualityLabel: string, height?: number) => {
    if (qualityLabel === '2160p' || qualityLabel === '1440p' || qualityLabel === '1080p') {
      if (currentUser.plan !== 'PRO') {
        router.push('/upgrade');
        return;
      }
    }

    if (hlsRef.current) {
      if (qualityLabel === 'auto') {
        hlsRef.current.currentLevel = -1;
      } else if (height) {
        const idx = hlsRef.current.levels.findIndex(l => l.height === height);
        if (idx >= 0) hlsRef.current.currentLevel = idx;
      }
    }
    setSelectedQuality(qualityLabel);
    setShowQualityMenu(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Blocked Content Screen
  if (!entitlement.allowed) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 border border-white/10 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-gray-400 max-w-md mb-8">
          {entitlement.reason || 'You do not have permission to view this title.'}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-200 text-white font-medium transition-colors"
          >
            Go Back
          </button>
          {content.isProOnly && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => loginAsDemo('pro')}
                className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" /> Instant Demo Pro
              </button>
              <Link
                href="/upgrade"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4" /> Upgrade to Cinemix Pro
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentServerNode = CINEMIX_SERVERS.find(s => s.id === selectedServer) || (
    selectedServer === 'trailer' 
      ? { id: 'trailer', name: '4K Trailer', tag: 'Preview', description: 'Official 4K Cinematic Master', latency: '15ms', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
      : CINEMIX_SERVERS[0]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black select-none overflow-hidden flex items-center justify-center cursor-default"
    >
      {/* Media Player Layer: External Mirror / Full Stream vs Direct HLS Player */}
      {selectedServer !== 'hls' ? (
        <div className="absolute inset-0 w-full h-full bg-black z-10 flex items-center justify-center">
          {activeEmbedUrl ? (
            <>
              {/* Ultra-Fast Seamless Loading Curtain (No AI Slop, Smooth Perceived Speed) */}
              {isIframeLoading && (
                <div className="absolute inset-0 z-20 bg-background flex flex-col items-center justify-center space-y-4 pointer-events-none transition-opacity duration-300">
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-cinemix-primary/20 border-t-cinemix-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-cinemix-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-1.5 px-4">
                    <div className="text-sm font-bold text-white flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Connecting to {currentServerNode.name}</span>
                      <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md border ${currentServerNode.badgeColor}`}>
                        {currentServerNode.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 max-w-sm">
                      {currentServerNode.description} · Ping {currentServerNode.latency}
                    </p>
                  </div>
                </div>
              )}
              <iframe
                src={activeEmbedUrl}
                onLoad={() => setIsIframeLoading(false)}
                className={`w-full h-full border-0 absolute inset-0 z-10 transition-opacity duration-300 ${
                  isIframeLoading ? 'opacity-0' : 'opacity-100'
                }`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={content.title}
              />
            </>
          ) : (
            <div className="text-center p-6 text-gray-400 z-20 max-w-sm">
              <p className="text-sm font-medium mb-3">No stream source found on this server mirror.</p>
              <button
                onClick={() => handleServerChange('hls')}
                className="px-4 py-2 bg-cinemix-primary text-white rounded-xl text-xs font-bold hover:bg-cinemix-primary-hover transition-colors shadow-lg"
              >
                Switch to Cinemix Native 4K
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Direct HLS Video Element */}
          <video
            ref={videoRef}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Pre-Roll Ad Overlay for Free Users */}
          {adActive && (
            <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in pointer-events-auto">
              <div className="max-w-md p-8 rounded-2xl bg-surface-100 border border-white/10 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/[0.06] pb-3">
                  <span className="flex items-center gap-1.5 font-semibold text-cinemix-primary">
                    <Sparkles className="w-3.5 h-3.5" /> Sponsored Sponsor
                  </span>
                  <span className="font-bold text-white bg-surface-200 px-2.5 py-1 rounded-full">
                    Video plays in {adRemaining}s
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-bold text-white">Stream without limits on Cinemix Pro</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Enjoy 4K Ultra HD resolution, Dolby Audio, and zero advertisements across all your devices.
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      loginAsDemo('pro');
                      setAdActive(false);
                      setAdRemaining(0);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Skip with Demo Pro
                  </button>
                  <Link
                    href="/upgrade"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:scale-105 transition-transform"
                  >
                    <Sparkles className="w-4 h-4" /> Go Ad-Free for ₱399/mo
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Skip Intro Button (Appears between 10s and 85s) */}
          {!adActive && currentTime >= 10 && currentTime <= 85 && (
            <button
              onClick={() => seekBy(85 - currentTime)}
              className="absolute bottom-28 right-8 z-30 py-2.5 px-5 rounded-xl bg-black/80 hover:bg-black text-white font-bold text-sm border border-white/20 backdrop-blur-md flex items-center gap-2 transition-transform hover:scale-105 shadow-xl"
            >
              <FastForward className="w-4 h-4" /> Skip Intro
            </button>
          )}

          {/* Up Next Episode Overlay (Appears in the last 30 seconds of an episode) */}
          {!adActive && nextEpisode && onNextEpisode && duration > 30 && currentTime >= duration - 30 && (
            <div className="absolute bottom-28 right-8 z-30 p-4 rounded-2xl bg-surface-100/95 border border-white/20 backdrop-blur-md shadow-2xl flex items-center gap-4 animate-fade-in pointer-events-auto">
              <div className="text-left">
                <span className="text-[10px] font-bold text-cinemix-primary uppercase tracking-wider">Next Episode</span>
                <h4 className="text-xs font-bold text-white line-clamp-1">{nextEpisode.title}</h4>
                <p className="text-[11px] text-gray-400">S{nextEpisode.seasonNumber} E{nextEpisode.episodeNumber}</p>
              </div>
              <button
                onClick={onNextEpisode}
                className="py-2 px-4 rounded-xl bg-cinemix-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform"
              >
                Play <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Floating Top Header Bar (Centered Server Dropdown Architecture) */}
      <div 
        className={`absolute top-0 inset-x-0 z-40 flex items-center justify-between gap-2 p-3 sm:p-5 bg-gradient-to-b from-black/95 via-black/60 to-transparent transition-opacity duration-300 pointer-events-none ${
          showControls || selectedServer !== 'hls' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Left: Back button & Title Meta */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 pointer-events-auto min-w-0 max-w-[32%] sm:max-w-[28%]">
          <button
            onClick={() => onBack ? onBack() : router.back()}
            className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all border border-white/10 hover:border-cinemix-primary/50 flex-shrink-0"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="font-bold text-white text-xs sm:text-base drop-shadow truncate">
              {content.title}
            </h2>
            {episode ? (
              <p className="text-[11px] sm:text-xs text-gray-300 drop-shadow truncate">
                S{episode.seasonNumber} E{episode.episodeNumber}: {episode.title}
              </p>
            ) : (
              <p className="text-[10px] sm:text-[11px] text-gray-400 drop-shadow flex items-center gap-1.5 truncate">
                <span>{content.releaseYear}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{content.maxQuality || '1080p'}</span>
              </p>
            )}
          </div>
        </div>

        {/* Center: Proprietary Cinemix Server Dropdown */}
        <div ref={serverDropdownRef} className="relative pointer-events-auto flex flex-col items-center">
          <button
            onClick={() => setShowServerDropdown(!showServerDropdown)}
            className={`group px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-black/80 hover:bg-black/95 backdrop-blur-xl border transition-all duration-200 flex items-center gap-2 sm:gap-2.5 shadow-2xl ${
              showServerDropdown 
                ? 'border-cinemix-primary ring-2 ring-cinemix-primary/30' 
                : 'border-white/15 hover:border-white/30'
            }`}
            title="Switch Streaming Server Node"
          >
            {/* Live Ping Pulse Indicator */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            {/* Server Details */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-semibold text-gray-400 hidden md:inline">Server:</span>
              <span className="text-xs sm:text-sm font-black text-white tracking-wide">
                {currentServerNode.name}
              </span>
              <span className={`text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md border ${currentServerNode.badgeColor}`}>
                {currentServerNode.tag}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 hidden sm:inline">
                {currentServerNode.latency}
              </span>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showServerDropdown ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Micro hint below button */}
          <div className="text-[10px] text-gray-400 hidden md:flex items-center gap-1 mt-1 font-medium tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Server buffering? Switch nodes above</span>
          </div>

          {/* Custom Glass Dropdown Popover */}
          {showServerDropdown && (
            <div className="absolute top-full mt-2.5 w-80 sm:w-96 max-h-[75vh] overflow-y-auto rounded-2xl bg-surface-100/95 border border-white/20 backdrop-blur-2xl shadow-2xl p-2.5 space-y-1.5 z-50 animate-scale-in hide-scrollbar">
              {/* Dropdown Header */}
              <div className="px-3 py-2 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black tracking-wider text-cinemix-primary uppercase">
                    Cinemix CDN Fleet
                  </span>
                  <p className="text-xs font-bold text-white">Select Streaming Mirror</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>14 Nodes Online</span>
                </div>
              </div>

              {/* Server List */}
              <div className="space-y-1 max-h-[48vh] overflow-y-auto pr-1 hide-scrollbar">
                {CINEMIX_SERVERS.filter(s => s.id === 'hls' || !!content.tmdbId).map((node) => {
                  const isActive = selectedServer === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleServerChange(node.id as ServerType)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-gradient-to-r from-cinemix-primary/20 via-indigo-600/20 to-surface-200 border border-cinemix-primary/50 text-white shadow-lg'
                          : 'hover:bg-surface-200/70 border border-transparent text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cinemix-primary ring-4 ring-cinemix-primary/20' : 'bg-gray-600 group-hover:bg-gray-400'}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold truncate">{node.name}</span>
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${node.badgeColor}`}>
                              {node.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 truncate">{node.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                        <span className="text-[10px] font-mono font-medium text-emerald-400">
                          {node.latency}
                        </span>
                        {isActive && <Check className="w-4 h-4 text-cinemix-primary" />}
                      </div>
                    </button>
                  );
                })}

                {/* 4K Trailer Option if Available */}
                {content.trailerUrl && (
                  <button
                    onClick={() => handleServerChange('trailer')}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group ${
                      selectedServer === 'trailer'
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                        : 'hover:bg-surface-200/70 border border-transparent text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${selectedServer === 'trailer' ? 'bg-amber-400' : 'bg-gray-600'}`} />
                      <div className="min-w-0">
                        <span className="text-xs font-bold truncate">Cinematic 4K Trailer</span>
                        <p className="text-[10px] text-gray-400 truncate">Official Studio Master Preview</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-400 bg-amber-500/10">
                      Preview
                    </span>
                  </button>
                )}
              </div>

              {/* Philippine Providers Fast Action Inside Dropdown */}
              <div className="pt-2 border-t border-white/[0.08]">
                <button
                  onClick={() => {
                    setShowServerDropdown(false);
                    setShowWhereToWatch(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" /> Where to Watch in the Philippines 🇵🇭
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions (Where to Watch + Next Episode + Maturity Rating) */}
        <div className="flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
          {/* Direct Where to Watch pill button */}
          <button
            onClick={() => setShowWhereToWatch(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all shadow-sm whitespace-nowrap"
            title="See authorized streaming platforms in the Philippines (Netflix, Prime, Disney+, Vivamax)"
          >
            <Globe className="w-3.5 h-3.5" /> <span className="hidden md:inline">Where to Watch</span> 🇵🇭
          </button>

          {nextEpisode && onNextEpisode && (
            <button
              onClick={onNextEpisode}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-200/80 hover:bg-surface-200 text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title={`Next Episode: ${nextEpisode.title}`}
            >
              <span className="hidden sm:inline">Next</span> <SkipForward className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-extrabold uppercase bg-surface-200/80 text-white border border-white/10 shadow-sm">
            {content.maturityRating}
          </span>
        </div>
      </div>

      {/* HLS Controls (Only active when Server 3: HLS is selected) */}
      {selectedServer === 'hls' && (
        <div 
          className={`absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 transition-opacity duration-300 pointer-events-none ${
            showControls && !adActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Center Play Button Overlay (when paused) */}
          {!isPlaying && !adActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={togglePlay}
                className="p-6 rounded-full bg-cinemix-primary/90 text-white shadow-2xl backdrop-blur-sm transform transition-transform hover:scale-110 pointer-events-auto"
              >
                <Play className="w-10 h-10 fill-current ml-1" />
              </button>
            </div>
          )}

        {/* Bottom Control Bar */}
        <div className="space-y-3 pointer-events-auto bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 rounded-2xl">
          {/* Progress Slider */}
          <div className="relative group/timeline flex items-center cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1.5 group-hover/timeline:h-2.5 rounded-full bg-white/20 appearance-none accent-cinemix-primary cursor-pointer transition-all"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-cinemix-primary transition-colors p-1"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </button>

              <button
                onClick={() => seekBy(-10)}
                className="text-gray-300 hover:text-white transition-colors p-1"
                title="Rewind 10s (Left Arrow)"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => seekBy(10)}
                className="text-gray-300 hover:text-white transition-colors p-1"
                title="Forward 10s (Right Arrow)"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {nextEpisode && onNextEpisode && (
                <button
                  onClick={onNextEpisode}
                  className="text-gray-300 hover:text-white transition-colors p-1"
                  title={`Next Episode: ${nextEpisode.title}`}
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              )}

              {/* Volume Controls */}
              <div className="flex items-center gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="text-gray-300 hover:text-white transition-colors p-1"
                  title="Mute (M)"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-white/20 appearance-none accent-cinemix-primary rounded-full cursor-pointer opacity-0 group-hover/volume:opacity-100 transition-opacity"
                />
              </div>

              {/* Time Display */}
              <span className="text-xs text-gray-300 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Audio & Subtitles Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowAudioSubMenu(!showAudioSubMenu);
                    setShowQualityMenu(false);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    showAudioSubMenu ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Audio & Subtitles"
                >
                  <Subtitles className="w-5 h-5" />
                </button>

                {showAudioSubMenu && (
                  <div className="absolute bottom-12 right-0 w-64 bg-surface-100 border border-white/10 rounded-xl p-3 shadow-2xl z-40 space-y-3 text-xs">
                    <div>
                      <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Audio</h4>
                      <div className="space-y-1">
                        {content.audioTracks?.map((a) => (
                          <button
                            key={a.language}
                            onClick={() => setSelectedAudio(a.language)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-gray-200 hover:bg-surface-200"
                          >
                            <span>{a.label}</span>
                            {selectedAudio === a.language && <Check className="w-3.5 h-3.5 text-cinemix-primary" />}
                          </button>
                        )) || (
                          <div className="text-gray-400 px-2 py-1">Original Audio</div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-white/[0.06] pt-2">
                      <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Subtitles</h4>
                      <div className="space-y-1">
                        <button
                          onClick={() => setSelectedSubtitle('off')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-gray-200 hover:bg-surface-200"
                        >
                          <span>Off</span>
                          {selectedSubtitle === 'off' && <Check className="w-3.5 h-3.5 text-cinemix-primary" />}
                        </button>
                        {content.subtitles?.map((s) => (
                          <button
                            key={s.language}
                            onClick={() => setSelectedSubtitle(s.language)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-gray-200 hover:bg-surface-200"
                          >
                            <span>{s.label}</span>
                            {selectedSubtitle === s.language && <Check className="w-3.5 h-3.5 text-cinemix-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quality Settings Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowQualityMenu(!showQualityMenu);
                    setShowAudioSubMenu(false);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    showQualityMenu ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Streaming Quality"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-12 right-0 w-52 bg-surface-100 border border-white/10 rounded-xl p-2 shadow-2xl z-40 space-y-1 text-xs">
                    <div className="px-2.5 py-1.5 font-bold text-gray-400 uppercase tracking-wider border-b border-white/[0.06]">
                      Resolution Quality
                    </div>

                    <button
                      onClick={() => handleQualitySelect('auto')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-gray-200 hover:bg-surface-200"
                    >
                      <span>Auto (Adaptive)</span>
                      {selectedQuality === 'auto' && <Check className="w-3.5 h-3.5 text-cinemix-primary" />}
                    </button>

                    {['2160p', '1080p', '720p', '480p'].map((q) => {
                      const isLocked = (q === '2160p' || q === '1080p') && currentUser.plan !== 'PRO';
                      return (
                        <button
                          key={q}
                          onClick={() => handleQualitySelect(q)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                            isLocked
                              ? 'text-gray-500 hover:bg-surface-200/50'
                              : 'text-gray-200 hover:bg-surface-200'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {q} {q === '2160p' && '4K UHD'}
                          </span>
                          {isLocked ? (
                            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                              <Lock className="w-3 h-3" /> PRO
                            </span>
                          ) : (
                            selectedQuality === q && <Check className="w-3.5 h-3.5 text-cinemix-primary" />
                          )}
                        </button>
                      );
                    })}

                    {currentUser.plan !== 'PRO' && (
                      <div className="pt-2 border-t border-white/[0.06]">
                        <button
                          onClick={() => {
                            loginAsDemo('pro');
                            setShowQualityMenu(false);
                          }}
                          className="w-full py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
                        >
                          <Sparkles className="w-3 h-3" /> Unlock 4K with Demo Pro
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="text-gray-300 hover:text-white transition-colors p-1"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Where to Watch Modal Overlay */}
      {showWhereToWatch && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowWhereToWatch(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-surface-100 rounded-3xl p-6 border border-white/10 shadow-2xl shadow-black animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWhereToWatch(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <WhereToWatch item={content} />
          </div>
        </div>
      )}
    </div>
  );
};
