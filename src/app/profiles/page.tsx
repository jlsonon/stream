'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, Trash2, Edit2, Shield, User, X } from 'lucide-react';
import { useProfile } from '@/lib/profile-context';
import { useToast } from '@/components/ui/Toast';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
];

export default function ProfilesPage() {
  const router = useRouter();
  const { profiles, activeProfile, selectProfile, createProfile, deleteProfile } = useProfile();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileAvatar, setNewProfileAvatar] = useState(AVATAR_OPTIONS[0]);
  const [isKids, setIsKids] = useState(false);

  const handleSelect = (profile: any) => {
    selectProfile(profile);
    toast({
      type: 'success',
      message: `Switched to profile "${profile.name}"`,
      duration: 3000
    });
    router.push('/');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    createProfile({
      name: newProfileName.trim(),
      avatarUrl: newProfileAvatar,
      isKids
    });

    setIsModalOpen(false);
    setNewProfileName('');
    setIsKids(false);

    toast({
      type: 'success',
      message: `Profile "${newProfileName}" created!`,
      duration: 3000
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
            Who&apos;s Watching?
          </h1>
          <p className="text-sm text-gray-400">
            Select a profile to personalize your watch history, recommendations, and list.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-4">
          {profiles.map((p) => {
            const isCurrent = activeProfile?.id === p.id;

            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                className="group flex flex-col items-center gap-3 cursor-pointer select-none"
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 transition-all duration-300 group-hover:scale-105 group-hover:ring-cinemix-primary group-hover:shadow-cinema ring-white/10">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {p.isKids && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black shadow-md flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" /> KIDS
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute bottom-2 right-2 p-1 rounded-full bg-cinemix-primary text-black font-bold shadow-glow-primary">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors block">
                    {p.name}
                  </span>
                  {p.isKids && (
                    <span className="text-[10px] text-amber-400 font-semibold block">
                      Protected (PG Only)
                    </span>
                  )}
                </div>

                {profiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProfile(p.id);
                      toast({
                        type: 'info',
                        message: `Deleted profile "${p.name}"`,
                        duration: 3000
                      });
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 transition-opacity text-xs flex items-center gap-1"
                    title="Delete profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Profile Card */}
          {profiles.length < 5 && (
            <div
              onClick={() => setIsModalOpen(true)}
              className="group flex flex-col items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-2 border-dashed border-white/20 hover:border-cinemix-primary flex items-center justify-center transition-all group-hover:scale-105 bg-surface-100/50">
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-cinemix-primary transition-colors" />
              </div>
              <span className="font-semibold text-sm sm:text-base text-gray-400 group-hover:text-white transition-colors">
                Add Profile
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-surface-100 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">Create New Profile</h3>
              <p className="text-xs text-gray-400 mt-1">
                Add a profile for another family member or child.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Profile Name
                </label>
                <input
                  type="text"
                  required
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="e.g. Jericho, Mom, Kids"
                  className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Choose Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <img
                      key={av}
                      src={av}
                      alt="avatar option"
                      onClick={() => setNewProfileAvatar(av)}
                      className={`w-12 h-12 rounded-xl object-cover cursor-pointer ring-2 transition-all ${
                        newProfileAvatar === av ? 'ring-cinemix-primary scale-110' : 'ring-transparent opacity-60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Kids Mode Toggle */}
              <div className="p-4 rounded-xl bg-surface-200 border border-white/[0.04] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-400" /> Kids Profile
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Restricts library to G & PG rated family content only.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isKids}
                  onChange={(e) => setIsKids(e.target.checked)}
                  className="w-5 h-5 accent-cinemix-primary rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cinemix-primary hover:bg-cinemix-primary/90 text-white font-bold text-xs shadow-lg"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
