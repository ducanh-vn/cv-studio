import type { CSSProperties, ComponentType } from 'react';
import type { PortfolioData, ProjectItem, TimelineItem } from '@/lib/data';
import type { CustomTechLink } from '@/lib/customTechLinks';
import type { CVQRConfig } from '@/lib/cvQRCode';
import type { CVTypographyConfig } from '@/lib/cvTypography';
import type { CVTemplateProps } from '@/components/templates/types';

export type { ProjectItem, TimelineItem, CVTemplateProps };

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  year: string;
  desc?: string;
}

export type StandardSectionKey = 'summary' | 'experience' | 'projects' | 'skills' | 'education';
export type SectionKey = StandardSectionKey | string;

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  desc?: string;
}

export type CanvasBgThemeId =
  | 'figma-dots'
  | 'portfolio-warm'
  | 'blueprint-grid'
  | 'editorial-noise'
  | 'pitch-black'
  | 'studio-slate';

export interface CanvasBgThemeOption {
  id: CanvasBgThemeId;
  nameVi: string;
  nameEn: string;
  tagVi: string;
  tagEn: string;
  style: CSSProperties;
  previewBg: string;
  previewPattern?: string;
  previewBadge: string;
}

export interface CustomSection {
  id: string;
  title: string;
  titleEn?: string;
  type: 'list' | 'text';
  content?: string;
  items?: CustomSectionItem[];
}

export interface CustomSectionPreset {
  presetId: string;
  icon: any;
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
  type: 'list' | 'text';
  templateVi: CustomSection;
  templateEn: CustomSection;
}

export interface SectionMetaItem {
  key: SectionKey;
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
  icon: ComponentType<{ className?: string }>;
}

export interface CVData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  avatar: string;
  showAvatar: boolean;
  summary: string;
  skills: string[];
  timeline: TimelineItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  customSections?: CustomSection[];
  customLinks?: CustomTechLink[];
  qrConfig?: CVQRConfig;
}

export type TemplateId =
  | 'rabbit' // Tech Dark Banner & Connected Vertical Timeline
  | 'cascade' // Left Colored Sidebar
  | 'chicken' // Dark Header Banner
  | 'iconic' // Icon Header Badges
  | 'crisp' // Two-Column Clean
  | 'basic' // 1-Column Minimalist ATS
  | 'decker' // Pill Badge Headers
  | 'enfold' // Right Colored Sidebar
  | 'bubbles' // Rounded Card Bubbles
  | 'editorial'; // Editorial Luxury Q-HJV

export type Language = 'vi' | 'en';

export type CVFontFamily =
  | 'inter'
  | 'bevietnam'
  | 'jakarta'
  | 'roboto'
  | 'merriweather'
  | 'jetbrains'
  | 'sans'
  | 'serif'
  | 'mono';

export interface CVFontOption {
  id: CVFontFamily;
  name: string;
  tagVi: string;
  tagEn: string;
  descVi: string;
  descEn: string;
  fontClass: string;
  fontFamilyCss: string;
}

export interface CVSnapshot {
  cv: CVData;
  template: TemplateId;
  accentColor: 'blue' | 'yellow' | 'emerald' | 'slate' | 'rose';
  fontFamily: CVFontFamily;
  isCompact: boolean;
  typography?: CVTypographyConfig;
  sectionOrder: SectionKey[];
  sectionVisibility: Record<string, boolean>;
}

export interface TemplateDef {
  id: TemplateId;
  name: string;
  category: 'all' | 'popular' | 'sidebar' | 'ats' | 'creative';
  badge: string;
  badgeEn?: string;
  desc: string;
  descEn?: string;
}

export interface CVBuilderClientProps {
  initialPortfolio: PortfolioData;
  isPublicView?: boolean;
}

export type { PageFillStatus, A4PageMetrics, A4StatusStyle, AutoFitOptions } from './a4PageGauge';
export type { PageMode, PageSheetMetric, PageBreakConfig, MultiPageInfo } from './cvPageLayout';
export type { RichTextFormat, ToolbarPosition, RichTokenType, RichToken } from './cvRichText';
export type { JobApplicationStatus, JobWorkType, JobApplication, KanbanColumnDef, JobTrackerStats } from './jobTracker';
export type { AuthProvider, SyncStatus, AuthUser, CloudWorkspace, AuthSyncState } from './auth';
export type { SupabaseConfig, UserCVCloudRecord, CloudSyncResult, SupabaseAuthState } from './supabase';




