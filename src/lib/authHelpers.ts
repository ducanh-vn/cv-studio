import type { AuthUser, AuthProvider } from '@/types/auth';
import {
  AUTH_USER_STORAGE_KEY,
  DEFAULT_GUEST_USER,
  MOCK_GOOGLE_USER,
  MOCK_GITHUB_USER,
} from '@/constants/authConstants';

/**
 * Reads stored user from localStorage, safely falls back to Guest on SSR or missing data.
 */
export function loadStoredUser(): AuthUser {
  if (typeof window === 'undefined') {
    return DEFAULT_GUEST_USER;
  }
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return DEFAULT_GUEST_USER;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === 'string') {
      return parsed as AuthUser;
    }
  } catch (err) {
    console.warn('[loadStoredUser] Failed to parse auth user from localStorage:', err);
  }
  return DEFAULT_GUEST_USER;
}

/**
 * Saves authenticated user or guest to localStorage.
 */
export function saveStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('[saveStoredUser] Failed to save auth user to localStorage:', err);
  }
}

/**
 * Clears stored auth user, reverting to guest.
 */
export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  } catch (err) {
    console.warn('[clearStoredUser] Failed to clear user from localStorage:', err);
  }
}

/**
 * Resolves a mock or authentic profile for the selected OAuth provider.
 */
export function getProviderProfile(provider: 'google' | 'github'): AuthUser {
  const base = provider === 'google' ? MOCK_GOOGLE_USER : MOCK_GITHUB_USER;
  return {
    ...base,
    lastSyncedAt: new Date().toISOString(),
  };
}

/**
 * Formats last synced timestamp into user-friendly text.
 */
export function formatLastSyncedTime(
  isoString: string | null | undefined,
  lang: 'vi' | 'en' = 'vi'
): string {
  if (!isoString) {
    return lang === 'en' ? 'Never' : 'Chưa đồng bộ';
  }

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return lang === 'en' ? 'Never' : 'Chưa đồng bộ';

    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);

    if (diffSec < 45) {
      return lang === 'en' ? 'Just now' : 'Vừa xong';
    }
    if (diffMin < 60) {
      return lang === 'en' ? `${diffMin}m ago` : `${diffMin} phút trước`;
    }

    return date.toLocaleTimeString(lang === 'en' ? 'en-US' : 'vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return lang === 'en' ? 'Recently' : 'Gần đây';
  }
}

/**
 * Pure merger function that combines local and cloud records by ID, preserving the most recently updated.
 */
export function mergeItemsById<T extends { id: string; updatedAt?: string }>(
  localItems: T[],
  cloudItems: T[]
): T[] {
  const itemMap = new Map<string, T>();

  // 1. Seed with cloud items
  for (const item of cloudItems) {
    itemMap.set(item.id, item);
  }

  // 2. Overlay local items (if local item has newer updatedAt or doesn't exist on cloud)
  for (const item of localItems) {
    const existing = itemMap.get(item.id);
    if (!existing) {
      itemMap.set(item.id, item);
    } else {
      const localTime = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
      const cloudTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
      if (localTime >= cloudTime) {
        itemMap.set(item.id, item);
      }
    }
  }

  return Array.from(itemMap.values());
}
