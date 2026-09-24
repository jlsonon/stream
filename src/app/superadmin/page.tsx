'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  LayoutDashboard, 
  Film, 
  CreditCard, 
  Users, 
  Settings, 
  Megaphone, 
  History, 
  Plus, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  AlertCircle,
  ShieldCheck,
  Search
} from 'lucide-react';
import { 
  ContentItem, 
  PaymentReceipt, 
  PlatformSettings, 
  AdPlacement, 
  AuditLog, 
  User,
  ContentType,
  MaturityRating,
  VideoQuality
} from '@/types';
import { catalogService, DEFAULT_PLATFORM_SETTINGS } from '@/lib/catalog-service';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

function formatDate(val: any): string {
  if (!val) return '—';
  if (val instanceof Date) return val.toLocaleString();
  if (typeof val === 'object' && 'seconds' in val) return new Date(val.seconds * 1000).toLocaleString();
  return new Date(val).toLocaleString();
}

export default function SuperadminPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'payments' | 'users' | 'ads' | 'settings' | 'audit'>('overview');

  // Data States
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [payments, setPayments] = useState<PaymentReceipt[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Forms
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [receiptLightboxOpen, setReceiptLightboxOpen] = useState(false);

  // Content Form State
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<ContentType>('movie');
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formMaturity, setFormMaturity] = useState<MaturityRating>('PG-13');
  const [formScore, setFormScore] = useState(9.0);
  const [formYear, setFormYear] = useState(2024);
  const [formDuration, setFormDuration] = useState(90);
  const [formGenres, setFormGenres] = useState('Action, Sci-Fi');
  const [formPosterUrl, setFormPosterUrl] = useState('');
  const [formBackdropUrl, setFormBackdropUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
  const [formIsProOnly, setFormIsProOnly] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [c, p, s, a, aud] = await Promise.all([
      catalogService.getAllContent(),
      catalogService.getPayments(),
      catalogService.getSettings(),
      catalogService.getAds(),
      catalogService.getAuditLogs()
    ]);
    setContentList(c);
    setPayments(p);
    setSettings(s);
    setAds(a);
    setAuditLogs(aud);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSeedCatalog = async () => {
    const count = await catalogService.seedStarterCatalog();
    await loadAll();
    confetti();
    toast({
      type: 'success',
      title: 'Catalog Seeded!',
      message: `Successfully seeded ${count} titles with working 4K/1080p HLS video streams into the database.`,
      duration: 5000
    });
  };

  const handleApprovePayment = async (p: PaymentReceipt) => {
    await catalogService.reviewPayment(p.id, 'APPROVED', user?.uid || 'superadmin');
    await loadAll();
    confetti({ particleCount: 100, spread: 70 });
    toast({
      type: 'success',
      title: 'Payment Approved!',
      message: `Upgraded user ${p.senderName} (${p.userId}) to Pro for 30 days.`,
      duration: 5000
    });
  };

  const handleRejectPayment = async (p: PaymentReceipt) => {
    const reason = prompt('Enter rejection reason for this receipt:') || 'Invalid reference number';
    await catalogService.reviewPayment(p.id, 'REJECTED', user?.uid || 'superadmin', reason);
    await loadAll();
    toast({
      type: 'info',
      message: `Receipt ${p.referenceNumber} was rejected.`,
      duration: 4000
    });
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newItem: ContentItem = {
      id: 'title-' + Date.now(),
      title: formTitle.trim(),
      type: formType,
      status: 'PUBLISHED',
      synopsis: formSynopsis.trim() || 'No synopsis provided.',
      longSynopsis: formSynopsis.trim(),
      posterUrl: formPosterUrl.trim() || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      backdropUrl: formBackdropUrl.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
      maturityRating: formMaturity,
      score: Number(formScore),
      releaseYear: Number(formYear),
      duration: Number(formDuration),
      genres: formGenres.split(',').map(s => s.trim()).filter(Boolean),
      tags: ['New', formType],
      isProOnly: formIsProOnly,
      maxQuality: '2160p',
      audioTracks: [{ language: 'en', label: 'English', isDefault: true }],
      subtitles: [{ language: 'en', label: 'English', url: '', isDefault: true }],
      cast: [],
      directors: [],
      producers: [],
      regionAvailability: ['GLOBAL'],
      featured: false,
      trending: true,
      newRelease: true,
      videoSources: [
        { quality: '2160p', url: formVideoUrl.trim(), bitrate: 10000, codec: 'H.264' }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      createdBy: user?.uid || 'superadmin'
    };

    await catalogService.saveContent(newItem);
    await loadAll();
    setIsContentModalOpen(false);

    toast({
      type: 'success',
      message: `Created title "${newItem.title}"!`,
      duration: 4000
    });
  };

  const handleDeleteContent = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      await catalogService.deleteContent(id);
      await loadAll();
      toast({
        type: 'info',
        message: `Deleted "${title}".`,
        duration: 3000
      });
    }
  };

  const pendingPayments = payments.filter(p => p.status === 'PENDING');

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Superadmin Control Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Commercial streaming operations, content CMS, payment verification, and platform configuration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedCatalog}
            className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-gray-200 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            title="Seed 4K & 1080p HLS titles"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cinemix-primary" /> Seed HLS Catalog
          </button>
          <button
            onClick={() => setIsContentModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cinemix-primary hover:bg-cinemix-primary/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Add Title
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar border-b border-white/[0.04]">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'content', label: `Content CMS (${contentList.length})`, icon: Film },
          { id: 'payments', label: `Payments (${pendingPayments.length} Pending)`, icon: CreditCard, alert: pendingPayments.length > 0 },
          { id: 'settings', label: 'Platform Settings', icon: Settings },
          { id: 'ads', label: 'Ad Manager', icon: Megaphone },
          { id: 'audit', label: 'Audit Logs', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cinemix-primary text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-surface-100/60 hover:bg-surface-200 text-gray-300 border border-white/[0.04]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-surface-50 border border-white/[0.04] space-y-2">
              <span className="text-xs font-semibold text-gray-400">Total Published Titles</span>
              <div className="text-3xl font-extrabold text-white">{contentList.length}</div>
              <p className="text-[11px] text-gray-500">Movies, series, anime, docs</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-50 border border-white/[0.04] space-y-2">
              <span className="text-xs font-semibold text-gray-400">Pending Receipts</span>
              <div className="text-3xl font-extrabold text-amber-400">{pendingPayments.length}</div>
              <p className="text-[11px] text-gray-500">Awaiting Superadmin review</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-50 border border-white/[0.04] space-y-2">
              <span className="text-xs font-semibold text-gray-400">Estimated Revenue</span>
              <div className="text-3xl font-extrabold text-green-400">
                ₱{(payments.filter(p => p.status === 'APPROVED').length * settings.proPriceMonthly).toLocaleString()}
              </div>
              <p className="text-[11px] text-gray-500">From approved subscriptions</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-50 border border-white/[0.04] space-y-2">
              <span className="text-xs font-semibold text-gray-400">Active Pro Price</span>
              <div className="text-3xl font-extrabold text-white">₱{settings.proPriceMonthly}</div>
              <p className="text-[11px] text-gray-500">Per 30 days subscription</p>
            </div>
          </div>

          {/* Quick Pending Payment Callout */}
          {pendingPayments.length > 0 && (
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Action Needed: Pending Receipts</h4>
                  <p className="text-xs text-gray-300">
                    {pendingPayments.length} customer payment receipts submitted via GCash/Maya need verification.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('payments')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-md hover:bg-amber-400"
              >
                Review Queue
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONTENT CMS */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-surface-50">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-surface-100 uppercase text-[10px] tracking-wider text-gray-400 font-bold border-b border-white/[0.06]">
                <tr>
                  <th className="p-4">Poster</th>
                  <th className="p-4">Title & Type</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Access</th>
                  <th className="p-4">HLS Source</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {contentList.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-100/50 transition-colors">
                    <td className="p-4 w-16">
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-12 h-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{item.title}</div>
                      <div className="text-[11px] text-gray-400 capitalize">{item.type.replace('_', ' ')} • {item.releaseYear}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-surface-200 font-bold text-white">
                        {item.maturityRating}
                      </span>
                    </td>
                    <td className="p-4 text-green-400 font-bold">
                      ★ {item.score}
                    </td>
                    <td className="p-4">
                      {item.isProOnly ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          PRO ONLY
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-200 text-gray-300">
                          FREE TIER
                        </span>
                      )}
                    </td>
                    <td className="p-4 max-w-xs truncate font-mono text-[10px] text-gray-400">
                      {item.videoSources?.[0]?.url || 'Default Stream'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/watch/${item.id}`}
                        className="p-2 rounded-lg bg-surface-200 hover:bg-surface-300 text-white inline-block"
                        title="Preview Stream"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteContent(item.id, item.title)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 inline-block"
                        title="Delete Title"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS QUEUE */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-surface-50">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-surface-100 uppercase text-[10px] tracking-wider text-gray-400 font-bold border-b border-white/[0.06]">
                <tr>
                  <th className="p-4">Receipt</th>
                  <th className="p-4">User / Sender</th>
                  <th className="p-4">Method & Ref #</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4 text-right">Approve / Reject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No payment receipts submitted yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-100/50 transition-colors">
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedReceipt(p);
                            setReceiptLightboxOpen(true);
                          }}
                          className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 group cursor-pointer"
                        >
                          <img
                            src={p.receiptImageUrl}
                            alt="Receipt"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{p.senderName}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{p.userId}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{p.method}</div>
                        <div className="text-[11px] font-mono text-amber-400">{p.referenceNumber}</div>
                      </td>
                      <td className="p-4 font-bold text-white text-sm">
                        ₱{p.amount}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'APPROVED'
                            ? 'bg-green-500/20 text-green-400'
                            : p.status === 'REJECTED'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">
                        {formatDate(p.submittedAt)}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {p.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleApprovePayment(p)}
                              className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold text-xs transition-colors shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectPayment(p)}
                              className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-500 text-[11px]">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PLATFORM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-surface-50 border border-white/[0.06] rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-white">Platform Settings</h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Pro Monthly Price (PHP)</label>
              <input
                type="number"
                value={settings.proPriceMonthly}
                onChange={(e) => setSettings({ ...settings, proPriceMonthly: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white text-sm focus-ring"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">Free Tier Daily Watch Limit (Minutes)</label>
              <input
                type="number"
                value={settings.dailyWatchLimitMinutes}
                onChange={(e) => setSettings({ ...settings, dailyWatchLimitMinutes: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white text-sm focus-ring"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">GCash Account Name</label>
              <input
                type="text"
                value={settings.paymentInstructions.gcash.accountName}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentInstructions: {
                    ...settings.paymentInstructions,
                    gcash: { ...settings.paymentInstructions.gcash, accountName: e.target.value }
                  }
                })}
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white text-sm focus-ring"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">GCash Mobile Number</label>
              <input
                type="text"
                value={settings.paymentInstructions.gcash.accountNumber}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentInstructions: {
                    ...settings.paymentInstructions,
                    gcash: { ...settings.paymentInstructions.gcash, accountNumber: e.target.value }
                  }
                })}
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white text-sm focus-ring"
              />
            </div>

            <button
              onClick={async () => {
                await catalogService.saveSettings(settings);
                toast({
                  type: 'success',
                  message: 'Platform settings saved!',
                  duration: 3000
                });
              }}
              className="py-3 px-6 rounded-xl bg-cinemix-primary hover:bg-cinemix-primary/90 text-white font-bold text-xs shadow-lg"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: AD MANAGER */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-surface-50 border border-white/[0.06] space-y-4">
            <h3 className="text-lg font-bold text-white">Configured Ads for Free Tier</h3>
            <p className="text-xs text-gray-400">
              Control the pre-roll ads and banners served to non-paying users. Pro members never receive advertisements.
            </p>

            <div className="space-y-3 pt-2">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="p-4 rounded-xl bg-surface-100 border border-white/[0.04] flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{ad.title}</div>
                    <div className="text-gray-400">
                      Type: <span className="capitalize">{ad.type}</span> • Duration: {ad.duration}s • Click URL: {ad.clickUrl}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400">
                      ACTIVE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-surface-50">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-surface-100 uppercase text-[10px] tracking-wider text-gray-400 font-bold border-b border-white/[0.06]">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-100/50 transition-colors">
                      <td className="p-4 font-mono text-gray-400">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="p-4 font-bold text-cinemix-primary">
                        {log.action}
                      </td>
                      <td className="p-4 font-semibold text-white">
                        {log.actorName}
                      </td>
                      <td className="p-4 text-gray-300">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Content */}
      {isContentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-surface-100 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-auto">
            <button
              onClick={() => setIsContentModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">Add New Title to Catalog</h3>
              <p className="text-xs text-gray-400 mt-1">
                Enter movie, series, or anime details and provide an HLS stream source.
              </p>
            </div>

            <form onSubmit={handleSaveContent} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Blade Runner 2099"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Content Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus-ring"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">TV Series</option>
                    <option value="anime">Anime</option>
                    <option value="ph_content">Philippine Cinema</option>
                    <option value="documentary">Documentary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Synopsis</label>
                <textarea
                  rows={3}
                  value={formSynopsis}
                  onChange={(e) => setFormSynopsis(e.target.value)}
                  placeholder="Compelling story description..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus-ring"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Maturity Rating</label>
                  <select
                    value={formMaturity}
                    onChange={(e) => setFormMaturity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus-ring"
                  >
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Score (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formScore}
                    onChange={(e) => setFormScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Genres (Comma separated)</label>
                <input
                  type="text"
                  value={formGenres}
                  onChange={(e) => setFormGenres(e.target.value)}
                  placeholder="e.g. Action, Sci-Fi, Thriller"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus-ring"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Poster Image URL</label>
                  <input
                    type="url"
                    value={formPosterUrl}
                    onChange={(e) => setFormPosterUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Backdrop Image URL</label>
                  <input
                    type="url"
                    value={formBackdropUrl}
                    onChange={(e) => setFormBackdropUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">HLS Video Stream URL (.m3u8)</label>
                <input
                  type="url"
                  required
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://.../stream.m3u8"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white font-mono text-sm focus-ring"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-200 border border-white/[0.04] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Cinemix Pro Exclusive</span>
                  <span className="text-[11px] text-gray-400">Lock this title behind a paid Pro subscription</span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsProOnly}
                  onChange={(e) => setFormIsProOnly(e.target.checked)}
                  className="w-5 h-5 accent-cinemix-primary rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsContentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cinemix-primary hover:bg-cinemix-primary/90 text-white font-bold text-sm shadow-lg"
                >
                  Publish Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox: Receipt Screenshot Viewer */}
      {receiptLightboxOpen && selectedReceipt && (
        <div 
          onClick={() => setReceiptLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-surface-100 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div>
                <h4 className="font-bold text-white text-sm">{selectedReceipt.senderName} - Receipt</h4>
                <p className="text-xs text-gray-400">Ref: {selectedReceipt.referenceNumber}</p>
              </div>
              <button
                onClick={() => setReceiptLightboxOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-black/50 rounded-xl p-2">
              <img
                src={selectedReceipt.receiptImageUrl}
                alt="Receipt screenshot"
                className="max-h-[60vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
