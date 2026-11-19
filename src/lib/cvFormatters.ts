import type { Language } from '@/types/cvBuilder';

/**
 * Format work period string according to selected language
 * Replaces 'HIỆN TẠI'/'PRESENT' appropriately
 */
export const formatPeriod = (period: string, currentLang: Language): string => {
  if (!period) return '';
  if (currentLang === 'en') {
    return period.replace(/HIỆN TẠI/g, 'PRESENT').replace(/Hiện tại/gi, 'Present');
  }
  return period.replace(/PRESENT/g, 'HIỆN TẠI').replace(/Present/gi, 'Hiện tại');
};

/**
 * Sanitize a string to be safely used as a file name across operating systems
 */
export const sanitizeFileName = (name: string, fallback: string = 'CV'): string => {
  const base = name?.trim() || fallback;
  return base.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
};

/**
 * Returns a standardized date stamp string (YYYY-MM-DD)
 */
export const formatDateStamp = (date: Date = new Date()): string => {
  return date.toISOString().slice(0, 10);
};
