'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type {
  CVData,
  Language,
  TemplateId,
  CVFontFamily,
  SectionKey,
} from '@/types/cvBuilder';
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_VISIBILITY,
} from '@/constants/cvConstants';
import {
  CVProfile,
  duplicateCVProfile,
  createNewCVProfile,
  saveProfilesToStorage,
} from '@/lib/cvProfiles';
import {
  CoverLetterData,
  createSyncedCoverLetter,
} from '@/lib/coverLetter';
import { sanitizeCVTechStuttering } from '@/lib/techLinter';
import { ensureCustomLinks } from '@/lib/customTechLinks';
import {
  CVTypographyConfig,
  DEFAULT_TYPOGRAPHY_CONFIG,
} from '@/lib/cvTypography';

export interface UseCVProfilesOptions {
  cv: CVData;
  cvVi: CVData;
  cvEn: CVData;
  lang: Language;
  coverLetterVi: CoverLetterData;
  coverLetterEn: CoverLetterData;
  template: TemplateId;
  accentColor: 'blue' | 'yellow' | 'emerald' | 'slate' | 'rose';
  fontFamily: CVFontFamily;
  isCompact: boolean;
  typographyConfig: CVTypographyConfig;
  sectionOrder: SectionKey[];
  sectionVisibility: Record<SectionKey, boolean>;

  setCvVi: (cv: CVData) => void;
  setCvEn: (cv: CVData) => void;
  setLang: (lang: Language) => void;
  setCvState: (cv: CVData) => void;
  setCoverLetterVi: (cl: CoverLetterData) => void;
  setCoverLetterEn: (cl: CoverLetterData) => void;
  setTemplate: (t: TemplateId) => void;
  setAccentColor: (c: 'blue' | 'yellow' | 'emerald' | 'slate' | 'rose') => void;
  setFontFamily: (f: CVFontFamily) => void;
  setIsCompact: (compact: boolean) => void;
  setTypographyConfig: (config: CVTypographyConfig) => void;
  setSectionOrder: (order: SectionKey[]) => void;
  setSectionVisibility: (vis: Record<SectionKey, boolean>) => void;

  defaultCVData: CVData;
  defaultEnglishCVData: CVData;
  setToastMessage: (msg: string | null) => void;
  initialProfiles?: CVProfile[];
  initialActiveProfileId?: string;
}

export interface UseCVProfilesReturn {
  profiles: CVProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<CVProfile[]>>;
  activeProfileId: string;
  setActiveProfileId: React.Dispatch<React.SetStateAction<string>>;
  activeProfile: CVProfile | undefined;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingProfileId: string | null;
  setEditingProfileId: React.Dispatch<React.SetStateAction<string | null>>;
  editingProfileName: string;
  setEditingProfileName: React.Dispatch<React.SetStateAction<string>>;
  showNewProfileModal: boolean;
  setShowNewProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
  newProfileName: string;
  setNewProfileName: React.Dispatch<React.SetStateAction<string>>;
  newProfileRole: string;
  setNewProfileRole: React.Dispatch<React.SetStateAction<string>>;
  newProfileCloneFromCurrent: boolean;
  setNewProfileCloneFromCurrent: React.Dispatch<React.SetStateAction<boolean>>;
  profileMenuRef: React.RefObject<HTMLDivElement>;

  handleSwitchProfile: (targetProfileId: string) => void;
  handleDuplicateProfile: (sourceId: string) => void;
  handleCreateNewProfile: () => void;
  handleRenameProfile: (profileId: string, newName: string) => void;
  handleDeleteProfile: (profileId: string) => void;
}

export function useCVProfiles({
  cv,
  cvVi,
  cvEn,
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
  setCvVi,
  setCvEn,
  setLang,
  setCvState,
  setCoverLetterVi,
  setCoverLetterEn,
  setTemplate,
  setAccentColor,
  setFontFamily,
  setIsCompact,
  setTypographyConfig,
  setSectionOrder,
  setSectionVisibility,
  defaultCVData,
  defaultEnglishCVData,
  setToastMessage,
  initialProfiles = [],
  initialActiveProfileId = '',
}: UseCVProfilesOptions): UseCVProfilesReturn {
  const [profiles, setProfiles] = useState<CVProfile[]>(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string>(initialActiveProfileId);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingProfileName, setEditingProfileName] = useState<string>('');
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileRole, setNewProfileRole] = useState('');
  const [newProfileCloneFromCurrent, setNewProfileCloneFromCurrent] = useState(true);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0];
  }, [profiles, activeProfileId]);

  const handleSwitchProfile = useCallback(
    (targetProfileId: string) => {
      if (targetProfileId === activeProfileId) {
        setIsProfileMenuOpen(false);
        return;
      }

      // 1. Sync current active state into profiles list
      const activeCvVi = lang === 'vi' ? cv : cvVi;
      const activeCvEn = lang === 'en' ? cv : cvEn;

      const updatedProfiles = profiles.map((p) => {
        if (p.id === activeProfileId) {
          return {
            ...p,
            updatedAt: new Date().toISOString(),
            cvVi: activeCvVi,
            cvEn: activeCvEn,
            activeLang: lang,
            coverLetterVi,
            coverLetterEn,
            template,
            accentColor,
            fontFamily,
            isCompact,
            typography: typographyConfig,
            sectionOrder,
            sectionVisibility,
          };
        }
        return p;
      });

      // 2. Locate target profile
      const target = updatedProfiles.find((p) => p.id === targetProfileId);
      if (!target) return;

      // 3. Load target profile into active state
      const targetVi = sanitizeCVTechStuttering({ ...target.cvVi, customLinks: ensureCustomLinks(target.cvVi) });
      const targetEn = sanitizeCVTechStuttering({ ...target.cvEn, customLinks: ensureCustomLinks(target.cvEn) });
      setCvVi(targetVi);
      setCvEn(targetEn);
      setLang(target.activeLang || 'vi');
      setCvState(target.activeLang === 'en' ? targetEn : targetVi);
      if (target.coverLetterVi) setCoverLetterVi(target.coverLetterVi);
      if (target.coverLetterEn) setCoverLetterEn(target.coverLetterEn);
      setTemplate((target.template as TemplateId) || 'rabbit');
      setAccentColor((target.accentColor as any) || 'blue');
      setFontFamily((target.fontFamily as CVFontFamily) || 'inter');
      setIsCompact(target.isCompact ?? false);
      if (target.typography) {
        setTypographyConfig(target.typography);
      } else {
        setTypographyConfig(DEFAULT_TYPOGRAPHY_CONFIG);
      }
      setSectionOrder(target.sectionOrder?.length ? (target.sectionOrder as SectionKey[]) : DEFAULT_SECTION_ORDER);
      setSectionVisibility(target.sectionVisibility || DEFAULT_SECTION_VISIBILITY);

      setActiveProfileId(target.id);
      setProfiles(updatedProfiles);
      saveProfilesToStorage(updatedProfiles, target.id);
      setIsProfileMenuOpen(false);

      setToastMessage(
        lang === 'en'
          ? `Switched to profile: ${target.name}`
          : `Đã chuyển sang phiên bản: ${target.name}`
      );
    },
    [
      activeProfileId,
      lang,
      cv,
      cvVi,
      cvEn,
      coverLetterVi,
      coverLetterEn,
      template,
      accentColor,
      fontFamily,
      isCompact,
      typographyConfig,
      sectionOrder,
      sectionVisibility,
      profiles,
      setCvVi,
      setCvEn,
      setLang,
      setCvState,
      setCoverLetterVi,
      setCoverLetterEn,
      setTemplate,
      setAccentColor,
      setFontFamily,
      setIsCompact,
      setTypographyConfig,
      setSectionOrder,
      setSectionVisibility,
      setToastMessage,
    ]
  );

  const handleDuplicateProfile = useCallback(
    (sourceId: string) => {
      const source = profiles.find((p) => p.id === sourceId);
      if (!source) return;

      // Sync current active data if duplicating active
      let sourceData = source;
      if (source.id === activeProfileId) {
        sourceData = {
          ...source,
          cvVi: lang === 'vi' ? cv : cvVi,
          cvEn: lang === 'en' ? cv : cvEn,
          activeLang: lang,
          coverLetterVi,
          coverLetterEn,
          template,
          accentColor,
          fontFamily,
          isCompact,
          typography: typographyConfig,
          sectionOrder,
          sectionVisibility,
        };
      }

      const cloned = duplicateCVProfile(sourceData);
      const nextProfiles = [...profiles, cloned];
      setProfiles(nextProfiles);
      saveProfilesToStorage(nextProfiles, cloned.id);
      handleSwitchProfile(cloned.id);

      setToastMessage(
        lang === 'en'
          ? `Duplicated profile: ${cloned.name}`
          : `Đã nhân bản phiên bản: ${cloned.name}`
      );
    },
    [
      profiles,
      activeProfileId,
      lang,
      cv,
      cvVi,
      cvEn,
      coverLetterVi,
      coverLetterEn,
      template,
      accentColor,
      fontFamily,
      isCompact,
      typographyConfig,
      sectionOrder,
      sectionVisibility,
      handleSwitchProfile,
      setToastMessage,
    ]
  );

  const handleCreateNewProfile = useCallback(() => {
    if (!newProfileName.trim()) return;

    const baseVi = newProfileCloneFromCurrent ? (lang === 'vi' ? cv : cvVi) : defaultCVData;
    const baseEn = newProfileCloneFromCurrent ? (lang === 'en' ? cv : cvEn) : defaultEnglishCVData;

    const created = createNewCVProfile(
      newProfileName,
      newProfileRole,
      baseVi,
      baseEn,
      {
        template: newProfileCloneFromCurrent ? template : 'rabbit',
        accentColor: newProfileCloneFromCurrent ? accentColor : 'blue',
        fontFamily: newProfileCloneFromCurrent ? fontFamily : 'inter',
        isCompact: newProfileCloneFromCurrent ? isCompact : false,
        typography: newProfileCloneFromCurrent ? typographyConfig : DEFAULT_TYPOGRAPHY_CONFIG,
        sectionOrder: newProfileCloneFromCurrent ? sectionOrder : DEFAULT_SECTION_ORDER,
        sectionVisibility: newProfileCloneFromCurrent ? sectionVisibility : DEFAULT_SECTION_VISIBILITY,
        activeLang: lang,
        coverLetterVi: newProfileCloneFromCurrent ? coverLetterVi : createSyncedCoverLetter('vi', baseVi),
        coverLetterEn: newProfileCloneFromCurrent ? coverLetterEn : createSyncedCoverLetter('en', baseEn),
      }
    );

    const nextProfiles = [...profiles, created];
    setProfiles(nextProfiles);
    saveProfilesToStorage(nextProfiles, created.id);
    handleSwitchProfile(created.id);

    setShowNewProfileModal(false);
    setNewProfileName('');
    setNewProfileRole('');

    setToastMessage(
      lang === 'en'
        ? `Created new profile: ${created.name}`
        : `Đã tạo phiên bản CV mới: ${created.name}`
    );
  }, [
    newProfileName,
    newProfileRole,
    newProfileCloneFromCurrent,
    lang,
    cv,
    cvVi,
    cvEn,
    defaultCVData,
    defaultEnglishCVData,
    template,
    accentColor,
    fontFamily,
    isCompact,
    typographyConfig,
    sectionOrder,
    sectionVisibility,
    coverLetterVi,
    coverLetterEn,
    profiles,
    handleSwitchProfile,
    setToastMessage,
  ]);

  const handleRenameProfile = useCallback(
    (profileId: string, newName: string) => {
      if (!newName.trim()) return;

      const nextProfiles = profiles.map((p) => {
        if (p.id === profileId) {
          return {
            ...p,
            name: newName.trim(),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      setProfiles(nextProfiles);
      saveProfilesToStorage(nextProfiles, activeProfileId);
      setEditingProfileId(null);
      setEditingProfileName('');

      setToastMessage(lang === 'en' ? 'Profile renamed!' : 'Đã đổi tên phiên bản thành công!');
    },
    [profiles, activeProfileId, setToastMessage]
  );

  const handleDeleteProfile = useCallback(
    (profileId: string) => {
      if (profiles.length <= 1) {
        alert(lang === 'en' ? 'Cannot delete the only remaining profile!' : 'Không thể xóa phiên bản CV duy nhất còn lại!');
        return;
      }

      const target = profiles.find((p) => p.id === profileId);
      const confirmMsg =
        lang === 'en'
          ? `Are you sure you want to delete profile "${target?.name}"?`
          : `Bạn có chắc chắn muốn xóa phiên bản "${target?.name}" không?`;

      if (!confirm(confirmMsg)) return;

      const remaining = profiles.filter((p) => p.id !== profileId);
      let nextActiveId = activeProfileId;
      if (activeProfileId === profileId) {
        nextActiveId = remaining[0].id;
      }

      setProfiles(remaining);
      saveProfilesToStorage(remaining, nextActiveId);

      if (activeProfileId === profileId) {
        handleSwitchProfile(nextActiveId);
      }

      setToastMessage(lang === 'en' ? 'Profile deleted.' : 'Đã xóa phiên bản CV.');
    },
    [profiles, activeProfileId, lang, handleSwitchProfile, setToastMessage]
  );

  return {
    profiles,
    setProfiles,
    activeProfileId,
    setActiveProfileId,
    activeProfile,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    editingProfileId,
    setEditingProfileId,
    editingProfileName,
    setEditingProfileName,
    showNewProfileModal,
    setShowNewProfileModal,
    newProfileName,
    setNewProfileName,
    newProfileRole,
    setNewProfileRole,
    newProfileCloneFromCurrent,
    setNewProfileCloneFromCurrent,
    profileMenuRef,

    handleSwitchProfile,
    handleDuplicateProfile,
    handleCreateNewProfile,
    handleRenameProfile,
    handleDeleteProfile,
  };
}

export default useCVProfiles;
