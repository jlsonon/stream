export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export type WithId<T> = T & { id: string };

// ==========================================
// 1. User & Auth Types
// ==========================================

export type UserRole = 'user' | 'moderator' | 'superadmin';
export type PlanTier = 'FREE' | 'PRO';
export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  plan: PlanTier;
  createdAt: FirestoreTimestamp | Date;
  lastLoginAt: FirestoreTimestamp | Date;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
  maturityRating: MaturityRating;
  language: string;
  pin?: string;
  watchHistory: string[];
  myList: string[];
}

// ==========================================
// 2. Content Types
// ==========================================

export type ContentType = 'movie' | 'series' | 'anime' | 'ph_content' | 'documentary' | 'independent';
export type ContentStatus = 'DRAFT' | 'PROCESSING' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
export type VideoQuality = '360p' | '480p' | '720p' | '1080p' | '1440p' | '2160p';
export type MaturityRating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export type Genre = 
  | 'Action' 
  | 'Adventure' 
  | 'Comedy' 
  | 'Drama' 
  | 'Fantasy' 
  | 'Horror' 
  | 'Mystery' 
  | 'Romance' 
  | 'Sci-Fi' 
  | 'Thriller' 
  | 'Documentary' 
  | 'Animation'
  | string;

export interface AudioTrack {
  language: string;
  label: string;
  isDefault: boolean;
}

export interface SubtitleTrack {
  language: string;
  label: string;
  url: string;
  isDefault: boolean;
}

export interface VideoSource {
  quality: VideoQuality;
  url: string;
  bitrate: number;
  codec: string;
}

export interface CastMember {
  name: string;
  role: string;
  photoUrl?: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  synopsis: string;
  duration: number;
  thumbnailUrl: string;
  videoSources: VideoSource[];
  isSpecial?: boolean;
  isOVA?: boolean;
  airDate?: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface ContentItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: ContentType;
  status: ContentStatus;
  synopsis: string;
  longSynopsis: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string;
  maturityRating: MaturityRating;
  score: number;
  releaseYear: number;
  endYear?: number;
  duration?: number;
  genres: string[];
  tags: string[];
  isProOnly: boolean;
  maxQuality: VideoQuality;
  audioTracks: AudioTrack[];
  subtitles: SubtitleTrack[];
  cast: CastMember[];
  directors: string[];
  producers: string[];
  studio?: string;
  regionAvailability: string[];
  featured: boolean;
  trending: boolean;
  newRelease: boolean;
  videoSources: VideoSource[];
  seasons?: Season[];
  createdAt: FirestoreTimestamp | Date;
  updatedAt: FirestoreTimestamp | Date;
  publishedAt?: FirestoreTimestamp | Date;
  createdBy: string;
}

// ==========================================
// 3. Subscription & Payment Types
// ==========================================

export type SubscriptionStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
export type PaymentMethod = 'GCash' | 'Maya' | 'BDO' | 'BPI' | 'UnionBank';

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanTier;
  priceAtPurchase: number;
  currency: 'PHP';
  status: SubscriptionStatus;
  startedAt: FirestoreTimestamp | Date;
  expiresAt: FirestoreTimestamp | Date;
  approvedBy?: string;
  approvedAt?: FirestoreTimestamp | Date;
  paymentId?: string;
  autoRenew: boolean;
  cancelledAt?: FirestoreTimestamp | Date;
  cancellationReason?: string;
}

export interface PaymentReceipt {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  plan: PlanTier;
  method: PaymentMethod;
  referenceNumber: string;
  senderName: string;
  senderNumber?: string;
  receiptImageUrl: string;
  receiptImagePath: string;
  status: PaymentStatus;
  submittedAt: FirestoreTimestamp | Date;
  reviewedAt?: FirestoreTimestamp | Date;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

// ==========================================
// 4. Ad Types
// ==========================================

export type AdType = 'pre_roll' | 'mid_roll' | 'banner' | 'sponsored_card';

export interface AdPlacement {
  id: string;
  type: AdType;
  title: string;
  mediaUrl: string;
  clickUrl: string;
  duration?: number;
  displayDuration?: number;
  targetTiers: PlanTier[];
  targetRegions: string[];
  impressions: number;
  clicks: number;
  isActive: boolean;
  startDate: FirestoreTimestamp | Date;
  endDate: FirestoreTimestamp | Date;
  createdBy: string;
  createdAt: FirestoreTimestamp | Date;
}

// ==========================================
// 5. Watch Progress
// ==========================================

export interface WatchProgress {
  contentId: string;
  episodeId?: string;
  profileId: string;
  progressSeconds: number;
  totalSeconds: number;
  updatedAt: FirestoreTimestamp | Date;
  completed: boolean;
}

export interface ContinueWatchingItem extends WatchProgress {
  content: ContentItem;
  episode?: Episode;
}

// ==========================================
// 6. Platform Settings
// ==========================================

export interface PaymentChannelInfo {
  accountName: string;
  accountNumber: string;
  qrCodeUrl?: string;
  instructions?: string;
  isEnabled: boolean;
}

export interface PaymentInstructions {
  gcash: PaymentChannelInfo;
  maya: PaymentChannelInfo;
  bdo: PaymentChannelInfo;
  bpi: PaymentChannelInfo;
}

export interface PlatformSettings {
  proPriceMonthly: number;
  currency: string;
  paymentInstructions: PaymentInstructions;
  adsEnabledForFree: boolean;
  dailyWatchLimitMinutes: number;
  maxFreeQuality: VideoQuality;
  maxProQuality: VideoQuality;
  maxProfiles: number;
  maxFreeProfiles: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  supportEmail: string;
  termsUrl: string;
  privacyUrl: string;
}

// ==========================================
// 7. Audit Log
// ==========================================

export type AuditAction = 
  | 'PAYMENT_APPROVED' 
  | 'PAYMENT_REJECTED' 
  | 'PAYMENT_REFUNDED' 
  | 'PRO_MANUAL_GRANTED' 
  | 'PRO_EXTENDED' 
  | 'PRO_REVOKED' 
  | 'CONTENT_CREATED' 
  | 'CONTENT_UPDATED' 
  | 'CONTENT_PUBLISHED' 
  | 'CONTENT_UNPUBLISHED' 
  | 'CONTENT_DELETED' 
  | 'USER_BANNED' 
  | 'USER_UNBANNED' 
  | 'USER_ROLE_CHANGED' 
  | 'AD_CREATED' 
  | 'AD_UPDATED' 
  | 'AD_DELETED' 
  | 'SETTINGS_UPDATED' 
  | 'PROFILE_DELETED';

export interface AuditLog {
  id: string;
  timestamp: FirestoreTimestamp | Date;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditAction;
  targetId: string;
  targetType: 'user' | 'content' | 'payment' | 'ad' | 'settings';
  details: string;
  metadata: Record<string, unknown>;
}

// ==========================================
// 8. Notification
// ==========================================

export type NotificationType = 'payment_approved' | 'payment_rejected' | 'subscription_expiring' | 'new_content' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: FirestoreTimestamp | Date;
}

// ==========================================
// 9. API Response Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
