'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/Toast';
import { isFirebaseConfigured } from '@/lib/firebase';
import { Film, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, loginAsDemo } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isFirebaseConfigured()) {
        if (mode === 'login') {
          await signIn(email, password);
        } else {
          await signUp(email, password, displayName || 'User');
        }
        toast({
          type: 'success',
          message: mode === 'login' ? 'Welcome back to Cinemix!' : 'Account created successfully!',
          duration: 3000
        });
        router.push('/');
      } else {
        // Instant simulated session for testing/demo deployment
        toast({
          type: 'info',
          title: 'Demo Session Active',
          message: 'Firebase credentials not set in environment. Demo session active.',
          duration: 4000
        });
        router.push('/');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (type: 'pro' | 'free' | 'admin') => {
    loginAsDemo(type);
    toast({
      type: 'success',
      title: `${type === 'admin' ? 'Superadmin' : type === 'pro' ? 'VIP Pro Member' : 'Free Member'} Active`,
      message: `Signed in as Demo ${type === 'admin' ? 'Superadmin' : type === 'pro' ? 'Pro Member (4K UHD & Zero Ads)' : 'Free Viewer'}.`,
      duration: 4000
    });
    router.push(type === 'admin' ? '/superadmin' : '/');
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 py-20 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cinemix-primary to-indigo-400 flex items-center justify-center shadow-xl shadow-indigo-500/25">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-black text-white">
              Cine<span className="text-cinemix-primary">mix</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            {mode === 'login' ? 'Sign in to access your watchlists and stream' : 'Create your Cinemix account in seconds'}
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="rounded-3xl bg-surface-100 border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="displayName" className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Jericho Sonon"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-white/10 text-white placeholder-gray-500 text-sm focus-ring"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-white/10 text-white placeholder-gray-500 text-sm focus-ring"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-white/10 text-white placeholder-gray-500 text-sm focus-ring"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-cinemix-primary hover:bg-cinemix-primary/90 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-102 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Free Account')}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
              }}
              className="text-xs text-gray-400 hover:text-cinemix-primary transition-colors"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already registered? Sign in'}
            </button>
          </div>

          {/* Quick Demo Access for Testers & Deployment */}
          <div className="pt-4 border-t border-white/[0.06] space-y-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block text-center">
              Quick One-Click Test Logins
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('pro')}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-[11px] font-bold text-amber-400 flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Demo Pro</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('free')}
                className="p-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-white/[0.04] text-[11px] font-semibold text-gray-300 flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-gray-400" />
                <span>Demo Free</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-white/[0.04] text-[11px] font-semibold text-purple-400 flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Superadmin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            ← Return to Cinemix Browse
          </Link>
        </div>
      </div>
    </main>
  );
}
