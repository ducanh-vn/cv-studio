import type {
  CVData,
  Language,
  TemplateId,
  SectionKey,
  EducationItem,
  CustomSectionItem,
} from '@/types/cvBuilder';
import type { TimelineItem, ProjectItem } from '@/lib/data';
import type { CustomTechLink } from '@/lib/customTechLinks';
import type { CVQRConfig } from '@/lib/cvQRCode';

export interface ColorTheme {
  primary: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  lightBg: string;
  sidebarBg: string;
  gradient: string;
}

export interface SpacingDensity {
  header: string;
  body: string;
  sectionGap: string;
  itemGap: string;
  itemSubGap: string;
  cardPad: string;
  gridGap: string;
  textDesc: string;
  textSummary: string;
  timelineLine: string;
  sidebarPad: string;
}

export interface CVTemplateProps {
  cv: CVData;
  setCv: (cv: CVData | ((prev: CVData) => CVData)) => void;
  lang: Language;
  t: Record<string, string>;
  activeColor: ColorTheme;
  pad: SpacingDensity;
  sectionOrder: SectionKey[];
  sectionVisibility: Record<SectionKey, boolean>;
  isCompact?: boolean;
  template?: TemplateId;
  qrDataUrl?: string;
  activeQrConfig?: CVQRConfig;
  triggerAvatarUpload?: () => void;

  // Timeline callbacks
  addTimelineItem: (insertIndex?: number) => void;
  updateTimelineItem: (id: string, field: keyof TimelineItem, value: any) => void;
  moveTimelineItem: (index: number, direction: 'up' | 'down') => void;
  deleteTimelineItem: (id: string) => void;

  // Project callbacks
  addProjectItem: (insertIndex?: number) => void;
  updateProjectItem: (id: string, field: keyof ProjectItem, value: any) => void;
  moveProjectItem: (index: number, direction: 'up' | 'down') => void;
  deleteProjectItem: (id: string) => void;

  // Skills callbacks
  updateSkill: (index: number, value: string) => void;
  removeSkill: (index: number) => void;
  addSkill?: (name: string) => void;
  newSkillText?: string;
  setNewSkillText?: (text: string) => void;
  isAddingSkill?: boolean;
  setIsAddingSkill?: (adding: boolean) => void;

  // Education callbacks
  addEducationItem: (insertIndex?: number) => void;
  updateEducationItem: (id: string, field: keyof EducationItem, value: any) => void;
  moveEducationItem: (index: number, direction: 'up' | 'down') => void;
  deleteEducationItem: (id: string) => void;

  // Tech link callbacks
  handleUpdateCustomLink: (id: string, updates: Partial<CustomTechLink>) => void;

  // Custom section callbacks
  updateCustomSectionTitle?: (sectionId: string, title: string) => void;
  updateCustomSectionContent?: (sectionId: string, content: string) => void;
  addCustomSectionItem?: (sectionId: string, afterIndex?: number) => void;
  updateCustomSectionItem?: (sectionId: string, itemId: string, field: keyof CustomSectionItem, value: string) => void;
  deleteCustomSectionItem?: (sectionId: string, itemId: string) => void;
  moveCustomSectionItem?: (sectionId: string, index: number, direction: 'up' | 'down') => void;
  removeCustomSection?: (sectionId: string) => void;
}
