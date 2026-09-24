'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '@/types';
import { useAuth } from './auth-context';

interface ProfileContextType {
  profiles: Profile[];
  activeProfile: Profile | null;
  selectProfile: (profile: Profile) => void;
  createProfile: (data: { name: string; avatarUrl: string; isKids: boolean }) => void;
  updateProfile: (id: string, data: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  isKidsMode: boolean;
}

const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'profile-main',
    userId: 'default-user',
    name: 'Main',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isKids: false,
    maturityRating: 'NC-17',
    language: 'English',
    watchHistory: [],
    myList: ['cinemix-tears-of-steel', 'cinemix-manila-nights']
  },
  {
    id: 'profile-kids',
    userId: 'default-user',
    name: 'Kids Zone',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    isKids: true,
    maturityRating: 'PG',
    language: 'English',
    watchHistory: [],
    myList: ['cinemix-big-buck-bunny']
  }
];

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('cinemix_user_profiles');
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.warn('Could not read cached profiles', e);
      }
    }
    return DEFAULT_PROFILES;
  });

  const [activeProfile, setActiveProfile] = useState<Profile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedId = localStorage.getItem('cinemix_active_profile_id');
        if (cachedId) {
          const found = profiles.find(p => p.id === cachedId);
          if (found) return found;
        }
      } catch (e) {
        console.warn('Could not read active profile', e);
      }
    }
    return profiles[0] || null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinemix_user_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  useEffect(() => {
    if (activeProfile && typeof window !== 'undefined') {
      localStorage.setItem('cinemix_active_profile_id', activeProfile.id);
    }
  }, [activeProfile]);

  const selectProfile = (profile: Profile) => {
    setActiveProfile(profile);
  };

  const createProfile = ({ name, avatarUrl, isKids }: { name: string; avatarUrl: string; isKids: boolean }) => {
    const newProfile: Profile = {
      id: 'profile-' + Date.now(),
      userId: user?.uid || 'user',
      name,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isKids,
      maturityRating: isKids ? 'PG' : 'NC-17',
      language: 'English',
      watchHistory: [],
      myList: []
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfile(newProfile);
  };

  const updateProfile = (id: string, data: Partial<Profile>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    if (activeProfile?.id === id) {
      setActiveProfile(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return; // Keep at least one
    const remaining = profiles.filter(p => p.id !== id);
    setProfiles(remaining);
    if (activeProfile?.id === id) {
      setActiveProfile(remaining[0]);
    }
  };

  return (
    <ProfileContext.Provider 
      value={{ 
        profiles, 
        activeProfile, 
        selectProfile, 
        createProfile, 
        updateProfile, 
        deleteProfile,
        isKidsMode: !!activeProfile?.isKids
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
