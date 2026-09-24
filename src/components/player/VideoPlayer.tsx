'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  ExternalLink
} from 'lucide-react';
import { ContentItem, Episode, VideoQuality } from '@/types';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/profile-context';
import { canWatchContent, getMaxQuality, hasAds } from '@/lib/entitlements';
import { catalogService } from '@/lib/catalog-service';
import Link from 'next/link';

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
  const { user } = useAuth();
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

  // Multi-Server Selection State
  // 'vidsrc': Server 1 (Full Stream Mirror)
  // 'autoembed': Server 2 (Cloud Mirror)
  // 'hls': Server 3 (Direct HLS Cloud CDN)
  // 'trailer': Server 4 (Official 4K Trailer)
  const defaultServer = content.tmdbId ? 'vidsrc' : 'hls';
  const [selectedServer, setSelectedServer] = useState<'vidsrc' | 'autoembed' | 'hls' | 'trailer'>(defaultServer);

  // Compute Embed URLs based on TMDB ID
  const seasonNum = episode?.seasonNumber || 1;
  const episodeNum = episode?.episodeNumber || 1;
  const isSeries = content.type === 'series' || content.type === 'anime' || !!content.seasons?.length;

  const vidsrcUrl = isSeries
    ? `https://vidsrc.cc/v2/embed/tv/${content.tmdbId}/${seasonNum}/${episodeNum}`
    : `https://vidsrc.cc/v2/embed/movie/${content.tmdbId}`;

  const autoembedUrl = isSeries
    ? `https://autoembed.to/tv/tmdb/${content.tmdbId}/${seasonNum}/${episodeNum}`
    : `https://autoembed.to/movie/tmdb/${content.tmdbId}`;

  const activeEmbedUrl = selectedServer === 'vidsrc'
    ? vidsrcUrl
    : selectedServer === 'autoembed'
    ? autoembedUrl
    : selectedServer === 'trailer'
    ? (content.trailerUrl || '')
    : '';

  const handleServerChange = (newServer: 'vidsrc' | 'autoembed' | 'hls' | 'trailer') => {
    if (newServer !== 'hls' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setSelectedServer(newServer);
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
            <Link
              href="/upgrade"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" /> Upgrade to Cinemix Pro
            </Link>
          )}
        </div>
      </div>
    );
  }

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
            <iframe
              src={activeEmbedUrl}
              className="w-full h-full border-0 absolute inset-0 z-10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={content.title}
            />
          ) : (
            <div className="text-center p-6 text-gray-400 z-20 max-w-sm">
              <p className="text-sm font-medium mb-3">No stream source found on this server mirror.</p>
              <button
                onClick={() => handleServerChange('hls')}
                className="px-4 py-2 bg-cinemix-primary text-white rounded-xl text-xs font-bold hover:bg-cinemix-hover transition-colors shadow-lg"
              >
                Switch to Server 3 (Direct HLS Cloud)
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
                  <Link
                    href="/upgrade"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:scale-105 transition-transform"
                  >
                    <Sparkles className="w-4 h-4" /> Go Ad-Free for ₱349/mo
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

      {/* Floating Top Header Bar (Accessible in all server modes) */}
      <div 
        className={`absolute top-0 inset-x-0 z-40 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-opacity duration-300 pointer-events-none ${
          showControls || selectedServer !== 'hls' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
          <button
            onClick={() => onBack ? onBack() : router.back()}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-colors border border-white/10"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-white text-sm sm:text-base drop-shadow">
              {content.title}
            </h2>
            {episode && (
              <p className="text-xs text-gray-300 drop-shadow">
                S{episode.seasonNumber} E{episode.episodeNumber}: {episode.title}
              </p>
            )}
          </div>
        </div>

        {/* Server Switcher Navigation */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-black/80 backdrop-blur-md rounded-xl p-1 border border-white/15 pointer-events-auto shadow-2xl">
          {content.tmdbId && (
            <>
              <button
                onClick={() => handleServerChange('vidsrc')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedServer === 'vidsrc'
                    ? 'bg-cinemix-primary text-white shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="Server 1: Full-Length Stream (VidSrc)"
              >
                Server 1 (Full Stream)
              </button>
              <button
                onClick={() => handleServerChange('autoembed')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedServer === 'autoembed'
                    ? 'bg-cinemix-primary text-white shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="Server 2: High-speed backup mirror (AutoEmbed)"
              >
                Server 2 (Mirror)
              </button>
            </>
          )}
          <button
            onClick={() => handleServerChange('hls')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedServer === 'hls'
                ? 'bg-cinemix-primary text-white shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
            title="Server 3: Fast Direct HLS Cloud CDN"
          >
            Server 3 (HLS Cloud)
          </button>
          {content.trailerUrl && (
            <button
              onClick={() => handleServerChange('trailer')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedServer === 'trailer'
                  ? 'bg-cinemix-primary text-white shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
              title="Server 4: Official 4K Trailer"
            >
              Trailer
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {nextEpisode && onNextEpisode && (
            <button
              onClick={onNextEpisode}
              className="px-3 py-1.5 rounded-lg bg-surface-200/80 hover:bg-surface-200 text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title={`Next Episode: ${nextEpisode.title}`}
            >
              Next <SkipForward className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-surface-200/80 text-white border border-white/10">
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
    </div>
  );
};
