import type { Language } from '@/types/cvBuilder';

export const formatPeriod = (period: string, currentLang: Language) => {
  if (!period) return '';
  if (currentLang === 'en') {
    return period.replace(/HIỆN TẠI/g, 'PRESENT').replace(/Hiện tại/gi, 'Present');
  }
  return period.replace(/PRESENT/g, 'HIỆN TẠI').replace(/Present/gi, 'Hiện tại');
};
