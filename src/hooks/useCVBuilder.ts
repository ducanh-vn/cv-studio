'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type {
  CVData,
  Language,
  TemplateId,
  CVFontFamily,
  SectionKey,
  CVTemplateProps,
  CustomSection,
  CustomSectionItem,
  EducationItem,
  TimelineItem,
  ProjectItem,
  CanvasBgThemeId,
  CanvasBgThemeOption,
  TemplateDef,
} from '@/types/cvBuilder';
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_VISIBILITY,
  CUSTOM_SECTION_PRESETS,
  CANVAS_BG_THEMES,
  TEMPLATES_COLLECTION,
  CV_FONT_OPTIONS,
} from '@/constants/cvConstants';
import type { PortfolioData } from '@/lib/data';
import {
  createDefaultCVData,
  createDefaultEnglishCVData,
} from '@/lib/cvBuilderDefaults';
import { cvTranslations } from '@/data/cvTranslations';
import {
  sanitizeCVTechStuttering,
  lintCVTechnologies,
  lintAndFormatText,
  safeReplaceTechName,
  normalizeSingleSkill,
  TechLintIssue,
} from '@/lib/techLinter';
import { evaluateCVStrength, CVStrengthEvaluation } from '@/lib/cvStrength';
import {
  analyzeJDMatch,
  JDMatchResult,
} from '@/lib/jdMatcher';
import {
  CustomTechLink,
  TechLinkPlatform,
  TECH_PLATFORM_META,
  detectLinkPlatform,
  formatLinkDisplay,
  ensureCustomLinks,
} from '@/lib/customTechLinks';
import {
  CoverLetterData,
  CoverLetterPreset,
  createSyncedCoverLetter,
} from '@/lib/coverLetter';
import {
  CVQRConfig,
  ensureQRConfig,
  getQRTargetText,
  generateQRDataUrl,
} from '@/lib/cvQRCode';
import {
  CVTypographyConfig,
  DEFAULT_TYPOGRAPHY_CONFIG,
  COMPACT_TYPOGRAPHY_PRESET,
} from '@/lib/cvTypography';
import {
  exportDocumentImage,
  printDocument,
  generateExportFileName,
} from '@/lib/cvExport';
import type { ImageExportFormat, ExportResolution } from '@/lib/exportImage';
import { formatDateStamp } from '@/lib/cvFormatters';
import {
  createFullBackupPayload,
  createSingleProfileBackupPayload,
  downloadJsonFile,
  copyJsonToClipboard,
  ImportPreviewResult,
} from '@/lib/cvBackup';

export const COLOR_THEMES: Record<string, {
  primary: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  lightBg: string;
  sidebarBg: string;
  gradient: string;
}> = {
  blue: {
    primary: '#0284c7',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
    border: '#0284c7',
    lightBg: '#f0f9ff',
    sidebarBg: '#082f49',
    gradient: 'from-[#38bdf8] to-[#0284c7]',
  },
  yellow: {
    primary: '#d97706',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    border: '#f59e0b',
    lightBg: '#fffbeb',
    sidebarBg: '#451a03',
    gradient: 'from-[#fbbf24] to-[#d97706]',
  },
  emerald: {
    primary: '#059669',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
    border: '#10b981',
    lightBg: '#ecfdf5',
    sidebarBg: '#064e3b',
    gradient: 'from-[#34d399] to-[#059669]',
  },
  slate: {
    primary: '#0f172a',
    badgeBg: '#f1f5f9',
    badgeText: '#0f172a',
    border: '#334155',
    lightBg: '#f8fafc',
    sidebarBg: '#18181b',
    gradient: 'from-[#475569] to-[#0f172a]',
  },
  rose: {
    primary: '#be123c',
    badgeBg: '#ffe4e6',
    badgeText: '#881337',
    border: '#f43f5e',
    lightBg: '#fff1f2',
    sidebarBg: '#4c0519',
    gradient: 'from-[#fb7185] to-[#be123c]',
  },
};

export const FONT_CLASSES: Record<string, string> = {
  inter: 'font-inter',
  bevietnam: 'font-bevietnam',
  jakarta: 'font-jakarta',
  roboto: 'font-roboto',
  merriweather: 'font-merriweather',
  jetbrains: 'font-jetbrains',
  sans: 'font-inter',
  serif: 'font-merriweather',
  mono: 'font-jetbrains',
};

export interface UseCVBuilderOptions {
  initialPortfolio: PortfolioData;
  isPublicView?: boolean;
  initialViewMode?: 'preview' | 'editor' | 'public';
}

export function useCVBuilder({
  initialPortfolio,
  isPublicView = false,
  initialViewMode = 'editor',
}: UseCVBuilderOptions) {
  // 1. Initial default CV Data
  const defaultCVData = useMemo(() => createDefaultCVData(initialPortfolio), [initialPortfolio]);
  const defaultEnglishCVData = useMemo(() => createDefaultEnglishCVData(initialPortfolio), [initialPortfolio]);

  // 2. Bilingual State (VI ⟷ EN)
  const [lang, setLang] = useState<Language>('vi');
  const [cvVi, setCvVi] = useState<CVData>(() => sanitizeCVTechStuttering(defaultCVData));
  const [cvEn, setCvEn] = useState<CVData>(() => sanitizeCVTechStuttering(defaultEnglishCVData));
  const [rawCv, setCvState] = useState<CVData>(() => sanitizeCVTechStuttering(defaultCVData));

  // 3. Public Share & Privacy Masking States
  const [isShareLinkEnabled, setIsShareLinkEnabled] = useState(true);
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [privacyHidePhone, setPrivacyHidePhone] = useState(false);
  const [privacyHideLocation, setPrivacyHideLocation] = useState(false);
  const [shareAllowDownload, setShareAllowDownload] = useState(true);
  const [shareIncludeCoverLetter, setShareIncludeCoverLetter] = useState(true);
  const [publicTemplateMenuOpen, setPublicTemplateMenuOpen] = useState(false);
  const [shareOrigin, setShareOrigin] = useState('');
  const [shareQrDataUrl, setShareQrDataUrl] = useState('');

  // Memoized CV with privacy masking for public view
  const cv = useMemo(() => {
    if (!isPublicView) return rawCv;
    return {
      ...rawCv,
      phone: privacyHidePhone
        ? lang === 'en'
          ? '+84 ••• ••• ••• (Hidden for privacy)'
          : '+84 ••• ••• ••• (Bảo mật riêng tư)'
        : rawCv.phone,
      location: privacyHideLocation
        ? lang === 'en'
          ? 'Vietnam (Relocation available)'
          : 'Việt Nam'
        : rawCv.location,
    };
  }, [rawCv, isPublicView, privacyHidePhone, privacyHideLocation, lang]);

  // Toast & Loading & Saving
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Wrapper for setCv syncing active state with language profile
  const setCv = useCallback((updater: CVData | ((prev: CVData) => CVData)) => {
    setCvState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (lang === 'vi') {
        setCvVi(next);
      } else {
        setCvEn(next);
      }
      return next;
    });
  }, [lang]);

  const t = cvTranslations[lang];

  // Language Switcher Handlers
  const handleSwitchLanguage = useCallback((newLang: Language) => {
    if (newLang === lang) return;
    if (newLang === 'en') {
      setCvVi(rawCv);
      setCvState(cvEn);
      setLang('en');
      setToastMessage('Đã chuyển sang CV Tiếng Anh (English CV)!');
    } else {
      setCvEn(rawCv);
      setCvState(cvVi);
      setLang('vi');
      setToastMessage('Đã chuyển sang CV Tiếng Việt!');
    }
    setTimeout(() => setToastMessage(null), 3000);
  }, [lang, rawCv, cvEn, cvVi]);

  const handleToggleLang = useCallback(() => {
    handleSwitchLanguage(lang === 'vi' ? 'en' : 'vi');
  }, [lang, handleSwitchLanguage]);

  // Quick sync contact info between language profiles
  const syncContactInfoBetweenLangs = useCallback(() => {
    if (lang === 'vi') {
      setCvEn((prev) => ({
        ...prev,
        email: cv.email,
        phone: cv.phone,
        location: cv.location,
        github: cv.github,
        linkedin: cv.linkedin,
        website: cv.website,
        avatar: cv.avatar,
        showAvatar: cv.showAvatar,
        customLinks: cv.customLinks ? [...cv.customLinks] : undefined,
      }));
      setToastMessage('Đã đồng bộ thông tin liên hệ sang bản Tiếng Anh!');
    } else {
      setCvVi((prev) => ({
        ...prev,
        email: cv.email,
        phone: cv.phone,
        location: cv.location,
        github: cv.github,
        linkedin: cv.linkedin,
        website: cv.website,
        avatar: cv.avatar,
        showAvatar: cv.showAvatar,
        customLinks: cv.customLinks ? [...cv.customLinks] : undefined,
      }));
      setToastMessage('Đã đồng bộ thông tin liên hệ sang bản Tiếng Việt!');
    }
    setTimeout(() => setToastMessage(null), 3000);
  }, [lang, cv]);

  // 4. Design & Style States
  const [template, setTemplate] = useState<TemplateId>('rabbit');
  const [accentColor, setAccentColor] = useState<'blue' | 'yellow' | 'emerald' | 'slate' | 'rose'>('blue');
  const [fontFamily, setFontFamily] = useState<CVFontFamily>('inter');
  const [isCompact, setIsCompact] = useState(false);
  const [typographyConfig, setTypographyConfig] = useState<CVTypographyConfig>(DEFAULT_TYPOGRAPHY_CONFIG);

  const toggleCompactMode = useCallback(() => {
    setIsCompact((prev) => {
      const next = !prev;
      if (next) {
        setTypographyConfig(COMPACT_TYPOGRAPHY_PRESET);
      } else {
        setTypographyConfig(DEFAULT_TYPOGRAPHY_CONFIG);
      }
      return next;
    });
  }, []);

  const handleResetTypography = useCallback(() => {
    setTypographyConfig(DEFAULT_TYPOGRAPHY_CONFIG);
  }, []);

  const handleUpdateTypographyScale = useCallback((scale: number) => {
    setTypographyConfig((prev) => ({ ...prev, scale }));
  }, []);

  const handleUpdateLineHeight = useCallback((lineHeight: number) => {
    setTypographyConfig((prev) => ({ ...prev, lineHeight }));
  }, []);

  const handleUpdateSectionSpacing = useCallback((sectionSpacing: number) => {
    setTypographyConfig((prev) => ({ ...prev, sectionSpacing }));
  }, []);

  // 5. Canvas & Workspace States
  const [zoom, setZoom] = useState<number>(90);
  const [canvasBgTheme, setCanvasBgTheme] = useState<CanvasBgThemeId>('figma-dots');
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);

  const handleSelectCanvasBgTheme = useCallback((themeId: CanvasBgThemeId) => {
    setCanvasBgTheme(themeId);
    setIsBgPickerOpen(false);
  }, []);

  const activeCanvasBgTheme: CanvasBgThemeOption = useMemo(() => {
    return CANVAS_BG_THEMES.find((t) => t.id === canvasBgTheme) || CANVAS_BG_THEMES[0];
  }, [canvasBgTheme]);

  // 6. Section Order & Visibility
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(DEFAULT_SECTION_ORDER);
  const [sectionVisibility, setSectionVisibility] = useState<Record<SectionKey, boolean>>(DEFAULT_SECTION_VISIBILITY);

  const toggleSectionVisibility = useCallback((key: SectionKey) => {
    setSectionVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const moveSection = useCallback((key: SectionKey, direction: 'up' | 'down') => {
    setSectionOrder((prev) => {
      const index = prev.indexOf(key);
      if (index < 0) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const newOrder = [...prev];
      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = key;
      return newOrder;
    });
  }, []);

  const resetSections = useCallback(() => {
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setSectionVisibility(DEFAULT_SECTION_VISIBILITY);
  }, []);

  // 7. UI Navigation / Rail / Drawer States
  const [activeRailTab, setActiveRailTab] = useState<'design' | 'content' | 'layout' | 'ai-ats' | 'data' | 'cover_letter'>('design');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [drawerTab, setDrawerTab] = useState<'profile' | 'summary' | 'experience' | 'projects' | 'skills' | 'education' | 'data'>('profile');
  const [contentSubTab, setContentSubTab] = useState<string>('profile');
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(initialViewMode === 'preview');

  // Scrollable Section Tabs in Content Drawer
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sectionTabsRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const checkSectionTabsScroll = useCallback(() => {
    if (!sectionTabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sectionTabsRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  const handleScrollSectionTabs = useCallback((direction: 'left' | 'right') => {
    if (!sectionTabsRef.current) return;
    const scrollAmount = 180;
    sectionTabsRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkSectionTabsScroll, 300);
  }, [checkSectionTabsScroll]);

  const handleSectionTabsWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (!sectionTabsRef.current) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    sectionTabsRef.current.scrollLeft += e.deltaY;
    checkSectionTabsScroll();
  }, [checkSectionTabsScroll]);

  // 8. Skills Input State & Handlers
  const [newSkillText, setNewSkillText] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const addSkill = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCv((prev) => {
      if (prev.skills.includes(trimmed)) return prev;
      return { ...prev, skills: [...prev.skills, trimmed] };
    });
    setNewSkillText('');
    setIsAddingSkill(false);
  }, [setCv]);

  const updateSkill = useCallback((index: number, newName: string) => {
    setCv((prev) => {
      const list = [...prev.skills];
      list[index] = newName.trim();
      return { ...prev, skills: list };
    });
  }, [setCv]);

  const removeSkill = useCallback((index: number) => {
    setCv((prev) => {
      const list = [...prev.skills];
      list.splice(index, 1);
      return { ...prev, skills: list };
    });
  }, [setCv]);

  const moveSkill = useCallback((index: number, direction: 'up' | 'down') => {
    setCv((prev) => {
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.skills.length - 1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const list = [...prev.skills];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, skills: list };
    });
  }, [setCv]);

  // 9. Timeline CRUD
  const addTimelineItem = useCallback((index?: number) => {
    const idx = index !== undefined ? index : cv.timeline.length - 1;
    const newItem: TimelineItem = {
      id: `exp-${Date.now()}`,
      period: '2024 — PRESENT',
      role: lang === 'en' ? 'Position / Role' : 'Vị trí công việc',
      desc:
        lang === 'en'
          ? 'Describe your key contributions, achievements, and impact using strong action verbs.'
          : 'Mô tả chi tiết các đóng góp nổi bật, kết quả đạt được và công nghệ sử dụng trong công việc.',
    };
    setCv((prev) => {
      const list = [...prev.timeline];
      list.splice(idx + 1, 0, newItem);
      return { ...prev, timeline: list };
    });
  }, [cv.timeline.length, lang, setCv]);

  const updateTimelineItem = useCallback((id: string, field: keyof TimelineItem, value: any) => {
    setCv((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  }, [setCv]);

  const deleteTimelineItem = useCallback((id: string) => {
    setCv((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((t) => t.id !== id),
    }));
  }, [setCv]);

  const moveTimelineItem = useCallback((index: number, direction: 'up' | 'down') => {
    setCv((prev) => {
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.timeline.length - 1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const list = [...prev.timeline];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, timeline: list };
    });
  }, [setCv]);

  // 10. Projects CRUD
  const addProjectItem = useCallback((index?: number) => {
    const idx = index !== undefined ? index : cv.projects.length - 1;
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      num: `0${cv.projects.length + 1}`,
      title: lang === 'en' ? 'New Project Title' : 'Tên dự án mới',
      category: lang === 'en' ? 'Web Application' : 'Ứng dụng Web',
      year: '2024',
      desc:
        lang === 'en'
          ? 'Concise overview of project objectives, architecture, and technology stack.'
          : 'Mô tả tổng quan về bài toán, mục tiêu dự án và giải pháp công nghệ đã áp dụng.',
      badges: ['React', 'TypeScript', 'Tailwind CSS'],
      liveDemo: '',
      github: '',
      features: [
        {
          title: lang === 'en' ? 'Key Feature 1' : 'Tính năng nổi bật 1',
          detail:
            lang === 'en'
              ? 'Detailed metric or accomplishment achieved.'
              : 'Chi tiết tính năng hoặc thành tích đạt được trong dự án.',
        },
      ],
    };
    setCv((prev) => {
      const list = [...prev.projects];
      list.splice(idx + 1, 0, newProj);
      return { ...prev, projects: list };
    });
  }, [cv.projects.length, lang, setCv]);

  const updateProjectItem = useCallback((id: string, field: keyof ProjectItem, value: any) => {
    setCv((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  }, [setCv]);

  const deleteProjectItem = useCallback((id: string) => {
    setCv((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, [setCv]);

  const moveProjectItem = useCallback((index: number, direction: 'up' | 'down') => {
    setCv((prev) => {
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.projects.length - 1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const list = [...prev.projects];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, projects: list };
    });
  }, [setCv]);

  // 11. Education CRUD
  const addEducationItem = useCallback((index?: number) => {
    const idx = index !== undefined ? index : cv.education.length - 1;
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      school: lang === 'en' ? 'University / Institution Name' : 'Tên trường / Học viện',
      degree: lang === 'en' ? 'Degree / Major' : 'Bằng cấp / Chuyên ngành',
      year: '2020 — 2024',
      desc:
        lang === 'en'
          ? 'Graduation honors, GPA, relevant coursework, or specialized academic focus.'
          : 'Xếp loại tốt nghiệp, điểm GPA, các môn học thế mạnh hoặc đồ án tốt nghiệp nổi bật.',
    };
    setCv((prev) => {
      const list = [...prev.education];
      list.splice(idx + 1, 0, newEdu);
      return { ...prev, education: list };
    });
  }, [cv.education.length, lang, setCv]);

  const updateEducationItem = useCallback((id: string, field: keyof EducationItem, value: any) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  }, [setCv]);

  const deleteEducationItem = useCallback((id: string) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  }, [setCv]);

  const moveEducationItem = useCallback((index: number, direction: 'up' | 'down') => {
    setCv((prev) => {
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.education.length - 1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const list = [...prev.education];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, education: list };
    });
  }, [setCv]);

  // 12. Custom Sections CRUD
  const addCustomSection = useCallback((presetId?: string) => {
    const preset = CUSTOM_SECTION_PRESETS.find((p) => p.presetId === presetId);
    const newId = `custom_${Date.now()}`;
    const newSec: CustomSection = {
      id: newId,
      title: preset ? (lang === 'en' ? preset.templateEn.title : preset.templateVi.title) : (lang === 'en' ? 'New Section' : 'Mục mới'),
      titleEn: preset ? preset.templateEn.title : 'New Section',
      type: preset ? preset.type : 'list',
      content: preset?.type === 'text' ? (lang === 'en' ? preset.templateEn.content : preset.templateVi.content) : '',
      items: preset?.type === 'list'
        ? (lang === 'en' ? preset.templateEn.items : preset.templateVi.items)?.map((it, idx) => ({
            ...it,
            id: `item-${Date.now()}-${idx}`,
          }))
        : [
            {
              id: `item-${Date.now()}-0`,
              title: lang === 'en' ? 'Title / Name' : 'Tên mục / Chứng chỉ / Hoạt động',
              subtitle: lang === 'en' ? 'Organization / Issuer' : 'Tổ chức / Đơn vị cấp',
              date: '2024',
              desc: lang === 'en' ? 'Description of responsibilities or impact' : 'Mô tả chi tiết hoặc thành tựu đạt được',
            },
          ],
    };

    setCv((prev) => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSec],
    }));
    setSectionOrder((prev) => [...prev, newId]);
    setSectionVisibility((prev) => ({ ...prev, [newId]: true }));
    setShowAddSectionMenu(false);
    setToastMessage(lang === 'en' ? `Added section: ${newSec.title}` : `Đã thêm mục: ${newSec.title}`);
    setTimeout(() => setToastMessage(null), 2500);
  }, [lang, setCv]);

  const removeCustomSection = useCallback((sectionId: string) => {
    const sec = cv.customSections?.find((s) => s.id === sectionId);
    const title = sec?.title || 'Mục tùy chỉnh';
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).filter((s) => s.id !== sectionId),
    }));
    setSectionOrder((prev) => prev.filter((k) => k !== sectionId));
    setSectionVisibility((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    setToastMessage(lang === 'en' ? `Removed section: ${title}` : `Đã xóa mục: ${title}`);
    setTimeout(() => setToastMessage(null), 2500);
  }, [cv.customSections, lang, setCv]);

  const updateCustomSectionTitle = useCallback((sectionId: string, title: string) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((s) => (s.id === sectionId ? { ...s, title } : s)),
    }));
  }, [setCv]);

  const updateCustomSectionContent = useCallback((sectionId: string, content: string) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((s) => (s.id === sectionId ? { ...s, content } : s)),
    }));
  }, [setCv]);

  const addCustomSectionItem = useCallback((sectionId: string, afterIndex?: number) => {
    const newItem: CustomSectionItem = {
      id: `item-${Date.now()}`,
      title: lang === 'en' ? 'New Item Title' : 'Tiêu đề mục mới',
      subtitle: lang === 'en' ? 'Organization / Issuer' : 'Tổ chức / Đơn vị cấp',
      date: '2024',
      desc: lang === 'en' ? 'Details or description' : 'Mô tả chi tiết',
    };
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        const currentItems = [...(sec.items || [])];
        if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < currentItems.length) {
          currentItems.splice(afterIndex + 1, 0, newItem);
        } else {
          currentItems.push(newItem);
        }
        return { ...sec, items: currentItems };
      }),
    }));
  }, [lang, setCv]);

  const updateCustomSectionItem = useCallback((sectionId: string, itemId: string, field: keyof CustomSectionItem, value: string) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: (sec.items || []).map((it) => (it.id === itemId ? { ...it, [field]: value } : it)),
        };
      }),
    }));
  }, [setCv]);

  const deleteCustomSectionItem = useCallback((sectionId: string, itemId: string) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: (sec.items || []).filter((it) => it.id !== itemId),
        };
      }),
    }));
  }, [setCv]);

  const moveCustomSectionItem = useCallback((sectionId: string, index: number, direction: 'up' | 'down') => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        const items = [...(sec.items || [])];
        if (direction === 'up' && index === 0) return sec;
        if (direction === 'down' && index === items.length - 1) return sec;
        const target = direction === 'up' ? index - 1 : index + 1;
        const temp = items[index];
        items[index] = items[target];
        items[target] = temp;
        return { ...sec, items };
      }),
    }));
  }, [setCv]);

  // 13. Custom Tech Links CRUD
  const handleAddCustomLink = useCallback((platform: TechLinkPlatform = 'website', presetUrl?: string, presetLabel?: string) => {
    const p = platform || 'website';
    const newId = `link-${Date.now()}`;
    const meta = TECH_PLATFORM_META[p];
    const newLink: CustomTechLink = {
      id: newId,
      platform: p,
      url: presetUrl || (meta ? (meta.placeholder.startsWith('http') ? meta.placeholder : `https://${meta.placeholder}`) : 'https://'),
      label: presetLabel || (meta ? meta.defaultLabel : 'Link'),
      enabled: true,
    };
    const currentLinks = ensureCustomLinks(cv);
    setCv({ ...cv, customLinks: [...currentLinks, newLink] });
    setToastMessage(lang === 'en' ? `Added ${meta?.name || p} link` : `Đã thêm liên kết ${meta?.name || p}`);
    setTimeout(() => setToastMessage(null), 2000);
  }, [lang, cv, setCv]);

  const handleUpdateCustomLink = useCallback((id: string, updates: Partial<CustomTechLink>) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.map((l: CustomTechLink) => {
      if (l.id !== id) return l;
      const next = { ...l, ...updates };
      if (updates.url && !updates.platform) {
        const detected = detectLinkPlatform(updates.url);
        if (detected !== 'custom' && detected !== l.platform) {
          next.platform = detected;
        }
        const pMeta = TECH_PLATFORM_META[next.platform];
        if (!updates.label && (!l.label || l.label === pMeta?.defaultLabel)) {
          next.label = formatLinkDisplay(updates.url, next.platform);
        }
      }
      return next;
    });
    setCv({ ...cv, customLinks: updated });
  }, [cv, setCv]);

  const handleToggleCustomLink = useCallback((id: string) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.map((l: CustomTechLink) => (l.id === id ? { ...l, enabled: !l.enabled } : l));
    setCv({ ...cv, customLinks: updated });
  }, [cv, setCv]);

  const handleRemoveCustomLink = useCallback((id: string) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.filter((l: CustomTechLink) => l.id !== id);
    setCv({ ...cv, customLinks: updated });
  }, [cv, setCv]);

  const handleMoveCustomLink = useCallback((index: number, direction: 'up' | 'down') => {
    const currentLinks = ensureCustomLinks(cv);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentLinks.length) return;
    const copy = [...currentLinks];
    const [removed] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, removed);
    setCv({ ...cv, customLinks: copy });
  }, [cv, setCv]);

  // 14. Avatar Handlers
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const triggerAvatarUpload = useCallback(() => {
    avatarInputRef.current?.click();
  }, []);

  const handleAvatarFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToastMessage(lang === 'en' ? 'Please upload an image file (PNG, JPG, WEBP).' : 'Vui lòng chọn file ảnh (PNG, JPG, WEBP).');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setToastMessage(lang === 'en' ? 'Image size must be smaller than 2MB.' : 'Dung lượng ảnh cần nhỏ hơn 2MB.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setCv((prev) => ({
          ...prev,
          avatar: base64,
          showAvatar: true,
        }));
        setToastMessage(lang === 'en' ? 'Profile photo uploaded successfully!' : 'Đã tải ảnh đại diện thành công!');
        setTimeout(() => setToastMessage(null), 3000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [lang, setCv]);

  const handleRemoveAvatar = useCallback(() => {
    setCv((prev) => ({
      ...prev,
      avatar: '',
      showAvatar: false,
    }));
    setToastMessage(lang === 'en' ? 'Removed profile photo.' : 'Đã gỡ ảnh đại diện.');
    setTimeout(() => setToastMessage(null), 2500);
  }, [lang, setCv]);

  // 15. Matching Cover Letter State & Handlers
  const [docMode, setDocMode] = useState<'cv' | 'cover_letter'>('cv');
  const [coverLetterVi, setCoverLetterVi] = useState<CoverLetterData>(() =>
    createSyncedCoverLetter('vi', defaultCVData)
  );
  const [coverLetterEn, setCoverLetterEn] = useState<CoverLetterData>(() =>
    createSyncedCoverLetter('en', defaultEnglishCVData)
  );
  const [activeCoverLetterPresetId, setActiveCoverLetterPresetId] = useState<string>('frontend-focus');
  const [isCoverLetterCopied, setIsCoverLetterCopied] = useState<boolean>(false);
  const currentCoverLetter = lang === 'vi' ? coverLetterVi : coverLetterEn;

  const handleUpdateCoverLetterField = useCallback((field: keyof CoverLetterData, value: string) => {
    if (lang === 'vi') {
      setCoverLetterVi((prev) => ({ ...prev, [field]: value }));
    } else {
      setCoverLetterEn((prev) => ({ ...prev, [field]: value }));
    }
  }, [lang]);

  const handleApplyCoverLetterPreset = useCallback((preset: CoverLetterPreset) => {
    setActiveCoverLetterPresetId(preset.id);
    const data = lang === 'en' ? preset.dataEn : preset.dataVi;
    if (lang === 'vi') {
      setCoverLetterVi((prev) => ({ ...prev, ...data }));
    } else {
      setCoverLetterEn((prev) => ({ ...prev, ...data }));
    }
    setToastMessage(
      lang === 'en'
        ? `Applied "${preset.titleEn}" cover letter preset!`
        : `Đã áp dụng mẫu thư: "${preset.titleVi}"!`
    );
    setTimeout(() => setToastMessage(null), 3000);
  }, [lang]);

  const handleSyncCoverLetterWithCV = useCallback(() => {
    const activeCv = cv;
    const updater = (prev: CoverLetterData): CoverLetterData => ({
      ...prev,
      senderName: activeCv.name || prev.senderName,
      senderRole: activeCv.role || prev.senderRole,
      senderEmail: activeCv.email || prev.senderEmail,
      senderPhone: activeCv.phone || prev.senderPhone,
      senderLocation: activeCv.location || prev.senderLocation,
      senderWebsite: activeCv.website || prev.senderWebsite,
    });
    if (lang === 'vi') {
      setCoverLetterVi(updater);
    } else {
      setCoverLetterEn(updater);
    }
    setToastMessage(
      lang === 'en'
        ? 'Cover letter sender info synchronized from CV!'
        : 'Đã đồng bộ thông tin ứng viên từ CV vào Thư xin việc!'
    );
    setTimeout(() => setToastMessage(null), 3000);
  }, [cv, lang]);

  const handleCopyCoverLetterText = useCallback(() => {
    const currentLetter = lang === 'vi' ? coverLetterVi : coverLetterEn;
    const fullText = [
      `${currentLetter.senderName.toUpperCase()}`,
      `${currentLetter.senderRole} | ${currentLetter.senderEmail} | ${currentLetter.senderPhone} | ${currentLetter.senderLocation}`,
      currentLetter.senderWebsite ? `Website: ${currentLetter.senderWebsite}` : '',
      '',
      `${currentLetter.date}`,
      '',
      `Kính gửi: ${currentLetter.recipientName}`,
      `${currentLetter.recipientRole}`,
      `${currentLetter.companyName}`,
      `${currentLetter.companyAddress}`,
      '',
      `V/v: Ứng tuyển vị trí ${currentLetter.jobTitle}`,
      '',
      `${currentLetter.salutation}`,
      '',
      `${currentLetter.opening}`,
      '',
      `${currentLetter.body1}`,
      '',
      `${currentLetter.body2}`,
      '',
      `${currentLetter.closing}`,
      '',
      `${currentLetter.signOff}`,
      `${currentLetter.senderName}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setIsCoverLetterCopied(true);
      setToastMessage(
        lang === 'en'
          ? 'Cover letter text copied to clipboard!'
          : 'Đã sao chép toàn bộ nội dung thư xin việc vào bộ nhớ tạm!'
      );
      setTimeout(() => {
        setIsCoverLetterCopied(false);
        setToastMessage(null);
      }, 2500);
    }
  }, [lang, coverLetterVi, coverLetterEn]);

  // 16. CV Personal QR Code State & Generation
  const activeColor = COLOR_THEMES[accentColor] || COLOR_THEMES.blue;
  const activeFont = CV_FONT_OPTIONS.find((f: any) => f.id === fontFamily) || CV_FONT_OPTIONS[0];
  const activeTemplateDef: TemplateDef = TEMPLATES_COLLECTION.find((t) => t.id === template) || TEMPLATES_COLLECTION[0];
  const fontClass = FONT_CLASSES[fontFamily] || 'font-inter';

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrCopied, setQrCopied] = useState<boolean>(false);
  const activeQrConfig = ensureQRConfig(cv.qrConfig);

  useEffect(() => {
    if (!activeQrConfig.enabled) {
      setQrDataUrl('');
      return;
    }
    let isMounted = true;
    const targetText = getQRTargetText(activeQrConfig, cv);
    const colorHex = activeQrConfig.colorMode === 'accent' ? activeColor.primary : '#0F172A';

    generateQRDataUrl(targetText, {
      color: colorHex,
      size: 200,
      margin: 1,
    }).then((url) => {
      if (isMounted) {
        setQrDataUrl(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    activeQrConfig.enabled,
    activeQrConfig.targetType,
    activeQrConfig.customUrl,
    activeQrConfig.colorMode,
    cv.website,
    cv.linkedin,
    cv.github,
    cv.email,
    cv.phone,
    cv.name,
    activeColor.primary,
  ]);

  const handleUpdateQRConfig = useCallback((patch: Partial<CVQRConfig>) => {
    setCv((prev) => {
      const current = ensureQRConfig(prev.qrConfig);
      return {
        ...prev,
        qrConfig: {
          ...current,
          ...patch,
        },
      };
    });
  }, [setCv]);

  const handleUpdateQRTargetUrl = useCallback((newVal: string) => {
    const currentTarget = activeQrConfig.targetType;
    if (currentTarget === 'website') {
      setCv((prev) => ({
        ...prev,
        website: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else if (currentTarget === 'linkedin') {
      setCv((prev) => ({
        ...prev,
        linkedin: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else if (currentTarget === 'github') {
      setCv((prev) => ({
        ...prev,
        github: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else {
      handleUpdateQRConfig({ customUrl: newVal });
    }
  }, [activeQrConfig.targetType, setCv, handleUpdateQRConfig]);

  const handleCopyQRUrl = useCallback((textToCopy: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setQrCopied(true);
    setToastMessage(lang === 'en' ? 'Link copied to clipboard!' : 'Đã sao chép liên kết!');
    setTimeout(() => {
      setQrCopied(false);
      setToastMessage(null);
    }, 2000);
  }, [lang]);

  // 17. Public Share URL & QR Code Generation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareOrigin(window.location.origin);
    }
  }, []);

  const sharePublicUrl = useMemo(() => {
    const origin = shareOrigin || 'https://ducanh.dev';
    const params = new URLSearchParams();
    if (lang === 'en') params.set('lang', 'en');
    if (template !== 'rabbit') params.set('t', template);
    if (accentColor !== 'blue') params.set('c', accentColor);
    if (privacyHidePhone) params.set('hidePhone', '1');
    if (privacyHideLocation) params.set('hideLoc', '1');
    if (!shareAllowDownload) params.set('noDownload', '1');
    if (docMode === 'cover_letter') params.set('mode', 'cover_letter');
    const qs = params.toString();
    return `${origin}/cv/view${qs ? `?${qs}` : ''}`;
  }, [
    shareOrigin,
    lang,
    template,
    accentColor,
    privacyHidePhone,
    privacyHideLocation,
    shareAllowDownload,
    docMode,
  ]);

  useEffect(() => {
    if (!sharePublicUrl) return;
    let isMounted = true;
    generateQRDataUrl(sharePublicUrl, {
      color: '#0F172A',
      size: 260,
      margin: 1,
    }).then((url) => {
      if (isMounted) {
        setShareQrDataUrl(url);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [sharePublicUrl]);

  const handleCopyShareUrl = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(sharePublicUrl);
      setIsShareCopied(true);
      setToastMessage(lang === 'en' ? 'Public link copied to clipboard!' : 'Đã sao chép liên kết xem trực tuyến công khai!');
      setTimeout(() => {
        setIsShareCopied(false);
        setToastMessage(null);
      }, 2500);
    }
  }, [sharePublicUrl, lang]);

  const handleShareLinkedIn = useCallback(() => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePublicUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [sharePublicUrl]);

  const handleShareTwitter = useCallback(() => {
    const text = encodeURIComponent(
      lang === 'en'
        ? `Check out the interactive resume and portfolio of ${cv.name} (${cv.role}):`
        : `Xem hồ sơ CV trực tuyến & portfolio của ${cv.name} (${cv.role}):`
    );
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(sharePublicUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [sharePublicUrl, lang, cv.name, cv.role]);

  const handleShareEmail = useCallback(() => {
    const subject = encodeURIComponent(
      lang === 'en'
        ? `[Resume] ${cv.name} - ${cv.role}`
        : `[Hồ sơ ứng tuyển] ${cv.name} - ${cv.role}`
    );
    const body = encodeURIComponent(
      lang === 'en'
        ? `Dear Hiring Team,\n\nPlease find my verified digital resume and credentials at:\n${sharePublicUrl}\n\nBest regards,\n${cv.name}`
        : `Kính gửi Quý nhà tuyển dụng,\n\nEm xin gửi đường link xem trực tuyến hồ sơ CV và portfolio của em tại:\n${sharePublicUrl}\n\nTrân trọng,\n${cv.name}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  }, [cv.name, cv.role, lang, sharePublicUrl]);

  const handleDownloadShareQr = useCallback(() => {
    if (!shareQrDataUrl) return;
    const a = document.createElement('a');
    a.href = shareQrDataUrl;
    a.download = `QR_${(cv.name || 'CV').replace(/\s+/g, '_')}_Public_View.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setToastMessage(lang === 'en' ? 'Downloaded QR image!' : 'Đã tải ảnh mã QR xem trực tuyến!');
    setTimeout(() => setToastMessage(null), 2500);
  }, [shareQrDataUrl, cv.name, lang]);

  // 18. Print & Export
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [exportResolution, setExportResolution] = useState<ExportResolution>(2);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const cvPrintRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    if (isLoading) {
      setToastMessage(lang === 'en' ? 'CV is still loading, please wait a moment...' : 'Hồ sơ đang tải, vui lòng chờ trong giây lát...');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    setIsExportMenuOpen(false);
    printDocument();
  }, [isLoading, lang]);

  const handleExportImage = useCallback(async (format: ImageExportFormat, resolution: ExportResolution = exportResolution) => {
    setIsExportingImage(true);
    setIsExportMenuOpen(false);
    const isCoverLetter = docMode === 'cover_letter';
    const currentLetter = lang === 'vi' ? coverLetterVi : coverLetterEn;
    const targetElementId = isCoverLetter ? 'cover-letter-paper' : 'cv-paper';
    const baseName = isCoverLetter
      ? currentLetter.senderName || cv.name || 'Nguyen_Duc_Anh'
      : cv.name || 'Nguyen_Duc_Anh';
    const fileName = generateExportFileName({
      baseName,
      docType: isCoverLetter ? 'CoverLetter' : 'CV',
      template,
      lang,
      resolution,
    });

    setToastMessage(
      lang === 'en'
        ? `Rendering high-res ${format.toUpperCase()} (${resolution === 2 ? '300 DPI' : resolution + 'x'})...`
        : `Đang xử lý xuất ảnh ${format.toUpperCase()} (${resolution === 2 ? 'chuẩn 300 DPI' : resolution + 'x'})...`
    );

    try {
      const result = await exportDocumentImage({
        elementId: targetElementId,
        format,
        resolution,
        fileName,
        quality: 0.95,
      });

      if (result.success) {
        setToastMessage(
          lang === 'en'
            ? `Exported ${format.toUpperCase()} image successfully!`
            : `Đã tải ảnh ${format.toUpperCase()} sắc nét về máy thành công!`
        );
      } else {
        setToastMessage(result.error || (lang === 'en' ? 'Failed to export image.' : 'Có lỗi khi xuất ảnh.'));
      }
    } catch (err: any) {
      setToastMessage(err?.message || (lang === 'en' ? 'Export failed.' : 'Xuất ảnh thất bại.'));
    } finally {
      setIsExportingImage(false);
    }
  }, [docMode, lang, coverLetterVi, coverLetterEn, cv.name, template, exportResolution]);

  // Export JSON Handlers
  const handleExportFullJSON = useCallback(() => {
    const payload = createFullBackupPayload({
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
    });
    const dateStr = formatDateStamp();
    downloadJsonFile(payload, `cv-full-backup-${dateStr}.json`);
    setToastMessage(lang === 'en' ? 'Exported full CV backup (.json) successfully!' : 'Đã xuất trọn gói dữ liệu CV (.json) thành công!');
    setTimeout(() => setToastMessage(null), 3000);
  }, [cv, cvVi, cvEn, lang, template, accentColor, fontFamily, isCompact, sectionOrder, sectionVisibility]);

  const handleExportCurrentProfileJSON = useCallback(() => {
    const payload = createSingleProfileBackupPayload({
      cv,
      lang,
      template,
      accentColor,
      fontFamily,
      isCompact,
      sectionOrder,
      sectionVisibility,
    });
    const dateStr = formatDateStamp();
    const safeName = (cv.name || 'cv').toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadJsonFile(payload, `cv-${lang}-${safeName}-${dateStr}.json`);
    setToastMessage(lang === 'en' ? `Exported ${lang.toUpperCase()} CV profile (.json) successfully!` : `Đã xuất hồ sơ CV ${lang === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'} (.json) thành công!`);
    setTimeout(() => setToastMessage(null), 3000);
  }, [cv, lang, template, accentColor, fontFamily, isCompact, sectionOrder, sectionVisibility]);

  const handleCopyJSON = useCallback(async () => {
    const payload = createFullBackupPayload({
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
    });
    await copyJsonToClipboard(payload);
    setToastMessage(t.copyJsonBtn + ' — ' + (lang === 'en' ? 'Copied to clipboard!' : 'Đã sao chép vào bộ nhớ tạm!'));
    setTimeout(() => setToastMessage(null), 3000);
  }, [cv, cvVi, cvEn, lang, template, accentColor, fontFamily, isCompact, sectionOrder, sectionVisibility, t.copyJsonBtn]);

  const handleApplyImport = useCallback((preview: ImportPreviewResult | null, onFinish?: () => void) => {
    if (!preview) return;
    if (preview.type === 'full') {
      const p = preview.data;
      if (p.cvVi) setCvVi(p.cvVi);
      if (p.cvEn) setCvEn(p.cvEn);
      if (p.template && TEMPLATES_COLLECTION.some((tmpl) => tmpl.id === p.template)) {
        setTemplate(p.template);
      }
      if (p.accentColor) setAccentColor(p.accentColor);
      if (p.fontFamily) setFontFamily(p.fontFamily);
      if (p.isCompact !== undefined) setIsCompact(p.isCompact);
      if (p.sectionOrder) setSectionOrder(p.sectionOrder);
      if (p.sectionVisibility) setSectionVisibility(p.sectionVisibility);

      if (p.lang === 'en' && p.cvEn) {
        setLang('en');
        setCvState(p.cvEn);
      } else {
        setLang('vi');
        setCvState(p.cvVi || p.cv);
      }
    } else if (preview.type === 'single') {
      const single = preview.data as CVData;
      setCvState(single);
      if (lang === 'vi') {
        setCvVi(single);
      } else {
        setCvEn(single);
      }
      if (preview.meta?.template && TEMPLATES_COLLECTION.some((tmpl) => tmpl.id === preview.meta.template)) {
        setTemplate(preview.meta.template);
      }
      if (preview.meta?.accentColor) setAccentColor(preview.meta.accentColor);
      if (preview.meta?.fontFamily) setFontFamily(preview.meta.fontFamily);
      if (preview.meta?.isCompact !== undefined) setIsCompact(preview.meta.isCompact);
      if (preview.meta?.sectionOrder) setSectionOrder(preview.meta.sectionOrder);
      if (preview.meta?.sectionVisibility) setSectionVisibility(preview.meta.sectionVisibility);
    }
    onFinish?.();
  }, [lang]);

  // 19. ATS / Tech Linter / JD Matcher Evaluations & Handlers
  const [ignoredIssueIds, setIgnoredIssueIds] = useState<Set<string>>(new Set());
  const [playgroundInput, setPlaygroundInput] = useState<string>('ExpressJS, next js, react JS, tailwind, node JS, AWS, typeScript');
  const [playgroundOutput, setPlaygroundOutput] = useState<string>('');
  const [playgroundReplacements, setPlaygroundReplacements] = useState<any[]>([]);

  const cvStrength = useMemo(() => evaluateCVStrength(cv, lang), [cv, lang]);

  const jdMatchResult = useMemo(
    () => analyzeJDMatch('', cv, lang),
    [cv, lang]
  );

  const techLintReport = useMemo(() => {
    const rawReport = lintCVTechnologies(
      cv,
      docMode === 'cover_letter' ? (lang === 'vi' ? coverLetterVi : coverLetterEn) : undefined
    );
    const filteredIssues = rawReport.issues.filter((iss) => !ignoredIssueIds.has(iss.id));
    return {
      ...rawReport,
      totalIssuesCount: filteredIssues.length,
      issues: filteredIssues,
    };
  }, [cv, docMode, lang, coverLetterVi, coverLetterEn, ignoredIssueIds]);

  const handleFixAllTechIssues = useCallback(() => {
    const rawReport = lintCVTechnologies(
      cv,
      docMode === 'cover_letter' ? (lang === 'vi' ? coverLetterVi : coverLetterEn) : undefined
    );
    const count = rawReport.totalIssuesCount;
    if (count === 0) return;

    setCv(rawReport.cleanCv);
    if (docMode === 'cover_letter' && rawReport.cleanCoverLetter) {
      if (lang === 'vi') {
        setCoverLetterVi(rawReport.cleanCoverLetter);
      } else {
        setCoverLetterEn(rawReport.cleanCoverLetter);
      }
    }
    setIgnoredIssueIds(new Set());
    setToastMessage(
      lang === 'en'
        ? `Cleaned and standardized ${count} technology name${count > 1 ? 's' : ''}!`
        : `Đã chuẩn hóa thành công ${count} tên công nghệ theo chuẩn ngành!`
    );
    setTimeout(() => setToastMessage(null), 3000);
  }, [cv, docMode, lang, coverLetterVi, coverLetterEn, setCv]);

  const handleFixSingleTechIssue = useCallback((issue: TechLintIssue) => {
    if (issue.section === 'skills') {
      setCv((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => (s === issue.original ? issue.replacement : s)),
      }));
    } else if (issue.section === 'summary') {
      setCv((prev) => ({
        ...prev,
        summary: safeReplaceTechName(prev.summary || '', issue.original, issue.replacement),
      }));
    } else if (issue.section === 'timeline') {
      setCv((prev) => ({
        ...prev,
        timeline: prev.timeline.map((item) => {
          if (item.id !== issue.targetId) return item;
          return {
            ...item,
            role: issue.field === 'role' ? safeReplaceTechName(item.role, issue.original, issue.replacement) : item.role,
            desc: issue.field === 'desc' ? safeReplaceTechName(item.desc, issue.original, issue.replacement) : item.desc,
          };
        }),
      }));
    } else if (issue.section === 'projects') {
      setCv((prev) => ({
        ...prev,
        projects: prev.projects.map((proj) => {
          if (proj.id !== issue.targetId) return proj;
          if (issue.field === 'badges' && proj.badges) {
            return {
              ...proj,
              badges: proj.badges.map((b) => (b === issue.original ? issue.replacement : b)),
            };
          }
          if (issue.field === 'desc') {
            return {
              ...proj,
              desc: safeReplaceTechName(proj.desc, issue.original, issue.replacement),
            };
          }
          if (issue.field === 'features' && proj.features) {
            return {
              ...proj,
              features: proj.features.map((f) => ({
                title: safeReplaceTechName(f.title, issue.original, issue.replacement),
                detail: safeReplaceTechName(f.detail, issue.original, issue.replacement),
              })),
            };
          }
          return proj;
        }),
      }));
    } else if (issue.section === 'custom') {
      setCv((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).map((sec) => {
          if (sec.id === issue.targetId && issue.field === 'content' && sec.content) {
            return { ...sec, content: safeReplaceTechName(sec.content, issue.original, issue.replacement) };
          }
          if (sec.items) {
            return {
              ...sec,
              items: sec.items.map((it) => (it.id === issue.targetId ? { ...it, desc: safeReplaceTechName(it.desc || '', issue.original, issue.replacement) } : it)),
            };
          }
          return sec;
        }),
      }));
    } else if (issue.section === 'cover_letter' && issue.field) {
      if (lang === 'vi') {
        setCoverLetterVi((prev) => ({
          ...prev,
          [issue.field!]: safeReplaceTechName((prev as any)[issue.field!] || '', issue.original, issue.replacement),
        }));
      } else {
        setCoverLetterEn((prev) => ({
          ...prev,
          [issue.field!]: safeReplaceTechName((prev as any)[issue.field!] || '', issue.original, issue.replacement),
        }));
      }
    }

    setToastMessage(
      lang === 'en'
        ? `Replaced "${issue.original}" with standard "${issue.replacement}"`
        : `Đã chuẩn hóa "${issue.original}" thành "${issue.replacement}"`
    );
    setTimeout(() => setToastMessage(null), 2500);
  }, [lang, setCv]);

  const handleIgnoreTechIssue = useCallback((issueId: string) => {
    setIgnoredIssueIds((prev) => new Set([...Array.from(prev), issueId]));
  }, []);

  const handleQuickLintSkills = useCallback(() => {
    const nextSkills = cv.skills.map((s) => normalizeSingleSkill(s).normalized);
    setCv((prev) => ({ ...prev, skills: nextSkills }));
    setToastMessage(lang === 'en' ? 'Standardized all skill names!' : 'Đã chuẩn hóa toàn bộ danh pháp trong mục Kỹ năng!');
    setTimeout(() => setToastMessage(null), 2500);
  }, [cv.skills, lang, setCv]);

  const handleRunPlayground = useCallback(() => {
    if (!playgroundInput.trim()) return;
    const { cleanText, replacements } = lintAndFormatText(playgroundInput);
    setPlaygroundOutput(cleanText);
    setPlaygroundReplacements(replacements);
  }, [playgroundInput]);

  // 20. Lifecycle: Initial Load from LocalStorage
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const local = localStorage.getItem('ducanh_cv_data');
        const res = await fetch('/api/cv');
        const data = await res.json();

        let baseVi = defaultCVData;
        let baseEn = defaultEnglishCVData;

        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.cv) baseVi = parsed.cv;
          if (parsed.cvVi) baseVi = parsed.cvVi;
          if (parsed.cvEn) baseEn = parsed.cvEn;
          if (parsed.lang) setLang(parsed.lang);
          if (parsed.template) setTemplate(parsed.template);
          if (parsed.accentColor) setAccentColor(parsed.accentColor);
          if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
          if (parsed.isCompact !== undefined) setIsCompact(parsed.isCompact);
          if (parsed.sectionOrder) setSectionOrder(parsed.sectionOrder);
          if (parsed.sectionVisibility) setSectionVisibility(parsed.sectionVisibility);
          if (parsed.coverLetterVi) setCoverLetterVi(parsed.coverLetterVi);
          if (parsed.coverLetterEn) setCoverLetterEn(parsed.coverLetterEn);
          if (parsed.typographyConfig) setTypographyConfig(parsed.typographyConfig);
        } else if (data?.success && data.cv) {
          baseVi = { ...defaultCVData, ...data.cv };
          if (data.cv.template) setTemplate(data.cv.template);
          if (data.cv.accentColor) setAccentColor(data.cv.accentColor);
          if (data.cv.fontFamily) setFontFamily(data.cv.fontFamily);
          if (data.cv.isCompact !== undefined) setIsCompact(data.cv.isCompact);
          if (data.cv.sectionOrder) setSectionOrder(data.cv.sectionOrder);
          if (data.cv.sectionVisibility) setSectionVisibility(data.cv.sectionVisibility);
        }

        const sanitizedVi = sanitizeCVTechStuttering({
          ...baseVi,
          customLinks: ensureCustomLinks(baseVi),
        });
        const sanitizedEn = sanitizeCVTechStuttering({
          ...baseEn,
          customLinks: ensureCustomLinks(baseEn),
        });

        setCvVi(sanitizedVi);
        setCvEn(sanitizedEn);
        const activeInitial = (local && JSON.parse(local).lang === 'en') ? sanitizedEn : sanitizedVi;
        setCvState(activeInitial);
      } catch (err) {
        console.warn('Could not load saved CV:', err);
      } finally {
        setTimeout(() => setIsLoading(false), 350);
      }
    };

    loadSavedData();
  }, [defaultCVData, defaultEnglishCVData]);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    if (isLoading) return;
    try {
      const activeCvVi = lang === 'vi' ? cv : cvVi;
      const activeCvEn = lang === 'en' ? cv : cvEn;

      localStorage.setItem(
        'ducanh_cv_data',
        JSON.stringify({
          cv,
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          lang,
          coverLetterVi,
          coverLetterEn,
          template,
          accentColor,
          fontFamily,
          isCompact,
          typographyConfig,
          sectionOrder,
          sectionVisibility,
        })
      );
    } catch (e) {
      // ignore quota errors
    }
  }, [cv, cvVi, cvEn, lang, coverLetterVi, coverLetterEn, template, accentColor, fontFamily, isCompact, typographyConfig, sectionOrder, sectionVisibility, isLoading]);

  // Save changes explicitly to server & localStorage
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setToastMessage(lang === 'en' ? 'Saving changes...' : 'Đang lưu thay đổi...');
    try {
      const activeCvVi = lang === 'vi' ? cv : cvVi;
      const activeCvEn = lang === 'en' ? cv : cvEn;

      localStorage.setItem(
        'ducanh_cv_data',
        JSON.stringify({
          cv,
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          lang,
          template,
          accentColor,
          fontFamily,
          isCompact,
          typographyConfig,
          sectionOrder,
          sectionVisibility,
        })
      );

      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv,
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          lang,
          template,
          accentColor,
          fontFamily,
          isCompact,
          typographyConfig,
          sectionOrder,
          sectionVisibility,
        }),
      });

      const resData = await res.json();
      if (resData.success) {
        setToastMessage(lang === 'en' ? 'Changes saved successfully!' : 'Đã lưu thay đổi thành công!');
      } else {
        setToastMessage(lang === 'en' ? 'Saved to browser local storage!' : 'Đã lưu vào bộ nhớ trình duyệt!');
      }
    } catch (e) {
      console.error(e);
      setToastMessage(lang === 'en' ? 'Saved to local browser storage!' : 'Đã lưu vào bộ nhớ trình duyệt!');
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  }, [cv, cvVi, cvEn, lang, template, accentColor, fontFamily, isCompact, typographyConfig, sectionOrder, sectionVisibility]);

  // 21. Padding for templates (SpacingDensity)
  const pad = useMemo(() => ({
    header: isCompact ? 'py-4 px-6' : 'p-8',
    body: isCompact ? 'p-5' : 'p-8',
    sectionGap: isCompact ? 'space-y-3.5' : 'space-y-6',
    itemGap: isCompact ? 'space-y-2' : 'space-y-4',
    itemSubGap: isCompact ? 'space-y-0.5' : 'space-y-1',
    cardPad: isCompact ? 'p-2.5' : 'p-3',
    gridGap: isCompact ? 'gap-5' : 'gap-8',
    textDesc: isCompact ? 'text-[11px] leading-snug' : 'text-xs leading-relaxed',
    textSummary: isCompact ? 'text-[11px] leading-snug' : 'text-xs leading-relaxed',
    timelineLine: isCompact ? 'space-y-3.5' : 'space-y-5',
    sidebarPad: isCompact ? 'p-5 space-y-4' : 'p-7 space-y-6',
  }), [isCompact]);

  // 22. Common Template Props Bundle
  const commonTemplateProps: CVTemplateProps = useMemo(() => ({
    cv,
    setCv,
    lang,
    t,
    activeColor,
    pad,
    sectionOrder,
    sectionVisibility,
    isCompact,
    template,
    qrDataUrl,
    activeQrConfig,
    triggerAvatarUpload,
    addTimelineItem,
    updateTimelineItem,
    moveTimelineItem,
    deleteTimelineItem,
    addProjectItem,
    updateProjectItem,
    moveProjectItem,
    deleteProjectItem,
    updateSkill,
    removeSkill,
    addSkill,
    newSkillText,
    setNewSkillText,
    isAddingSkill,
    setIsAddingSkill,
    addEducationItem,
    updateEducationItem,
    moveEducationItem,
    deleteEducationItem,
    handleUpdateCustomLink,
    updateCustomSectionTitle,
    updateCustomSectionContent,
    addCustomSectionItem,
    updateCustomSectionItem,
    deleteCustomSectionItem,
    moveCustomSectionItem,
    removeCustomSection,
  }), [
    cv,
    setCv,
    lang,
    t,
    activeColor,
    pad,
    sectionOrder,
    sectionVisibility,
    isCompact,
    template,
    qrDataUrl,
    activeQrConfig,
    triggerAvatarUpload,
    addTimelineItem,
    updateTimelineItem,
    moveTimelineItem,
    deleteTimelineItem,
    addProjectItem,
    updateProjectItem,
    moveProjectItem,
    deleteProjectItem,
    updateSkill,
    removeSkill,
    addSkill,
    newSkillText,
    isAddingSkill,
    addEducationItem,
    updateEducationItem,
    moveEducationItem,
    deleteEducationItem,
    handleUpdateCustomLink,
    updateCustomSectionTitle,
    updateCustomSectionContent,
    addCustomSectionItem,
    updateCustomSectionItem,
    deleteCustomSectionItem,
    moveCustomSectionItem,
    removeCustomSection,
  ]);

  return {
    // Defaults & State
    defaultCVData,
    defaultEnglishCVData,
    lang,
    setLang,
    cvVi,
    setCvVi,
    cvEn,
    setCvEn,
    rawCv,
    setCvState,
    cv,
    setCv,
    t,
    handleSwitchLanguage,
    handleToggleLang,
    syncContactInfoBetweenLangs,

    // Design & Styling
    template,
    setTemplate,
    accentColor,
    setAccentColor,
    fontFamily,
    setFontFamily,
    isCompact,
    setIsCompact,
    toggleCompactMode,
    typographyConfig,
    setTypographyConfig,
    handleResetTypography,
    handleUpdateTypographyScale,
    handleUpdateLineHeight,
    handleUpdateSectionSpacing,

    // Canvas
    zoom,
    setZoom,
    canvasBgTheme,
    setCanvasBgTheme,
    handleSelectCanvasBgTheme,
    activeCanvasBgTheme,
    isBgPickerOpen,
    setIsBgPickerOpen,
    paperRef,
    cvPrintRef,

    // Sections & Layout
    sectionOrder,
    setSectionOrder,
    sectionVisibility,
    setSectionVisibility,
    toggleSectionVisibility,
    moveSection,
    resetSections,
    canScrollLeft,
    canScrollRight,
    sectionTabsRef,
    handleScrollSectionTabs,
    handleSectionTabsWheel,
    checkSectionTabsScroll,

    // Navigation & Drawer
    activeRailTab,
    setActiveRailTab,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerTab,
    setDrawerTab,
    contentSubTab,
    setContentSubTab,
    showAddSectionMenu,
    setShowAddSectionMenu,
    isPreviewMode,
    setIsPreviewMode,
    drawerRef,

    // Skills
    newSkillText,
    setNewSkillText,
    isAddingSkill,
    setIsAddingSkill,
    addSkill,
    updateSkill,
    removeSkill,
    moveSkill,

    // Timeline CRUD
    addTimelineItem,
    updateTimelineItem,
    deleteTimelineItem,
    moveTimelineItem,

    // Projects CRUD
    addProjectItem,
    updateProjectItem,
    deleteProjectItem,
    moveProjectItem,

    // Education CRUD
    addEducationItem,
    updateEducationItem,
    deleteEducationItem,
    moveEducationItem,

    // Custom Sections CRUD
    addCustomSection,
    removeCustomSection,
    updateCustomSectionTitle,
    updateCustomSectionContent,
    addCustomSectionItem,
    updateCustomSectionItem,
    deleteCustomSectionItem,
    moveCustomSectionItem,

    // Custom Links CRUD
    handleAddCustomLink,
    handleUpdateCustomLink,
    handleToggleCustomLink,
    handleRemoveCustomLink,
    handleMoveCustomLink,

    // Avatar
    avatarInputRef,
    triggerAvatarUpload,
    handleAvatarFileChange,
    handleRemoveAvatar,

    // Cover Letter
    docMode,
    setDocMode,
    coverLetterVi,
    setCoverLetterVi,
    coverLetterEn,
    setCoverLetterEn,
    activeCoverLetterPresetId,
    setActiveCoverLetterPresetId,
    isCoverLetterCopied,
    setIsCoverLetterCopied,
    currentCoverLetter,
    handleUpdateCoverLetterField,
    handleApplyCoverLetterPreset,
    handleSyncCoverLetterWithCV,
    handleCopyCoverLetterText,

    // Personal QR
    activeQrConfig,
    qrDataUrl,
    setQrDataUrl,
    qrCopied,
    setQrCopied,
    handleUpdateQRConfig,
    handleUpdateQRTargetUrl,
    handleCopyQRUrl,

    // Public Share
    isShareLinkEnabled,
    setIsShareLinkEnabled,
    isShareCopied,
    setIsShareCopied,
    privacyHidePhone,
    setPrivacyHidePhone,
    privacyHideLocation,
    setPrivacyHideLocation,
    shareAllowDownload,
    setShareAllowDownload,
    shareIncludeCoverLetter,
    setShareIncludeCoverLetter,
    publicTemplateMenuOpen,
    setPublicTemplateMenuOpen,
    shareOrigin,
    sharePublicUrl,
    shareQrDataUrl,
    handleCopyShareUrl,
    handleShareLinkedIn,
    handleShareTwitter,
    handleShareEmail,
    handleDownloadShareQr,

    // Export & Print
    isExportMenuOpen,
    setIsExportMenuOpen,
    isExportingImage,
    setIsExportingImage,
    exportResolution,
    setExportResolution,
    exportMenuRef,
    handlePrint,
    handleExportImage,
    handleExportFullJSON,
    handleExportCurrentProfileJSON,
    handleCopyJSON,
    handleApplyImport,

    // ATS & Linter
    ignoredIssueIds,
    setIgnoredIssueIds,
    playgroundInput,
    setPlaygroundInput,
    playgroundOutput,
    setPlaygroundOutput,
    playgroundReplacements,
    setPlaygroundReplacements,
    cvStrength,
    jdMatchResult,
    techLintReport,
    handleFixAllTechIssues,
    handleFixSingleTechIssue,
    handleIgnoreTechIssue,
    handleQuickLintSkills,
    handleRunPlayground,

    // Lifecycle
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    toastMessage,
    setToastMessage,
    handleSave,

    // Visual helpers
    activeColor,
    activeFont,
    activeTemplateDef,
    fontClass,
    commonTemplateProps,
  };
}
