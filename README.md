# Cinemix — Commercial Global Streaming Platform

Cinemix is a production-ready, installable Progressive Web App (PWA) streaming platform for **Movies, Anime, TV Series, Philippine Cinema, and 4K Documentaries**.

Built with Next.js 14 App Router, TypeScript, Tailwind CSS, HLS.js adaptive bitrate streaming, and Firebase (Firestore + Auth + Cloud Storage).

---

## 🚀 Key Platform Capabilities

### 1. Commercial-Quality HLS Adaptive Streaming Player
- **HLS.js Adaptive Bitrate**: Streams multi-bitrate `.m3u8` master playlists with automatic level switching, and falls back to native HLS on iOS Safari.
- **Dynamic Quality Selector**: Auto, 4K Ultra HD (2160p), 1080p, 720p, 480p, 360p.
- **Entitlement Locking**: Free users are capped at 720p. Attempting to select 1080p or 4K presents an instant upgrade prompt to Cinemix Pro.
- **Ad Engine for Free Users**: Configurable 5-second pre-roll video ad countdown before playback. Zero ads for Pro subscribers.
- **Audio & Subtitles Switcher**: Select between original audio, English dub, Filipino dub, or subtitles with CC support.
- **Skip Intro / Outro**: Instant Skip Intro button between 0:10 and 1:25.
- **Keyboard Shortcuts**: Space (Play/Pause), Left/Right (±10s Seek), F (Fullscreen), M (Mute).
- **Watch Progress Synchronization**: Resumes playback from the exact second you left off across sessions.

### 2. Multi-Profile System & Kids Mode
- Multiple profiles per account (up to 5 for Pro, 1 for Free).
- **Kids Profile Protection**: Automatically locks and hides R, NC-17, and TV-MA titles across Home, Browse, Search, and Player routes.
- Individual watch history and watchlist per profile.

### 3. Philippine Payment & Pro Subscription System (₱399/month)
- Direct payment channels: **GCash**, **Maya**, **BDO Unibank**, and **BPI**.
- Account details with one-click copy buttons.
- Receipt upload workflow: Reference number, sender account name, mobile number, and receipt screenshot.
- Real-time submission tracker with `PENDING`, `APPROVED`, and `REJECTED` status badges.

### 4. Superadmin Operations Suite (`/superadmin`)
- **Overview Metrics**: Total published titles, pending receipts, estimated revenue, active Pro price.
- **Content CMS**: Full content editor for movies, series, anime, with poster/backdrop URLs, HLS stream sources, maturity rating, genres, and cast.
- **One-Click HLS Catalog Seeder**: Populates the database with real Creative Commons 4K/1080p open-source streaming productions (e.g. *Tears of Steel*, *Sintel*, *Cosmos Laundromat*, *Big Buck Bunny*, and Philippine showcases).
- **Payment Verification Queue**: View uploaded receipts in a lightbox, approve payments (instantly activating 30 days of Pro with celebratory confetti), or reject with custom feedback.
- **Ad Management**: Configure and toggle pre-roll and banner advertisements.
- **Platform Configuration**: Configure subscription pricing, GCash/Maya recipient accounts, and free watch time limits.
- **Audit Logs**: Chronological immutable log of all administrative and financial actions.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict typing, zero `any`)
- **Styling**: Tailwind CSS with Cinemix dark theme
- **Video Engine**: HLS.js with HTML5 Video fallback
- **Backend / Database**: Firebase (Auth, Firestore, Cloud Storage) with local persistence cache
- **State Management**: React Context (`AuthProvider`, `ProfileProvider`, `ToastProvider`)
- **PWA**: Web App Manifest (`manifest.json`), Service Worker (`sw.js`), and offline fallback (`/offline`)

---

## 📦 Getting Started & Deployment

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run development server (on port 3001)
npm run dev

# 3. Build production bundle
npm run build
```

### Deploying to Vercel / Netlify
1. Push repository to GitHub or GitLab.
2. Import project into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set environment variables (optional for live Firebase sync):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
4. Deploy! If Firebase variables are omitted, Cinemix automatically runs in hybrid demo mode with full local persistence so all features work out-of-the-box.

---

## 🧪 Testing the Platform

1. **Watch Videos**: Navigate to `/`, click any title card to view details, then click **Play** to test HLS streaming.
2. **Quality & Ads**: Test switching between Free and Pro; Free users experience a 5s pre-roll ad and 720p cap.
3. **Submit Payment**: Go to `/upgrade`, choose GCash or Maya, input reference number and sender name, and submit.
4. **Approve Payment in Superadmin**: Go to `/superadmin`, click the **Payments** tab, and click **Approve** to activate Pro status.
5. **Switch Profiles**: Open the top-right profile avatar or visit `/profiles` to test switching between Main and Kids profiles.
