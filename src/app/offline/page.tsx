'use client';

import React from 'react';
import { WifiOff, RefreshCw, Film } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-surface-100 border border-white/10 flex items-center justify-center mb-6 text-gray-400">
        <WifiOff className="w-8 h-8" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
        You are currently offline
      </h1>
      <p className="text-xs sm:text-sm text-gray-400 max-w-sm mb-8 leading-relaxed">
        Cinemix requires an internet connection to stream high-definition movies and series. Please check your network and try again.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 rounded-xl bg-cinemix-primary hover:bg-cinemix-primary-hover text-black font-extrabold text-xs flex items-center gap-2 shadow-glow-primary transition-all hover:scale-105 active:scale-95"
      >
        <RefreshCw className="w-4 h-4" /> Reload Page
      </button>
    </div>
  );
}
