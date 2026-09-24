'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  Copy, 
  Upload, 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { catalogService } from '@/lib/catalog-service';
import { useToast } from '@/components/ui/Toast';
import { PaymentMethod, PaymentReceipt } from '@/types';
import Link from 'next/link';

function formatDate(val: any): string {
  if (!val) return '—';
  if (val instanceof Date) return val.toLocaleDateString();
  if (typeof val === 'object' && 'seconds' in val) return new Date(val.seconds * 1000).toLocaleDateString();
  return new Date(val).toLocaleDateString();
}

export default function UpgradePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('GCash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<PaymentReceipt | null>(null);
  const [existingPayments, setExistingPayments] = useState<PaymentReceipt[]>([]);

  useEffect(() => {
    async function load() {
      const all = await catalogService.getPayments();
      if (user) {
        const mine = all.filter(p => p.userId === user.uid);
        setExistingPayments(mine);
      }
    }
    load();
  }, [user]);

  const paymentChannels = {
    GCash: {
      accountName: 'Cinemix Media Philippines Inc.',
      accountNumber: '0917-888-2469',
      instructions: 'Open your GCash App > Send Money > Express Send. Enter the mobile number below, input ₱349, and type your email in the message. Save screenshot of the receipt.',
    },
    Maya: {
      accountName: 'Cinemix Digital Entertainment',
      accountNumber: '0998-555-7389',
      instructions: 'Open your Maya app > Send Money to Maya user. Input ₱349 and take a screenshot of the completed transaction slip.',
    },
    BDO: {
      accountName: 'Cinemix Interactive Corp.',
      accountNumber: '0068-1234-8901',
      instructions: 'Transfer via BDO Online Banking or InstaPay / PESONet to BDO Savings Account. Take a screenshot or upload deposit slip.',
    },
    BPI: {
      accountName: 'Cinemix Interactive Corp.',
      accountNumber: '1940-5678-2234',
      instructions: 'Transfer via BPI app or QR code. Upload transaction confirmation with reference number.',
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      type: 'success',
      message: `Copied ${label} to clipboard!`,
      duration: 3000
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReceiptImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber || !senderName) {
      toast({
        type: 'error',
        message: 'Please provide Reference Number and Sender Name.',
        duration: 4000
      });
      return;
    }

    setSubmitting(true);

    const receipt: PaymentReceipt = {
      id: 'pay-' + Date.now(),
      userId: user?.uid || 'guest-user',
      amount: 349,
      currency: 'PHP',
      plan: 'PRO',
      method: selectedMethod,
      referenceNumber: referenceNumber.trim(),
      senderName: senderName.trim(),
      senderNumber: senderNumber.trim(),
      receiptImageUrl: receiptImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      receiptImagePath: 'receipts/' + Date.now() + '.jpg',
      status: 'PENDING',
      submittedAt: new Date()
    };

    await catalogService.submitPaymentReceipt(receipt);
    setSubmittedReceipt(receipt);
    setExistingPayments(prev => [receipt, ...prev]);
    setSubmitting(false);

    toast({
      type: 'success',
      title: 'Payment Submitted!',
      message: 'Your receipt has been submitted. A Superadmin will verify and activate your Pro subscription shortly.',
      duration: 6000
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" /> Premium Entertainment
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Upgrade to Cinemix <span className="text-gradient from-amber-400 to-amber-600">Pro</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Experience uncompressed 4K streaming, zero commercial interruptions, and unlimited family profiles for only <strong className="text-white">₱349/month</strong>.
        </p>
      </div>

      {/* Plan Feature Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {/* Free Plan */}
        <div className="p-8 rounded-3xl bg-surface-50 border border-white/[0.06] space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Cinemix Free</h3>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-200 text-gray-400">
                Current Plan
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white">₱0 <span className="text-xs text-gray-400 font-normal">/ month</span></div>
            <p className="text-xs text-gray-400">Basic streaming experience for casual viewers.</p>

            <ul className="space-y-3 pt-4 text-xs sm:text-sm text-gray-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-gray-400" /> Standard 720p HD streaming
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-gray-400" /> Watch with sponsor ads
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-gray-400" /> 1 User profile
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-gray-400" /> 60 minutes daily watch limit
              </li>
            </ul>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-b from-surface-100 to-indigo-950/30 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 space-y-6 flex flex-col justify-between">
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg">
            Recommended
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Cinemix Pro <Sparkles className="w-5 h-5 text-amber-400" />
              </h3>
            </div>
            <div className="text-3xl font-extrabold text-white">
              ₱349 <span className="text-xs text-amber-400/80 font-normal">/ 30 days</span>
            </div>
            <p className="text-xs text-gray-300">The ultimate home theater cinema experience.</p>

            <ul className="space-y-3 pt-4 text-xs sm:text-sm text-white">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 font-bold" /> 4K Ultra HD & 1080p Crystal Clear
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 font-bold" /> 100% Ad-Free uninterrupted playback
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 font-bold" /> Up to 5 Profiles + Kids Protection
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 font-bold" /> Unlimited daily watch time
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 font-bold" /> Dolby 5.1 Surround Sound & Subtitles
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <a
              href="#payment-section"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-transform"
            >
              <Sparkles className="w-4 h-4" /> Subscribe Now for ₱349
            </a>
          </div>
        </div>
      </div>

      {/* Manual Payment Section */}
      <div id="payment-section" className="bg-surface-50 border border-white/[0.06] rounded-3xl p-6 sm:p-10 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Philippine Payment Instructions</h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Pay via your preferred mobile wallet or local bank, then upload your transaction receipt below for immediate Superadmin review.
          </p>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['GCash', 'Maya', 'BDO', 'BPI'] as PaymentMethod[]).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMethod(m)}
              className={`p-4 rounded-2xl border text-center transition-all ${
                selectedMethod === m
                  ? 'bg-cinemix-primary/20 border-cinemix-primary text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-surface-100/60 border-white/[0.04] text-gray-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-sm sm:text-base">{m}</div>
              <div className="text-[10px] text-gray-400 mt-1">Official Account</div>
            </button>
          ))}
        </div>

        {/* Selected Channel Details Box */}
        {selectedMethod && (
          <div className="p-6 rounded-2xl bg-surface-100 border border-white/10 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Account Name:</span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-200 border border-white/[0.04]">
                  <span className="font-bold text-white text-sm">
                    {paymentChannels[selectedMethod as keyof typeof paymentChannels]?.accountName}
                  </span>
                  <button
                    onClick={() => copyToClipboard(paymentChannels[selectedMethod as keyof typeof paymentChannels]?.accountName || '', 'Account Name')}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-1">Account / Mobile Number:</span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-200 border border-white/[0.04]">
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {paymentChannels[selectedMethod as keyof typeof paymentChannels]?.accountNumber}
                  </span>
                  <button
                    onClick={() => copyToClipboard(paymentChannels[selectedMethod as keyof typeof paymentChannels]?.accountNumber || '', 'Account Number')}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-surface-200/50 p-3 rounded-xl">
              {paymentChannels[selectedMethod as keyof typeof paymentChannels]?.instructions}
            </p>
          </div>
        )}

        {/* Receipt Submission Form */}
        <form onSubmit={handleSubmitReceipt} className="space-y-6 pt-4 border-t border-white/[0.06]">
          <h3 className="text-lg font-bold text-white">Submit Payment Receipt</h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Reference / Transaction Number *
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. 100293849102"
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-gray-500 text-sm focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Sender Account Name *
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-gray-500 text-sm focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Sender Mobile / Account Number (Optional)
              </label>
              <input
                type="text"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="e.g. 0917-xxx-xxxx"
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-gray-500 text-sm focus-ring"
              />
            </div>
          </div>

          {/* Screenshot Upload Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Upload Receipt Screenshot / Photo (Optional but recommended)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="cursor-pointer px-6 py-4 rounded-2xl bg-surface-100 border border-dashed border-white/20 hover:border-cinemix-primary flex items-center gap-3 transition-colors text-xs text-gray-300">
                <Upload className="w-5 h-5 text-cinemix-primary" />
                <span>{receiptImage ? 'Change Image' : 'Select Screenshot (PNG, JPG)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {receiptImage && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20">
                  <img src={receiptImage} alt="Receipt preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-cinemix-primary hover:bg-cinemix-primary/90 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 disabled:opacity-50"
          >
            {submitting ? 'Submitting Receipt...' : 'Submit Receipt for Verification (₱349)'}
          </button>
        </form>

        {/* User's Recent Submissions Status Tracker */}
        {existingPayments.length > 0 && (
          <div className="pt-8 border-t border-white/[0.06] space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cinemix-primary" /> Your Submitted Receipts
            </h4>
            <div className="space-y-2">
              {existingPayments.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-surface-100 border border-white/[0.04] flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{p.method} • ₱{p.amount}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'APPROVED'
                          ? 'bg-green-500/20 text-green-400'
                          : p.status === 'REJECTED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-gray-400">Ref: {p.referenceNumber} | Sender: {p.senderName}</p>
                  </div>
                  <div className="text-gray-500">
                    {formatDate(p.submittedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
