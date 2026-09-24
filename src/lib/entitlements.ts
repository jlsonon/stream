import type {
  User,
  ContentItem,
  Profile,
  VideoQuality,
  Subscription,
  PlatformSettings,
  FirestoreTimestamp,
} from '@/types';

// ==========================================
// Default platform limits (used when PlatformSettings not loaded)
// ==========================================

const DEFAULTS = {
  dailyWatchLimitMinutes: 60,
  maxFreeQuality: '720p' as VideoQuality,
  maxProQuality: '2160p' as VideoQuality,
  maxFreeProfiles: 1,
  maxProProfiles: 5,
} as const;

// ==========================================
// Helpers
// ==========================================

function toDate(value: FirestoreTimestamp | Date | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if ('seconds' in value) return new Date(value.seconds * 1000);
  return null;
}

// Maturity ratings ordered by restrictiveness
const MATURITY_ORDER: Record<string, number> = {
  'G': 0,
  'PG': 1,
  'PG-13': 2,
  'R': 3,
  'NC-17': 4,
};

// ==========================================
// Core Entitlement Functions
// ==========================================

/**
 * Check if a user is allowed to watch a specific piece of content.
 * Considers plan tier, kids profile maturity restrictions, and region.
 */
export function canWatchContent(
  user: User,
  content: ContentItem,
  profile?: Profile
): { allowed: boolean; reason?: string } {
  // Check kids profile maturity restrictions
  if (profile?.isKids) {
    const profileLevel = MATURITY_ORDER[profile.maturityRating] ?? 1; // Default PG
    const contentLevel = MATURITY_ORDER[content.maturityRating] ?? 4;
    if (contentLevel > profileLevel) {
      return { allowed: false, reason: 'This content exceeds the maturity rating for this profile.' };
    }
  }

  // Check PRO-only content
  if (content.isProOnly && user.plan !== 'PRO') {
    return { allowed: false, reason: 'This content requires a Cinemix Pro subscription.' };
  }

  // Check content is published
  if (content.status !== 'PUBLISHED') {
    return { allowed: false, reason: 'This content is not currently available.' };
  }

  return { allowed: true };
}

/**
 * Get the maximum video quality a user can stream.
 */
export function getMaxQuality(user: User, settings?: PlatformSettings): VideoQuality {
  if (user.plan === 'PRO') {
    return settings?.maxProQuality ?? DEFAULTS.maxProQuality;
  }
  return settings?.maxFreeQuality ?? DEFAULTS.maxFreeQuality;
}

/**
 * Check if a user should see ads.
 */
export function hasAds(user: User, settings?: PlatformSettings): boolean {
  if (user.plan === 'PRO') return false;
  return settings?.adsEnabledForFree ?? true;
}

/**
 * Get the daily watch limit in minutes.
 * PRO users have unlimited (Infinity).
 */
export function getDailyWatchLimit(user: User, settings?: PlatformSettings): number {
  if (user.plan === 'PRO') return Infinity;
  return settings?.dailyWatchLimitMinutes ?? DEFAULTS.dailyWatchLimitMinutes;
}

/**
 * Check if a user can use a specific feature.
 */
export function canUseFeature(
  user: User,
  feature: 'downloads' | 'skip_intro' | 'pip' | 'multiple_profiles' | '4k' | 'hdr' | 'dolby'
): boolean {
  const proOnlyFeatures: typeof feature[] = ['downloads', '4k', 'hdr', 'dolby', 'multiple_profiles'];

  if (proOnlyFeatures.includes(feature) && user.plan !== 'PRO') {
    return false;
  }

  return true;
}

/**
 * Get remaining daily watch time in minutes.
 */
export function getRemainingWatchTime(
  user: User,
  minutesWatched: number,
  settings?: PlatformSettings
): number {
  const limit = getDailyWatchLimit(user, settings);
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - minutesWatched);
}

/**
 * Check if a user can create another profile.
 */
export function canCreateProfile(
  user: User,
  currentProfileCount: number,
  settings?: PlatformSettings
): boolean {
  const maxProfiles =
    user.plan === 'PRO'
      ? (settings?.maxProfiles ?? DEFAULTS.maxProProfiles)
      : (settings?.maxFreeProfiles ?? DEFAULTS.maxFreeProfiles);
  return currentProfileCount < maxProfiles;
}

/**
 * Check if a subscription is currently valid (active and not expired).
 */
export function isSubscriptionValid(subscription: Subscription | null | undefined): boolean {
  if (!subscription) return false;
  if (subscription.status !== 'ACTIVE') return false;

  const expiresAt = toDate(subscription.expiresAt);
  if (expiresAt) {
    return new Date() < expiresAt;
  }

  return true;
}

/**
 * Get the number of days remaining on a subscription.
 */
export function getSubscriptionDaysRemaining(subscription: Subscription | null | undefined): number {
  if (!subscription) return 0;

  const expiresAt = toDate(subscription.expiresAt);
  if (!expiresAt) return 0;

  const diffMs = expiresAt.getTime() - Date.now();
  if (diffMs <= 0) return 0;

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
