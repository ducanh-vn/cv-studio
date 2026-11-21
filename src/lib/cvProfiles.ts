import { CVTypographyConfig, DEFAULT_TYPOGRAPHY_CONFIG } from './cvTypography';
import { sanitizeCVTechStuttering } from './techLinter';
import { ensureCustomLinks } from './customTechLinks';
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_VISIBILITY } from '@/constants/cvConstants';

export interface CVProfile {
  id: string;
  name: string;
  targetRole?: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
  // Content data
  cvVi: any;
  cvEn: any;
  activeLang: 'vi' | 'en';
  // Matching Cover Letter data
  coverLetterVi?: any;
  coverLetterEn?: any;
  // Design & layout settings
  template: string;
  accentColor: string;
  fontFamily: string;
  isCompact: boolean;
  typography?: CVTypographyConfig;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
}

export const STORAGE_PROFILES_KEY = 'ducanh_cv_profiles_v1';
export const STORAGE_ACTIVE_PROFILE_ID_KEY = 'ducanh_active_cv_profile_id';

/**
 * Returns user-scoped storage key for CV profiles list.
 * Guarantees that profiles for User A never mix with User B or Guest.
 */
export function getUserProfilesStorageKey(userId?: string): string {
  if (!userId || userId === 'guest') {
    return 'cv_profiles_guest';
  }
  return `cv_profiles_${userId}`;
}

/**
 * Returns user-scoped storage key for the currently active profile ID.
 */
export function getUserActiveProfileKey(userId?: string): string {
  if (!userId || userId === 'guest') {
    return 'cv_active_profile_guest';
  }
  return `cv_active_profile_${userId}`;
}

/**
 * Creates initial profiles, using any existing saved CV as Profile 1,
 * and adds an optional specialized sample profile (e.g. Senior Frontend / Fullstack)
 */
export function createInitialProfiles(
  existingVi: any,
  existingEn: any,
  currentSettings: {
    template: string;
    accentColor: string;
    fontFamily: string;
    isCompact: boolean;
    typography?: CVTypographyConfig;
    sectionOrder: string[];
    sectionVisibility: Record<string, boolean>;
    activeLang?: 'vi' | 'en';
  }
): CVProfile[] {
  const now = new Date().toISOString();

  // Profile 1: Main / Default Profile
  const profile1: CVProfile = {
    id: 'profile-main',
    name: 'Hồ sơ Fullstack & Web (Mặc định)',
    targetRole: 'Fullstack / Frontend Engineer',
    createdAt: now,
    updatedAt: now,
    isDefault: true,
    cvVi: existingVi,
    cvEn: existingEn,
    activeLang: currentSettings.activeLang || 'vi',
    template: currentSettings.template || 'rabbit',
    accentColor: currentSettings.accentColor || 'blue',
    fontFamily: currentSettings.fontFamily || 'inter',
    isCompact: currentSettings.isCompact ?? false,
    typography: currentSettings.typography,
    sectionOrder: currentSettings.sectionOrder || [],
    sectionVisibility: currentSettings.sectionVisibility || {},
  };

  // Profile 2: Senior Frontend Specialist (cloned with customized title & template)
  const profile2Vi = JSON.parse(JSON.stringify(existingVi));
  profile2Vi.title = 'SENIOR FRONTEND ENGINEER & UI/UX ARCHITECT';
  profile2Vi.summary =
    'Kỹ sư Frontend giàu kinh nghiệm chuyên sâu về React, Next.js, TypeScript và tối ưu hiệu năng Web Vitals. Đam mê xây dựng Design System và kiến trúc ứng dụng Web quy mô lớn với trải nghiệm người dùng mượt mà.';

  const profile2En = JSON.parse(JSON.stringify(existingEn));
  profile2En.title = 'SENIOR FRONTEND ENGINEER & UI/UX ARCHITECT';
  profile2En.summary =
    'Passionate Frontend Engineer specializing in React, Next.js, TypeScript, and Core Web Vitals optimization. Dedicated to crafting scalable Design Systems and high-performance web applications with superior UX.';

  const profile2: CVProfile = {
    id: 'profile-frontend-lead',
    name: 'Frontend & UI/UX Specialist',
    targetRole: 'Senior Frontend / UI Architect',
    createdAt: now,
    updatedAt: now,
    isDefault: false,
    cvVi: profile2Vi,
    cvEn: profile2En,
    activeLang: 'vi',
    template: 'cascade', // distinctive template
    accentColor: 'emerald',
    fontFamily: 'bevietnam',
    isCompact: false,
    sectionOrder: currentSettings.sectionOrder || [],
    sectionVisibility: currentSettings.sectionVisibility || {},
  };

  return [profile1, profile2];
}

export interface BuilderApplyTarget {
  setCvVi: (cv: any) => void;
  setCvEn: (cv: any) => void;
  setLang: (lang: any) => void;
  setCvState: (cv: any) => void;
  setCoverLetterVi: (cl: any) => void;
  setCoverLetterEn: (cl: any) => void;
  setTemplate: (t: any) => void;
  setAccentColor: (c: any) => void;
  setFontFamily: (f: any) => void;
  setIsCompact: (compact: boolean) => void;
  setTypographyConfig: (config: any) => void;
  setSectionOrder: (order: any) => void;
  setSectionVisibility: (vis: any) => void;
}

/**
 * Applies a CVProfile's content and appearance settings directly to the builder state.
 */
export function applyProfileToBuilder(
  target: CVProfile,
  builder: BuilderApplyTarget
): void {
  const targetVi = sanitizeCVTechStuttering({
    ...target.cvVi,
    customLinks: ensureCustomLinks(target.cvVi),
  });
  const targetEn = sanitizeCVTechStuttering({
    ...target.cvEn,
    customLinks: ensureCustomLinks(target.cvEn),
  });
  builder.setCvVi(targetVi);
  builder.setCvEn(targetEn);
  builder.setLang(target.activeLang || 'vi');
  builder.setCvState(target.activeLang === 'en' ? targetEn : targetVi);
  if (target.coverLetterVi) builder.setCoverLetterVi(target.coverLetterVi);
  if (target.coverLetterEn) builder.setCoverLetterEn(target.coverLetterEn);
  builder.setTemplate(target.template || 'rabbit');
  builder.setAccentColor(target.accentColor || 'blue');
  builder.setFontFamily(target.fontFamily || 'inter');
  builder.setIsCompact(target.isCompact ?? false);
  if (target.typography) {
    builder.setTypographyConfig(target.typography);
  } else {
    builder.setTypographyConfig(DEFAULT_TYPOGRAPHY_CONFIG);
  }
  builder.setSectionOrder(
    target.sectionOrder?.length ? target.sectionOrder : DEFAULT_SECTION_ORDER
  );
  builder.setSectionVisibility(
    target.sectionVisibility || DEFAULT_SECTION_VISIBILITY
  );
}

/**
 * Loads profiles list from localStorage, scoped per user ID,
 * or creates initial profiles if none exist.
 */
export function loadProfilesFromStorage(
  fallbackVi: any,
  fallbackEn: any,
  currentSettings: any,
  userId?: string
): { profiles: CVProfile[]; activeProfileId: string } {
  if (typeof window === 'undefined') {
    const initials = createInitialProfiles(fallbackVi, fallbackEn, currentSettings);
    return { profiles: initials, activeProfileId: initials[0].id };
  }

  const profilesKey = getUserProfilesStorageKey(userId);
  const activeKey = getUserActiveProfileKey(userId);

  try {
    let raw = localStorage.getItem(profilesKey);
    let savedActiveId = localStorage.getItem(activeKey);

    // Migration fallback: if guest and no guest key yet, import legacy single-user data
    if (!raw && (!userId || userId === 'guest')) {
      const legacyRaw = localStorage.getItem(STORAGE_PROFILES_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        savedActiveId = localStorage.getItem(STORAGE_ACTIVE_PROFILE_ID_KEY);
        // Persist into new guest key
        localStorage.setItem(profilesKey, raw);
        if (savedActiveId) localStorage.setItem(activeKey, savedActiveId);
      }
    }

    if (raw) {
      const parsed = JSON.parse(raw) as CVProfile[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const activeId =
          savedActiveId && parsed.some((p) => p.id === savedActiveId)
            ? savedActiveId
            : parsed[0].id;
        return { profiles: parsed, activeProfileId: activeId };
      }
    }
  } catch (err) {
    console.warn('Failed to parse saved CV profiles from storage:', err);
  }

  // If no profiles in storage for this user, initialize fresh defaults
  const initials = createInitialProfiles(fallbackVi, fallbackEn, currentSettings);
  saveProfilesToStorage(initials, initials[0].id, userId);
  return { profiles: initials, activeProfileId: initials[0].id };
}

/**
 * Saves profiles list and active profile ID to localStorage for a specific user ID.
 */
export function saveProfilesToStorage(
  profiles: CVProfile[],
  activeProfileId: string,
  userId?: string
): void {
  if (typeof window === 'undefined') return;
  const profilesKey = getUserProfilesStorageKey(userId);
  const activeKey = getUserActiveProfileKey(userId);
  try {
    localStorage.setItem(profilesKey, JSON.stringify(profiles));
    localStorage.setItem(activeKey, activeProfileId);
  } catch (err) {
    console.warn('Failed to save CV profiles to storage:', err);
  }
}

/**
 * Duplicates an existing profile.
 */
export function duplicateCVProfile(source: CVProfile, newName?: string): CVProfile {
  const now = new Date().toISOString();
  const id = `profile-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  return {
    ...JSON.parse(JSON.stringify(source)),
    id,
    name: newName || `${source.name} (Bản sao)`,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Creates a brand new empty profile based on defaults.
 */
export function createNewCVProfile(
  name: string,
  targetRole: string,
  baseVi: any,
  baseEn: any,
  settings: any
): CVProfile {
  const now = new Date().toISOString();
  const id = `profile-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  return {
    id,
    name: name.trim() || 'Phiên bản CV mới',
    targetRole: targetRole.trim() || 'Software Engineer',
    createdAt: now,
    updatedAt: now,
    isDefault: false,
    cvVi: JSON.parse(JSON.stringify(baseVi)),
    cvEn: JSON.parse(JSON.stringify(baseEn)),
    activeLang: settings.activeLang || 'vi',
    coverLetterVi: settings.coverLetterVi || null,
    coverLetterEn: settings.coverLetterEn || null,
    template: settings.template || 'rabbit',
    accentColor: settings.accentColor || 'blue',
    fontFamily: settings.fontFamily || 'inter',
    isCompact: settings.isCompact ?? false,
    typography: settings.typography,
    sectionOrder: settings.sectionOrder || [],
    sectionVisibility: settings.sectionVisibility || {},
  };
}
