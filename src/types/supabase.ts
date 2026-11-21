/**
 * Types for Supabase Integration & Cloud Database Persistence
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export interface UserCVCloudRecord {
  id?: string;
  user_id: string;
  profiles: any[];
  job_applications: any[];
  active_profile_id?: string;
  updated_at: string;
}

export interface CloudSyncResult {
  success: boolean;
  error?: string;
  syncedAt?: string;
  record?: UserCVCloudRecord;
}

export interface SupabaseAuthState {
  isConfigured: boolean;
  isLoading: boolean;
  sessionError: string | null;
}
