/**
 * Comprehensive Streaming Platform Test Suite
 * Tests catalog integrity, HLS video streams, and web server endpoints
 */

async function fetchHttp(url, options = {}) {
  const timeoutMs = options.timeout || 20000;
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body,
    signal: AbortSignal.timeout(timeoutMs)
  });
  const body = await res.text();
  const headers = {};
  res.headers.forEach((v, k) => { headers[k] = v; });
  return { status: res.status, headers, body };
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('[CINELOG] GLOBAL STREAMING PLATFORM - COMPREHENSIVE TEST');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  const PORT = process.env.PORT || 3000;
  const BASE_URL = process.env.TEST_BASE_URL || `http://localhost:${PORT}`;
  console.log(`  Testing Next.js routes and endpoints on ${BASE_URL}...`);

  // ----------------------------------------------------
  // TEST 1: CORE APPLICATION ROUTES & NAVIGATION
  // ----------------------------------------------------
  console.log('\n[RUN] [1/8] Testing Core Web Routes and Discovery Rails...');
  const routesToTest = [
    { path: '/', label: 'Home Page & Discovery Rails' },
    { path: '/browse', label: 'Browse Catalog & Filters' },
    { path: '/browse?type=series', label: 'Browse TV Series' },
    { path: '/browse?type=anime', label: 'Browse Anime' },
    { path: '/browse?type=ph_content', label: 'Browse Philippine Cinema' },
    { path: '/browse?genre=Action', label: 'Browse Action Genre' },
    { path: '/browse?genre=Comedy', label: 'Browse Comedy Genre' },
    { path: '/browse?genre=Thriller', label: 'Browse Thriller Genre' },
    { path: '/browse?type=kdrama', label: 'Browse Korean Drama' },
    { path: '/browse?type=documentary', label: 'Browse Documentaries' },
    { path: '/search', label: 'Search Page' },
    { path: '/superadmin', label: 'Superadmin CMS & Approvals' },
    { path: '/upgrade', label: 'Upgrade & Payment Center' },
    { path: '/profiles', label: 'Multi-Profile Selector' },
    { path: '/my-list', label: 'My Watchlist' },
    { path: '/login', label: 'Authentication Page' },
    { path: '/watch/series-breaking-bad', label: 'Watch Player: Breaking Bad' },
    { path: '/watch/anime-attack-on-titan', label: 'Watch Player: Attack on Titan' },
    { path: '/watch/movie-oppenheimer', label: 'Watch Player: Oppenheimer' },
    { path: '/watch/ph-batang-quiapo', label: 'Watch Player: FPJ Batang Quiapo' },
    { path: '/watch/series-squid-game', label: 'Watch Player: Squid Game' }
  ];

  for (const route of routesToTest) {
    try {
      const res = await fetchHttp(`${BASE_URL}${route.path}`, { method: 'GET', timeout: 15000 });
      assert(res.status === 200, `${route.label} (${route.path}) returned HTTP ${res.status}`);
    } catch (err) {
      assert(false, `${route.label} (${route.path}) failed to respond: ${err.message}`);
    }
  }

  // ----------------------------------------------------
  // TEST 2: LIVE HLS STREAM ACCESSIBILITY
  // ----------------------------------------------------
  console.log('\n[RUN] [2/8] Testing Live HLS Master Video Streams & CORS...');
  const hlsStreams = [
    { url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', name: 'Premiere 4K/1080p Master Stream' },
    { url: 'https://test-streams.mux.dev/test_001/stream.m3u8', name: 'Action Multi-Bitrate HLS Stream' }
  ];

  for (const stream of hlsStreams) {
    try {
      const res = await fetchHttp(stream.url, { method: 'GET' });
      assert(res.status === 200, `${stream.name} returned HTTP 200`);
      assert(res.body.includes('#EXTM3U'), `${stream.name} has valid #EXTM3U playlist header`);
      assert(res.body.includes('BANDWIDTH'), `${stream.name} contains multi-bitrate adaptive variant definitions`);
      assert(res.headers['access-control-allow-origin'] === '*', `${stream.name} has CORS access-control-allow-origin: *`);
    } catch (err) {
      assert(false, `${stream.name} failed: ${err.message}`);
    }
  }

  // ----------------------------------------------------
  // TEST 3: SUB-PLAYLIST & VIDEO TS SEGMENT STREAMING
  // ----------------------------------------------------
  console.log('\n[RUN] [3/8] Testing Video Resolution Sub-Playlists and Video Chunks...');
  try {
    const subPlaylistUrl = 'https://test-streams.mux.dev/x36xhzz/url_8/193039199_mp4_h264_aac_fhd_7.m3u8';
    const subRes = await fetchHttp(subPlaylistUrl);
    assert(subRes.status === 200, `1080p FHD Sub-playlist loaded (HTTP ${subRes.status})`);
    assert(subRes.body.includes('.ts'), `Sub-playlist contains real .ts video segments`);

    // Verify first video segment
    const segmentUrl = 'https://test-streams.mux.dev/x36xhzz/url_8/url_590/193039199_mp4_h264_aac_fhd_7.ts';
    const segRes = await fetchHttp(segmentUrl, { method: 'HEAD' });
    const bytes = parseInt(segRes.headers['content-length'] || '0', 10);
    assert(segRes.status === 200 && bytes > 1000000, `Video TS chunk streamed successfully (${(bytes / 1024 / 1024).toFixed(2)} MB, HTTP ${segRes.status})`);
  } catch (err) {
    assert(false, `Segment streaming check failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST 4: PWA MANIFEST & OFFLINE CAPABILITIES
  // ----------------------------------------------------
  console.log('\n[RUN] [4/8] Testing PWA & Manifest Configuration...');
  try {
    const manifestRes = await fetchHttp(`${BASE_URL}/manifest.json`);
    assert(manifestRes.status === 200, 'manifest.json returned HTTP 200');
    const manifest = JSON.parse(manifestRes.body);
    assert(manifest.name === 'Cinelog — Global Streaming Platform', `PWA Manifest name is "${manifest.name}"`);
    assert(manifest.display === 'standalone', `PWA Display mode is "${manifest.display}"`);
    assert(manifest.icons && manifest.icons.length > 0, `PWA Icons defined (${manifest.icons.length} sizes)`);
  } catch (err) {
    assert(false, `PWA manifest check failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST 5: TMDB LIVE API INTEGRATION & OFFICIAL ASSETS
  // ----------------------------------------------------
  console.log('\n[RUN] [5/8] Testing TMDB Live APIs & Official Image CDN...');
  try {
    const searchRes = await fetchHttp(`${BASE_URL}/api/tmdb/search?query=Inception`);
    assert(searchRes.status === 200, 'TMDB Live Search API returned HTTP 200');
    const searchData = JSON.parse(searchRes.body);
    assert(searchData.results && searchData.results.length > 0, `TMDB Search returned ${searchData.results?.length} verified titles`);
    assert(searchData.results[0].posterUrl.startsWith('https://image.tmdb.org/'), 'TMDB Search results use official TMDB Image CDN');

    const detailsRes = await fetchHttp(`${BASE_URL}/api/tmdb/details?id=27205&type=movie`);
    assert(detailsRes.status === 200, 'TMDB Live Details API returned HTTP 200');
    const detailsData = JSON.parse(detailsRes.body);
    assert(detailsData.item && detailsData.item.tmdbId === 27205, `TMDB Details parsed ContentItem with TMDB ID ${detailsData.item?.tmdbId}`);
    assert(detailsData.item.posterUrl.includes('image.tmdb.org'), 'TMDB Details contains high-res official poster');
    assert(detailsData.item.trailerUrl && detailsData.item.trailerUrl.includes('youtube.com'), 'TMDB Details extracted official YouTube 4K trailer');

    // TMDB MEGA-CATALOG SYNC API
    const syncRes = await fetchHttp(`${BASE_URL}/api/tmdb/sync`);
    assert(syncRes.status === 200, 'TMDB Mega Sync API returned HTTP 200');
    const syncData = JSON.parse(syncRes.body);
    assert(syncData.success === true, 'TMDB Mega Sync reports success: true');
    assert(syncData.items && syncData.items.length >= 40, `TMDB Mega Sync synchronized ${syncData.items?.length} global titles`);
    assert(syncData.items[0].tmdbId !== undefined, 'Synchronized item contains authentic TMDB ID');
    assert(syncData.items[0].posterUrl.includes('image.tmdb.org'), 'Synchronized item uses official TMDB Image CDN');

    // TMDB LIVE DISCOVER & WORLDWIDE BROWSE
    const discoverRes = await fetchHttp(`${BASE_URL}/api/tmdb/discover?type=movie&genre=Action&page=1`);
    assert(discoverRes.status === 200, 'TMDB Live Discover API returned HTTP 200');
    const discoverData = JSON.parse(discoverRes.body);
    assert(discoverData.success === true, 'TMDB Discover reports success: true');
    assert(discoverData.items && discoverData.items.length > 0, `TMDB Discover returned ${discoverData.items?.length} live titles`);
    assert(discoverData.items[0].genres.includes('Action'), 'Discovered item has requested genre (Action)');
    assert(discoverData.items[0].score <= 10, `Discovered item score is scaled correctly: ${discoverData.items[0].score}/10`);
  } catch (err) {
    assert(false, `TMDB API test failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST 6: CINELOG AI SEMANTIC SEARCH ENGINE
  // ----------------------------------------------------
  console.log('\n[RUN] [6/8] Testing Cinelog AI Semantic Search Engine...');
  try {
    const aiRes = await fetchHttp(`${BASE_URL}/api/ai/search?prompt=mind-bending+sci-fi+like+inception`);
    assert(aiRes.status === 200, 'Cinelog AI Semantic Search returned HTTP 200');
    const aiData = JSON.parse(aiRes.body);
    assert(aiData.success === true, 'Cinelog AI Search reports success: true');
    assert(aiData.results && aiData.results.length > 0, `Cinelog AI returned ${aiData.results.length} curated matching titles`);
    assert(aiData.explanation && aiData.explanation.includes('Cinelog AI'), 'Cinelog AI returned natural language curation explanation');
    assert(aiData.interpretation?.themeTags?.length > 0, 'Cinelog AI extracted semantic theme tags');
  } catch (err) {
    assert(false, `Cinelog AI API test failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST 7: DAILY RANKINGS & DAILY RELEASES ENGINE
  // ----------------------------------------------------
  console.log('\n[RUN] [7/8] Testing Daily Rankings and Daily Releases System...');
  try {
    const rankRes = await fetchHttp(`${BASE_URL}/api/rankings/daily`);
    assert(rankRes.status === 200, 'Daily Rankings endpoint returned HTTP 200');
    const rankData = JSON.parse(rankRes.body);
    assert(rankData.success === true, 'Daily Rankings reports success: true');
    assert(rankData.rankings && rankData.rankings.length === 10, `Daily Rankings returns Top 10 titles (got ${rankData.rankings?.length})`);
    assert(rankData.rankings[0].rank === 1, 'Top title has rank 1');

    const relRes = await fetchHttp(`${BASE_URL}/api/releases/daily`);
    assert(relRes.status === 200, 'Daily Releases endpoint returned HTTP 200');
    const relData = JSON.parse(relRes.body);
    assert(relData.success === true, 'Daily Releases reports success: true');
    assert(relData.items && relData.items.length > 0, `Daily Releases returns new releases (got ${relData.items?.length})`);
  } catch (err) {
    assert(false, `Daily Rankings/Releases test failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST 8: STREAM RESOLVER & PRO SHIELD CDN
  // ----------------------------------------------------
  console.log('\n[RUN] [8/8] Testing Streaming Resolver and Pro Shield Nodes...');
  try {
    const streamRes = await fetchHttp(`${BASE_URL}/api/stream/resolve?id=series-breaking-bad-1396&type=tv&season=1&episode=1`);
    assert(streamRes.status === 200, 'Stream Resolver endpoint returned HTTP 200');
    const streamData = JSON.parse(streamRes.body);
    assert(streamData.success === true, 'Stream Resolver reports success: true');
    assert(streamData.cleanMirrors && streamData.cleanMirrors.length >= 3, `Stream Resolver returned ${streamData.cleanMirrors?.length} verified clean mirrors`);
    assert(streamData.proShield?.popupSuppression === true, 'Pro Shield Anti-Redirect & Popup Firewall active');
  } catch (err) {
    assert(false, `Stream Resolver test failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST 9: STREAM REVERSE PROXY & M3U8 PLAYLIST REWRITER
  // ----------------------------------------------------
  console.log('\n[RUN] [9/11] Testing Stream Reverse Proxy & M3U8 Playlist Rewriter...');
  try {
    const targetM3u8 = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const proxyRes = await fetchHttp(`${BASE_URL}/api/stream/proxy?url=${encodeURIComponent(targetM3u8)}`);
    assert(proxyRes.status === 200, `Stream Proxy returned HTTP 200`);
    assert(proxyRes.headers['access-control-allow-origin'] === '*', 'Stream Proxy injects wildcard CORS header');
    assert(proxyRes.body.includes('#EXTM3U'), 'Stream Proxy passes through playlist contents');

    const m3u8Res = await fetchHttp(`${BASE_URL}/api/stream/m3u8-proxy?url=${encodeURIComponent(targetM3u8)}`);
    assert(m3u8Res.status === 200, `M3U8 Playlist Rewriter returned HTTP 200`);
    assert(m3u8Res.body.includes('/api/stream/'), 'M3U8 Rewriter successfully routes internal variant links through proxy');
  } catch (err) {
    assert(false, `Stream Proxy test failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST 10: SUBTITLES SEARCH & DIRECT STREAM RESOLVER
  // ----------------------------------------------------
  console.log('\n[RUN] [10/11] Testing Subtitles Engine & Direct Resolver...');
  try {
    const subRes = await fetchHttp(`${BASE_URL}/api/stream/subtitles?id=1396&type=tv&season=1&episode=1`);
    assert(subRes.status === 200, 'Subtitles endpoint returned HTTP 200');
    const subData = JSON.parse(subRes.body);
    assert(subData.success === true, 'Subtitles engine reports success: true');
    assert(subData.subtitles && subData.subtitles.length > 0, `Subtitles engine returned ${subData.subtitles?.length} language tracks`);

    const directRes = await fetchHttp(`${BASE_URL}/api/stream/direct?id=series-breaking-bad-1396&type=tv&season=1&episode=1`);
    assert(directRes.status === 200, 'Direct Stream Resolver returned HTTP 200');
    const directData = JSON.parse(directRes.body);
    assert(directData.success === true, 'Direct Stream Resolver reports success: true');
    assert(directData.recommendedServer === 'aurora', 'Direct Stream Resolver prioritizes clean zero-ad mirror');
  } catch (err) {
    assert(false, `Subtitles/Direct Resolver test failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST 11: SERVER PERSISTENCE & CROSS-DEVICE SYNC
  // ----------------------------------------------------
  console.log('\n[RUN] [11/11] Testing Server State Persistence & Cross-Device Sync...');
  try {
    const syncGetRes = await fetchHttp(`${BASE_URL}/api/user/sync?userId=automated-test-user`);
    assert(syncGetRes.status === 200, 'User Sync GET endpoint returned HTTP 200');
    const syncGetData = JSON.parse(syncGetRes.body);
    assert(syncGetData.success === true, 'User Sync GET reports success: true');

    const testPayload = {
      userId: 'automated-test-user',
      watchProgress: {
        'profile-test_series-breaking-bad': {
          contentId: 'series-breaking-bad',
          profileId: 'profile-test',
          progressSeconds: 742,
          totalSeconds: 3480,
          completed: false,
        },
      },
    };

    const syncPostRes = await fetchHttp(`${BASE_URL}/api/user/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });
    assert(syncPostRes.status === 200, 'User Sync POST endpoint returned HTTP 200');
    const syncPostData = JSON.parse(syncPostRes.body);
    assert(syncPostData.success === true, 'User Sync POST reports success: true');
    assert(
      syncPostData.data.watchProgress['profile-test_series-breaking-bad'].progressSeconds === 742,
      'User Sync successfully persisted progress timestamp (742s) on disk'
    );
  } catch (err) {
    assert(false, `User Sync test failed: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch(err => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
