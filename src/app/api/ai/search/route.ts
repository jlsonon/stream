import { NextRequest, NextResponse } from 'next/server';
import { ContentItem } from '@/types';

// Genre ID mapping for TMDB Discover API
const GENRE_MAP: Record<string, number> = {
  // Movie genres
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'anime': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'family': 10751,
  'fantasy': 14,
  'history': 36,
  'horror': 27,
  'music': 10402,
  'mystery': 9648,
  'romance': 10749,
  'sci-fi': 878,
  'scifi': 878,
  'science fiction': 878,
  'thriller': 53,
  'war': 10752,
  'western': 37,
  // TV genres
  'tv_action': 10759,
  'tv_animation': 16,
  'tv_comedy': 35,
  'tv_crime': 80,
  'tv_documentary': 99,
  'tv_drama': 18,
  'tv_family': 10751,
  'tv_kids': 10762,
  'tv_mystery': 9648,
  'tv_news': 10763,
  'tv_reality': 10764,
  'tv_scifi': 10765,
  'tv_soap': 10766,
  'tv_talk': 10767,
  'tv_war': 10768,
  'tv_western': 10768,
};

interface SemanticQueryInterpretation {
  genres: number[];
  language?: string;
  type: 'movie' | 'tv' | 'both';
  minRating: number;
  sortBy: string;
  explanation: string;
  themeTags: string[];
}

function parseNaturalLanguageQuery(query: string): SemanticQueryInterpretation {
  const q = query.toLowerCase();
  const detectedGenres: number[] = [];
  const themeTags: string[] = [];
  let language: string | undefined = undefined;
  let type: 'movie' | 'tv' | 'both' = 'both';
  let minRating = 7.0;
  let sortBy = 'vote_average.desc';

  // Detect Type intent
  if (q.includes('series') || q.includes('show') || q.includes('tv') || q.includes('season') || q.includes('episode') || q.includes('k-drama') || q.includes('kdrama')) {
    type = 'tv';
  } else if (q.includes('movie') || q.includes('film') || q.includes('cinema')) {
    type = 'movie';
  }

  // Detect Anime intent
  if (q.includes('anime') || q.includes('manga') || q.includes('shonen') || q.includes('isekai') || q.includes('studio ghibli')) {
    detectedGenres.push(16);
    language = 'ja';
    themeTags.push('Anime', 'Japanese Animation');
  }

  // Detect Philippine / Filipino intent
  if (q.includes('philippine') || q.includes('filipino') || q.includes('pinoy') || q.includes('tagalog') || q.includes('batang quiapo') || q.includes('vivamax')) {
    language = 'tl';
    themeTags.push('Philippine Cinema', 'Pinoy Content');
  }

  // Detect Korean / K-Drama intent
  if (q.includes('korean') || q.includes('k-drama') || q.includes('kdrama') || q.includes('squid game')) {
    language = 'ko';
    themeTags.push('Korean Drama', 'Hallyu');
  }

  // Detect Themes & Genres
  if (q.includes('sci-fi') || q.includes('scifi') || q.includes('space') || q.includes('time travel') || q.includes('cyberpunk') || q.includes('future') || q.includes('alien') || q.includes('interstellar') || q.includes('inception')) {
    detectedGenres.push(878);
    themeTags.push('Sci-Fi', 'Futuristic');
  }
  if (q.includes('horror') || q.includes('scary') || q.includes('creepy') || q.includes('zombie') || q.includes('ghost') || q.includes('demon')) {
    detectedGenres.push(27);
    themeTags.push('Horror', 'Supernatural');
  }
  if (q.includes('thriller') || q.includes('suspense') || q.includes('mind-bending') || q.includes('psychological') || q.includes('mystery') || q.includes('twist')) {
    detectedGenres.push(53);
    detectedGenres.push(9648);
    themeTags.push('Psychological Thriller', 'High Suspense');
  }
  if (q.includes('action') || q.includes('fight') || q.includes('chase') || q.includes('superhero') || q.includes('heist') || q.includes('explosive')) {
    detectedGenres.push(28);
    themeTags.push('Action', 'High Adrenaline');
  }
  if (q.includes('romance') || q.includes('love') || q.includes('romantic') || q.includes('heartwarming') || q.includes('couple') || q.includes('dating')) {
    detectedGenres.push(10749);
    themeTags.push('Romance', 'Emotional');
  }
  if (q.includes('comedy') || q.includes('funny') || q.includes('humor') || q.includes('laugh')) {
    detectedGenres.push(35);
    themeTags.push('Comedy', 'Lighthearted');
  }
  if (q.includes('crime') || q.includes('gangster') || q.includes('mafia') || q.includes('cartel') || q.includes('detective') || q.includes('breaking bad')) {
    detectedGenres.push(80);
    themeTags.push('Crime', 'Gritty');
  }

  // Fallback defaults
  if (detectedGenres.length === 0) {
    sortBy = 'popularity.desc';
  }

  const genreNames = themeTags.length > 0 ? themeTags.join(', ') : 'Popular Highlights';
  const explanation = `Cinemix AI identified semantic themes: [${genreNames}] with high critical ratings (minimum ${minRating}/10).`;

  return {
    genres: Array.from(new Set(detectedGenres)),
    language,
    type,
    minRating,
    sortBy,
    explanation,
    themeTags
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get('prompt')?.trim();

  if (!prompt || prompt.length < 2) {
    return NextResponse.json({ error: 'Prompt query is required' }, { status: 400 });
  }

  const apiKey = process.env.TMDB_API_KEY || 'bd32fd534e7f46e7bb4b3caf090d970b';
  const interpretation = parseNaturalLanguageQuery(prompt);

  try {
    const endpoints: string[] = [];
    const genreParam = interpretation.genres.length > 0 ? `&with_genres=${interpretation.genres.join(',')}` : '';
    const langParam = interpretation.language ? `&with_original_language=${interpretation.language}` : '';
    const voteParam = `&vote_average.gte=${interpretation.minRating}&vote_count.gte=50`;

    if (interpretation.type === 'movie' || interpretation.type === 'both') {
      endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${interpretation.sortBy}${genreParam}${langParam}${voteParam}&include_adult=false&page=1`);
    }

    if (interpretation.type === 'tv' || interpretation.type === 'both') {
      endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=${interpretation.sortBy}${genreParam}${langParam}${voteParam}&include_adult=false&page=1`);
    }

    const responses = await Promise.all(
      endpoints.map(url => fetch(url, { headers: { 'Accept': 'application/json' }, next: { revalidate: 3600 } }))
    );

    const items: ContentItem[] = [];

    for (let i = 0; i < responses.length; i++) {
      const res = responses[i];
      if (!res.ok) continue;
      const data = await res.json();
      const results = data.results || [];
      const isTv = endpoints[i].includes('/discover/tv');

      for (const raw of results.slice(0, 10)) {
        if (!raw.poster_path) continue;

        const title = isTv ? (raw.name || raw.original_name) : (raw.title || raw.original_title);
        const releaseDate = isTv ? raw.first_air_date : raw.release_date;
        const releaseYear = releaseDate ? parseInt(releaseDate.split('-')[0], 10) : new Date().getFullYear();
        const score = Math.round((raw.vote_average || 7.5) * 10);

        let contentType: ContentItem['type'] = 'movie';
        if (raw.original_language === 'tl') {
          contentType = 'ph_content';
        } else if (raw.original_language === 'ja' && (raw.genre_ids?.includes(16) || interpretation.themeTags.includes('Anime'))) {
          contentType = 'anime';
        } else if (isTv) {
          contentType = 'series';
        }

        const item: ContentItem = {
          id: `${contentType}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${raw.id}`,
          tmdbId: raw.id,
          title,
          originalTitle: isTv ? raw.original_name : raw.original_title,
          type: contentType,
          status: 'PUBLISHED',
          synopsis: raw.overview || `Cinemix AI recommendation for: "${prompt}".`,
          longSynopsis: raw.overview || '',
          releaseYear,
          duration: isTv ? undefined : 120,
          maturityRating: 'PG-13',
          score,
          genres: interpretation.themeTags.length > 0 ? interpretation.themeTags : ['Trending', 'Featured'],
          tags: ['AI Recommendation', 'Cinemix Exclusive', ...(interpretation.themeTags || [])],
          posterUrl: `https://image.tmdb.org/t/p/w500${raw.poster_path}`,
          backdropUrl: raw.backdrop_path 
            ? `https://image.tmdb.org/t/p/w1280${raw.backdrop_path}` 
            : `https://image.tmdb.org/t/p/w500${raw.poster_path}`,
          isProOnly: false,
          maxQuality: '2160p',
          audioTracks: [
            { language: raw.original_language || 'en', label: 'Original Audio', isDefault: true }
          ],
          subtitles: [
            { language: 'en', label: 'English CC', url: '', isDefault: true }
          ],
          cast: [],
          directors: [],
          producers: [],
          studio: 'Cinemix Studios',
          regionAvailability: ['GLOBAL'],
          featured: false,
          trending: true,
          newRelease: true,
          videoSources: [
            {
              quality: '1080p',
              url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
              bitrate: 4500000,
              codec: 'avc1'
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'cinemix-ai-curator'
        };

        items.push(item);
      }
    }

    // Sort combined results by score
    items.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      prompt,
      interpretation,
      totalMatches: items.length,
      explanation: interpretation.explanation,
      results: items
    });
  } catch (error: any) {
    console.error('AI Semantic Search error:', error);
    return NextResponse.json({ error: 'Failed to process AI search query', details: error.message }, { status: 500 });
  }
}
