'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import type { User, AuthState } from '@/types';

export const DEMO_PRO_USER: User = {
  uid: 'demo-pro-vip',
  email: 'pro@cinemix.ph',
  displayName: 'VIP Pro Member',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  role: 'user',
  plan: 'PRO',
  createdAt: new Date(),
  lastLoginAt: new Date(),
};

export const DEMO_FREE_USER: User = {
  uid: 'demo-free-viewer',
  email: 'free@cinemix.ph',
  displayName: 'Free Viewer',
  photoURL: '',
  role: 'user',
  plan: 'FREE',
  createdAt: new Date(),
  lastLoginAt: new Date(),
};

export const DEMO_ADMIN_USER: User = {
  uid: 'demo-admin-lead',
  email: 'admin@cinemix.ph',
  displayName: 'Superadmin Lead',
  photoURL: '',
  role: 'superadmin',
  plan: 'PRO',
  createdAt: new Date(),
  lastLoginAt: new Date(),
};

interface AuthContextType {
  user: User | null;
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loginAsDemo: (type: 'pro' | 'free' | 'admin') => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local demo session first
    if (typeof window !== 'undefined') {
      const savedDemo = localStorage.getItem('cinemix_active_user');
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          setUser(parsed);
          setAuthState('authenticated');
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem('cinemix_active_user');
        }
      }
    }

    if (!isFirebaseConfigured() || !auth) {
      setAuthState('unauthenticated');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let userData: Partial<User> = {};

          if (db) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              userData = userDoc.data() as Partial<User>;
            }
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || userData.displayName || '',
            photoURL: firebaseUser.photoURL || userData.photoURL || '',
            role: userData.role || 'user',
            plan: userData.plan || 'FREE',
            createdAt: userData.createdAt || new Date(),
            lastLoginAt: new Date(),
          });
          setAuthState('authenticated');
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            role: 'user',
            plan: 'FREE',
            createdAt: new Date(),
            lastLoginAt: new Date(),
          });
          setAuthState('authenticated');
        }
      } else {
        // If no firebase user and no demo user
        const savedDemo = typeof window !== 'undefined' ? localStorage.getItem('cinemix_active_user') : null;
        if (!savedDemo) {
          setUser(null);
          setAuthState('unauthenticated');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsDemo = useCallback((type: 'pro' | 'free' | 'admin') => {
    const selected = type === 'pro' ? DEMO_PRO_USER : type === 'admin' ? DEMO_ADMIN_USER : DEMO_FREE_USER;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinemix_active_user', JSON.stringify(selected));
    }
    setUser(selected);
    setAuthState('authenticated');
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth is not configured');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    if (!auth) throw new Error('Firebase Auth is not configured');
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });

      // Create user doc in Firestore
      if (db) {
        await setDoc(doc(db, 'users', credential.user.uid), {
          uid: credential.user.uid,
          email,
          displayName,
          photoURL: '',
          role: 'user',
          plan: 'FREE',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cinemix_active_user');
    }
    if (auth && isFirebaseConfigured()) {
      try {
        await firebaseSignOut(auth);
      } catch {}
    }
    setUser(null);
    setAuthState('unauthenticated');
  }, []);

  return (
    <AuthContext.Provider value={{ user, authState, signIn, signUp, signOut, loginAsDemo, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
