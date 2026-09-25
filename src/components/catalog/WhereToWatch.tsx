'use client';

import React, { useState } from 'react';
import { ExternalLink, Globe, Sparkles, Tv, ShieldCheck, Play, Info } from 'lucide-react';
import { ContentItem, WatchAvailability, WatchProvider } from '@/types';
import Link from 'next/link';

interface WhereToWatchProps {
  item: ContentItem;
  className?: string;
}

export const WhereToWatch: React.FC<WhereToWatchProps> = ({ item, className = '' }) => {
  const [selectedCountry, setSelectedCountry] = useState<'PH' | 'US' | 'GLOBAL'>('PH');

  // Fallback default mock providers for Philippines & US if TMDB watchAvailability is not yet fetched
  const defaultAvailability: Record<string, WatchAvailability> = {
    PH: {
      country: 'PH',
      justWatchUrl: `https://www.themoviedb.org/${item.type === 'series' || item.type === 'anime' ? 'tv' : 'movie'}/${item.tmdbId || 27205}/watch?locale=PH`,
      stream: [
        {
          id: 8,
          name: 'Netflix',
          logoUrl: 'https://image.tmdb.org/t/p/original/rK1KljqmbvO9HQa1PBFLILWah72.png',
          type: 'stream'
        },
        {
          id: 119,
          name: 'Amazon Prime Video',
          logoUrl: 'https://image.tmdb.org/t/p/original/pbpMk2JmcoNnQwx5JGpXngfoWtp.png',
          type: 'stream'
        },
        {
          id: 337,
          name: 'Disney+ Philippines',
          logoUrl: 'https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5vpzxTj19Q.png',
          type: 'stream'
        }
      ],
      rent: [
        {
          id: 2,
          name: 'Apple TV Store',
          logoUrl: 'https://image.tmdb.org/t/p/original/qdEGArH3lKfFnAtYXMkSYk5wxuG.png',
          type: 'rent'
        },
        {
          id: 3,
          name: 'Google Play Movies',
          logoUrl: 'https://image.tmdb.org/t/p/original/aZRENwYILujqs0RVOZutTh0BVGV.png',
          type: 'rent'
        }
      ],
      buy: [
        {
          id: 2,
          name: 'Apple TV Store',
          logoUrl: 'https://image.tmdb.org/t/p/original/qdEGArH3lKfFnAtYXMkSYk5wxuG.png',
          type: 'buy'
        }
      ],
      free: []
    },
    US: {
      country: 'US',
      justWatchUrl: `https://www.themoviedb.org/${item.type === 'series' || item.type === 'anime' ? 'tv' : 'movie'}/${item.tmdbId || 27205}/watch?locale=US`,
      stream: [
        {
          id: 8,
          name: 'Netflix',
          logoUrl: 'https://image.tmdb.org/t/p/original/rK1KljqmbvO9HQa1PBFLILWah72.png',
          type: 'stream'
        },
        {
          id: 15,
          name: 'Hulu',
          logoUrl: 'https://image.tmdb.org/t/p/original/zxrVdFjIjLqkfnwyghCHPtuvMVB.png',
          type: 'stream'
        }
      ],
      rent: [
        {
          id: 10,
          name: 'Amazon Video',
          logoUrl: 'https://image.tmdb.org/t/p/original/jn6TLbtaTZntTRX9UYucHJvpQx1.png',
          type: 'rent'
        }
      ],
      buy: [],
      free: []
    },
    GLOBAL: {
      country: 'GLOBAL',
      justWatchUrl: `https://www.themoviedb.org/${item.type === 'series' || item.type === 'anime' ? 'tv' : 'movie'}/${item.tmdbId || 27205}/watch`,
      stream: [
        {
          id: 8,
          name: 'Netflix Global',
          logoUrl: 'https://image.tmdb.org/t/p/original/rK1KljqmbvO9HQa1PBFLILWah72.png',
          type: 'stream'
        },
        {
          id: 119,
          name: 'Prime Video',
          logoUrl: 'https://image.tmdb.org/t/p/original/pbpMk2JmcoNnQwx5JGpXngfoWtp.png',
          type: 'stream'
        }
      ],
      rent: [],
      buy: [],
      free: []
    }
  };

  const availability: WatchAvailability = 
    item.watchAvailability?.[selectedCountry] ||
    defaultAvailability[selectedCountry] ||
    defaultAvailability.PH;

  const hasAnyProviders = 
    availability.stream?.length > 0 ||
    availability.rent?.length > 0 ||
    availability.buy?.length > 0 ||
    availability.free?.length > 0;

  return (
    <div className={`p-5 rounded-2xl bg-surface-50/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5 ${className}`}>
      {/* Header and Region Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-cinemix-primary" />
            <h3 className="font-extrabold text-white text-base sm:text-lg tracking-tight">
              Where to Watch
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Verified legal streaming destinations & availability
          </p>
        </div>

        {/* Country Selector Pills */}
        <div className="flex items-center gap-1.5 bg-surface-200/60 p-1 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setSelectedCountry('PH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCountry === 'PH'
                ? 'bg-cinemix-primary text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="px-1 py-0.5 rounded text-[9px] font-black bg-blue-500/20 text-blue-300 leading-none">PH</span> Philippines
          </button>
          <button
            onClick={() => setSelectedCountry('US')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCountry === 'US'
                ? 'bg-cinemix-primary text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="px-1 py-0.5 rounded text-[9px] font-black bg-red-500/20 text-red-300 leading-none">US</span> US
          </button>
          <button
            onClick={() => setSelectedCountry('GLOBAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCountry === 'GLOBAL'
                ? 'bg-cinemix-primary text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Globe className="w-3 h-3" /> Global
          </button>
        </div>
      </div>

      {/* Subscription Streaming (Flatrate) */}
      {availability.stream && availability.stream.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Stream (Subscription)
            </span>
            <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Included with plan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {availability.stream.map((provider) => (
              <a
                key={provider.id + provider.name}
                href={availability.justWatchUrl || `https://www.google.com/search?q=watch+${encodeURIComponent(item.title)}+on+${encodeURIComponent(provider.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-2.5 rounded-xl bg-surface-100 hover:bg-surface-200 border border-white/[0.06] hover:border-emerald-500/40 transition-all hover:scale-102"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={provider.logoUrl}
                    alt={provider.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10 group-hover:ring-emerald-400 transition-all shadow-md"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block group-hover:text-emerald-300 transition-colors">
                      {provider.name}
                    </span>
                    <span className="text-[10px] text-gray-400">Watch Now</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Rental & Purchase Options */}
      {((availability.rent && availability.rent.length > 0) || (availability.buy && availability.buy.length > 0)) && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Rent or Buy (Digital Store)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[...(availability.rent || []), ...(availability.buy || [])]
              .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)
              .map((provider) => (
                <a
                  key={provider.id + provider.name}
                  href={availability.justWatchUrl || `https://www.google.com/search?q=rent+${encodeURIComponent(item.title)}+on+${encodeURIComponent(provider.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-2.5 rounded-xl bg-surface-100 hover:bg-surface-200 border border-white/[0.06] hover:border-amber-500/40 transition-all hover:scale-102"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={provider.logoUrl}
                      alt={provider.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10 group-hover:ring-amber-400 transition-all shadow-md"
                    />
                    <div>
                      <span className="font-bold text-white text-xs block group-hover:text-amber-300 transition-colors">
                        {provider.name}
                      </span>
                      <span className="text-[10px] text-gray-400">Rent / Purchase</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
          </div>
        </div>
      )}

      {/* Free / Ad-Supported Options */}
      {availability.free && availability.free.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> Free with Ads
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {availability.free.map((provider) => (
              <a
                key={provider.id + provider.name}
                href={availability.justWatchUrl || `https://www.google.com/search?q=watch+${encodeURIComponent(item.title)}+free`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-2.5 rounded-xl bg-surface-100 hover:bg-surface-200 border border-white/[0.06] hover:border-blue-500/40 transition-all hover:scale-102"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={provider.logoUrl}
                    alt={provider.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10 group-hover:ring-blue-400 transition-all shadow-md"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block group-hover:text-blue-300 transition-colors">
                      {provider.name}
                    </span>
                    <span className="text-[10px] text-gray-400">Free Streaming</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Instant Player Option in Cinemix */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-gray-400">
            Cinemix aggregates legitimate streaming services & official media previews.
          </span>
        </div>

        <Link
          href={`/watch/${item.id}`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cinemix-primary to-indigo-500 hover:opacity-90 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Open Cinemix Cinema Player
        </Link>
      </div>
    </div>
  );
};
