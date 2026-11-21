/**
 * Types for Progressive Authentication & Cloud Sync
 */

export type AuthProvider = 'google' | 'github' | 'guest';

export type SyncStatus = 'local_only' | 'syncing' | 'synced' | 'error';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
  createdAt: string;
  lastSyncedAt?: string;
  workspaceId?: string;
}

export interface CloudWorkspace {
  id: string;
  userId: string;
  name: string;
  cvProfilesCount: number;
  jobApplicationsCount: number;
  updatedAt: string;
}

export interface AuthSyncState {
  user: AuthUser;
  isAuthenticated: boolean;
  isGuest: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  error: string | null;
}
