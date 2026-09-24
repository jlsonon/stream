import { ContentItem } from '@/types';

// Working multi-bitrate HLS streams for video playback
const HLS_STREAM_PREMIERE = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const HLS_STREAM_ACTION = 'https://test-streams.mux.dev/test_001/stream.m3u8';

export const COMPREHENSIVE_CATALOG: ContentItem[] = [
  // ========================================================
  // 1. TOP GLOBAL TV SERIES
  // ========================================================
  {
    id: 'series-breaking-bad',
    title: 'Breaking Bad',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'A high school chemistry teacher diagnosed with terminal lung cancer turns to manufacturing methamphetamine with a former student.',
    longSynopsis: 'Walter White, a mild-mannered high school chemistry teacher in Albuquerque, discovers he has terminal lung cancer. In a desperate bid to secure his family’s financial future before he dies, he partners with former delinquent student Jesse Pinkman to manufacture and sell premium blue crystal meth, gradually transforming into the ruthless drug lord known as Heisenberg.',
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.9,
    releaseYear: 2008,
    endYear: 2013,
    genres: ['Drama', 'Crime', 'Thriller'],
    tags: ['Masterpiece', 'Crime Drama', 'Antihero', 'Top Rated', '4K UHD'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'en', label: 'English (Dolby 5.1)', isDefault: true },
      { language: 'es', label: 'Spanish Dub', isDefault: false },
    ],
    subtitles: [
      { language: 'en', label: 'English CC', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog Subtitles', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Bryan Cranston', role: 'Walter White / Heisenberg' },
      { name: 'Aaron Paul', role: 'Jesse Pinkman' },
      { name: 'Anna Gunn', role: 'Skyler White' },
      { name: 'Dean Norris', role: 'Hank Schrader' },
      { name: 'Giancarlo Esposito', role: 'Gus Fring' }
    ],
    directors: ['Vince Gilligan'],
    producers: ['Sony Pictures Television', 'High Bridge Productions'],
    studio: 'AMC Studios',
    regionAvailability: ['GLOBAL'],
    featured: true,
    trending: true,
    newRelease: false,
    videoSources: [
      { quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 14000, codec: 'H.264' },
      { quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 6000, codec: 'H.264' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Respect the Chemistry',
        episodes: [
          {
            id: 'bb-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Pilot',
            synopsis: 'Diagnosed with inoperable lung cancer, high school teacher Walter White recruits former student Jesse Pinkman to cook meth in an RV.',
            duration: 58,
            thumbnailUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2008-01-20'
          },
          {
            id: 'bb-s1e2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: "Cat's in the Bag...",
            synopsis: 'Walt and Jesse attempt to dispose of two bodies, resulting in messy and gruesome complications in Jesse’s basement.',
            duration: 48,
            thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2008-01-27'
          },
          {
            id: 'bb-s1e3',
            episodeNumber: 3,
            seasonNumber: 1,
            title: '...And the Bag’s in the River',
            synopsis: 'Walt wrestles with the moral dilemma of whether to kill Krazy-8 while learning disturbing truths about his captive.',
            duration: 48,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2008-02-10'
          },
          {
            id: 'bb-s1e6',
            episodeNumber: 6,
            seasonNumber: 1,
            title: 'Crazy Handful of Nothin’',
            synopsis: 'Walt adopts the name Heisenberg and boldly confronts violent kingpin Tuco Salamanca with fulminated mercury.',
            duration: 48,
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2008-03-02'
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
    id: 'series-stranger-things',
    title: 'Stranger Things',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    longSynopsis: 'In the 1980s town of Hawkins, Indiana, 12-year-old Will Byers vanishes under inexplicable circumstances. As friends, family and local police search for answers, they are drawn into an extraordinary mystery involving top-secret government experiments, terrifying supernatural forces known as the Upside Down, and a telekinetic girl named Eleven.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.7,
    releaseYear: 2016,
    genres: ['Sci-Fi', 'Horror', 'Drama', 'Fantasy'],
    tags: ['80s Nostalgia', 'Upside Down', 'Supernatural', 'Bingeable', '4K UHD'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'en', label: 'English (Dolby Atmos)', isDefault: true },
      { language: 'fil', label: 'Filipino Dub', isDefault: false }
    ],
    subtitles: [
      { language: 'en', label: 'English CC', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Millie Bobby Brown', role: 'Eleven' },
      { name: 'Finn Wolfhard', role: 'Mike Wheeler' },
      { name: 'David Harbour', role: 'Jim Hopper' },
      { name: 'Winona Ryder', role: 'Joyce Byers' },
      { name: 'Gaten Matarazzo', role: 'Dustin Henderson' }
    ],
    directors: ['The Duffer Brothers'],
    producers: ['21 Laps Entertainment', 'Monkey Massacre'],
    studio: 'Netflix Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [
      { quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 12000, codec: 'H.264' },
      { quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: The Vanishing of Will Byers',
        episodes: [
          {
            id: 'st-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Chapter One: The Vanishing of Will Byers',
            synopsis: 'On his way home from a friend’s house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.',
            duration: 49,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2016-07-15'
          },
          {
            id: 'st-s1e2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Chapter Two: The Weirdo on Maple Street',
            synopsis: 'Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about a bizarre phone call.',
            duration: 56,
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2016-07-15'
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
    id: 'series-game-of-thrones',
    title: 'Game of Thrones',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    longSynopsis: 'In the mythical continent of Westeros, several powerful families battle for the Iron Throne to rule the Seven Kingdoms. As conflict erupts in the kingdoms of men, a forgotten military order defends against the threat of the supernatural White Walkers beyond the great Wall of the North.',
    posterUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.8,
    releaseYear: 2011,
    endYear: 2019,
    genres: ['Fantasy', 'Drama', 'Adventure', 'Action'],
    tags: ['Dragons', 'Iron Throne', 'Epic Fantasy', 'Westeros', 'Emmy Winner'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'en', label: 'English (Dolby Atmos)', isDefault: true }
    ],
    subtitles: [
      { language: 'en', label: 'English CC', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Emilia Clarke', role: 'Daenerys Targaryen' },
      { name: 'Kit Harington', role: 'Jon Snow' },
      { name: 'Peter Dinklage', role: 'Tyrion Lannister' },
      { name: 'Lena Headey', role: 'Cersei Lannister' },
      { name: 'Nikolaj Coster-Waldau', role: 'Jaime Lannister' }
    ],
    directors: ['David Benioff', 'D.B. Weiss', 'Alan Taylor'],
    producers: ['HBO Entertainment'],
    studio: 'HBO',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [
      { quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 14000, codec: 'H.264' },
      { quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 6000, codec: 'H.264' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Winter Is Coming',
        episodes: [
          {
            id: 'got-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Winter Is Coming',
            synopsis: 'Lord Eddard Stark is asked by King Robert Baratheon to serve as the Hand of the King following the mysterious death of Jon Arryn.',
            duration: 62,
            thumbnailUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2011-04-17'
          },
          {
            id: 'got-s1e9',
            episodeNumber: 9,
            seasonNumber: 1,
            title: 'Baelor',
            synopsis: 'With Ned Stark imprisoned, Robb goes to war against the Lannisters and Daenerys searches for a way to save Khal Drogo.',
            duration: 57,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2011-06-12'
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
    id: 'series-house-of-the-dragon',
    title: 'House of the Dragon',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'The reign of House Targaryen begins with this prequel series set nearly 200 years before the events of Game of Thrones.',
    longSynopsis: 'Based on George R.R. Martin’s Fire & Blood, the series tells the story of the House Targaryen civil war known as the Dance of the Dragons, fought between Princess Rhaenyra Targaryen and her half-brother Aegon II for the Iron Throne.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.4,
    releaseYear: 2022,
    genres: ['Fantasy', 'Drama', 'Action'],
    tags: ['Targaryen', 'Dance of Dragons', 'HBO Original', '4K UHD'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Emma D’Arcy', role: 'Rhaenyra Targaryen' },
      { name: 'Matt Smith', role: 'Daemon Targaryen' },
      { name: 'Olivia Cooke', role: 'Alicent Hightower' }
    ],
    directors: ['Miguel Sapochnik', 'Ryan Condal'],
    producers: ['HBO Entertainment'],
    studio: 'HBO',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 14000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: The Heirs of the Dragon',
        episodes: [
          {
            id: 'hotd-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'The Heirs of the Dragon',
            synopsis: 'King Viserys hosts a tournament to celebrate the impending birth of his second child as Princess Rhaenyra welcomes her uncle Daemon home.',
            duration: 66,
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2022-08-21'
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
    id: 'series-the-last-of-us',
    title: 'The Last of Us',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity’s last hope.',
    longSynopsis: 'Twenty years after a fungal outbreak devastates the globe, transforming victims into ferocious fungal creatures known as Clickers, weathered smuggler Joel is hired to smuggle 14-year-old Ellie out of an oppressive quarantine zone. What begins as a small gig soon turns into a brutal, heartbreaking trek across post-apocalyptic America.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.7,
    releaseYear: 2023,
    genres: ['Drama', 'Sci-Fi', 'Horror', 'Adventure'],
    tags: ['Post-Apocalyptic', 'HBO Masterpiece', 'Pedro Pascal', 'Emotional Journey'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Pedro Pascal', role: 'Joel Miller' },
      { name: 'Bella Ramsey', role: 'Ellie Williams' },
      { name: 'Gabriel Luna', role: 'Tommy' }
    ],
    directors: ['Craig Mazin', 'Neil Druckmann'],
    producers: ['Sony Pictures Television', 'Naughty Dog'],
    studio: 'HBO',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Cross-Country Odyssey',
        episodes: [
          {
            id: 'tlou-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'When You’re Lost in the Darkness',
            synopsis: 'Twenty years after a fungal outbreak devastates the planet, survivors Joel and Tess are tasked with a mission that could change everything.',
            duration: 81,
            thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '2023-01-15'
          },
          {
            id: 'tlou-s1e3',
            episodeNumber: 3,
            seasonNumber: 1,
            title: 'Long, Long Time',
            synopsis: 'When a stranger approaches his compound, survivalist Bill forges an unlikely connection that evolves into a decade-long romance.',
            duration: 75,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '2023-01-29'
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
    id: 'series-the-bear',
    title: 'The Bear',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'A young fine-dining chef comes home to Chicago to run his family’s Italian beef sandwich shop after a tragic loss.',
    longSynopsis: 'Carmen "Carmy" Berzatto, a rising young star in the world of Michelin-starred fine dining, returns home to Chicago to manage his family’s gritty Italian beef sandwich shop after his older brother’s suicide. A world away from what he’s used to, Carmy must balance the soul-crushing realities of small business ownership and grief.',
    posterUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.6,
    releaseYear: 2022,
    genres: ['Drama', 'Comedy'],
    tags: ['Culinary', 'High Tension', 'Chicago', 'Emmy Winner', 'Intense'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Stereo/5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Jeremy Allen White', role: 'Carmen "Carmy" Berzatto' },
      { name: 'Ebon Moss-Bachrach', role: 'Richard "Richie" Jerimovich' },
      { name: 'Ayo Edebiri', role: 'Sydney Adamu' }
    ],
    directors: ['Christopher Storer'],
    producers: ['FX Productions'],
    studio: 'FX Network',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 11000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Every Second Counts',
        episodes: [
          {
            id: 'bear-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'System',
            synopsis: 'Carmy attempts to modernize the kitchen at The Original Beef of Chicagoland, but meets intense resistance from stubborn staff.',
            duration: 28,
            thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2022-06-23'
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
    id: 'series-wednesday',
    title: 'Wednesday',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'Follows Wednesday Addams’ years as a student at Nevermore Academy, attempting to master her psychic ability and solve a 25-year-old mystery.',
    longSynopsis: 'Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.3,
    releaseYear: 2022,
    genres: ['Comedy', 'Fantasy', 'Mystery'],
    tags: ['Addams Family', 'Gothic', 'Nevermore', 'Viral Phenomenon'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby 5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Jenna Ortega', role: 'Wednesday Addams' },
      { name: 'Gwendoline Christie', role: 'Principal Larissa Weems' },
      { name: 'Emma Myers', role: 'Enid Sinclair' }
    ],
    directors: ['Tim Burton'],
    producers: ['MGM Television'],
    studio: 'Netflix Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 11000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Outcasts and Monsters',
        episodes: [
          {
            id: 'wed-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Wednesday’s Child Is Full of Woe',
            synopsis: 'When a deliciously wicked prank gets Wednesday expelled from high school, her parents ship her off to Nevermore Academy.',
            duration: 59,
            thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2022-11-23'
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
    id: 'series-succession',
    title: 'Succession',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their aging father steps down.',
    longSynopsis: 'Logan Roy and his four children navigate existential corporate peril and vicious familial betrayals as they fight for control over global media colossus Waystar RoyCo.',
    posterUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.8,
    releaseYear: 2018,
    endYear: 2023,
    genres: ['Drama'],
    tags: ['Billionaires', 'Corporate Satire', 'Emmy Best Drama', 'Sharp Dialogue'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby 5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Brian Cox', role: 'Logan Roy' },
      { name: 'Jeremy Strong', role: 'Kendall Roy' },
      { name: 'Sarah Snook', role: 'Shiv Roy' },
      { name: 'Kieran Culkin', role: 'Roman Roy' },
      { name: 'Matthew Macfadyen', role: 'Tom Wambsgans' }
    ],
    directors: ['Jesse Armstrong'],
    producers: ['Hyperobject Industries', 'Gary Sanchez Productions'],
    studio: 'HBO',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 13000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Waystar RoyCo',
        episodes: [
          {
            id: 'succ-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Celebration',
            synopsis: 'On his 80th birthday, media titan Logan Roy shocks his four adult children by announcing he will remain CEO indefinitely.',
            duration: 61,
            thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2018-06-03'
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
    id: 'series-dark',
    title: 'Dark',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families.',
    longSynopsis: 'In the small German town of Winden, children begin to vanish near a sinister nuclear power plant. As the investigation deepens, time loops and multi-generational family secrets across 1953, 1986, and 2019 intertwine into a mind-bending puzzle.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.7,
    releaseYear: 2017,
    endYear: 2020,
    genres: ['Sci-Fi', 'Mystery', 'Drama', 'Thriller'],
    tags: ['Time Travel', 'German Masterpiece', 'Complex Plot', 'Mind-Bending'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'de', label: 'German (Original Dolby 5.1)', isDefault: true },
      { language: 'en', label: 'English Dub', isDefault: false }
    ],
    subtitles: [
      { language: 'en', label: 'English CC', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Louis Hofmann', role: 'Jonas Kahnwald' },
      { name: 'Oliver Masucci', role: 'Ulrich Nielsen' }
    ],
    directors: ['Baran bo Odar'],
    producers: ['Wiedemann & Berg Television'],
    studio: 'Netflix',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Secrets',
        episodes: [
          {
            id: 'dark-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Secrets',
            synopsis: 'In 2019, a local boy’s disappearance stokes fear in the residents of Winden, a small town with a strange and tragic history.',
            duration: 52,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2017-12-01'
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
    id: 'series-peaky-blinders',
    title: 'Peaky Blinders',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'A notorious gang in 1919 Birmingham, England, is led by the fierce Tommy Shelby, a crime boss set on moving up in the world no matter the cost.',
    longSynopsis: 'Thomas Shelby and his brothers return to Birmingham after serving in WWI. As the leader of the Peaky Blinders gang, named for the razor blades sewn into the peaks of their caps, Tommy navigates corrupt law enforcement, rival Italian mobsters, and political extremists.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.6,
    releaseYear: 2013,
    endYear: 2022,
    genres: ['Crime', 'Drama'],
    tags: ['British Gangsters', 'Tommy Shelby', 'Cillian Murphy', 'Period Drama'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby 5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Cillian Murphy', role: 'Thomas Shelby' },
      { name: 'Paul Anderson', role: 'Arthur Shelby' },
      { name: 'Helen McCrory', role: 'Polly Gray' },
      { name: 'Tom Hardy', role: 'Alfie Solomons' }
    ],
    directors: ['Steven Knight'],
    producers: ['Caryn Mandabach Productions', 'Tiger Aspect Productions'],
    studio: 'BBC Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Birmingham 1919',
        episodes: [
          {
            id: 'pb-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episode 1',
            synopsis: 'Thomas Shelby inadvertently appropriates a crate of military guns, drawing the attention of Winston Churchill and Inspector Campbell.',
            duration: 57,
            thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '2013-09-12'
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
    id: 'series-the-boys',
    title: 'The Boys',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'A fun and irreverent take on what happens when superheroes—who are as popular as celebrities and as influential as politicians—abuse their superpowers.',
    longSynopsis: 'In a world where corporate superheroes monetized by Vought International are secretly narcissistic sociopaths, a group of vigilantes known as The Boys sets out to expose the corrupt superheroes, especially the monstrous Homelander.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.5,
    releaseYear: 2019,
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    tags: ['Satire', 'Anti-Superhero', 'Homelander', 'Bloody Action'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Karl Urban', role: 'Billy Butcher' },
      { name: 'Antony Starr', role: 'Homelander' },
      { name: 'Jack Quaid', role: 'Hughie Campbell' }
    ],
    directors: ['Eric Kripke'],
    producers: ['Sony Pictures Television', 'Amazon MGM Studios'],
    studio: 'Amazon MGM Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 13000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Diabolical',
        episodes: [
          {
            id: 'tb-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'The Name of the Game',
            synopsis: 'When an A-Train speedster accident kills his girlfriend, Hughie Campbell joins vengeful operative Billy Butcher.',
            duration: 60,
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '2019-07-26'
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
    id: 'series-severance',
    title: 'Severance',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.',
    longSynopsis: 'At mysterious corporation Lumon Industries, employees undergo a surgical procedure called Severance, which splits their consciousness between their working innie self and outer life outie self. When a mysterious former colleague appears outside work, Mark begins a journey to uncover the truth about their sinister jobs.',
    posterUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.6,
    releaseYear: 2022,
    genres: ['Sci-Fi', 'Thriller', 'Mystery'],
    tags: ['Mind Bending', 'Dystopian Workplace', 'Psychological', 'Apple Original'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Adam Scott', role: 'Mark Scout' },
      { name: 'Britt Lower', role: 'Helly R.' },
      { name: 'Patricia Arquette', role: 'Harmony Cobel' }
    ],
    directors: ['Ben Stiller'],
    producers: ['Red Hour Productions'],
    studio: 'Apple Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 12500, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: The Macrodata Refinement',
        episodes: [
          {
            id: 'sev-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Good News About Hell',
            synopsis: 'Mark Scout gets promoted to department head after his coworker Petey disappears under strange circumstances.',
            duration: 57,
            thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2022-02-18'
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
  // 2. TOP ANIME TITLES (Shonen & Dark Fantasy Masterpieces)
  // ========================================================
  {
    id: 'anime-attack-on-titan',
    title: 'Attack on Titan',
    originalTitle: '進撃の巨人 (Shingeki no Kyojin)',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.',
    longSynopsis: 'For over a century, the remnants of humanity have lived sheltered within three towering concentric stone walls: Wall Maria, Wall Rose, and Wall Sina, protected from monstrous man-eating Titans. When a 60-meter Colossal Titan breaches the outer defense, Eren Jaeger witnesses his mother devoured alive. Burning with vengeance, Eren and his adoptive sister Mikasa enlist in the Scout Regiment to reclaim humanity’s freedom beyond the walls.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.9,
    releaseYear: 2013,
    endYear: 2023,
    genres: ['Animation', 'Action', 'Dark Fantasy', 'Mystery'],
    tags: ['Scout Regiment', 'Titans', 'Eren Jaeger', 'Levi Ackerman', 'Masterpiece', '4K UHD'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'ja', label: 'Japanese (Original Hi-Fi)', isDefault: true },
      { language: 'en', label: 'English Dub', isDefault: false },
      { language: 'fil', label: 'Tagalog Dub', isDefault: false }
    ],
    subtitles: [
      { language: 'en', label: 'English Subtitles', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog Subtitles', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Yuki Kaji', role: 'Eren Jaeger (Voice)' },
      { name: 'Yui Ishikawa', role: 'Mikasa Ackerman (Voice)' },
      { name: 'Hiroshi Kamiya', role: 'Levi Ackerman (Voice)' },
      { name: 'Marina Inoue', role: 'Armin Arlert (Voice)' }
    ],
    directors: ['Tetsuro Araki', 'Yuichiro Hayashi'],
    producers: ['Wit Studio', 'MAPPA', 'Kodansha'],
    studio: 'MAPPA',
    regionAvailability: ['GLOBAL'],
    featured: true,
    trending: true,
    newRelease: false,
    videoSources: [
      { quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 14000, codec: 'H.264' },
      { quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 6000, codec: 'H.264' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Fall of Shiganshina',
        episodes: [
          {
            id: 'aot-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'To You, in 2000 Years: The Fall of Shiganshina',
            synopsis: 'Eren and Mikasa witness the catastrophic arrival of the Colossal Titan, which shatters the city wall and unleashes devastation.',
            duration: 24,
            thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2013-04-07'
          },
          {
            id: 'aot-s1e2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'That Day: The Fall of Shiganshina, Part 2',
            synopsis: 'Amidst mass panic and evacuations, the Armored Titan breaks through Wall Maria, forcing the human race into territorial retreat.',
            duration: 24,
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2013-04-14'
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
    id: 'anime-demon-slayer',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    originalTitle: '鬼滅の刃',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon herself.',
    longSynopsis: 'In Taisho-era Japan, kindhearted Tanjiro Kamado makes a living selling charcoal. His peaceful life is shattered when demons slaughter his entire family. His younger sister Nezuko survives as a demon with residual human feelings. Tanjiro embarks on a dangerous path to become a Demon Slayer and restore Nezuko’s humanity.',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.8,
    releaseYear: 2019,
    genres: ['Animation', 'Action', 'Fantasy', 'Adventure'],
    tags: ['Swordsmanship', 'Breath of Water', 'Hinokami', 'Ufotable Animation', '4K UHD'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'ja', label: 'Japanese (Dolby 5.1)', isDefault: true },
      { language: 'en', label: 'English Dub', isDefault: false }
    ],
    subtitles: [
      { language: 'en', label: 'English CC', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog Subtitles', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Natsuki Hanae', role: 'Tanjiro Kamado' },
      { name: 'Akari Kito', role: 'Nezuko Kamado' },
      { name: 'Hiro Shimono', role: 'Zenitsu Agatsuma' },
      { name: 'Yoshitsugu Matsuoka', role: 'Inosuke Hashibira' }
    ],
    directors: ['Haruo Sotozaki'],
    producers: ['Aniplex', 'Shueisha', 'Ufotable'],
    studio: 'Ufotable',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 13500, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Tanjiro Kamado, Unwavering Resolve',
        episodes: [
          {
            id: 'ds-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Cruelty',
            synopsis: 'Tanjiro returns from the village to find his family butchered and his sister transformed into an aggressive demon.',
            duration: 24,
            thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2019-04-06'
          },
          {
            id: 'ds-s1e19',
            episodeNumber: 19,
            seasonNumber: 1,
            title: 'Hinokami (God of Fire)',
            synopsis: 'Facing impossible odds against Rui, Lower Moon Five, Tanjiro unlocks the fiery breathing technique passed down by his father.',
            duration: 24,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2019-08-10'
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
    id: 'anime-jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    originalTitle: '呪術廻戦',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself, joining a secret school of sorcerers.',
    longSynopsis: 'Yuji Itadori, a high school student with extraordinary physical prowess, swallows the rotten finger of Ryomen Sukuna, the King of Curses. Mentored by the almighty Satoru Gojo, Yuji transfers to Tokyo Prefectural Jujutsu High School to master cursed energy and locate all 20 of Sukuna’s fingers before his impending execution.',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.7,
    releaseYear: 2020,
    genres: ['Animation', 'Action', 'Supernatural', 'Dark Fantasy'],
    tags: ['Domain Expansion', 'Gojo Satoru', 'Sukuna', 'Shibuya Incident', 'MAPPA'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'ja', label: 'Japanese (Hi-Fi)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Junya Enoki', role: 'Yuji Itadori' },
      { name: 'Yuichi Nakamura', role: 'Satoru Gojo' },
      { name: 'Megumi Ogata', role: 'Yuta Okkotsu' }
    ],
    directors: ['Sunghoo Park', 'Shota Goshozono'],
    producers: ['TOHO animation', 'MAPPA'],
    studio: 'MAPPA',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 13000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Cursed Womb',
        episodes: [
          {
            id: 'jjk-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Ryomen Sukuna',
            synopsis: 'Yuji swallows a special grade cursed object to save his occult club classmates from ravenous curses.',
            duration: 24,
            thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '2020-10-03'
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
    id: 'anime-solo-leveling',
    title: 'Solo Leveling',
    originalTitle: '나 혼자만 레벨업',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'In a world where hunters face magical monsters, the weakest hunter Sung Jinwoo is chosen by a mysterious program that lets him level up infinitely.',
    longSynopsis: 'Sung Jinwoo is known as the Weakest Hunter of All Mankind. Trapped in a catastrophic Double Dungeon slaughter, he accepts a secretive quest offered by a system window floating in his vision. Jinwoo awakens as the only Hunter capable of leveling up without limits, setting the stage for his emergence as the Shadow Monarch.',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.6,
    releaseYear: 2024,
    genres: ['Animation', 'Action', 'Fantasy', 'Adventure'],
    tags: ['Shadow Monarch', 'Arise', 'Manhwa Adaptation', 'Overpowered Protagonist'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'ja', label: 'Japanese', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [{ name: 'Taito Ban', role: 'Sung Jinwoo' }],
    directors: ['Shunsuke Nakashige'],
    producers: ['A-1 Pictures', 'Aniplex'],
    studio: 'A-1 Pictures',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Arise',
        episodes: [
          {
            id: 'sl-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: "I'm Used to It",
            synopsis: 'E-Rank hunter Sung Jinwoo barely survives a low-level dungeon raid, before entering a hidden secondary sanctuary with godlike stone statues.',
            duration: 24,
            thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2024-01-06'
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
    id: 'anime-one-piece',
    title: 'One Piece',
    originalTitle: 'ワンピース',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'Monkey D. Luffy sets sail with his pirate crew across the treacherous Grand Line in search of the legendary ultimate treasure: the One Piece.',
    longSynopsis: 'Inspired by his childhood idol Red-Haired Shanks, Monkey D. Luffy sets off from the East Blue to become the King of the Pirates. With his rubber-like body granted by eating a Devil Fruit, Luffy gathers an unmatched crew of loyal outcasts—swordsman Zoro, navigator Nami, sniper Usopp, and cook Sanji—facing ruthless Warlords, Marine Admirals, and Emperor titans.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.8,
    releaseYear: 1999,
    genres: ['Animation', 'Action', 'Adventure', 'Comedy', 'Fantasy'],
    tags: ['Straw Hat', 'Grand Line', 'Gear 5', 'Shonen Legend', 'Eiichiro Oda'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'ja', label: 'Japanese (Original)', isDefault: true },
      { language: 'en', label: 'English Dub', isDefault: false }
    ],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Mayumi Tanaka', role: 'Monkey D. Luffy' },
      { name: 'Kazuya Nakai', role: 'Roronoa Zoro' },
      { name: 'Akemi Okamura', role: 'Nami' }
    ],
    directors: ['Konosuke Uda', 'Tatsuya Nagamine'],
    producers: ['Toei Animation', 'Fuji TV'],
    studio: 'Toei Animation',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: East Blue Saga',
        episodes: [
          {
            id: 'op-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'I’m Luffy! The Man Who Will Become the Pirate King!',
            synopsis: 'Luffy pops out of a wine barrel on a cruise ship and joins forces with young shipboy Koby to defeat the pirate Alvida.',
            duration: 25,
            thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '1999-10-20'
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
    id: 'anime-death-note',
    title: 'Death Note',
    originalTitle: 'デスノート',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'An intelligent high school student goes on a secret crusade to eliminate criminals after discovering a notebook capable of killing anyone whose name is written in it.',
    longSynopsis: 'Genius student Light Yagami finds a mysterious black notebook dropped by the Shinigami Ryuk. The rules state that any human whose name is written in the notebook will die. Light resolves to rid the world of evil and create a peaceful utopia under his rule as Kira, triggering a lethal game of cat-and-mouse with eccentric detective L.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.8,
    releaseYear: 2006,
    endYear: 2007,
    genres: ['Animation', 'Psychological', 'Thriller', 'Mystery', 'Supernatural'],
    tags: ['L vs Light', 'Shinigami', 'Psychological Warfare', 'All-Time Classic'],
    isProOnly: false,
    maxQuality: '1080p',
    audioTracks: [
      { language: 'ja', label: 'Japanese', isDefault: true },
      { language: 'en', label: 'English Dub', isDefault: false }
    ],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Mamoru Miyano', role: 'Light Yagami' },
      { name: 'Kappei Yamaguchi', role: 'L' }
    ],
    directors: ['Tetsuro Araki'],
    producers: ['Madhouse', 'Nippon TV'],
    studio: 'Madhouse',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: false,
    videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 6000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Kira vs L',
        episodes: [
          {
            id: 'dn-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Rebirth',
            synopsis: 'Light Yagami tests the supernatural notebook by writing down the name of an armed hostage taker on live television.',
            duration: 23,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2006-10-04'
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
    id: 'anime-chainsaw-man',
    title: 'Chainsaw Man',
    originalTitle: 'チェンソーマン',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'Following a betrayal, a young man who merged with his pet chainsaw devil is resurrected and joins the Public Safety Devil Hunters.',
    longSynopsis: 'Denji lives an impoverished existence repaying his deceased father’s debts to the yakuza by slaughtering devils with his chainsaw dog Pochita. When the mob betrays and murders him, Pochita sacrifices himself to become Denji’s heart. Denji transforms into Chainsaw Man, joining the enigmatic Makima in Public Safety.',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.5,
    releaseYear: 2022,
    genres: ['Animation', 'Action', 'Dark Fantasy', 'Horror'],
    tags: ['Devil Hunters', 'Pochita', 'Makima', 'MAPPA Masterpiece'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'ja', label: 'Japanese (Hi-Fi)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Kikunosuke Toya', role: 'Denji' },
      { name: 'Tomori Kusunoki', role: 'Makima' }
    ],
    directors: ['Ryu Nakayama'],
    producers: ['MAPPA'],
    studio: 'MAPPA',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 13000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Public Safety Arc',
        episodes: [
          {
            id: 'csm-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Dog & Chainsaw',
            synopsis: 'Denji earns a meager living fighting devils with Pochita until the Zombie Devil ambushes them.',
            duration: 25,
            thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '2022-10-12'
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
    id: 'anime-spy-family',
    title: 'SPY x FAMILY',
    originalTitle: 'スパイファミリー',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'A spy on an undercover mission gets married and adopts a child, unaware that his wife is a deadly assassin and his daughter is a telepath.',
    longSynopsis: 'To maintain peace between rival nations Westalis and Ostania, elite spy "Twilight" must establish a mock family under the alias Loid Forger. He unwittingly adopts Anya, an orphan girl who can read minds, and marries Yor Briar, a soft-spoken civil servant who leads a double life as the assassin "Thorn Princess."',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.4,
    releaseYear: 2022,
    genres: ['Animation', 'Comedy', 'Action', 'Slice of Life'],
    tags: ['Anya', 'Wholesome', 'Secret Agent', 'Family Fun'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'ja', label: 'Japanese', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Takuya Eguchi', role: 'Loid Forger' },
      { name: 'Atsumi Tanezaki', role: 'Anya Forger' },
      { name: 'Saori Hayami', role: 'Yor Forger' }
    ],
    directors: ['Kazuhiro Furuhashi'],
    producers: ['Wit Studio', 'CloverWorks'],
    studio: 'Wit Studio / CloverWorks',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 11000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Operation Strix',
        episodes: [
          {
            id: 'sxf-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Operation Strix',
            synopsis: 'Master spy Twilight adopts young Anya from an orphanage to gain admission to elite Eden Academy.',
            duration: 24,
            thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2022-04-09'
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
    id: 'anime-frieren',
    title: 'Frieren: Beyond Journey’s End',
    originalTitle: '葬送のフリーレン',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'An elven mage and her fellow adventurers have defeated the Demon King and brought peace to the land. But after decades pass, she reflects on the brevity of human life.',
    longSynopsis: 'Elven mage Frieren and her party’s 10-year quest defeated the Demon King. As an elf with a millennia-long lifespan, 10 years felt like a fleeting blink. When her human companion Himmel the Hero passes away of old age, Frieren regrets not understanding humans better and embarks on a new reflective journey across the continent.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.9,
    releaseYear: 2023,
    genres: ['Animation', 'Fantasy', 'Adventure', 'Drama'],
    tags: ['Highest Rated Anime', 'Masterpiece', 'Madhouse', 'Poetic', 'Elven Mage'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'ja', label: 'Japanese (Hi-Fi)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [{ name: 'Atsumi Tanezaki', role: 'Frieren' }],
    directors: ['Keiichiro Saito'],
    producers: ['Madhouse', 'TOHO animation'],
    studio: 'Madhouse',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 13000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Journey to Ende',
        episodes: [
          {
            id: 'fri-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'The Journey’s End',
            synopsis: 'The hero party returns triumphant after defeating the Demon King and witnesses the Era Meteors shower.',
            duration: 24,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2023-09-29'
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
  // 3. TOP KOREAN DRAMAS (K-Drama Sensations)
  // ========================================================
  {
    id: 'series-squid-game',
    title: 'Squid Game',
    originalTitle: '오징어 게임',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'Hundreds of cash-strapped players accept a strange invitation to compete in children’s games. Inside, a tempting prize awaits with deadly high stakes.',
    longSynopsis: 'Desperate and deep in debt, Seong Gi-hun is approached on a subway platform by a mysterious salesman offering an invitation to play simple children’s games. Transported to an undisclosed island alongside 455 other indebted players, Gi-hun discovers that losing any game means instantaneous execution, as the winner stands to claim 45.6 billion won.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.7,
    releaseYear: 2021,
    genres: ['Drama', 'Thriller', 'Mystery', 'Action'],
    tags: ['K-Drama', 'Survival Game', 'Global Sensation', 'Red Light Green Light', '4K UHD'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'ko', label: 'Korean (Original Dolby 5.1)', isDefault: true },
      { language: 'en', label: 'English Dub', isDefault: false },
      { language: 'fil', label: 'Tagalog Dub', isDefault: false }
    ],
    subtitles: [
      { language: 'en', label: 'English CC', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog Subtitles', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Lee Jung-jae', role: 'Seong Gi-hun (Player 456)' },
      { name: 'Park Hae-soo', role: 'Cho Sang-woo (Player 218)' },
      { name: 'Jung Ho-yeon', role: 'Kang Sae-byeok (Player 067)' },
      { name: 'Wi Ha-joon', role: 'Hwang Jun-ho' },
      { name: 'Oh Yeong-su', role: 'Oh Il-nam (Player 001)' }
    ],
    directors: ['Hwang Dong-hyuk'],
    producers: ['Siren Pictures'],
    studio: 'Netflix Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 13000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: 45.6 Billion Won',
        episodes: [
          {
            id: 'sg-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Red Light, Green Light',
            synopsis: 'Hoping to win easy money, broke and desperate Gi-hun agrees to take part in an enigmatic game. Not long into the first round, unexpected horrors unfold.',
            duration: 60,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2021-09-17'
          },
          {
            id: 'sg-s1e2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Hell',
            synopsis: 'Split on whether to continue or quit, the group holds a democratic vote. But their grim real-world debts make the island look like an opportunity.',
            duration: 63,
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2021-09-17'
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
    id: 'series-queen-of-tears',
    title: 'Queen of Tears',
    originalTitle: '눈물의 여왕',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'The queen of department stores and the prince of supermarkets weather a marital crisis until love miraculously begins to bloom again.',
    longSynopsis: 'Hong Hae-in, the cold-headed third-generation heiress of Queens Group department stores, and Baek Hyun-woo, the humble legal director from rural Yongdu-ri, face the imminent collapse of their high-profile three-year marriage. When shocking medical news surfaces, their buried affections reignite against venomous family boardroom plots.',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.7,
    releaseYear: 2024,
    genres: ['Romance', 'Comedy', 'Drama'],
    tags: ['K-Drama', 'Chaebol Romance', 'Kim Soo-hyun', 'Kim Ji-won', 'Record Breaking'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'ko', label: 'Korean (Dolby 5.1)', isDefault: true }],
    subtitles: [
      { language: 'en', label: 'English', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog Subtitles', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Kim Soo-hyun', role: 'Baek Hyun-woo' },
      { name: 'Kim Ji-won', role: 'Hong Hae-in' },
      { name: 'Park Sung-hoon', role: 'Yoon Eun-sung' }
    ],
    directors: ['Jang Young-woo', 'Kim Hee-won'],
    producers: ['Studio Dragon', 'Showrunners'],
    studio: 'tvN / Studio Dragon',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Reconnecting Love',
        episodes: [
          {
            id: 'qot-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episode 1: The Wedding of the Century',
            synopsis: 'Suffocated by the tyrannical Queens family, Hyun-woo prepares divorce papers until Hae-in delivers life-altering news.',
            duration: 78,
            thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2024-03-09'
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
    id: 'series-crash-landing-on-you',
    title: 'Crash Landing on You',
    originalTitle: '사랑의 불시착',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'A paragliding mishap drops a South Korean heiress in North Korea - and into the life of an army officer, who decides to help her hide.',
    longSynopsis: 'Yoon Se-ri, a fashionable South Korean beauty conglomerate heiress, is swept up in a sudden tornado while paragliding and crash lands in the North Korean DMZ. Captain Ri Jeong-hyeok of the Korean People’s Army discovers her and decides to conceal her identity, giving rise to an unforgettable cross-border love story.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.8,
    releaseYear: 2019,
    endYear: 2020,
    genres: ['Romance', 'Comedy', 'Drama'],
    tags: ['K-Drama', 'BinJin', 'Hyun Bin', 'Son Ye-jin', 'Masterpiece'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'ko', label: 'Korean', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Hyun Bin', role: 'Ri Jeong-hyeok' },
      { name: 'Son Ye-jin', role: 'Yoon Se-ri' }
    ],
    directors: ['Lee Jeong-hyo'],
    producers: ['Studio Dragon'],
    studio: 'tvN / Studio Dragon',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Cross-Border Destiny',
        episodes: [
          {
            id: 'cloy-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episode 1',
            synopsis: 'A freak storm carries Se-ri into hostile territory, where she literally drops out of the sky onto Captain Ri.',
            duration: 70,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2019-12-14'
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
    id: 'series-all-of-us-are-dead',
    title: 'All of Us Are Dead',
    originalTitle: '지금 우리 학교는',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'A high school becomes ground zero for a zombie virus outbreak. Trapped students must fight their way out or turn into the infected.',
    longSynopsis: 'When a biology teacher’s covert experiment unleashes a mutant virus in Hyosan High School, students find themselves cornered without food or phones. Arming themselves with archery bows, broadcast equipment, and desks, the students must survive waves of rabid classmates and super-infected mutants.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.3,
    releaseYear: 2022,
    genres: ['Horror', 'Action', 'Drama', 'Sci-Fi'],
    tags: ['K-Drama', 'Zombies', 'High School Survival', 'High Tension'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'ko', label: 'Korean', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Park Ji-hu', role: 'Nam On-jo' },
      { name: 'Yoon Chan-young', role: 'Lee Cheong-san' }
    ],
    directors: ['Lee JQ', 'Kim Nam-su'],
    producers: ['Film Monster', 'JTBC Studios'],
    studio: 'Netflix Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 13000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Outbreak at Hyosan High',
        episodes: [
          {
            id: 'aouad-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episode 1',
            synopsis: 'A bitten student in the science lab triggers a terrifying chain reaction across the entire school.',
            duration: 65,
            thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '2022-01-28'
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
    id: 'series-the-glory',
    title: 'The Glory',
    originalTitle: '더 글로리',
    type: 'series',
    status: 'PUBLISHED',
    synopsis: 'A woman lives for absolute revenge against her high school childhood bullies who destroyed her life.',
    longSynopsis: 'Moon Dong-eun was subjected to unspeakable physical and emotional torture by wealthy classmates in high school. Two decades later, having earned her teaching credentials, she inserts herself into her tormentor’s life as her young daughter’s homeroom teacher, methodically executing a chilling masterpiece of vengeance.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.6,
    releaseYear: 2022,
    genres: ['Drama', 'Thriller', 'Mystery'],
    tags: ['K-Drama', 'Song Hye-kyo', 'Revenge Masterpiece', 'Dark Thriller'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [{ language: 'ko', label: 'Korean (Dolby 5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Song Hye-kyo', role: 'Moon Dong-eun' },
      { name: 'Lee Do-hyun', role: 'Joo Yeo-jeong' },
      { name: 'Lim Ji-yeon', role: 'Park Yeon-jin' }
    ],
    directors: ['Ahn Gil-ho'],
    producers: ['Hwa&Dam Pictures'],
    studio: 'Netflix Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Part 1',
        episodes: [
          {
            id: 'tg-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episode 1',
            synopsis: 'Tormented by vicious school bullies with no help from authorities, Moon Dong-eun vows to make vengeance her life purpose.',
            duration: 50,
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2022-12-30'
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
  // 4. TOP PHILIPPINE CONTENT (Teleseryes & Classic Cinema)
  // ========================================================
  {
    id: 'ph-batang-quiapo',
    title: "FPJ's Batang Quiapo",
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'A young man rises to become one of the biggest outlaws in Quiapo, Manila, navigating loyalty, family, and street survival.',
    longSynopsis: 'Born and raised in the bustling, unforgiving streets around Quiapo Church, Tanggol grows up amidst petty crimes and tough choices. As he fights for respect and identity in Manila’s grittiest district, Tanggol navigates loyalty, family disputes, and rival crime bosses in this epic modern action-drama inspired by Fernando Poe Jr.’s iconic legacy.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.5,
    releaseYear: 2023,
    genres: ['Action', 'Drama', 'Philippine Cinema'],
    tags: ['Coco Martin', 'Quiapo Manila', 'Pinoy Action', 'Teleserye King', 'Trending PH'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'fil', label: 'Filipino / Tagalog (Dolby 5.1)', isDefault: true }],
    subtitles: [
      { language: 'en', label: 'English Subtitles', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog Subtitles', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Coco Martin', role: 'Hesus Nazareno "Tanggol" Dimaguiba' },
      { name: 'Ivana Alawi', role: 'Bubbles' },
      { name: 'Christopher de Leon', role: 'Don Ramon Montenegro' },
      { name: 'Lovi Poe', role: 'Mokang' }
    ],
    directors: ['Coco Martin', 'Malu Sevilla', 'Darnel Villaflor'],
    producers: ['ABS-CBN Studios', 'CCM Film Productions'],
    studio: 'Kapamilya Online Live',
    regionAvailability: ['GLOBAL'],
    featured: true,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 13000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Ang Pagsilang ni Tanggol',
        episodes: [
          {
            id: 'bq-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Ang Alamat ng Quiapo',
            synopsis: 'Tanggol’s tumultuous origins are forged on the feast day of the Black Nazarene as young street dwellers fight to survive.',
            duration: 45,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '2023-02-13'
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
    id: 'ph-ang-probinsyano',
    title: "FPJ's Ang Probinsyano",
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'A righteous provincial cop assumes the identity of his deceased twin brother to uncover a sinister syndicate inside the police force.',
    longSynopsis: 'Cardo Dalisay, a principled SAF trooper from the province, steps into the shoes of his martyred twin Ador. Across 7 legendary years of record-breaking broadcast, Cardo forms the Vendetta resistance to protect the nation against corrupt politicians and international cartels.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.6,
    releaseYear: 2015,
    endYear: 2022,
    genres: ['Action', 'Drama', 'Philippine Cinema'],
    tags: ['Cardo Dalisay', 'Vendetta', 'Historic Pinoy Series', 'Coco Martin'],
    isProOnly: false,
    maxQuality: '1080p',
    audioTracks: [{ language: 'fil', label: 'Tagalog', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Coco Martin', role: 'Cardo Dalisay / Ador de Leon' },
      { name: 'Yassi Pressman', role: 'Alyana Arevalo' },
      { name: 'Susan Roces', role: 'Flora "Lola Kap" Borja-de Leon' }
    ],
    directors: ['Malu Sevilla', 'Avel Sunpongco'],
    producers: ['Dreamscape Entertainment'],
    studio: 'ABS-CBN Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 6000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Paghihiganti',
        episodes: [
          {
            id: 'ap-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Ang Simula ng Kambal',
            synopsis: 'Ador is separated from his twin Cardo at youth, following divergent journeys toward the police force.',
            duration: 44,
            thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '2015-09-28'
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
    id: 'ph-maria-clara-at-ibarra',
    title: 'Maria Clara at Ibarra',
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'A Gen Z nursing student finds herself magically transported into the world of Dr. Jose Rizal’s masterpiece novel, Noli Me Tangere.',
    longSynopsis: 'Klay Infantes, an outspoken and practical modern-day nursing student, falls asleep while reading Jose Rizal’s Noli Me Tangere. She awakens inside 1887 Spanish-colonial San Diego, meeting Crisostomo Ibarra and Maria Clara. Her 21st-century perspective challenges societal norms and alters history.',
    posterUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 9.8,
    releaseYear: 2022,
    endYear: 2023,
    genres: ['Fantasy', 'Drama', 'Adventure', 'Philippine Cinema'],
    tags: ['GMA Masterpiece', 'Jose Rizal', 'Noli Me Tangere', 'Barbie Forteza', 'Dennis Trillo'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'fil', label: 'Filipino / Spanish (Dolby 5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Barbie Forteza', role: 'Klay Infantes' },
      { name: 'Dennis Trillo', role: 'Crisostomo Ibarra / Simoun' },
      { name: 'Julie Anne San Jose', role: 'Maria Clara' },
      { name: 'David Licauco', role: 'Fidel Reyes' }
    ],
    directors: ['Zig Dulay'],
    producers: ['GMA Entertainment Group'],
    studio: 'GMA Network',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Ang Nobela',
        episodes: [
          {
            id: 'mci-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Ang Pagsisimula',
            synopsis: 'Working student Klay questions the relevance of history class and falls into a magical book into colonial Manila.',
            duration: 48,
            thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2022-10-03'
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
    id: 'ph-cant-buy-me-love',
    title: "Can't Buy Me Love",
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'A hardworking Binondo ramen seller’s life becomes entangled with a wealthy heiress targeted by an extortion kidnap attempt.',
    longSynopsis: 'Bingo Mariano is an industrious Binondo street hustler working odd jobs to support his ailing grandmother. Caroline Tiu is the rejected black sheep of a powerful Chinese-Filipino real estate conglomerate. When Bingo witnesses Caroline’s abduction and rescues her, their colliding worlds ignite romance and dangerous corporate conspiracies.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 9.5,
    releaseYear: 2023,
    endYear: 2024,
    genres: ['Romance', 'Comedy', 'Drama', 'Philippine Cinema'],
    tags: ['DonBelle', 'Binondo Manila', 'Donny Pangilinan', 'Belle Mariano', 'Top 1 PH'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'fil', label: 'Filipino / Hokkien', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Donny Pangilinan', role: 'Bingo Mariano' },
      { name: 'Belle Mariano', role: 'Caroline Tiu' }
    ],
    directors: ['Mae Cruz-Alviar', 'Ian Loreños'],
    producers: ['Star Creatives'],
    studio: 'ABS-CBN Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 11000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Binondo Nights',
        episodes: [
          {
            id: 'cbml-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'The Collision',
            synopsis: 'Bingo’s delivery routine is shattered when Caroline falls into the river running from armed abductors in Chinatown.',
            duration: 45,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2023-10-16'
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
    id: 'ph-hello-love-goodbye',
    title: 'Hello, Love, Goodbye',
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'Two Overseas Filipino Workers in Hong Kong find solace and unexpected romance in each other while striving for their divergent dreams.',
    longSynopsis: 'Joy Marie Fabregas is a domestic helper in Hong Kong aspiring to immigrate to Canada as a nurse. Ethan Del Rosario is a charismatic bartender waiting for his residency. As their paths cross and romance sparks, they must decide between personal sacrifice, love, and the futures they envisioned.',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 9.6,
    releaseYear: 2019,
    duration: 118,
    genres: ['Romance', 'Drama', 'Philippine Cinema'],
    tags: ['KathDen', 'Hong Kong', 'OFW', 'Blockbuster Record', 'Heartfelt'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'fil', label: 'Filipino / Tagalog (Dolby 5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Kathryn Bernardo', role: 'Joy Marie Fabregas' },
      { name: 'Alden Richards', role: 'Ethan Del Rosario' }
    ],
    directors: ['Cathy Garcia-Molina'],
    producers: ['Star Cinema'],
    studio: 'ABS-CBN Film Productions',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 12000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'ph-rewind',
    title: 'Rewind',
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'Given a miraculous chance to turn back time after a tragic car crash, a man fights to save his wife by fixing the mistakes of his past.',
    longSynopsis: 'John and Mary’s once-blissful marriage deteriorates under professional pressure and resentment. When an argument results in a fatal car accident claiming Mary’s life, a celestial entity offers John the chance to relive the fatal day and alter their destiny.',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 9.7,
    releaseYear: 2023,
    duration: 112,
    genres: ['Drama', 'Romance', 'Philippine Cinema'],
    tags: ['DongYan', 'Second Chances', 'Highest Grossing PH Film', 'Emotional'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [{ language: 'fil', label: 'Filipino / Tagalog', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Dingdong Dantes', role: 'John' },
      { name: 'Marian Rivera', role: 'Mary' }
    ],
    directors: ['Mae Cruz-Alviar'],
    producers: ['Star Cinema', 'APT Entertainment'],
    studio: 'ABS-CBN Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 13000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'ph-on-the-job',
    title: 'On the Job (OTJ)',
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'Prison inmates are temporarily released to carry out assassinations for influential politicians and military officials.',
    longSynopsis: 'Veteran inmate Tatang and his protege Daniel are regularly smuggled out of state penitentiaries by corrupt wardens to execute high-profile political hits. Meanwhile, idealistic law enforcers race against time to connect the executions to the highest corridors of power.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.4,
    releaseYear: 2013,
    duration: 121,
    genres: ['Action', 'Crime', 'Thriller', 'Philippine Cinema'],
    tags: ['Erik Matti', 'Piolo Pascual', 'Gerald Anderson', 'Cannes Film Festival'],
    isProOnly: false,
    maxQuality: '1080p',
    audioTracks: [{ language: 'fil', label: 'Filipino / Tagalog (Dolby 5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Piolo Pascual', role: 'Francis Coronel Jr.' },
      { name: 'Gerald Anderson', role: 'Daniel' },
      { name: 'Joel Torre', role: 'Mario "Tatang" Maghari' }
    ],
    directors: ['Erik Matti'],
    producers: ['Reality Entertainment', 'Star Cinema'],
    studio: 'Reality MM Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: false,
    videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'ph-heneral-luna',
    title: 'Heneral Luna',
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'General Antonio Luna faces an uphill battle against the American military while confronting toxic factionalism within his own republic.',
    longSynopsis: 'Set during the Philippine-American War, General Antonio Luna, fiery military commander of the young Philippine Revolutionary Army, seeks to lead his countrymen against American colonial forces. However, Luna’s greatest battle is not with foreign invaders, but with treacherous oligarchs and cowardice among his own cabinet.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.7,
    releaseYear: 2015,
    duration: 118,
    genres: ['Action', 'Drama', 'Philippine Cinema'],
    tags: ['Historical Epic', 'John Arcilla', 'Artikulo Uno', 'Patriotism'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'fil', label: 'Filipino (Dolby 5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'John Arcilla', role: 'General Antonio Luna' },
      { name: 'Mon Confiado', role: 'President Emilio Aguinaldo' }
    ],
    directors: ['Jerrold Tarog'],
    producers: ['Artikulo Uno Productions'],
    studio: 'TBA Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 12000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'ph-four-sisters',
    title: 'Four Sisters and a Wedding',
    type: 'ph_content',
    status: 'PUBLISHED',
    synopsis: 'Four sisters reunite to dissuade their youngest brother from rushing into marriage, forcing them to confront years of unspoken resentment.',
    longSynopsis: 'The Salazar sisters—Teddie, Bobbie, Alex, and Gabbie—gather home in Manila upon learning their baby brother CJ plans to marry his girlfriend of three months. In their absurd quest to sabotage the engagement, buried childhood grievances and career insecurities explode in an unforgettable confrontation.',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 9.6,
    releaseYear: 2013,
    duration: 125,
    genres: ['Comedy', 'Drama', 'Philippine Cinema'],
    tags: ['Salazar Sisters', 'Iconic Confrontation', 'Star Cinema Classic', 'Family Comedy'],
    isProOnly: false,
    maxQuality: '1080p',
    audioTracks: [{ language: 'fil', label: 'Tagalog (Stereo)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
    cast: [
      { name: 'Bea Alonzo', role: 'Bobbie Salazar' },
      { name: 'Toni Gonzaga', role: 'Teddie Salazar' },
      { name: 'Angel Locsin', role: 'Alex Salazar' },
      { name: 'Shaina Magdayao', role: 'Gabbie Salazar' },
      { name: 'Enchong Dee', role: 'CJ / Reb-Reb Salazar' }
    ],
    directors: ['Cathy Garcia-Molina'],
    producers: ['Star Cinema'],
    studio: 'ABS-CBN Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: false,
    videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },

  // ========================================================
  // 5. BLOCKBUSTER HOLLYWOOD MOVIES & CINEPHILE MASTERPIECES
  // ========================================================
  {
    id: 'movie-oppenheimer',
    title: 'Oppenheimer',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    longSynopsis: 'During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to direct the secret Manhattan Project at Los Alamos. Working alongside the century’s greatest scientific minds, Oppenheimer races against Nazi Germany to fabricate the atomic bomb, unleashing an apocalyptic new era that forever alters human history.',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.8,
    releaseYear: 2023,
    duration: 180,
    genres: ['Drama', 'Thriller'],
    tags: ['Christopher Nolan', 'Oscar Best Picture', '70mm IMAX', 'Cillian Murphy', '4K UHD'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'en', label: 'English (Dolby Atmos 7.1)', isDefault: true }
    ],
    subtitles: [
      { language: 'en', label: 'English CC', url: '', isDefault: true },
      { language: 'fil', label: 'Tagalog Subtitles', url: '', isDefault: false }
    ],
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer' },
      { name: 'Emily Blunt', role: 'Kitty Oppenheimer' },
      { name: 'Matt Damon', role: 'Leslie Groves Jr.' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss' },
      { name: 'Florence Pugh', role: 'Jean Tatlock' }
    ],
    directors: ['Christopher Nolan'],
    producers: ['Emma Thomas', 'Charles Roven', 'Christopher Nolan'],
    studio: 'Universal Pictures / Syncopy',
    regionAvailability: ['GLOBAL'],
    featured: true,
    trending: true,
    newRelease: true,
    videoSources: [
      { quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 16000, codec: 'H.264' },
      { quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 6500, codec: 'H.264' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'movie-dune-2',
    title: 'Dune: Part Two',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    longSynopsis: 'Paul Atreides continues his mythic journey alongside Chani and the Fremen in the harsh deserts of Arrakis. Faced with a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible holy war in his name that only he can foresee.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.8,
    releaseYear: 2024,
    duration: 166,
    genres: ['Sci-Fi', 'Adventure', 'Action', 'Drama'],
    tags: ['Arrakis', 'Sandworms', 'Denis Villeneuve', 'IMAX Epic', '4K UHD'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides / Muad’Dib' },
      { name: 'Zendaya', role: 'Chani' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica' },
      { name: 'Austin Butler', role: 'Feyd-Rautha Harkonnen' }
    ],
    directors: ['Denis Villeneuve'],
    producers: ['Legendary Pictures'],
    studio: 'Warner Bros. Pictures',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 16000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'movie-interstellar',
    title: 'Interstellar',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
    longSynopsis: 'In the mid-21st century, crop blights and dust storms gradually make Earth unlivable. Cooper, a widowed former NASA test pilot turned corn farmer, is recruited for a clandestine interstellar mission. Passing through a mysterious wormhole near Saturn, his crew surveys three distant planets orbiting Gargantua, a supermassive black hole.',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.8,
    releaseYear: 2014,
    duration: 169,
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    tags: ['Gargantua', 'Black Hole', 'Hans Zimmer Score', 'Space Exploration', 'Emotional'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Matthew McConaughey', role: 'Joseph Cooper' },
      { name: 'Anne Hathaway', role: 'Dr. Amelia Brand' },
      { name: 'Jessica Chastain', role: 'Murphy Cooper' },
      { name: 'Michael Caine', role: 'Professor John Brand' }
    ],
    directors: ['Christopher Nolan'],
    producers: ['Emma Thomas', 'Christopher Nolan', 'Lynda Obst'],
    studio: 'Paramount Pictures / Warner Bros.',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 15000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'movie-inception',
    title: 'Inception',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    longSynopsis: 'Dom Cobb is a skilled extractor, the best at stealing valuable corporate secrets from deep within the subconscious during the dream state. Offered a chance at redemption and return to his children, Cobb is tasked with the impossible: inception—planting an idea inside a mind rather than stealing one.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.8,
    releaseYear: 2010,
    duration: 148,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    tags: ['Dream Heist', 'Mind-Bending', 'Hans Zimmer', 'Spinning Top', '4K UHD'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby 5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Dom Cobb' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur' },
      { name: 'Elliot Page', role: 'Ariadne' },
      { name: 'Tom Hardy', role: 'Eames' },
      { name: 'Ken Watanabe', role: 'Saito' }
    ],
    directors: ['Christopher Nolan'],
    producers: ['Emma Thomas', 'Christopher Nolan'],
    studio: 'Warner Bros. Pictures / Syncopy',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 14000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'movie-spider-verse',
    title: 'Spider-Man: Across the Spider-Verse',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    longSynopsis: 'Miles Morales reunites with Gwen Stacy and is catapulted across the Multiverse to the Spider Society headquarters in Nueva York. When the heroes clash on how to handle the Spot and canonical tragedies, Miles finds himself pitted against Miguel O’Hara and must redefine what it means to be a hero.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 9.8,
    releaseYear: 2023,
    duration: 140,
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    tags: ['Miles Morales', 'Multiverse', 'Visual Masterpiece', 'Gwen Stacy', '4K UHD'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales (Voice)' },
      { name: 'Hailee Steinfeld', role: 'Gwen Stacy (Voice)' },
      { name: 'Oscar Isaac', role: 'Miguel O’Hara / Spider-Man 2099' }
    ],
    directors: ['Joaquim Dos Santos', 'Kemp Powers', 'Justin K. Thompson'],
    producers: ['Phil Lord', 'Christopher Miller', 'Amy Pascal'],
    studio: 'Sony Pictures Animation',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 14000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'movie-the-dark-knight',
    title: 'The Dark Knight',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    longSynopsis: 'With the help of Lt. Jim Gordon and DA Harvey Dent, Batman keeps a tight lid on crime in Gotham City. But when a psychopathic criminal mastermind known as the Joker emerges from the criminal underworld, he plunges the city into terrifying anarchy and forces the Dark Knight to cross the line between hero and vigilante.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.9,
    releaseYear: 2008,
    duration: 152,
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    tags: ['Heath Ledger Joker', 'Batman', 'Christopher Nolan', 'Oscar Winner', 'Masterpiece'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman' },
      { name: 'Heath Ledger', role: 'The Joker' },
      { name: 'Aaron Eckhart', role: 'Harvey Dent' },
      { name: 'Gary Oldman', role: 'Lt. James Gordon' },
      { name: 'Michael Caine', role: 'Alfred Pennyworth' }
    ],
    directors: ['Christopher Nolan'],
    producers: ['Emma Thomas', 'Charles Roven', 'Christopher Nolan'],
    studio: 'Warner Bros. Pictures / DC Comics',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 15000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'movie-avengers-endgame',
    title: 'Avengers: Endgame',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos’ actions.',
    longSynopsis: 'Five years after Thanos snapped away half of all living creatures in the cosmos, the shattered remaining Avengers—Iron Man, Captain America, Thor, Black Widow, Hulk, and Hawkeye—unite with Ant-Man to embark on a daring time heist across quantum space to retrieve the Infinity Stones and bring everyone back.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.7,
    releaseYear: 2019,
    duration: 181,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    tags: ['Marvel Cinematic Universe', 'Avengers Assemble', 'Infinity Saga', 'Blockbuster Record'],
    isProOnly: true,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Robert Downey Jr.', role: 'Tony Stark / Iron Man' },
      { name: 'Chris Evans', role: 'Steve Rogers / Captain America' },
      { name: 'Scarlett Johansson', role: 'Natasha Romanoff / Black Widow' },
      { name: 'Chris Hemsworth', role: 'Thor' }
    ],
    directors: ['Anthony Russo', 'Joe Russo'],
    producers: ['Kevin Feige'],
    studio: 'Marvel Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 15000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'movie-top-gun-maverick',
    title: 'Top Gun: Maverick',
    type: 'movie',
    status: 'PUBLISHED',
    synopsis: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOPGUN’s elite graduates.',
    longSynopsis: 'After more than thirty years of service as one of the Navy’s top aviators, Pete "Maverick" Mitchell is where he belongs, pushing the envelope as a courageous test pilot. When he finds himself training a detachment of Top Gun graduates for a specialized mission unlike any living pilot has ever seen, Maverick encounters Lt. Bradley Bradshaw, the son of his late friend Goose.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG-13',
    score: 9.7,
    releaseYear: 2022,
    duration: 130,
    genres: ['Action', 'Drama'],
    tags: ['Tom Cruise', 'Naval Aviation', 'Dogfight', 'Practical Stunts', '4K UHD'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Tom Cruise', role: 'Capt. Pete "Maverick" Mitchell' },
      { name: 'Miles Teller', role: 'Lt. Bradley "Rooster" Bradshaw' },
      { name: 'Jennifer Connelly', role: 'Penny Benjamin' }
    ],
    directors: ['Joseph Kosinski'],
    producers: ['Jerry Bruckheimer', 'Tom Cruise', 'Christopher McQuarrie'],
    studio: 'Paramount Pictures / Skydance',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 14000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'movie-spirited-away',
    title: 'Spirited Away',
    originalTitle: '千と千尋の神隠し',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'During her family’s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, and where humans are changed into beasts.',
    longSynopsis: 'While moving to a new neighborhood, Chihiro and her parents discover an abandoned amusement park. When her parents turn into giant pigs after eating spirit food, Chihiro must work at an opulent supernatural bathhouse run by the sorceress Yubaba to regain her real name and free her parents.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 9.9,
    releaseYear: 2001,
    duration: 125,
    genres: ['Animation', 'Adventure', 'Fantasy', 'Family'],
    tags: ['Studio Ghibli', 'Hayao Miyazaki', 'Academy Award Winner', 'Masterpiece of All Time'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'ja', label: 'Japanese (Dolby 5.1)', isDefault: true },
      { language: 'en', label: 'English Dub', isDefault: false }
    ],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Rumi Hiiragi', role: 'Chihiro Ogino / Sen (Voice)' },
      { name: 'Miyu Irino', role: 'Haku (Voice)' }
    ],
    directors: ['Hayao Miyazaki'],
    producers: ['Toshio Suzuki'],
    studio: 'Studio Ghibli',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 12000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'movie-your-name',
    title: 'Your Name',
    originalTitle: '君の名は。 (Kimi no Na wa)',
    type: 'anime',
    status: 'PUBLISHED',
    synopsis: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    longSynopsis: 'Mitsuha Miyamizu, a high school girl living in rural Itomori, yearns for the vibrant life of Tokyo. Meanwhile, Taki Tachibana is a busy high school boy juggling city life and architecture sketches in Tokyo. When they begin randomly swapping bodies, their initial frustration turns into deep affection—until a cosmic comet reveals a heartbreaking temporal truth.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'PG',
    score: 9.8,
    releaseYear: 2016,
    duration: 106,
    genres: ['Animation', 'Drama', 'Fantasy', 'Romance'],
    tags: ['Makoto Shinkai', 'Radwimps Soundtrack', 'Body Swap', 'Emotional Masterpiece'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [
      { language: 'ja', label: 'Japanese (Dolby 5.1)', isDefault: true },
      { language: 'en', label: 'English Dub', isDefault: false }
    ],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Ryunosuke Kamiki', role: 'Taki Tachibana (Voice)' },
      { name: 'Mone Kamishiraishi', role: 'Mitsuha Miyamizu (Voice)' }
    ],
    directors: ['Makoto Shinkai'],
    producers: ['CoMix Wave Films', 'TOHO'],
    studio: 'CoMix Wave Films',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 13000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },

  // ========================================================
  // 6. ACCLAIMED DOCUMENTARIES & SPORTS DOCUSERIES
  // ========================================================
  {
    id: 'doc-planet-earth-3',
    title: 'Planet Earth III',
    type: 'documentary',
    status: 'PUBLISHED',
    synopsis: 'Sir David Attenborough narrates this landmark nature series celebrating the wonders of our world and the resilience of wildlife in the face of rapid change.',
    longSynopsis: 'Filmed over nearly five years across 43 countries, Planet Earth III reveals unprecedented wildlife behaviors from the deepest ocean trenches to the highest mountain ridges. Captured in breathtaking 4K high-speed cinematic resolution, this definitive BBC natural history documentary explores the extraordinary adaptations of life on Earth.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'G',
    score: 9.8,
    releaseYear: 2023,
    duration: 60,
    genres: ['Documentary'],
    tags: ['David Attenborough', 'BBC Earth', '4K UHD HDR', 'Wildlife', 'Ocean'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [{ name: 'David Attenborough', role: 'Narrator' }],
    directors: ['Michael Gunton', 'Matt Brandon'],
    producers: ['BBC Studios Natural History Unit'],
    studio: 'BBC Earth',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: false,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 16000, codec: 'H.264' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: 'doc-the-last-dance',
    title: 'The Last Dance',
    type: 'documentary',
    status: 'PUBLISHED',
    synopsis: 'Charting the rise of the 1990s Chicago Bulls, led by Michael Jordan, one of the most notable dynasties in sports history.',
    longSynopsis: 'In the autumn of 1997, Michael Jordan, Chicago Bulls owner Jerry Reinsdorf, and head coach Phil Jackson agreed to let an NBA Entertainment crew follow the team all season long. The result is an unflinching 10-part portrait of an iconic champion and a sports dynasty at its legendary peak.',
    posterUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.7,
    releaseYear: 2020,
    genres: ['Documentary'],
    tags: ['Michael Jordan', 'Chicago Bulls', 'NBA Dynasty', 'Emmy Winner', 'Sports'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby 5.1)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Michael Jordan', role: 'Himself' },
      { name: 'Scottie Pippen', role: 'Himself' },
      { name: 'Dennis Rodman', role: 'Himself' },
      { name: 'Phil Jackson', role: 'Himself' }
    ],
    directors: ['Jason Hehir'],
    producers: ['ESPN Films', 'Netflix'],
    studio: 'ESPN Films',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: false,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_PREMIERE, bitrate: 12000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: 1997-1998 Championship Season',
        episodes: [
          {
            id: 'tld-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episode 1',
            synopsis: 'Flashbacks chronicle Michael Jordan’s college career and early days with the struggling Chicago Bulls.',
            duration: 50,
            thumbnailUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_PREMIERE, bitrate: 5500, codec: 'H.264' }],
            airDate: '2020-04-19'
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
    id: 'doc-drive-to-survive',
    title: 'Formula 1: Drive to Survive',
    type: 'documentary',
    status: 'PUBLISHED',
    synopsis: 'Drivers, managers and team owners live life in the fast lane — both on and off the track — during each cutthroat season of Formula 1 racing.',
    longSynopsis: 'Offering exclusive, unprecedented access to the world’s fastest drivers, team principals, and billionaires, Formula 1: Drive to Survive takes viewers inside the paddocks of Ferrari, Mercedes, Red Bull, and McLaren through wheel-to-wheel battles and intense political drama.',
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    maturityRating: 'R',
    score: 9.4,
    releaseYear: 2019,
    genres: ['Documentary'],
    tags: ['Formula 1', 'Motorsport', 'High Adrenaline', 'Max Verstappen', 'Lewis Hamilton'],
    isProOnly: false,
    maxQuality: '2160p',
    audioTracks: [{ language: 'en', label: 'English (Dolby Atmos)', isDefault: true }],
    subtitles: [{ language: 'en', label: 'English CC', url: '', isDefault: true }],
    cast: [
      { name: 'Max Verstappen', role: 'Himself' },
      { name: 'Lewis Hamilton', role: 'Himself' },
      { name: 'Toto Wolff', role: 'Himself' },
      { name: 'Christian Horner', role: 'Himself' }
    ],
    directors: ['James Gay-Rees', 'Paul Martin'],
    producers: ['Box to Box Films'],
    studio: 'Netflix Studios',
    regionAvailability: ['GLOBAL'],
    featured: false,
    trending: true,
    newRelease: true,
    videoSources: [{ quality: '2160p', url: HLS_STREAM_ACTION, bitrate: 13000, codec: 'H.264' }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: All to Play For',
        episodes: [
          {
            id: 'dts-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'All to Play For',
            synopsis: 'At the Australian Grand Prix in Melbourne, Red Bull Racing driver Daniel Ricciardo looks to make a statement on home soil.',
            duration: 40,
            thumbnailUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
            videoSources: [{ quality: '1080p', url: HLS_STREAM_ACTION, bitrate: 5500, codec: 'H.264' }],
            airDate: '2019-03-08'
          }
        ]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    createdBy: 'system'
  }
];
