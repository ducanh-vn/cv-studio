import { supabase, isSupabaseConfigured } from './supabaseClient';
import { USER_CV_TABLE_NAME } from '@/constants/supabaseConstants';
import type { UserCVCloudRecord, CloudSyncResult } from '@/types/supabase';

/**
 * Saves or updates user profiles and job tracker applications to Supabase PostgreSQL.
 */
export async function uploadUserDataToSupabase(
  userId: string,
  profiles: any[],
  jobApplications: any[],
  activeProfileId?: string
): Promise<CloudSyncResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase credentials not configured',
    };
  }

  if (!userId || userId === 'guest') {
    return {
      success: false,
      error: 'Cannot sync guest user to cloud',
    };
  }

  try {
    const payload = {
      user_id: userId,
      profiles: Array.isArray(profiles) ? profiles : [],
      job_applications: Array.isArray(jobApplications) ? jobApplications : [],
      active_profile_id: activeProfileId || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(USER_CV_TABLE_NAME)
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('[uploadUserDataToSupabase] Upsert error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      syncedAt: payload.updated_at,
      record: data as UserCVCloudRecord,
    };
  } catch (err: any) {
    console.error('[uploadUserDataToSupabase] Unexpected exception:', err);
    return {
      success: false,
      error: err.message || 'Unknown network error',
    };
  }
}

/**
 * Fetches existing cloud data for authenticated user from Supabase.
 */
export async function fetchUserDataFromSupabase(
  userId: string
): Promise<UserCVCloudRecord | null> {
  if (!isSupabaseConfigured() || !userId || userId === 'guest') {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(USER_CV_TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[fetchUserDataFromSupabase] Select warning:', error);
      return null;
    }

    return data as UserCVCloudRecord | null;
  } catch (err) {
    console.warn('[fetchUserDataFromSupabase] Exception:', err);
    return null;
  }
}
