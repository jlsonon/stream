'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search as SearchIcon, 
  X, 
  Film, 
  Sparkles, 
  Globe, 
  Play, 
  Loader2, 
  Star, 
  Tv,
  Info,
  Check,
  Bot,
  Zap
} from 'lucide-react';
import { ContentItem } from '@/types';
import { catalogService } from '@/lib/catalog-service';
import { useProfile } from '@/lib/profile-context';
import { useToast } from '@/components/ui/Toast';
import { ContentCard } from '@/components/catalog/ContentCard';
import { TitleDetailsModal } from '@/components/catalog/TitleDetailsModal';
import { COMPREHENSIVE_CATALOG } from '@/lib/catalog-data';

const PLATFORM_TAGS = [
  'Netflix',
  'HBO Max',
  'Disney+',
  'Apple TV+',
  'Prime Video',
  'Paramount+',
  'Crunchyroll',
  'Philippine TV'
];

const POPULAR_SEARCHES = [
  'Breaking Bad', 
  'Stranger Things',
  'House of the Dragon',
  'The Boys',
  'The Last of Us',
  'Severance',
  'Attack on Titan', 
  'Demon Slayer',
  'Solo Leveling',
  'Batang Quiapo', 
  'Oppenheimer', 
  'Squid Game', 
  'Fallout',
  'Shogun',
  'Dune', 
  'Interstellar'
];

const AI_PROMPTS = [
  { label: 'Mind-bending Sci-Fi like Inception', prompt: 'mind-bending sci-fi thriller like inception with time and space twists' },
  { label: 'Dark Psychological Anime', prompt: 'dark psychological anime thrillers with high suspense' },
  { label: 'Masterpiece Philippine Cinema', prompt: 'critically acclaimed philippine cinema drama and romance' },
  { label: 'High-Stakes Crime Drama', prompt: 'high-stakes crime drama series like breaking bad' },
  { label: 'Zombie Survival Masterpieces', prompt: 'intense horror zombie survival movies and series' },
  { label: 'Heartwarming Fantasy & Adventure', prompt: 'heartwarming animated fantasy and adventure movies' },
];

interface TmdbSearchResult {
  id: number;
  title: string;
  originalTitle?: string;
  type: 'movie' | 'series';
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  score: number;
  popularity: number;
}

export default function SearchPage() {
  const router = useRouter();
  const { isKidsMode } = useProfile();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'standard' | 'ai'>('standard');
  const [allContent, setAllContent] = useState<ContentItem[]>(() => COMPREHENSIVE_CATALOG);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // TMDB Global Live Search State
  const [tmdbResults, setTmdbResults] = useState<TmdbSearchResult[]>([]);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'local' | 'global'>('all');

  // AI Semantic Search State
  const [aiResults, setAiResults] = useState<ContentItem[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [aiThemeTags, setAiThemeTags] = useState<string[]>([]);
  const [isSearchingAi, setIsSearchingAi] = useState(false);

  useEffect(() => {
    async function load() {
      const items = await catalogService.getAllContent();
      setAllContent(items);
    }
    load();
  }, []);

  // Filter local catalog items
  const localResults = useMemo(() => {
    if (!query.trim() || searchMode === 'ai') return [];

    const q = query.toLowerCase().trim();

    return allContent.filter((item) => {
      if (isKidsMode && (item.maturityRating === 'R' || item.maturityRating === 'NC-17')) {
        return false;
      }

      const matchTitle = item.title.toLowerCase().includes(q) || (item.originalTitle?.toLowerCase().includes(q) ?? false);
      const matchGenre = item.genres.some(g => g.toLowerCase().includes(q));
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      const matchCast = item.cast?.some(c => c.name.toLowerCase().includes(q)) ?? false;
      const matchDirector = item.directors?.some(d => d.toLowerCase().includes(q)) ?? false;
      const matchType = item.type.toLowerCase().includes(q);

      return matchTitle || matchGenre || matchTags || matchCast || matchDirector || matchType;
    });
  }, [allContent, query, isKidsMode, searchMode]);

  // Debounced TMDB Live Search across all world movies & TV shows
  useEffect(() => {
    if (searchMode === 'ai') return;
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setTmdbResults([]);
      setIsSearchingTmdb(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingTmdb(true);
      try {
        const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setTmdbResults(data.results || []);
        }
      } catch (err) {
        console.error('TMDB Live Search error:', err);
      } finally {
        setIsSearchingTmdb(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, searchMode]);

  // Trigger AI Semantic Search
  const handleAiSearch = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setSearchMode('ai');
    setIsSearchingAi(true);

    try {
      const res = await fetch(`/api/ai/search?prompt=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        setAiResults(data.results || []);
        setAiExplanation(data.explanation || '');
        setAiThemeTags(data.interpretation?.themeTags || []);
      } else {
        toast({
          type: 'error',
          message: 'Cinemix AI was unable to complete semantic interpretation.'
        });
      }
    } catch (err: any) {
      console.error('AI search error:', err);
      toast({
        type: 'error',
        message: err.message || 'AI Search request failed'
      });
    } finally {
      setIsSearchingAi(false);
    }
  };

  // Handler to stream or view any title directly from TMDB
  const handleTmdbAction = async (item: TmdbSearchResult, action: 'play' | 'details' = 'play') => {
    const existing = allContent.find(c => c.tmdbId === item.id);
    if (existing) {
      if (action === 'play') {
        router.push(`/watch/${existing.id}`);
      } else {
        setSelectedItem(existing);
      }
      return;
    }

    setImportingId(item.id);
    try {
      const res = await fetch(`/api/tmdb/details?id=${item.id}&type=${item.type}`);
      if (!res.ok) throw new Error('Could not load title data from TMDB');
      const data = await res.json();
      
      if (data.item) {
        await catalogService.saveContent(data.item);
        setAllContent(prev => [data.item, ...prev.filter(x => x.id !== data.item.id)]);
        toast({
          type: 'success',
          message: `Ready to stream "${data.item.title}"!`,
          duration: 3000
        });

        if (action === 'play') {
          router.push(`/watch/${data.item.id}`);
        } else {
          setSelectedItem(data.item);
        }
      }
    } catch (err: any) {
      toast({
        type: 'error',
        message: err.message || 'Failed to prepare video stream',
        duration: 4000
      });
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-18 sm:pt-28 pb-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-x-hidden">
      {/* Mode Selector Pill Bar */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 w-full max-w-md mx-auto">
        <button
          onClick={() => {
            setSearchMode('standard');
            setAiResults([]);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            searchMode === 'standard'
              ? 'bg-cinemix-primary text-black shadow-glow-primary'
              : 'bg-surface-100 hover:bg-surface-200 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <SearchIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Standard Search</span>
        </button>
        <button
          onClick={() => setSearchMode('ai')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            searchMode === 'ai'
              ? 'bg-surface-200 text-cinemix-primary border border-cinemix-primary/50 shadow-glow-primary'
              : 'bg-surface-100 hover:bg-surface-200 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <Bot className="w-4 h-4 text-cinemix-primary flex-shrink-0" />
          <span>Cinemix AI</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-3xl mx-auto mb-6 sm:mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchMode === 'ai') {
              handleAiSearch(query);
            }
          }}
          className="relative flex items-center"
        >
          {searchMode === 'ai' ? (
            <Bot className="absolute left-3.5 sm:left-5 w-5 h-5 sm:w-6 sm:h-6 text-purple-400 pointer-events-none" />
          ) : (
            <SearchIcon className="absolute left-3.5 sm:left-5 w-5 h-5 sm:w-6 sm:h-6 text-gray-400 pointer-events-none" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === 'ai'
                ? "Ask Cinemix AI (e.g. 'mind-bending sci-fi', 'dark thriller')..."
                : "Search any movie, anime, series, or actor worldwide..."
            }
            autoFocus
            className={`w-full pl-11 sm:pl-14 pr-20 sm:pr-28 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-surface-100 border text-white placeholder-gray-500 text-xs sm:text-base focus:outline-none transition-all shadow-xl ${
              searchMode === 'ai'
                ? 'border-purple-500/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20'
                : 'border-white/10 focus:border-cinemix-primary focus:ring-2 focus:ring-cinemix-primary/20'
            }`}
          />

          <div className="absolute right-2.5 sm:right-3 flex items-center gap-1 sm:gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setAiResults([]);
                }}
                className="p-1 sm:p-1.5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {searchMode === 'ai' && (
              <button
                type="submit"
                disabled={isSearchingAi || !query.trim()}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-md disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
              >
                {isSearchingAi ? <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" /> : <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                <span>Ask AI</span>
              </button>
            )}
          </div>
        </form>

        {/* Suggestion Chips */}
        {searchMode === 'ai' ? (
          <div className="space-y-2 pt-3 sm:pt-4">
            <span className="text-[11px] sm:text-xs font-semibold text-purple-400">Cinemix AI Prompt Curations:</span>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 hide-scrollbar touch-pan-x overscroll-x-contain">
              {AI_PROMPTS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleAiSearch(item.prompt)}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white border border-purple-500/25 whitespace-nowrap transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-3 sm:pt-4">
            {/* Streaming Platform Discovery Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 hide-scrollbar touch-pan-x overscroll-x-contain">
              <span className="text-[11px] sm:text-xs font-bold text-cinemix-primary whitespace-nowrap">Platforms:</span>
              {PLATFORM_TAGS.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => setQuery(platform)}
                  className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-cinemix-primary/10 hover:bg-cinemix-primary/20 text-cinemix-primary border border-cinemix-primary/30 whitespace-nowrap transition-all"
                >
                  {platform}
                </button>
              ))}
            </div>

            {/* Worldwide Trending Shows */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar touch-pan-x overscroll-x-contain">
              <span className="text-[11px] sm:text-xs font-semibold text-gray-400 whitespace-nowrap">Worldwide:</span>
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-surface-200/70 hover:bg-surface-200 text-gray-300 hover:text-white border border-white/[0.04] whitespace-nowrap transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Semantic Search Results View */}
      {searchMode === 'ai' ? (
        <div className="space-y-8">
          {isSearchingAi ? (
            <div className="py-20 text-center space-y-4 bg-purple-950/20 rounded-3xl border border-purple-500/20 p-8 max-w-xl mx-auto backdrop-blur-md">
              <Bot className="w-12 h-12 text-purple-400 animate-bounce mx-auto" />
              <h3 className="text-lg font-bold text-white">Cinemix AI is Curating Titles...</h3>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                Analyzing natural language intent, mapping critical reviews, and selecting top-tier matches from global cinema databases.
              </p>
            </div>
          ) : aiResults.length > 0 ? (
            <div className="space-y-6">
              {/* AI Insight Header Banner */}
              <div className="p-6 rounded-2xl bg-surface-100 border border-white/10 shadow-cinema flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cinemix-primary text-black shadow-glow-primary">
                      Cinemix AI Curator
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">{aiResults.length} Curated Titles</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {aiExplanation}
                  </p>
                  {aiThemeTags.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {aiThemeTags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-surface-200 text-gray-300 border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right self-start sm:self-auto">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-surface-200 border border-white/10 px-3 py-1.5 rounded-xl whitespace-nowrap inline-flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Rating: 7.0+</span>
                  </span>
                </div>
              </div>

              {/* AI Content Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                {aiResults.map((item) => (
                  <div key={item.id} className="w-full flex justify-center">
                    <ContentCard
                      item={item}
                      className="w-full"
                      onOpenDetails={(i) => setSelectedItem(i)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : query.trim() ? (
            <div className="py-20 text-center space-y-4 bg-surface-50/50 rounded-3xl border border-white/[0.04] p-8 max-w-md mx-auto">
              <Bot className="w-12 h-12 text-purple-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">No AI matches found</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Cinemix AI could not find matching titles with high critical consensus for &ldquo;{query}&rdquo;. Try another prompt or click one of our curated prompt chips above.
              </p>
            </div>
          ) : (
            <div className="py-16 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mx-auto text-purple-400 shadow-xl">
                <Bot className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-white">Natural Language AI Search</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Describe what you want to watch in plain English, and Cinemix AI will discover the perfect movies, series, or anime.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Standard TMDB Search Results View */
        <div>
          {/* Query Header & Source Filter Tabs */}
          {query.trim() && (
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/[0.06] pb-3 sm:pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  Results for &ldquo;{query}&rdquo;
                  {isSearchingTmdb && <Loader2 className="w-4 h-4 text-cinemix-primary animate-spin" />}
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                  {localResults.length} in featured catalog · {tmdbResults.length} live from TMDB global library
                </p>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full hide-scrollbar touch-pan-x overscroll-x-contain">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === 'all'
                      ? 'bg-cinemix-primary text-black font-extrabold shadow-md'
                      : 'bg-surface-200 text-gray-400 hover:text-white'
                  }`}
                >
                  All ({localResults.length + tmdbResults.length})
                </button>
                <button
                  onClick={() => setActiveTab('local')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === 'local'
                      ? 'bg-cinemix-primary text-black font-extrabold shadow-md'
                      : 'bg-surface-200 text-gray-400 hover:text-white'
                  }`}
                >
                  In-Catalog ({localResults.length})
                </button>
                <button
                  onClick={() => setActiveTab('global')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                    activeTab === 'global'
                      ? 'bg-cinemix-primary text-black font-extrabold shadow-md'
                      : 'bg-surface-200 text-gray-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3 h-3" /> TMDB Global ({tmdbResults.length})
                </button>
              </div>
            </div>
          )}

          {/* Content Display */}
          {query.trim() ? (
            <div className="space-y-12">
              {/* Section 1: Featured In-Catalog Results */}
              {(activeTab === 'all' || activeTab === 'local') && localResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">
                      Featured In-Catalog ({localResults.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                    {localResults.map((item) => (
                      <div key={item.id} className="w-full flex justify-center">
                        <ContentCard
                          item={item}
                          className="w-full"
                          onOpenDetails={(i) => setSelectedItem(i)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 2: TMDB Global Live Results */}
              {(activeTab === 'all' || activeTab === 'global') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cinemix-primary" />
                      <h3 className="text-base font-bold text-white uppercase tracking-wider">
                        Worldwide TMDB Results ({tmdbResults.length})
                      </h3>
                    </div>
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      Instant Multi-Server Playback & Where-to-Watch Discovery
                    </span>
                  </div>

                  {tmdbResults.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
                      {tmdbResults.map((item) => {
                        const isImporting = importingId === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleTmdbAction(item, 'details')}
                            className="group relative bg-surface-50 border border-white/[0.06] rounded-xl sm:rounded-2xl overflow-hidden hover:border-cinemix-primary/50 transition-all flex flex-col cursor-pointer select-none"
                          >
                            {/* Poster */}
                            <div className="relative aspect-[2/3] w-full bg-surface-100 overflow-hidden">
                              <img
                                src={item.posterUrl}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 sm:p-2.5 gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTmdbAction(item, 'play');
                                  }}
                                  disabled={isImporting}
                                  className="w-full py-1.5 rounded-lg bg-cinemix-primary hover:bg-cinemix-hover text-black font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-lg transition-transform hover:scale-102 active:scale-95 disabled:opacity-50"
                                >
                                  {isImporting ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  )}
                                  <span>Stream Now</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTmdbAction(item, 'details');
                                  }}
                                  disabled={isImporting}
                                  className="w-full py-1 rounded-lg bg-surface-100/90 hover:bg-surface-200 text-gray-200 font-semibold text-[10px] sm:text-[11px] flex items-center justify-center gap-1 border border-white/10 active:scale-95"
                                >
                                  <Info className="w-3 h-3" />
                                  <span>Details</span>
                                </button>
                              </div>

                              {/* Cineby-style Gold Rating Pill */}
                              <div className="absolute top-2 left-2 z-10">
                                <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black bg-black/80 text-amber-400 border border-amber-500/40 backdrop-blur-md shadow-md">
                                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                                  {item.score}
                                </span>
                              </div>
                            </div>

                            {/* Title & Info */}
                            <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between space-y-0.5 sm:space-y-1">
                              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-cinemix-primary transition-colors">
                                {item.title}
                              </h4>
                              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-400 font-mono">
                                <span>{item.releaseYear}</span>
                                <span className="capitalize text-gray-500 font-sans">{item.type}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : isSearchingTmdb ? (
                    <div className="py-16 text-center space-y-3 bg-surface-50/50 rounded-2xl border border-white/[0.04]">
                      <Loader2 className="w-8 h-8 text-cinemix-primary animate-spin mx-auto" />
                      <p className="text-xs text-gray-400">Searching global TMDB database for matching movies and shows...</p>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-gray-500">
                      No additional titles found on TMDB matching this query.
                    </div>
                  )}
                </div>
              )}

              {/* Empty state if both have 0 results and search is done */}
              {localResults.length === 0 && tmdbResults.length === 0 && !isSearchingTmdb && (
                <div className="py-24 text-center space-y-4 bg-surface-50/50 rounded-3xl border border-white/[0.04] p-8 max-w-md mx-auto">
                  <Film className="w-12 h-12 text-gray-500 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No titles found</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    We couldn&apos;t find anything matching &ldquo;{query}&rdquo; across either local catalog or the global TMDB library. Try searching by movie title, actor, or franchise name.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Empty Query Showcase */
            <div className="py-16 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-surface-100 border border-white/10 flex items-center justify-center mx-auto text-cinemix-primary shadow-xl">
                <SearchIcon className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-white">Find your next favorite watch</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Search across our verified catalog or millions of worldwide movies, television series, and anime with instant multi-server streaming.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      <TitleDetailsModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
