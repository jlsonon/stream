import { 
  ContentItem, 
  Profile, 
  PaymentReceipt, 
  PlatformSettings, 
  AdPlacement, 
  AuditLog, 
  WatchProgress,
  VideoQuality,
  User
} from '@/types';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit 
} from 'firebase/firestore';

import { COMPREHENSIVE_CATALOG } from './catalog-data';

export const STARTER_CATALOG: ContentItem[] = COMPREHENSIVE_CATALOG;

// Default Platform Settings
export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  proPriceMonthly: 349,
  currency: 'PHP',
  paymentInstructions: {
    gcash: {
      accountName: 'Cinemix Media Philippines Inc.',
      accountNumber: '0917-888-2469',
      instructions: 'Send via Express Send. Use your Cinemix account email as the payment note or message.',
      isEnabled: true,
    },
    maya: {
      accountName: 'Cinemix Digital Entertainment',
      accountNumber: '0998-555-7389',
      instructions: 'Transfer to PayMaya mobile number. Save the official confirmation receipt screenshot.',
      isEnabled: true,
    },
    bdo: {
      accountName: 'Cinemix Interactive Corp.',
      accountNumber: '0068-1234-8901',
      instructions: 'BDO Unibank Online or Over-the-Counter. Upload clear photo of deposit slip or mobile transfer slip.',
      isEnabled: true,
    },
    bpi: {
      accountName: 'Cinemix Interactive Corp.',
      accountNumber: '1940-5678-2234',
      instructions: 'BPI Mobile transfer or BPI QR scan.',
      isEnabled: true,
    },
  },
  adsEnabledForFree: true,
  dailyWatchLimitMinutes: 60,
  maxFreeQuality: '720p',
  maxProQuality: '2160p',
  maxProfiles: 5,
  maxFreeProfiles: 1,
  maintenanceMode: false,
  maintenanceMessage: '',
  supportEmail: 'support@cinemix.app',
  termsUrl: '/terms',
  privacyUrl: '/privacy',
};

// Local storage keys for hybrid fallback/offline operations
const STORAGE_KEYS = {
  CATALOG: 'cinemix_catalog_cache',
  PROFILES: 'cinemix_profiles_cache',
  PAYMENTS: 'cinemix_payments_cache',
  SETTINGS: 'cinemix_settings_cache',
  PROGRESS: 'cinemix_watch_progress_cache',
  MY_LIST: 'cinemix_my_list_cache',
  AUDIT: 'cinemix_audit_cache',
  ADS: 'cinemix_ads_cache'
};

// ========================================================
// CATALOG SERVICE METHODS
// ========================================================

function toTimeMs(val: any): number {
  if (!val) return 0;
  if (val instanceof Date) return val.getTime();
  if (typeof val === 'object' && 'seconds' in val) return val.seconds * 1000;
  return new Date(val).getTime();
}

class CatalogService {
  private getLocal<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setLocal<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Local storage write failed', e);
    }
  }

  // --- CONTENT ITEMS ---

  async getAllContent(): Promise<ContentItem[]> {
    // 1. Try Firestore if configured
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'content'));
        if (!snap.empty) {
          const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ContentItem));
          this.setLocal(STORAGE_KEYS.CATALOG, items);
          return items;
        }
      } catch (err) {
        console.warn('Firestore fetch failed, using cached/starter catalog', err);
      }
    }

    // 2. Check local storage cache
    const cached = this.getLocal<ContentItem[]>(STORAGE_KEYS.CATALOG, []);
    if (cached.length > 0) return cached;

    // 3. Fallback to starter catalog
    this.setLocal(STORAGE_KEYS.CATALOG, STARTER_CATALOG);
    return STARTER_CATALOG;
  }

  async getContentById(id: string): Promise<ContentItem | null> {
    const list = await this.getAllContent();
    return list.find(item => item.id === id) || null;
  }

  async saveContent(item: ContentItem): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        const itemRef = doc(db, 'content', item.id);
        await setDoc(itemRef, { ...item, updatedAt: new Date() }, { merge: true });
      } catch (err) {
        console.warn('Failed to save content in Firestore', err);
      }
    }

    // Update local cache
    const all = await this.getAllContent();
    const idx = all.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      all[idx] = item;
    } else {
      all.push(item);
    }
    this.setLocal(STORAGE_KEYS.CATALOG, all);
  }

  async deleteContent(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'content', id));
      } catch (err) {
        console.warn('Failed to delete from Firestore', err);
      }
    }
    const all = (await this.getAllContent()).filter(i => i.id !== id);
    this.setLocal(STORAGE_KEYS.CATALOG, all);
  }

  async seedStarterCatalog(): Promise<number> {
    for (const item of STARTER_CATALOG) {
      await this.saveContent(item);
    }
    return STARTER_CATALOG.length;
  }

  // --- WATCHLIST (MY LIST) ---

  getMyListIds(profileId: string): string[] {
    const map = this.getLocal<Record<string, string[]>>(STORAGE_KEYS.MY_LIST, {});
    return map[profileId] || [];
  }

  toggleMyList(profileId: string, contentId: string): boolean {
    const map = this.getLocal<Record<string, string[]>>(STORAGE_KEYS.MY_LIST, {});
    const current = map[profileId] || [];
    const exists = current.includes(contentId);
    const updated = exists ? current.filter(id => id !== contentId) : [...current, contentId];
    map[profileId] = updated;
    this.setLocal(STORAGE_KEYS.MY_LIST, map);
    return !exists;
  }

  // --- WATCH PROGRESS ---

  getWatchProgress(profileId: string, contentId: string): WatchProgress | null {
    const map = this.getLocal<Record<string, WatchProgress>>(STORAGE_KEYS.PROGRESS, {});
    const key = `${profileId}_${contentId}`;
    return map[key] || null;
  }

  saveWatchProgress(progress: WatchProgress): void {
    const map = this.getLocal<Record<string, WatchProgress>>(STORAGE_KEYS.PROGRESS, {});
    const key = `${progress.profileId}_${progress.contentId}`;
    map[key] = progress;
    this.setLocal(STORAGE_KEYS.PROGRESS, map);
  }

  getAllContinueWatching(profileId: string): WatchProgress[] {
    const map = this.getLocal<Record<string, WatchProgress>>(STORAGE_KEYS.PROGRESS, {});
    return Object.values(map)
      .filter(p => p.profileId === profileId && !p.completed && p.progressSeconds > 10)
      .sort((a, b) => toTimeMs(b.updatedAt) - toTimeMs(a.updatedAt));
  }

  // --- PAYMENTS & SUBSCRIPTIONS ---

  async getPayments(): Promise<PaymentReceipt[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'payments'));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentReceipt));
          this.setLocal(STORAGE_KEYS.PAYMENTS, list);
          return list;
        }
      } catch (err) {
        console.warn('Failed to load payments from Firestore', err);
      }
    }
    return this.getLocal<PaymentReceipt[]>(STORAGE_KEYS.PAYMENTS, []);
  }

  async submitPaymentReceipt(receipt: PaymentReceipt): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'payments', receipt.id), receipt);
      } catch (e) {
        console.warn('Failed to save receipt in Firestore', e);
      }
    }
    const current = await this.getPayments();
    this.setLocal(STORAGE_KEYS.PAYMENTS, [receipt, ...current.filter(p => p.id !== receipt.id)]);
  }

  async reviewPayment(paymentId: string, status: 'APPROVED' | 'REJECTED', reviewerId: string, reason?: string): Promise<void> {
    const payments = await this.getPayments();
    const item = payments.find(p => p.id === paymentId);
    if (!item) return;

    item.status = status;
    item.reviewedAt = new Date();
    item.reviewedBy = reviewerId;
    if (reason) item.rejectionReason = reason;

    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'payments', paymentId), {
          status,
          reviewedAt: new Date(),
          reviewedBy: reviewerId,
          ...(reason ? { rejectionReason: reason } : {})
        });

        if (status === 'APPROVED') {
          // Update user to PRO
          await updateDoc(doc(db, 'users', item.userId), {
            plan: 'PRO',
            proExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
        }
      } catch (e) {
        console.warn('Firestore update failed for payment approval', e);
      }
    }

    this.setLocal(STORAGE_KEYS.PAYMENTS, payments);

    // Record audit log
    await this.logAudit({
      id: 'audit-' + Date.now(),
      timestamp: new Date(),
      actorId: reviewerId,
      actorName: 'Superadmin',
      actorRole: 'superadmin',
      action: status === 'APPROVED' ? 'PAYMENT_APPROVED' : 'PAYMENT_REJECTED',
      targetId: paymentId,
      targetType: 'payment',
      details: `Payment ${paymentId} (${item.referenceNumber}) for ₱${item.amount} was ${status}. ${reason || ''}`,
      metadata: { paymentId, userId: item.userId, amount: item.amount }
    });
  }

  // --- AUDIT LOGS ---

  async getAuditLogs(): Promise<AuditLog[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'auditLogs'));
        if (!snap.empty) {
          const logs = snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog));
          return logs.sort((a, b) => toTimeMs(b.timestamp) - toTimeMs(a.timestamp));
        }
      } catch (e) {
        console.warn('Audit fetch failed', e);
      }
    }
    return this.getLocal<AuditLog[]>(STORAGE_KEYS.AUDIT, []);
  }

  async logAudit(entry: AuditLog): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'auditLogs', entry.id), entry);
      } catch (e) {
        console.warn('Failed to record audit in Firestore', e);
      }
    }
    const current = this.getLocal<AuditLog[]>(STORAGE_KEYS.AUDIT, []);
    this.setLocal(STORAGE_KEYS.AUDIT, [entry, ...current]);
  }

  // --- PLATFORM SETTINGS ---

  async getSettings(): Promise<PlatformSettings> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDoc(doc(db, 'platformSettings', 'global'));
        if (snap.exists()) {
          return snap.data() as PlatformSettings;
        }
      } catch (e) {
        console.warn('Settings load error', e);
      }
    }
    return this.getLocal<PlatformSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_PLATFORM_SETTINGS);
  }

  async saveSettings(settings: PlatformSettings): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'platformSettings', 'global'), settings);
      } catch (e) {
        console.warn('Settings save error', e);
      }
    }
    this.setLocal(STORAGE_KEYS.SETTINGS, settings);
  }

  // --- ADS SYSTEM ---

  async getAds(): Promise<AdPlacement[]> {
    return this.getLocal<AdPlacement[]>(STORAGE_KEYS.ADS, [
      {
        id: 'ad-pro-upgrade-banner',
        type: 'pre_roll',
        title: 'Upgrade to Cinemix Pro',
        mediaUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        clickUrl: '/upgrade',
        duration: 5,
        targetTiers: ['FREE'],
        targetRegions: ['GLOBAL'],
        impressions: 124,
        clicks: 18,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        createdBy: 'system',
        createdAt: new Date()
      }
    ]);
  }

  async saveAd(ad: AdPlacement): Promise<void> {
    const list = await this.getAds();
    const idx = list.findIndex(a => a.id === ad.id);
    if (idx >= 0) list[idx] = ad;
    else list.push(ad);
    this.setLocal(STORAGE_KEYS.ADS, list);
  }
}

export const catalogService = new CatalogService();
