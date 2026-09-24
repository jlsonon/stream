import { ContentItem } from '@/types';

export const COMPREHENSIVE_CATALOG: ContentItem[] = [
  // ========================================================
  // 1. FEATURED MOVIES (Action, Sci-Fi, Drama, Family)
  // ========================================================
  {
    id: 'cinemix-tears-of-steel',
    title: 'Tears of Steel',
    originalTitle: 'Tears of Steel: Project Mango',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'In a dystopian future, scientists and fighters in Amsterdam stage a desperate tactical reboot to save Earth from rampaging combat robots.',
    longSynopsis: 'Set in a dystopian future Amsterdam, a group of scientists gather at the historic Oude Kerk to relive a crucial memory using advanced robotic and temporal technology. Thom, Celia, and their ragtag resistance squad fight against alien-like biomechanical monstrosities while racing to reconcile a bitter past before all civilization falls.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    maturityRating: 'PG-13',
    score: 9.4,
    releaseYear: 2024,
    duration: 12,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    tags: ['Cyberpunk', 'Robots', 'Cinematic', 'Future', '4K Ultra HD'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'en', label: 'English (Original 5.1)', isDefault: true },
      { language: 'fil', label: 'Filipino (Tagalog Dub)', isDefault: false },
    ],
    subtitles: [
      { language: 'en', label: 'English CC', url: '', isDefault: true },
      { language: 'fil', label: 'Filipino / Tagalog', url: '', isDefault: false },
    ],
    cast: [
      { name: 'Derek de Lint', role: 'Old Thom' },
      { name: 'Vanja Rukavina', role: 'Thom' },
      { name: 'Denise Rebergen', role: 'Celia' }
    ],
    directors: ['Ian Hubert'],
    producers: ['Ton Roosendaal'],
    studio: 'Blender Cinema Project',
    regionAvailability: ['GLOBAL'],
    featured: true,
    trending: true,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 14000, codec: 'H.264' },
      { quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 6000, codec: 'H.264' },
      { quality: '720p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 2800, codec: 'H.264' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-cosmos-laundromat',
    title: 'Cosmos Laundromat: First Cycle',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'On a desolate, wind-swept island, a suicidal sheep named Franck meets Victor, a bizarre salesman offering the gift of infinite parallel lives.',
    longSynopsis: 'Franck the depressed sheep is on the verge of ending it all with a fraying noose when a flamboyant traveling salesman named Victor offers him a chance to experience the universe through different lives and identities via an otherworldly cosmic washing machine.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 8.9,
    releaseYear: 2024,
    duration: 13,
    genres: ['Sci-Fi', 'Comedy', 'Animation'],
    tags: ['Mind-Bending', '4K Ultra HD', 'Cosmic', 'Surreal', 'VIP'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'en', label: 'English (Original)', isDefault: true },
      { language: 'es', label: 'Spanish Dub', isDefault: false }
    ],
    subtitles: [
      { language: 'en', label: 'English CC', url: '', isDefault: true }
    ],
    cast: [
      { name: 'Pierre Bokma', role: 'Franck (Voice)' },
      { name: 'Reinout Scholten van Aschat', role: 'Victor (Voice)' }
    ],
    directors: ['Mathieu Auvray'],
    producers: ['Ton Roosendaal'],
    studio: 'Cosmic Cinema Netherlands',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 14000, codec: 'H.264' },
      { quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 6000, codec: 'H.264' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-big-buck-bunny',
    title: 'Big Buck Bunny: Forest Awakening',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'A gigantic gentle rabbit deals with bullies of the forest in hilarious slapstick retribution. Certified family classic!',
    longSynopsis: 'Big Buck Bunny wakes up on a sunny spring morning and finds peace in the blooming nature, until three forest woodland bullies—Frank the flying squirrel, Rinky the red squirrel, and Gamera the chinchilla—ruin the peace. Buck devises an elaborate series of traps to teach them a lesson.',
    posterUrl: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'G',
    score: 9.2,
    releaseYear: 2023,
    duration: 10,
    genres: ['Animation', 'Comedy', 'Family'],
    tags: ['Kids', 'Family Friendly', 'Slapstick', 'Animals'],
    isProOnly: false,
    maxQuality: '1080p',
    audioTracks: [
      { language: 'en', label: 'Music & Effects (Stereo)', isDefault: true }
    ],
    subtitles: [],
    cast: [],
    directors: ['Sacha Goedegebure'],
    producers: ['Ton Roosendaal'],
    studio: 'Peach Open Movie',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [
      { quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 4500, codec: 'H.264' },
      { quality: '720p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 2200, codec: 'H.264' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-elephants-dream',
    title: "Elephant's Dream: Machine Heart",
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'Two adventurers navigate the labyrinthine interior of an ancient mechanical giant where clockwork gears threaten to consume reality.',
    longSynopsis: 'Proog is an experienced elder who understands the immense living mechanism that surrounds them. Emo, his young and sceptical protege, is fascinated yet terrified by the gears, wires, and ominous telephone poles that comprise their surreal world.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 8.7,
    releaseYear: 2023,
    duration: 11,
    genres: ['Sci-Fi', 'Fantasy', 'Animation'],
    tags: ['Steampunk', 'Classic', 'Mechanical', 'Atmospheric'],
    isProOnly: false,
    maxQuality: '1080p',
    audioTracks: [
      { language: 'en', label: 'English (Original)', isDefault: true }
    ],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Tygo Gernandt', role: 'Proog (Voice)' },
      { name: 'Cas Jansen', role: 'Emo (Voice)' }
    ],
    directors: ['Bassam Kurdali'],
    producers: ['Ton Roosendaal'],
    studio: 'Orange Open Project',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: false,
    videoSources: [
      { quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 5000, codec: 'H.264' },
      { quality: '720p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 2400, codec: 'H.264' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-echoes-abyss',
    title: 'Echoes of the Abyss',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'A deep-sea research station at the bottom of the Philippine Trench loses contact with the surface after unearthing a bioluminescent monolith.',
    longSynopsis: 'Stationed 10,000 meters beneath the surface in the dark depths of the Philippine Sea, a team of oceanographers and marine engineers discover acoustic pulses originating from deep within the tectonic fault. As systems fail one by one, they must decide between containment and escape.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 8.9,
    releaseYear: 2024,
    duration: 104,
    genres: ['Horror', 'Mystery', 'Sci-Fi'],
    tags: ['Deep Sea', 'Psychological', 'Cosmic Horror', 'Thriller'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'en', label: 'English (Dolby Atmos)', isDefault: true },
      { language: 'fil', label: 'Filipino Dub', isDefault: false }
    ],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Sarah Lahbati', role: 'Dr. Elena Cruz' },
      { name: 'Enchong Dee', role: 'Mark Reyes' }
    ],
    directors: ['Yam Laranas'],
    producers: ['Abyss Media Global'],
    studio: 'Oceanic Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 13000, codec: 'H.264' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },

  // ========================================================
  // 2. PHILIPPINE CINEMA & SHOWS
  // ========================================================
  {
    id: 'cinemix-manila-nights',
    title: 'Manila Midnight Express',
    originalTitle: 'Gabi sa Maynila: Halimaw ng Kalsada',
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'A thrilling ride across the nocturnal neon avenues of Metro Manila following a ride-share driver caught in an underground syndicate clash.',
    longSynopsis: 'Navigating through the gritty rain-slicked thoroughfares of Quiapo, Escolta, and Bonifacio Global City, a veteran night driver accidentally picks up an operative carrying encrypted government microchips. To keep his family safe, he must outsmart corrupt police officers and underworld enforcers before dawn breaks over Manila Bay.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.3,
    releaseYear: 2024,
    duration: 114,
    genres: ['Action', 'Thriller', 'Crime', 'Philippine Cinema'],
    tags: ['Philippine Cinema', 'Manila', 'Noir', 'Underworld', 'Pro Only'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'fil', label: 'Filipino / Tagalog (Dolby 5.1)', isDefault: true },
      { language: 'en', label: 'English Subtitled Version', isDefault: false }
    ],
    subtitles: [
      { language: 'en', label: 'English', url: '', isDefault: true },
      { language: 'fil', label: 'Filipino SDH', url: '', isDefault: false }
    ],
    cast: [
      { name: 'JM de Guzman', role: 'Dante Rodriguez' },
      { name: 'Alessandra de Rossi', role: 'Elena Morales' },
      { name: 'Sid Lucero', role: 'Mayor Valles' }
    ],
    directors: ['Erik Matti'],
    producers: ['Reality MM Studios'],
    studio: 'Philippine Cinema Alliance',
    regionAvailability: ['PH', 'GLOBAL'],
    featured: true,
    trending: true,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 12500, codec: 'H.264' },
      { quality: '1080p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 5500, codec: 'H.264' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-heneral-tirad',
    title: 'Heneral: The Battle for Tirad Pass',
    originalTitle: 'Ang Huling Bayani',
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'The epic historical drama chronicling General Gregorio del Pilar and his 60 brave young soldiers holding the treacherous mountain pass in 1899.',
    longSynopsis: 'High in the mist-shrouded peaks of the Cordilleras, General del Pilar commands a rear-guard unit against overwhelming American forces. An unflinching portrait of sacrifice, honor, youthful bravado, and tragic national brotherhood.',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.5,
    releaseYear: 2024,
    duration: 130,
    genres: ['Action', 'Drama', 'Philippine Cinema'],
    tags: ['History', 'Heroism', 'Epic Battles', 'Pinoy Pride'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'fil', label: 'Filipino / Tagalog (Dolby 5.1)', isDefault: true }
    ],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Paulo Avelino', role: 'Gen. Gregorio del Pilar' },
      { name: 'Mon Confiado', role: 'Emilio Aguinaldo' }
    ],
    directors: ['Jerrold Tarog'],
    producers: ['Artikulo Uno Productions'],
    studio: 'Philippine Historical Heritage',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 12000, codec: 'H.264' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-sunset-batanes',
    title: 'Sunset in Batanes',
    originalTitle: 'Batanes: Huling Yakap',
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'Two souls from different worlds meet among the wind-swept lighthouses and emerald hills of Ivana and Basco in Northern Philippines.',
    longSynopsis: 'An architect recovering from burnout retreats to the isolated province of Batanes, where she meets an Ivatan stone-mason dedicated to preserving centuries-old coastal homes. A gentle, poetic romance set against rolling cliffs and pounding ocean swells.',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 9.1,
    releaseYear: 2024,
    duration: 98,
    genres: ['Romance', 'Drama', 'Philippine Cinema'],
    tags: ['Batanes', 'Poetic Romance', 'Scenic', 'Heartfelt'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'fil', label: 'Filipino / Tagalog', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Nadine Lustre', role: 'Clara' },
      { name: 'Carlo Aquino', role: 'Mateo' }
    ],
    directors: ['Antoinette Jadaone'],
    producers: ['Project 8 Corner San Joaquin'],
    studio: 'Cinemix Romance Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 11000, codec: 'H.264' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },

  // ========================================================
  // 3. ANIME & ANIMATION SERIES (With Seasons & Episodes)
  // ========================================================
  {
    id: 'cinemix-sintel-chronicles',
    title: 'Sintel: The Dragon Seeker',
    originalTitle: 'Sintel: Ryuu no Kishi',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'A lonely warrior named Sintel rescues and befriends a baby dragon, only for it to be snatched away, driving her on an epic quest across desolate lands.',
    longSynopsis: 'Sintel is attacked by a rogue warrior in a desolate snowfield. Rescued and nursed by a village elder, she recounts her emotional journey to find Scales, a defenseless baby dragon with a wounded wing that she raised and loved, who was suddenly snatched away by an adult winged predator. An emotional masterpiece of visual storytelling.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    maturityRating: 'PG-13',
    score: 9.7,
    releaseYear: 2024,
    duration: 15,
    genres: ['Animation', 'Fantasy', 'Adventure', 'Drama'],
    tags: ['Dragons', 'Anime Fantasy', 'Epic Quest', 'Emotional', 'Featured Anime'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'ja', label: 'Japanese (Original Audio)', isDefault: true },
      { language: 'en', label: 'English Dub', isDefault: false },
      { language: 'fil', label: 'Filipino Dub', isDefault: false }
    ],
    subtitles: [
      { language: 'en', label: 'English', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog / Filipino', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Halina Reijn', role: 'Sintel (Voice)' },
      { name: 'Thom Hoffman', role: 'Shaman (Voice)' }
    ],
    directors: ['Colin Levy'],
    producers: ['Ton Roosendaal'],
    studio: 'Animax Studio Global',
    regionAvailability: ['GLOBAL'],
    featured: true,
    trending: true,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 11000, codec: 'H.264' },
      { quality: '1080p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 5000, codec: 'H.264' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Journey Across Ys',
        episodes: [
          {
            id: 'sintel-ep-1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episode 1: The Wounded Wing',
            synopsis: 'Sintel finds an injured infant dragon near the bamboo towers and nurses it back to health.',
            duration: 15,
            thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            videoSources: [
              { quality: '1080p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 5000, codec: 'H.264' }
            ],
            airDate: '2024-01-15'
          },
          {
            id: 'sintel-ep-2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Episode 2: Flight of the Talons',
            synopsis: 'As Scales learns to fly, a giant airborne predator strikes and abducts the young companion.',
            duration: 16,
            thumbnailUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=600&q=80',
            videoSources: [
              { quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 5000, codec: 'H.264' }
            ],
            airDate: '2024-01-22'
          },
          {
            id: 'sintel-ep-3',
            episodeNumber: 3,
            seasonNumber: 1,
            title: 'Episode 3: The Mountain of Fire',
            synopsis: 'Reaching the dragon crater, Sintel faces an impossible confrontation in the fiery lair.',
            duration: 18,
            thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            videoSources: [
              { quality: '1080p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 5000, codec: 'H.264' }
            ],
            airDate: '2024-01-29'
          }
        ]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-ghost-runner',
    title: 'Ghost Runner: Neo Tokyo 2099',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'An augmented courier equipped with experimental cyber-optics is hunted through the rain-soaked skyways of future Neo Tokyo.',
    longSynopsis: 'In the towering megastructures of year 2099, cybernetically enhanced runners deliver illicit quantum keys between mega-corporations. Ren, a freelance courier, is implanted with a biological AI payload that military syndicates will burn the city to retrieve.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.2,
    releaseYear: 2024,
    genres: ['Animation', 'Action', 'Sci-Fi'],
    tags: ['Cyberpunk', 'Mecha', 'Adrenaline', 'Anime Series'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'ja', label: 'Japanese (Original)', isDefault: true },
      { language: 'en', label: 'English Dub', isDefault: false }
    ],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [],
    directors: ['Shinichiro Watanabe'],
    producers: ['Sunrise Cyber'],
    studio: 'Neo Tokyo Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 12000, codec: 'H.264' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Zero Override',
        episodes: [
          {
            id: 'ghost-ep-1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Protocol Blackout',
            synopsis: 'A routine drop across Sector 7 turns into an ambush when corporate drones hijack the transit rails.',
            duration: 24,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 5000, codec: 'H.264' }]
          },
          {
            id: 'ghost-ep-2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Neural Cascade',
            synopsis: 'Ren confronts the phantom personality awakening inside his neural hardware.',
            duration: 25,
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 5000, codec: 'H.264' }]
          }
        ]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-blade-shogun',
    title: 'Blade of the Shogun: Crimson Moon',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'A masterless samurai cursed with immortality protects an exiled princess while traversing feudal lands infested with shadow demons.',
    longSynopsis: 'During the bloody Sengoku era, legendary swordsman Jin is marked by an ancient curse of blood. Swearing his steel to defend Princess Ayame from demonic warlords, he wields twin katanas forged in sacred moonlight.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.6,
    releaseYear: 2024,
    genres: ['Animation', 'Action', 'Fantasy'],
    tags: ['Samurai', 'Dark Fantasy', 'Swordsmanship', 'Demon Slayer'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'ja', label: 'Japanese', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [],
    directors: ['Tensai Okamura'],
    producers: ['Bones Animation'],
    studio: 'Shogun Arts Japan',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 13000, codec: 'H.264' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Way of the Demon Blade',
        episodes: [
          {
            id: 'shogun-ep-1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'The Ronin at Dusk',
            synopsis: 'A village surrounded by shadow beasts is delivered by a solitary wandering swordsman.',
            duration: 22,
            thumbnailUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 5000, codec: 'H.264' }]
          }
        ]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },

  // ========================================================
  // 4. DRAMATIC TV SERIES
  // ========================================================
  {
    id: 'cinemix-cybercity-shadows',
    title: 'CyberCity: Neon Shadows',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'A detective with a cybernetic heart partners with an underworld hacker to solve a string of synthetic assassinations.',
    longSynopsis: 'In the year 2085, the dividing line between human and android has dissolved into high-speed chaos. Detective Sean Callahan has three weeks before his artificial cardiac regulator expires, racing against syndicate killers across the neon sprawl.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.3,
    releaseYear: 2024,
    genres: ['Sci-Fi', 'Crime', 'Drama'],
    tags: ['Cyberpunk', 'Mystery', 'Detectives', 'Series'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English 5.1', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [],
    directors: ['Alex Garland'],
    producers: ['Neon TV Global'],
    studio: 'Cinemix Originals',
    regionAvailability: ['GLOBAL'],
    featured: true,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Glitch in the Code',
        episodes: [
          {
            id: 'cyber-ep-1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Synthetic Blood',
            synopsis: 'A prominent cyber-engineer is discovered lifeless in a locked penthouse suite.',
            duration: 48,
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 5500, codec: 'H.264' }]
          },
          {
            id: 'cyber-ep-2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'The Black Market Vault',
            synopsis: 'Sean infiltrates an underground cybernetics clinic in the underbelly of District 4.',
            duration: 52,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 5500, codec: 'H.264' }]
          }
        ]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-barangay-143',
    title: 'Barangay 143: Street Champions',
    originalTitle: 'Barangay 143: Alamat ng Kalsada',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'A troubled young basketball prodigy from South Korea moves to Tondo, Manila, finding brotherhood, grit, and purpose on the concrete court.',
    longSynopsis: 'Set against the vibrant, crowded alleys of Tondo, Manila, Joaquin arrives in search of his long-lost biological father. Through the passion of local 3-on-3 street basketball, he unites with neighborhood youth to overcome local syndicates and compete in the nationwide championship.',
    posterUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.0,
    releaseYear: 2024,
    genres: ['Drama', 'Philippine Cinema', 'Action'],
    tags: ['Basketball', 'Pinoy', 'Inspirational', 'Tondo', 'Friendship'],
    isProOnly: false,
    maxQuality: '1080p',
    audioTracks: [{ language: 'fil', label: 'Filipino / Tagalog', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [],
    directors: ['Jyotirmoy Saha'],
    producers: ['Synergy88 Entertainment'],
    studio: 'Philippine Sports Drama',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '1080p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 5000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Concrete Dreams',
        episodes: [
          {
            id: 'b143-ep-1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Welcome to Tondo',
            synopsis: 'Joaquin lands in Manila and meets Coach B and the ragtag players of Barangay 143.',
            duration: 38,
            thumbnailUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 5000, codec: 'H.264' }]
          },
          {
            id: 'b143-ep-2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'First Blood on the Asphalt',
            synopsis: 'A challenge match against rival street crew The Vipers tests the team cohesion.',
            duration: 40,
            thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 5000, codec: 'H.264' }]
          }
        ]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },

  // ========================================================
  // 5. 4K DOCUMENTARIES & EXPLORATION
  // ========================================================
  {
    id: 'cinemix-island-heritage',
    title: 'Treasures of the Archipelago: Palawan 4K',
    type: 'documentary',
    status: 'PUBLISHED',
    synopsis: 'A breathtaking 4K visual exploration into the subterranean rivers, coral reefs, and indigenous guardians of Palawan.',
    longSynopsis: 'From the subterranean caves of Puerto Princesa Underground River to the limestone karst cliffs of El Nido and Coron, dive into the ecological crown jewel of Southeast Asia. Featuring 4K underwater macro photography and intimate portraits of local conservationists.',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'G',
    score: 9.8,
    releaseYear: 2024,
    duration: 52,
    genres: ['Documentary', 'Adventure'],
    tags: ['Philippine Nature', 'Palawan', 'Ocean 4K', 'Wildlife', 'Ecology'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'en', label: 'English Narration', isDefault: true },
      { language: 'fil', label: 'Filipino Narration', isDefault: false }
    ],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [],
    directors: ['Kara David'],
    producers: ['Ocean Earth Media'],
    studio: 'Cinemix Heritage Docs',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 14000, codec: 'H.264' },
      { quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 6000, codec: 'H.264' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-coron-shipwrecks',
    title: 'Coron: Ghosts of the Deep',
    type: 'documentary',
    status: 'PUBLISHED',
    synopsis: 'Technical divers map the sunken WWII Japanese naval fleet buried beneath the tranquil azure waters of Coron Bay, Palawan.',
    longSynopsis: 'In September 1944, a surprise air raid sent a fleet of Japanese supply ships to the seafloor of Coron. Today, marine biologists and tech wreck divers explore these colossal artificial reefs teeming with sharks, sea turtles, and untouched naval history.',
    posterUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 9.4,
    releaseYear: 2024,
    duration: 64,
    genres: ['Documentary', 'Adventure'],
    tags: ['Scuba Diving', 'WWII', 'History', '4K UHD', 'Ocean'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Original)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [],
    directors: ['Jean-Michel Cousteau'],
    producers: ['Deep Blue Films'],
    studio: 'Ocean Heritage Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: 'https://test-streams.mux.dev/test_001/stream.m3u8', bitrate: 13000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'cinemix-banaue-terraces',
    title: 'Banaue: Stairway of the Ancestors',
    type: 'documentary',
    status: 'PUBLISHED',
    synopsis: '2,000 years of Ifugao engineering carved into mountainsides by hand. An intimate look at the custodians guarding the rice terraces.',
    longSynopsis: 'Rising like giant green stairs carved into the peaks of Northern Luzon, the Banaue Rice Terraces represent one of humanity’s greatest ecological achievements. This visual journey captures the sacred agricultural rituals, water-carving traditions, and modern youth balancing heritage with technology.',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'G',
    score: 9.6,
    releaseYear: 2024,
    duration: 48,
    genres: ['Documentary', 'Family'],
    tags: ['Culture', 'Ifugao', 'Philippines', 'Nature', 'Heritage'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English', isDefault: true }, { language: 'fil', label: 'Filipino', isDefault: false }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [],
    directors: ['Kidlat Tahimik'],
    producers: ['Highland Heritage Cinema'],
    studio: 'Philippine Cultural Foundation',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate: 12000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  }
];
