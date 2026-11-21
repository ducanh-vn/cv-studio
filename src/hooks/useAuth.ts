'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AuthUser, SyncStatus } from '@/types/auth';
import { DEFAULT_GUEST_USER } from '@/constants/authConstants';
import {
  loadStoredUser,
  saveStoredUser,
  clearStoredUser,
  getProviderProfile,
} from '@/lib/authHelpers';
import {
  supabase,
  isSupabaseConfigured,
} from '@/lib/supabaseClient';
import {
  signInWithSupabase,
  signOutFromSupabase,
  mapSupabaseUserToAuthUser,
  getCurrentSupabaseUser,
} from '@/lib/supabaseAuth';

export interface UseAuthReturn {
  user: AuthUser;
  isAuthenticated: boolean;
  isGuest: boolean;
  isSupabaseReady: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  loginWithProvider: (provider: 'google' | 'github') => Promise<AuthUser>;
  logout: () => void;
  triggerManualSync: (profiles?: any[], jobs?: any[]) => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser>(DEFAULT_GUEST_USER);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local_only');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const isSupabaseReady = isSupabaseConfigured();

  // 1. Initialize user from storage or active Supabase session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // If URL contains hash access_token from Supabase OAuth redirect, clean it and extract session
      if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            const mapped = mapSupabaseUserToAuthUser(session.user);
            setUser(mapped);
            saveStoredUser(mapped);
            setSyncStatus('synced');
            setLastSyncedAt(new Date().toISOString());
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }
        } catch (e) {
          console.warn('[useAuth] Hash token parse warning:', e);
        }
      }

      // If Supabase is active, check remote session first
      if (isSupabaseReady) {
        const sbUser = await getCurrentSupabaseUser();
        if (sbUser && mounted) {
          setUser(sbUser);
          saveStoredUser(sbUser);
          setSyncStatus('synced');
          setLastSyncedAt(sbUser.lastSyncedAt || new Date().toISOString());
          return;
        }
      }

      // Fallback to client localStorage
      const stored = loadStoredUser();
      if (mounted) {
        setUser(stored);
        if (stored.provider !== 'guest') {
          setSyncStatus('synced');
          setLastSyncedAt(stored.lastSyncedAt || stored.createdAt);
        } else {
          setSyncStatus('local_only');
        }
      }
    }

    initAuth();

    // 2. Set up Supabase auth listener if configured
    if (isSupabaseReady) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;
          if (session?.user) {
            const mapped = mapSupabaseUserToAuthUser(session.user);
            setUser(mapped);
            saveStoredUser(mapped);
            setSyncStatus('synced');
            setLastSyncedAt(new Date().toISOString());

            // Remove access token hash from URL cleanly
            if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          } else if (event === 'SIGNED_OUT') {
            clearStoredUser();
            setUser(DEFAULT_GUEST_USER);
            setSyncStatus('local_only');
            setLastSyncedAt(null);
          }
        }
      );

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, [isSupabaseReady]);

  const isAuthenticated = user.provider !== 'guest';
  const isGuest = user.provider === 'guest';

  // Login handler
  const loginWithProvider = useCallback(async (provider: 'google' | 'github'): Promise<AuthUser> => {
    setIsSyncing(true);
    setSyncStatus('syncing');

    // If Supabase is configured with keys, trigger authentic OAuth redirect
    if (isSupabaseReady) {
      const { error } = await signInWithSupabase(provider);
      if (error) {
        console.warn('[useAuth] Supabase OAuth failed, using fallback:', error);
      } else {
        // Redirect will happen automatically, return current user
        return user;
      }
    }

    // Fallback: Simulation mode for development without keys
    await new Promise((resolve) => setTimeout(resolve, 600));

    const now = new Date().toISOString();
    const newProfile = getProviderProfile(provider);
    newProfile.lastSyncedAt = now;

    saveStoredUser(newProfile);
    setUser(newProfile);
    setLastSyncedAt(now);
    setSyncStatus('synced');
    setIsSyncing(false);

    return newProfile;
  }, [isSupabaseReady, user]);

  // Logout handler
  const logout = useCallback(async () => {
    if (isSupabaseReady) {
      await signOutFromSupabase();
    }
    clearStoredUser();
    setUser(DEFAULT_GUEST_USER);
    setSyncStatus('local_only');
    setLastSyncedAt(null);
  }, [isSupabaseReady]);

  // Trigger manual cloud sync
  const triggerManualSync = useCallback(async (profiles?: any[], jobs?: any[]): Promise<boolean> => {
    if (user.provider === 'guest') {
      return false;
    }

    setIsSyncing(true);
    setSyncStatus('syncing');

    if (isSupabaseReady && user.id && user.id !== 'guest') {
      try {
        const { uploadUserDataToSupabase } = await import('@/lib/supabaseSync');
        await uploadUserDataToSupabase(user.id, profiles || [], jobs || []);
      } catch (err) {
        console.warn('[useAuth] Cloud sync warning:', err);
      }
    } else {
      // Simulate network sync delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const now = new Date().toISOString();
    const updated = {
      ...user,
      lastSyncedAt: now,
    };

    saveStoredUser(updated);
    setUser(updated);
    setLastSyncedAt(now);
    setSyncStatus('synced');
    setIsSyncing(false);

    return true;
  }, [isSupabaseReady, user]);

  return {
    user,
    isAuthenticated,
    isGuest,
    isSupabaseReady,
    syncStatus,
    lastSyncedAt,
    isSyncing,
    loginWithProvider,
    logout,
    triggerManualSync,
  };
}

export default useAuth;
