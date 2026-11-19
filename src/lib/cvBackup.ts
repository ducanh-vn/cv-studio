import type {
  CVData,
  TemplateId,
  Language,
  CVFontFamily,
  SectionKey,
} from '@/types/cvBuilder';
import { formatDateStamp } from './cvFormatters';

export interface FullBackupPayloadParams {
  cv: CVData;
  cvVi: CVData;
  cvEn: CVData;
  lang: Language;
  template: TemplateId;
  accentColor: string;
  fontFamily: CVFontFamily;
  isCompact: boolean;
  sectionOrder: SectionKey[];
  sectionVisibility: Record<string, boolean>;
}

export interface SingleProfileBackupPayloadParams {
  cv: CVData;
  lang: Language;
  template: TemplateId;
  accentColor: string;
  fontFamily: CVFontFamily;
  isCompact: boolean;
  sectionOrder: SectionKey[];
  sectionVisibility: Record<string, boolean>;
}

export interface ImportPreviewSummary {
  name?: string;
  role?: string;
  hasVi?: boolean;
  hasEn?: boolean;
  viName?: string;
  enName?: string;
  template?: string;
  timelineCount: number;
  projectsCount: number;
  skillsCount: number;
  eduCount: number;
}

export interface ImportPreviewResult {
  type: 'full' | 'single';
  data: any;
  meta?: any;
  summary: ImportPreviewSummary;
}

/**
 * Creates standardized full backup JSON object (supporting bilingual Vi/En data)
 */
export function createFullBackupPayload({
  cv,
  cvVi,
  cvEn,
  lang,
  template,
  accentColor,
  fontFamily,
  isCompact,
  sectionOrder,
  sectionVisibility,
}: FullBackupPayloadParams) {
  const activeCvVi = lang === 'vi' ? cv : cvVi;
  const activeCvEn = lang === 'en' ? cv : cvEn;

  return {
    $schema: 'https://nguyenducanh.dev/schemas/cv-backup-v1.json',
    app: 'DucAnh Portfolio CV Studio',
    version: 1,
    exportedAt: new Date().toISOString(),
    lang,
    template,
    accentColor,
    fontFamily,
    isCompact,
    sectionOrder,
    sectionVisibility,
    cvVi: activeCvVi,
    cvEn: activeCvEn,
  };
}

/**
 * Creates single active profile backup JSON object
 */
export function createSingleProfileBackupPayload({
  cv,
  lang,
  template,
  accentColor,
  fontFamily,
  isCompact,
  sectionOrder,
  sectionVisibility,
}: SingleProfileBackupPayloadParams) {
  return {
    $schema: 'https://nguyenducanh.dev/schemas/cv-profile-v1.json',
    app: 'DucAnh Portfolio CV Studio',
    version: 1,
    exportedAt: new Date().toISOString(),
    language: lang,
    template,
    accentColor,
    fontFamily,
    isCompact,
    sectionOrder,
    sectionVisibility,
    data: cv,
  };
}

/**
 * Initiates browser download of JSON data
 */
export function downloadJsonFile(data: object, fileName: string): void {
  if (typeof document === 'undefined') return;

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Copies formatted JSON string to user clipboard
 */
export async function copyJsonToClipboard(data: object): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    return true;
  }
  return false;
}

/**
 * Reads a File object as text asynchronously
 */
export async function readJsonFile(file: File): Promise<string> {
  if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
    throw new Error('FILE_TYPE_INVALID');
  }

  if (typeof file.text === 'function') {
    return await file.text();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = () => reject(new Error('FILE_READ_ERROR'));
    reader.readAsText(file);
  });
}

/**
 * Parses and validates raw JSON content into an ImportPreviewResult
 */
export function parseImportJsonString(rawJson: string): ImportPreviewResult {
  const parsed = JSON.parse(rawJson);

  // Case A: Full package containing cvVi and/or cvEn
  if (parsed.cvVi || parsed.cvEn) {
    const vi = parsed.cvVi || parsed.cv;
    const en = parsed.cvEn;
    const primary = vi || en || {};

    return {
      type: 'full',
      data: parsed,
      summary: {
        name: primary.name,
        role: primary.role,
        hasVi: !!parsed.cvVi,
        hasEn: !!parsed.cvEn,
        viName: parsed.cvVi?.name,
        enName: parsed.cvEn?.name,
        template: parsed.template,
        timelineCount: (primary.timeline || []).length,
        projectsCount: (primary.projects || []).length,
        skillsCount: (primary.skills || []).length,
        eduCount: (primary.education || []).length,
      },
    };
  }

  // Case B: Single profile (candidate.data, candidate.cv or root candidate)
  const candidate = parsed.data || parsed.cv || parsed;
  if (candidate && (candidate.name || candidate.timeline || candidate.skills || candidate.projects || candidate.role)) {
    const normalized: CVData = {
      name: candidate.name || 'Nguyen Duc Anh',
      role: candidate.role || 'Developer',
      email: candidate.email || '',
      phone: candidate.phone || '',
      location: candidate.location || '',
      github: candidate.github || '',
      linkedin: candidate.linkedin || '',
      website: candidate.website || '',
      avatar: candidate.avatar || '',
      showAvatar: candidate.showAvatar ?? true,
      summary: candidate.summary || '',
      timeline: Array.isArray(candidate.timeline) ? candidate.timeline : [],
      projects: Array.isArray(candidate.projects) ? candidate.projects : [],
      skills: Array.isArray(candidate.skills) ? candidate.skills : [],
      education: Array.isArray(candidate.education) ? candidate.education : [],
    };

    return {
      type: 'single',
      data: normalized,
      meta: parsed,
      summary: {
        name: normalized.name,
        role: normalized.role,
        timelineCount: normalized.timeline.length,
        projectsCount: normalized.projects.length,
        skillsCount: normalized.skills.length,
        eduCount: normalized.education.length,
      },
    };
  }

  throw new Error('INVALID_CV_SCHEMA');
}
