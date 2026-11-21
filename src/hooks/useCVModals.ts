'use client';

import { useState, useRef, useCallback } from 'react';
import type { ParsedCVResult } from '@/lib/cvParser';
import type { SampleJD } from '@/lib/jdMatcher';
import type { ImportPreviewResult } from '@/lib/cvBackup';
import type { Language } from '@/types/cvBuilder';

export interface TechModalTarget {
  type: 'timeline' | 'project';
  id: string;
  title?: string;
}

export function useCVModals(lang: Language = 'vi') {
  // 5.1: Template Gallery Modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'popular' | 'sidebar' | 'ats' | 'creative'>('all');

  // 5.2: CV Parser / Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTab, setImportTab] = useState<'upload' | 'paste' | 'sample'>('upload');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importRawText, setImportRawText] = useState('');
  const [isParsingCV, setIsParsingCV] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedCVResult | null>(null);
  const [importPreviewTab, setImportPreviewTab] = useState<'profile' | 'skills' | 'timeline' | 'projects' | 'education'>('profile');
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  // 5.3: New Profile Modal
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);

  // 5.4: Data Backup / Restore Modal
  const [showDataModal, setShowDataModal] = useState(false);
  const [dataModalTab, setDataModalTab] = useState<'export' | 'import'>('export');
  const [importPreview, setImportPreview] = useState<ImportPreviewResult | null>(null);
  const [importErrorMsg, setImportErrorMsg] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // 5.5: Tech Bullet Points Library Modal
  const [showTechModal, setShowTechModal] = useState(false);
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>('all');
  const [techSearchQuery, setTechSearchQuery] = useState('');
  const [techTarget, setTechTarget] = useState<TechModalTarget | null>(null);
  const [copiedBulletId, setCopiedBulletId] = useState<string | null>(null);
  const [insertedBulletId, setInsertedBulletId] = useState<string | null>(null);

  // 5.6: CV Strength & ATS Modal
  const [showStrengthModal, setShowStrengthModal] = useState(false);
  const [strengthFilter, setStrengthFilter] = useState<'all' | 'pending' | 'passed'>('all');

  // 5.7: JD Matcher Modal
  const [showJDModal, setShowJDModal] = useState(false);
  const [jdInputText, setJdInputText] = useState('');
  const [selectedSampleJdId, setSelectedSampleJdId] = useState<string | null>('frontend-sr');
  const [jdFilter, setJdFilter] = useState<'all' | 'missing' | 'matched'>('all');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [addedSkillKeyword, setAddedSkillKeyword] = useState<string | null>(null);

  const handleSelectSampleJD = useCallback((sample: SampleJD) => {
    setSelectedSampleJdId(sample.id);
    setJdInputText(lang === 'en' ? sample.descriptionEn : sample.descriptionVi);
  }, [lang]);

  // 5.8: Tech Linter Modal
  const [showTechLinterModal, setShowTechLinterModal] = useState(false);
  const [techLinterFilter, setTechLinterFilter] = useState<'all' | 'skills' | 'timeline' | 'projects' | 'summary' | 'custom' | 'cover_letter'>('all');
  const [techLinterCategory, setTechLinterCategory] = useState<string>('all');
  const [techLinterActiveTab, setTechLinterActiveTab] = useState<'issues' | 'playground' | 'registry'>('issues');
  const [techRegistrySearch, setTechRegistrySearch] = useState('');
  const [playgroundInput, setPlaygroundInput] = useState('Em co kinh nghiem su dung nodejs, reactjs, typescript va viet restful apis tren github.');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [playgroundReplacements, setPlaygroundReplacements] = useState<{ original: string; replacement: string; def: any }[]>([]);
  const [autoLintOnSave, setAutoLintOnSave] = useState(true);
  const [ignoredIssueIds, setIgnoredIssueIds] = useState<Set<string>>(new Set());

  // 5.9: Public Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);
  const shareModalRef = useRef<HTMLDivElement>(null);

  // 5.10: Contact Candidate Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // 5.11: Mobile QR Modal
  const [isPublicQrModalOpen, setIsPublicQrModalOpen] = useState(false);
  const [shareQrDataUrl, setShareQrDataUrl] = useState('');

  // 5.12: Job Application Kanban Tracker Modal
  const [showJobTrackerModal, setShowJobTrackerModal] = useState(false);

  // 5.13: Progressive Auth & Cloud Sync Modal
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 5.14: Supabase Cloud Setup Guide Modal
  const [showSupabaseSetupModal, setShowSupabaseSetupModal] = useState(false);

  // Close all modals helper
  const closeAllModals = useCallback(() => {
    setShowGalleryModal(false);
    setShowImportModal(false);
    setShowNewProfileModal(false);
    setShowDataModal(false);
    setShowTechModal(false);
    setShowStrengthModal(false);
    setShowJDModal(false);
    setShowTechLinterModal(false);
    setIsShareModalOpen(false);
    setIsContactModalOpen(false);
    setIsPublicQrModalOpen(false);
    setShowJobTrackerModal(false);
    setShowAuthModal(false);
    setShowSupabaseSetupModal(false);
  }, []);

  return {
    // 5.1
    showGalleryModal,
    setShowGalleryModal,
    galleryFilter,
    setGalleryFilter,

    // 5.2
    showImportModal,
    setShowImportModal,
    importTab,
    setImportTab,
    importFile,
    setImportFile,
    importRawText,
    setImportRawText,
    isParsingCV,
    setIsParsingCV,
    parseError,
    setParseError,
    parsedResult,
    setParsedResult,
    importPreviewTab,
    setImportPreviewTab,
    cvFileInputRef,

    // 5.3
    showNewProfileModal,
    setShowNewProfileModal,

    // 5.4
    showDataModal,
    setShowDataModal,
    dataModalTab,
    setDataModalTab,
    importPreview,
    setImportPreview,
    importErrorMsg,
    setImportErrorMsg,
    isDraggingFile,
    setIsDraggingFile,
    jsonFileInputRef,

    // 5.5
    showTechModal,
    setShowTechModal,
    techCategoryFilter,
    setTechCategoryFilter,
    techSearchQuery,
    setTechSearchQuery,
    techTarget,
    setTechTarget,
    copiedBulletId,
    setCopiedBulletId,
    insertedBulletId,
    setInsertedBulletId,

    // 5.6
    showStrengthModal,
    setShowStrengthModal,
    strengthFilter,
    setStrengthFilter,

    // 5.7
    showJDModal,
    setShowJDModal,
    jdInputText,
    setJdInputText,
    selectedSampleJdId,
    setSelectedSampleJdId,
    jdFilter,
    setJdFilter,
    copiedKeyword,
    setCopiedKeyword,
    addedSkillKeyword,
    setAddedSkillKeyword,
    handleSelectSampleJD,

    // 5.8
    showTechLinterModal,
    setShowTechLinterModal,
    techLinterFilter,
    setTechLinterFilter,
    techLinterCategory,
    setTechLinterCategory,
    techLinterActiveTab,
    setTechLinterActiveTab,
    techRegistrySearch,
    setTechRegistrySearch,
    playgroundInput,
    setPlaygroundInput,
    playgroundOutput,
    setPlaygroundOutput,
    playgroundReplacements,
    setPlaygroundReplacements,
    autoLintOnSave,
    setAutoLintOnSave,
    ignoredIssueIds,
    setIgnoredIssueIds,

    // 5.9
    isShareModalOpen,
    setIsShareModalOpen,
    copiedShareUrl,
    setCopiedShareUrl,
    shareModalRef,

    // 5.10
    isContactModalOpen,
    setIsContactModalOpen,
    copiedEmail,
    setCopiedEmail,
    copiedPhone,
    setCopiedPhone,

    // 5.11
    isPublicQrModalOpen,
    setIsPublicQrModalOpen,
    shareQrDataUrl,
    setShareQrDataUrl,

    // 5.12
    showJobTrackerModal,
    setShowJobTrackerModal,

    // 5.13
    showAuthModal,
    setShowAuthModal,

    // 5.14
    showSupabaseSetupModal,
    setShowSupabaseSetupModal,

    // Helper
    closeAllModals,
  };
}

export default useCVModals;
