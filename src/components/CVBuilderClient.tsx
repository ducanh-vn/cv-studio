'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, ChevronLeft, Save, Loader2 } from 'lucide-react';
import type { PortfolioData } from '@/lib/data';
import type { TechBulletPoint } from '@/lib/techBulletPoints';
import { useCVBuilder } from '@/hooks/useCVBuilder';
import { useCVModals } from '@/hooks/useCVModals';
import { useCVProfiles } from '@/hooks/useCVProfiles';
import { useCVHistory } from '@/hooks/useCVHistory';
import { useAuth } from '@/hooks/useAuth';
import { RecruiterTopbar, EditorTopbar } from '@/components/topbar';
import { SidebarRail } from '@/components/sidebar';
import {
  DesignTab,
  ContentTab,
  LayoutTab,
  AiAtsTab,
  DataTab,
  CoverLetterTab,
} from '@/components/sidebar/tabs';
import { CVCanvasWorkspace, CanvasFloatingControls } from '@/components/canvas';
import {
  TemplateGalleryModal,
  CVParserModal,
  NewProfileModal,
  DataBackupModal,
  TechBulletsModal,
  CVStrengthModal,
  JDMatcherModal,
  TechLinterModal,
  PublicShareModal,
  ContactCandidateModal,
  MobileQRModal,
  JobTrackerModal,
  AuthModal,
} from '@/components/modals';
import {
  createNewCVProfile,
  saveProfilesToStorage,
  loadProfilesFromStorage,
  createInitialProfiles,
  applyProfileToBuilder,
} from '@/lib/cvProfiles';
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_VISIBILITY,
} from '@/constants/cvConstants';
import { readJsonFile, parseImportJsonString } from '@/lib/cvBackup';

export type {
  CVData,
  EducationItem,
  CustomSection,
  CVFontFamily,
  TemplateId,
  SectionKey,
  TimelineItem,
  ProjectItem,
} from '@/types/cvBuilder';

export interface CVBuilderClientProps {
  initialPortfolio: PortfolioData;
  isPublicView?: boolean;
  initialViewMode?: 'preview' | 'editor' | 'public';
}

export default function CVBuilderClient({
  initialPortfolio,
  isPublicView = false,
  initialViewMode = 'editor',
}: CVBuilderClientProps) {
  // 1. Core CV Builder Hook
  const builder = useCVBuilder({
    initialPortfolio,
    isPublicView,
    initialViewMode,
  });

  // 2. Modals State Hook
  const modals = useCVModals(builder.lang);

  // 2.1 Progressive Auth & Cloud Sync Hook
  const auth = useAuth();

  // 3. Multi-profile Management Hook
  const profiles = useCVProfiles({
    userId: auth.user.id,
    cv: builder.cv,
    cvVi: builder.cvVi,
    cvEn: builder.cvEn,
    lang: builder.lang,
    coverLetterVi: builder.coverLetterVi,
    coverLetterEn: builder.coverLetterEn,
    template: builder.template,
    accentColor: builder.accentColor,
    fontFamily: builder.fontFamily,
    isCompact: builder.isCompact,
    typographyConfig: builder.typographyConfig,
    sectionOrder: builder.sectionOrder,
    sectionVisibility: builder.sectionVisibility,
    setCvVi: builder.setCvVi,
    setCvEn: builder.setCvEn,
    setLang: builder.setLang,
    setCvState: builder.setCvState,
    setCoverLetterVi: builder.setCoverLetterVi,
    setCoverLetterEn: builder.setCoverLetterEn,
    setTemplate: builder.setTemplate,
    setAccentColor: builder.setAccentColor,
    setFontFamily: builder.setFontFamily,
    setIsCompact: builder.setIsCompact,
    setTypographyConfig: builder.setTypographyConfig,
    setSectionOrder: builder.setSectionOrder,
    setSectionVisibility: builder.setSectionVisibility,
    defaultCVData: builder.defaultCVData,
    defaultEnglishCVData: builder.defaultEnglishCVData,
    setToastMessage: builder.setToastMessage,
  });

  // 4. Undo / Redo History Hook
  const history = useCVHistory({
    cv: builder.cv,
    setCvState: builder.setCvState,
    lang: builder.lang,
    setCvVi: builder.setCvVi,
    setCvEn: builder.setCvEn,
    template: builder.template,
    setTemplate: builder.setTemplate,
    accentColor: builder.accentColor,
    setAccentColor: builder.setAccentColor,
    fontFamily: builder.fontFamily,
    setFontFamily: builder.setFontFamily,
    isCompact: builder.isCompact,
    setIsCompact: builder.setIsCompact,
    typographyConfig: builder.typographyConfig,
    setTypographyConfig: builder.setTypographyConfig,
    sectionOrder: builder.sectionOrder,
    setSectionOrder: builder.setSectionOrder,
    sectionVisibility: builder.sectionVisibility,
    setSectionVisibility: builder.setSectionVisibility,
    isLoading: builder.isLoading,
    setToastMessage: builder.setToastMessage,
    isPreviewMode: builder.isPreviewMode,
    setIsPreviewMode: builder.setIsPreviewMode,
  });

  // Track previous user ID to trigger profile reload on account switch
  const prevUserIdRef = React.useRef<string | null>(null);

  // Load and switch profiles when user changes or on initial mount
  useEffect(() => {
    if (builder.isLoading) return;
    const currentUserId = auth.user.id || 'guest';

    if (prevUserIdRef.current === currentUserId) return;
    const isSwitchingFromAnotherUser = prevUserIdRef.current !== null;
    prevUserIdRef.current = currentUserId;

    async function loadUserProfiles() {
      // 1. Authenticated user with Supabase
      if (auth.isSupabaseReady && currentUserId !== 'guest') {
        try {
          const { initializeUserDataOnLogin } = await import('@/lib/supabaseSync');
          const defaultStarterProfiles = createInitialProfiles(
            builder.defaultCVData,
            builder.defaultEnglishCVData,
            {
              template: 'rabbit',
              accentColor: 'blue',
              fontFamily: 'roboto',
              isCompact: false,
              sectionOrder: DEFAULT_SECTION_ORDER,
              sectionVisibility: DEFAULT_SECTION_VISIBILITY,
              activeLang: 'vi',
            }
          );

          const { profiles: userProfiles, activeProfileId, isFirstTimeUser } =
            await initializeUserDataOnLogin(
              currentUserId,
              defaultStarterProfiles,
              [],
              defaultStarterProfiles[0].id
            );

          profiles.setProfiles(userProfiles);
          profiles.setActiveProfileId(activeProfileId);
          saveProfilesToStorage(userProfiles, activeProfileId, currentUserId);

          const targetProfile =
            userProfiles.find((p) => p.id === activeProfileId) || userProfiles[0];
          if (targetProfile) {
            applyProfileToBuilder(targetProfile, builder);
          }

          if (isSwitchingFromAnotherUser) {
            builder.setToastMessage(
              isFirstTimeUser
                ? `Chào mừng ${auth.user.name || 'bạn'}! Đã tạo không gian CV riêng.`
                : `Đã đồng bộ dữ liệu của ${auth.user.name || 'tài khoản'}.`
            );
          }
          return;
        } catch (err) {
          console.warn('[CVBuilderClient] Cloud profile load warning:', err);
        }
      }

      // 2. Guest or offline user
      const { profiles: loadedProfiles, activeProfileId: initialActiveId } =
        loadProfilesFromStorage(
          builder.defaultCVData,
          builder.defaultEnglishCVData,
          {
            template: builder.template,
            accentColor: builder.accentColor,
            fontFamily: builder.fontFamily,
            isCompact: builder.isCompact,
            sectionOrder: builder.sectionOrder,
            sectionVisibility: builder.sectionVisibility,
            activeLang: builder.lang,
          },
          currentUserId
        );

      profiles.setProfiles(loadedProfiles);
      profiles.setActiveProfileId(initialActiveId);

      const targetProfile =
        loadedProfiles.find((p) => p.id === initialActiveId) || loadedProfiles[0];
      if (targetProfile) {
        applyProfileToBuilder(targetProfile, builder);
      }

      if (isSwitchingFromAnotherUser && currentUserId === 'guest') {
        builder.setToastMessage('Đã chuyển về hồ sơ Khách.');
      }
    }

    loadUserProfiles();
  }, [
    auth.user.id,
    auth.isSupabaseReady,
    builder.isLoading,
  ]);

  // Auto-sync profile to storage on state change
  useEffect(() => {
    if (builder.isLoading || !profiles.activeProfileId) return;
    try {
      const activeCvVi = builder.lang === 'vi' ? builder.cv : builder.cvVi;
      const activeCvEn = builder.lang === 'en' ? builder.cv : builder.cvEn;

      profiles.setProfiles((prev) => {
        if (!prev || prev.length === 0) return prev;
        const next = prev.map((p) => {
          if (p.id === profiles.activeProfileId) {
            return {
              ...p,
              updatedAt: new Date().toISOString(),
              cvVi: activeCvVi,
              cvEn: activeCvEn,
              activeLang: builder.lang,
              coverLetterVi: builder.coverLetterVi,
              coverLetterEn: builder.coverLetterEn,
              template: builder.template,
              accentColor: builder.accentColor,
              fontFamily: builder.fontFamily,
              isCompact: builder.isCompact,
              typography: builder.typographyConfig,
              sectionOrder: builder.sectionOrder,
              sectionVisibility: builder.sectionVisibility,
            };
          }
          return p;
        });
        saveProfilesToStorage(next, profiles.activeProfileId, auth.user.id);
        return next;
      });
    } catch (e) {
      // ignore
    }
  }, [
    builder.cv,
    builder.cvVi,
    builder.cvEn,
    builder.lang,
    builder.coverLetterVi,
    builder.coverLetterEn,
    builder.template,
    builder.accentColor,
    builder.fontFamily,
    builder.isCompact,
    builder.typographyConfig,
    builder.sectionOrder,
    builder.sectionVisibility,
    profiles.activeProfileId,
    builder.isLoading,
    auth.user.id,
  ]);

  // Debounced auto-sync to Supabase Cloud for authenticated user
  useEffect(() => {
    if (
      builder.isLoading ||
      !auth.isAuthenticated ||
      auth.isGuest ||
      !auth.isSupabaseReady ||
      !auth.user.id
    ) {
      return;
    }
    if (!profiles.profiles || profiles.profiles.length === 0) return;

    const timer = setTimeout(async () => {
      try {
        const { uploadUserDataToSupabase } = await import('@/lib/supabaseSync');
        await uploadUserDataToSupabase(
          auth.user.id,
          profiles.profiles,
          [],
          profiles.activeProfileId
        );
      } catch (e) {
        // background sync catch
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [
    profiles.profiles,
    profiles.activeProfileId,
    auth.user.id,
    auth.isAuthenticated,
    auth.isGuest,
    auth.isSupabaseReady,
    builder.isLoading,
  ]);

  // Bridge Handlers
  const handleOpenTechModal = (target?: { type: 'timeline' | 'project'; id: string; title?: string }) => {
    if (target) {
      modals.setTechTarget(target);
    } else {
      if (builder.cv.timeline.length > 0) {
        modals.setTechTarget({ type: 'timeline', id: builder.cv.timeline[0].id, title: builder.cv.timeline[0].role });
      } else if (builder.cv.projects.length > 0) {
        modals.setTechTarget({ type: 'project', id: builder.cv.projects[0].id, title: builder.cv.projects[0].title });
      } else {
        modals.setTechTarget(null);
      }
    }
    modals.setShowTechModal(true);
  };

  const handleCopyBullet = (bullet: TechBulletPoint) => {
    const text = builder.lang === 'en' ? bullet.textEn : bullet.textVi;
    navigator.clipboard.writeText(text);
    modals.setCopiedBulletId(bullet.id);
    builder.setToastMessage(builder.lang === 'en' ? 'Copied bullet point to clipboard!' : 'Đã sao chép câu mô tả vào clipboard!');
    setTimeout(() => {
      modals.setCopiedBulletId(null);
      builder.setToastMessage(null);
    }, 2000);
  };

  const handleInsertBullet = (bullet: TechBulletPoint) => {
    const text = builder.lang === 'en' ? bullet.textEn : bullet.textVi;
    if (!modals.techTarget) {
      handleCopyBullet(bullet);
      return;
    }

    if (modals.techTarget.type === 'timeline') {
      builder.setCv((prev) => ({
        ...prev,
        timeline: prev.timeline.map((item) => {
          if (item.id !== modals.techTarget?.id) return item;
          const currentDesc = item.desc || '';
          const newDesc = currentDesc.trim() ? `${currentDesc.trim()}\n• ${text}` : `• ${text}`;
          return { ...item, desc: newDesc };
        }),
      }));
    } else if (modals.techTarget.type === 'project') {
      builder.setCv((prev) => ({
        ...prev,
        projects: prev.projects.map((proj) => {
          if (proj.id !== modals.techTarget?.id) return proj;
          const currentDesc = proj.desc || '';
          const newDesc = currentDesc.trim() ? `${currentDesc.trim()}\n• ${text}` : `• ${text}`;
          return { ...proj, desc: newDesc };
        }),
      }));
    }

    modals.setInsertedBulletId(bullet.id);
    builder.setToastMessage(builder.lang === 'en' ? 'Bullet inserted into CV!' : 'Đã chèn câu mô tả vào CV!');
    setTimeout(() => {
      modals.setInsertedBulletId(null);
      builder.setToastMessage(null);
    }, 2500);
  };

  const handleAddKeywordToSkills = (keywordName: string) => {
    if (!builder.cv.skills.some((s) => s.toLowerCase() === keywordName.toLowerCase())) {
      const nextSkills = [...builder.cv.skills, keywordName];
      builder.setCv((prev) => ({ ...prev, skills: nextSkills }));
      modals.setAddedSkillKeyword(keywordName);
      setTimeout(() => modals.setAddedSkillKeyword(null), 2000);
      builder.setToastMessage(builder.lang === 'en' ? `Added "${keywordName}" to Skills` : `Đã thêm "${keywordName}" vào mục Kỹ năng`);
      setTimeout(() => builder.setToastMessage(null), 2500);
    }
  };

  const handleCopyKeyword = (keywordName: string) => {
    navigator.clipboard.writeText(keywordName);
    modals.setCopiedKeyword(keywordName);
    setTimeout(() => modals.setCopiedKeyword(null), 2000);
    builder.setToastMessage(builder.lang === 'en' ? `Copied "${keywordName}"` : `Đã sao chép "${keywordName}"`);
    setTimeout(() => builder.setToastMessage(null), 2000);
  };

  const handleParseFile = async (file: File) => {
    modals.setIsParsingCV(true);
    modals.setParseError(null);
    modals.setImportFile(file);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/cv/parse', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || (builder.lang === 'en' ? 'Failed to parse file.' : 'Không thể trích xuất nội dung từ file.'));
      }
      modals.setParsedResult(data.result);
      modals.setImportPreviewTab('profile');
    } catch (err: any) {
      modals.setParseError(err.message || (builder.lang === 'en' ? 'An error occurred while parsing.' : 'Đã xảy ra lỗi khi phân tích file.'));
    } finally {
      modals.setIsParsingCV(false);
    }
  };

  const handleParseRawText = async (text: string, title?: string) => {
    if (!text || text.trim().length < 20) {
      modals.setParseError(builder.lang === 'en' ? 'Please paste at least 20 characters of CV content.' : 'Vui lòng dán ít nhất 20 ký tự nội dung CV.');
      return;
    }
    modals.setIsParsingCV(true);
    modals.setParseError(null);
    try {
      const res = await fetch('/api/cv/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fileName: title || (builder.lang === 'en' ? 'Pasted Text' : 'Văn bản đã dán') }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || (builder.lang === 'en' ? 'Failed to parse text.' : 'Không thể phân tích nội dung văn bản.'));
      }
      modals.setParsedResult(data.result);
      modals.setImportPreviewTab('profile');
    } catch (err: any) {
      modals.setParseError(err.message || (builder.lang === 'en' ? 'An error occurred while parsing.' : 'Đã xảy ra lỗi khi trích xuất.'));
    } finally {
      modals.setIsParsingCV(false);
    }
  };

  const handleApplyImportedCV = (mode: 'new_profile' | 'overwrite_current') => {
    if (!modals.parsedResult?.cv) return;
    const importedCV = modals.parsedResult.cv;
    const targetLang = modals.parsedResult.detectedLang;

    if (mode === 'new_profile') {
      const profileName = modals.parsedResult.fileName
        ? `CV ${modals.parsedResult.fileName.replace(/\.[^/.]+$/, '')}`
        : `CV ${importedCV.name || 'Imported'}`;

      const baseVi = targetLang === 'vi' ? importedCV : { ...builder.defaultCVData, ...importedCV };
      const baseEn = targetLang === 'en' ? importedCV : { ...builder.defaultEnglishCVData, ...importedCV };

      const newProfile = createNewCVProfile(
        profileName,
        importedCV.role || 'Software Engineer',
        baseVi,
        baseEn,
        {
          activeLang: targetLang,
          template: builder.template || 'rabbit',
          accentColor: builder.accentColor || 'blue',
          fontFamily: builder.fontFamily || 'inter',
          isCompact: builder.isCompact,
          sectionOrder: builder.sectionOrder,
          sectionVisibility: builder.sectionVisibility,
        }
      );

      const nextProfiles = [...profiles.profiles, newProfile];
      saveProfilesToStorage(nextProfiles, newProfile.id);
      profiles.setProfiles(nextProfiles);
      profiles.handleSwitchProfile(newProfile.id);
      modals.setShowImportModal(false);
      modals.setParsedResult(null);
      modals.setImportFile(null);
      modals.setImportRawText('');
      builder.setToastMessage(builder.lang === 'en' ? 'Created new CV Profile from imported file!' : 'Đã tạo phiên bản CV mới từ file trích xuất thành công!');
      setTimeout(() => builder.setToastMessage(null), 3000);
    } else {
      if (targetLang === 'vi') {
        builder.setCvVi(importedCV);
        if (builder.lang === 'vi') builder.setCvState(importedCV);
      } else {
        builder.setCvEn(importedCV);
        if (builder.lang === 'en') builder.setCvState(importedCV);
      }
      modals.setShowImportModal(false);
      modals.setParsedResult(null);
      modals.setImportFile(null);
      modals.setImportRawText('');
      builder.setToastMessage(builder.lang === 'en' ? 'CV updated from imported file!' : 'Đã cập nhật dữ liệu CV từ file thành công!');
      setTimeout(() => builder.setToastMessage(null), 3000);
    }
  };

  const processImportFile = async (file: File) => {
    try {
      const raw = await readJsonFile(file);
      const preview = parseImportJsonString(raw);
      modals.setImportPreview(preview);
      modals.setImportErrorMsg(null);
    } catch (err: any) {
      if (err.message === 'FILE_TYPE_INVALID') {
        modals.setImportErrorMsg(builder.lang === 'en' ? 'Please select a valid .json file.' : 'Vui lòng chọn tệp có định dạng .json');
      } else if (err.message === 'FILE_READ_ERROR') {
        modals.setImportErrorMsg(builder.lang === 'en' ? 'Failed to read file.' : 'Không thể đọc tệp đã chọn.');
      } else if (err.message === 'INVALID_CV_SCHEMA') {
        modals.setImportErrorMsg(builder.t.importInvalidMsg);
      } else {
        modals.setImportErrorMsg(builder.lang === 'en' ? `Failed to parse JSON file: ${err.message}` : `Lỗi đọc file JSON: ${err.message}`);
      }
    }
  };

  const handleJSONFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImportFile(file);
    }
    e.target.value = '';
  };

  const handleApplyImport = () => {
    builder.handleApplyImport(modals.importPreview, () => {
      modals.setShowDataModal(false);
      modals.setImportPreview(null);
      modals.setImportErrorMsg(null);
      builder.setToastMessage(builder.lang === 'en' ? 'Data restored successfully!' : 'Đã khôi phục dữ liệu thành công!');
      setTimeout(() => builder.setToastMessage(null), 3000);
    });
  };

  const handleReset = () => {
    if (
      confirm(
        builder.lang === 'en'
          ? 'Are you sure you want to reset this CV to initial template data?'
          : 'Bạn có chắc chắn muốn đặt lại dữ liệu CV về mặc định ban đầu?'
      )
    ) {
      builder.setCv(builder.lang === 'en' ? builder.defaultEnglishCVData : builder.defaultCVData);
      builder.setToastMessage(
        builder.lang === 'en' ? 'CV reset to default template.' : 'Đã đặt lại dữ liệu CV về mặc định.'
      );
      setTimeout(() => builder.setToastMessage(null), 3000);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B0F19] text-neutral-200 select-none">
      {/* Toast Notification */}
      {builder.toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-[99999] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-sm font-semibold animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{builder.toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Avatar Upload from Computer */}
      <input
        ref={builder.avatarInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        className="hidden"
        onChange={builder.handleAvatarFileChange}
      />

      {/* Hidden File Input for JSON CV Data Import */}
      <input
        ref={modals.jsonFileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleJSONFileChange}
      />

      {/* ================= RECRUITER PUBLIC TOPBAR (56px) ================= */}
      <RecruiterTopbar
        isPublicView={isPublicView}
        isPreviewMode={builder.isPreviewMode}
        cv={builder.cv}
        lang={builder.lang}
        t={builder.t}
        shareIncludeCoverLetter={builder.shareIncludeCoverLetter}
        docMode={builder.docMode}
        setDocMode={builder.setDocMode}
        handleToggleLang={builder.handleToggleLang}
        template={builder.template}
        setTemplate={builder.setTemplate}
        zoom={builder.zoom}
        setZoom={builder.setZoom}
        setIsPublicQrModalOpen={modals.setIsPublicQrModalOpen}
        handleCopyShareUrl={builder.handleCopyShareUrl}
        isShareCopied={builder.isShareCopied}
        shareAllowDownload={builder.shareAllowDownload}
        handlePrint={builder.handlePrint}
        setIsContactModalOpen={modals.setIsContactModalOpen}
      />

      {/* ================= 1. MINIMAL TOP-BAR (56px) - STUDIO EDITOR ================= */}
      <EditorTopbar
        isPreviewMode={builder.isPreviewMode}
        isPublicView={isPublicView}
        cv={builder.cv}
        lang={builder.lang}
        t={builder.t}
        profiles={profiles.profiles}
        activeProfileId={profiles.activeProfileId}
        handleSwitchProfile={profiles.handleSwitchProfile}
        handleRenameProfile={profiles.handleRenameProfile}
        handleDuplicateProfile={profiles.handleDuplicateProfile}
        handleDeleteProfile={profiles.handleDeleteProfile}
        setShowNewProfileModal={profiles.setShowNewProfileModal}
        setShowImportModal={modals.setShowImportModal}
        setShowDataModal={modals.setShowDataModal}
        handleUndo={history.handleUndo}
        handleRedo={history.handleRedo}
        undoHistoryIndex={history.undoHistoryIndex}
        undoHistory={history.undoHistory}
        isSaving={builder.isSaving}
        setIsPreviewMode={builder.setIsPreviewMode}
        setIsShareModalOpen={modals.setIsShareModalOpen}
        handlePrint={builder.handlePrint}
        handleExportImage={builder.handleExportImage}
        isExportingImage={builder.isExportingImage}
        exportResolution={builder.exportResolution}
        setExportResolution={builder.setExportResolution}
        setParsedResult={modals.setParsedResult}
        setParseError={modals.setParseError}
        auth={{
          user: auth.user,
          isAuthenticated: auth.isAuthenticated,
          isGuest: auth.isGuest,
          syncStatus: auth.syncStatus,
          lastSyncedAt: auth.lastSyncedAt,
          isSyncing: auth.isSyncing,
          onOpenAuthModal: () => modals.setShowAuthModal(true),
          onLogout: auth.logout,
          onTriggerSync: auth.triggerManualSync,
        }}
      />

      {/* ================= 2. MAIN WORKSPACE AREA (RAIL + DRAWER + CANVAS) ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ================= A. LEFT ICON RAIL (70px) ================= */}
        <SidebarRail
          isPreviewMode={builder.isPreviewMode}
          isPublicView={isPublicView}
          t={builder.t}
          lang={builder.lang}
          cvStrength={builder.cvStrength}
          activeRailTab={builder.activeRailTab}
          setActiveRailTab={builder.setActiveRailTab}
          isDrawerOpen={builder.isDrawerOpen}
          setIsDrawerOpen={builder.setIsDrawerOpen}
          setDocMode={builder.setDocMode}
          onOpenJobTracker={() => modals.setShowJobTrackerModal(true)}
        />

        {/* ================= B. TOOL DRAWER (320px) ================= */}
        {!builder.isPreviewMode && !isPublicView && builder.isDrawerOpen && (
          <aside className="no-print w-[320px] min-w-[320px] max-w-[85vw] bg-[#161B26] border-r border-white/10 flex flex-col z-40 lg:z-20 flex-shrink-0 transition-all duration-200 ease-in-out absolute lg:relative inset-y-0 left-[70px] lg:left-0 shadow-2xl lg:shadow-none">
            {/* Drawer Header */}
            <div className="h-12 min-h-[48px] px-4 border-b border-white/10 flex items-center justify-between bg-[#111827]/60">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white text-xs tracking-wide">
                  {builder.activeRailTab === 'design' && builder.t.drawerDesignTitle}
                  {builder.activeRailTab === 'content' && builder.t.drawerContentTitle}
                  {builder.activeRailTab === 'layout' && builder.t.drawerLayoutTitle}
                  {builder.activeRailTab === 'ai-ats' && builder.t.drawerAiAtsTitle}
                  {builder.activeRailTab === 'data' && builder.t.drawerDataTitle}
                  {builder.activeRailTab === 'cover_letter' && builder.t.coverLetterStudioTitle}
                </span>
              </div>
              <button
                onClick={() => builder.setIsDrawerOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Thu gọn"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body (Independent Scroll) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-xs text-neutral-300">
              {/* ================= TAB 1: DESIGN ================= */}
              {builder.activeRailTab === 'design' && (
                <DesignTab
                  lang={builder.lang}
                  t={builder.t}
                  activeTemplateDef={builder.activeTemplateDef}
                  template={builder.template}
                  setTemplate={builder.setTemplate}
                  setShowGalleryModal={modals.setShowGalleryModal}
                  accentColor={builder.accentColor}
                  setAccentColor={builder.setAccentColor}
                  fontFamily={builder.fontFamily}
                  setFontFamily={builder.setFontFamily}
                  canvasBgTheme={builder.canvasBgTheme}
                  handleSelectCanvasBgTheme={builder.handleSelectCanvasBgTheme}
                  typographyConfig={builder.typographyConfig}
                  setTypographyConfig={builder.setTypographyConfig}
                  cv={builder.cv}
                  setCv={builder.setCv}
                  triggerAvatarUpload={builder.triggerAvatarUpload}
                  handleRemoveAvatar={builder.handleRemoveAvatar}
                  activeQrConfig={builder.activeQrConfig}
                  handleUpdateQRConfig={builder.handleUpdateQRConfig}
                  handleUpdateQRTargetUrl={builder.handleUpdateQRTargetUrl}
                  qrDataUrl={builder.qrDataUrl}
                  handleCopyQRUrl={builder.handleCopyQRUrl}
                  qrCopied={builder.qrCopied}
                  setActiveRailTab={builder.setActiveRailTab}
                  setContentSubTab={builder.setContentSubTab}
                />
              )}

              {/* ================= TAB 2: CONTENT ================= */}
              {builder.activeRailTab === 'content' && (
                <ContentTab
                  lang={builder.lang}
                  t={builder.t}
                  cv={builder.cv}
                  setCv={builder.setCv}
                  drawerTab={builder.drawerTab}
                  setDrawerTab={builder.setDrawerTab}
                  sectionOrder={builder.sectionOrder}
                  sectionVisibility={builder.sectionVisibility}
                  handleAddCustomLink={builder.handleAddCustomLink}
                  handleUpdateCustomLink={builder.handleUpdateCustomLink}
                  handleToggleCustomLink={builder.handleToggleCustomLink}
                  handleRemoveCustomLink={builder.handleRemoveCustomLink}
                  handleMoveCustomLink={builder.handleMoveCustomLink}
                  handleOpenTechModal={handleOpenTechModal}
                  handleQuickLintSkills={builder.handleQuickLintSkills}
                  addTimelineItem={builder.addTimelineItem}
                  updateTimelineItem={builder.updateTimelineItem}
                  deleteTimelineItem={builder.deleteTimelineItem}
                  addProjectItem={builder.addProjectItem}
                  updateProjectItem={builder.updateProjectItem}
                  deleteProjectItem={builder.deleteProjectItem}
                  addSkill={builder.addSkill}
                  removeSkill={builder.removeSkill}
                  newSkillText={builder.newSkillText}
                  setNewSkillText={builder.setNewSkillText}
                  addEducationItem={builder.addEducationItem}
                  updateEducationItem={builder.updateEducationItem}
                  deleteEducationItem={builder.deleteEducationItem}
                  removeCustomSection={builder.removeCustomSection}
                  updateCustomSectionTitle={builder.updateCustomSectionTitle}
                  updateCustomSectionContent={builder.updateCustomSectionContent}
                  addCustomSectionItem={builder.addCustomSectionItem}
                  updateCustomSectionItem={builder.updateCustomSectionItem}
                  deleteCustomSectionItem={builder.deleteCustomSectionItem}
                  setToastMessage={builder.setToastMessage}
                />
              )}

              {/* ================= TAB 3: LAYOUT ================= */}
              {builder.activeRailTab === 'layout' && (
                <LayoutTab
                  lang={builder.lang}
                  setLang={builder.setLang}
                  handleSwitchLanguage={builder.handleSwitchLanguage}
                  t={builder.t}
                  syncContactInfoBetweenLangs={builder.syncContactInfoBetweenLangs}
                  isCompact={builder.isCompact}
                  toggleCompactMode={builder.toggleCompactMode}
                  canvasBgTheme={builder.canvasBgTheme}
                  handleSelectCanvasBgTheme={builder.handleSelectCanvasBgTheme}
                  typographyConfig={builder.typographyConfig}
                  setTypographyConfig={builder.setTypographyConfig}
                  sectionOrder={builder.sectionOrder}
                  sectionVisibility={builder.sectionVisibility}
                  cv={builder.cv}
                  resetSections={builder.resetSections}
                  toggleSectionVisibility={builder.toggleSectionVisibility}
                  moveSection={builder.moveSection}
                  removeCustomSection={builder.removeCustomSection}
                  addCustomSection={builder.addCustomSection}
                  zoom={builder.zoom}
                  setZoom={builder.setZoom}
                />
              )}

              {/* ================= TAB 4: AI & ATS ================= */}
              {builder.activeRailTab === 'ai-ats' && (
                <AiAtsTab
                  lang={builder.lang}
                  t={builder.t}
                  cvStrength={builder.cvStrength}
                  setShowStrengthModal={modals.setShowStrengthModal}
                  jdMatchResult={builder.jdMatchResult}
                  setShowJDModal={modals.setShowJDModal}
                  selectedSampleJdId={modals.selectedSampleJdId}
                  handleSelectSampleJD={modals.handleSelectSampleJD}
                  techLintReport={builder.techLintReport}
                  setShowTechLinterModal={modals.setShowTechLinterModal}
                  handleFixAllTechIssues={builder.handleFixAllTechIssues}
                  handleOpenTechModal={handleOpenTechModal}
                  setDrawerTab={builder.setDrawerTab}
                  setActiveRailTab={builder.setActiveRailTab}
                  setIsDrawerOpen={builder.setIsDrawerOpen}
                />
              )}

              {/* ================= TAB 5: DATA ================= */}
              {builder.activeRailTab === 'data' && (
                <DataTab
                  lang={builder.lang}
                  t={builder.t}
                  profiles={profiles.profiles}
                  activeProfileId={profiles.activeProfileId}
                  handleSwitchProfile={profiles.handleSwitchProfile}
                  handleDuplicateProfile={profiles.handleDuplicateProfile}
                  handleDeleteProfile={profiles.handleDeleteProfile}
                  setShowNewProfileModal={profiles.setShowNewProfileModal}
                  handleExportFullJSON={builder.handleExportFullJSON}
                  handleExportCurrentProfileJSON={builder.handleExportCurrentProfileJSON}
                  handleCopyJSON={builder.handleCopyJSON}
                  setShowImportModal={modals.setShowImportModal}
                  setParsedResult={modals.setParsedResult}
                  setParseError={modals.setParseError}
                  jsonFileInputRef={modals.jsonFileInputRef}
                  importPreview={modals.importPreview}
                  setImportPreview={modals.setImportPreview}
                  importErrorMsg={modals.importErrorMsg}
                  setImportErrorMsg={modals.setImportErrorMsg}
                  handleApplyImport={handleApplyImport}
                  handleReset={handleReset}
                />
              )}

              {/* ================= TAB 6: MATCHING COVER LETTER STUDIO ================= */}
              {builder.activeRailTab === 'cover_letter' && (
                <CoverLetterTab
                  lang={builder.lang}
                  t={builder.t}
                  currentCoverLetter={builder.currentCoverLetter}
                  handleSyncCoverLetterWithCV={builder.handleSyncCoverLetterWithCV}
                  handleCopyCoverLetterText={builder.handleCopyCoverLetterText}
                  isCoverLetterCopied={builder.isCoverLetterCopied}
                  activeCoverLetterPresetId={builder.activeCoverLetterPresetId}
                  handleApplyCoverLetterPreset={builder.handleApplyCoverLetterPreset}
                  handleUpdateCoverLetterField={builder.handleUpdateCoverLetterField}
                  setDocMode={builder.setDocMode}
                  setActiveRailTab={builder.setActiveRailTab}
                />
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-white/10 bg-[#111827] flex items-center justify-between">
              <button
                onClick={() => builder.setIsDrawerOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-neutral-300 hover:bg-white/5 text-xs font-medium transition-colors cursor-pointer"
              >
                {builder.lang === 'en' ? 'Close' : 'Đóng'}
              </button>
              <button
                onClick={builder.handleSave}
                disabled={builder.isSaving}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {builder.isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{builder.isSaving ? builder.t.saving : builder.t.save}</span>
              </button>
            </div>
          </aside>
        )}

        {/* Small Screen Backdrop */}
        {!builder.isPreviewMode && builder.isDrawerOpen && (
          <div
            onClick={() => builder.setIsDrawerOpen(false)}
            className="no-print lg:hidden fixed inset-0 bg-black/60 z-35 backdrop-blur-xs"
          />
        )}

        {/* ================= MAIN CV WORKSPACE CANVAS (7.1) ================= */}
        <CVCanvasWorkspace
          currentCanvasBg={builder.activeCanvasBgTheme}
          isPublicView={isPublicView}
          docMode={builder.docMode}
          lang={builder.lang}
          t={builder.t}
          activeTemplateDef={builder.activeTemplateDef}
          isCompact={builder.isCompact}
          setIsCompact={builder.setIsCompact}
          cvStrength={builder.cvStrength}
          zoom={builder.zoom}
          currentCoverLetter={builder.currentCoverLetter}
          template={builder.template}
          accentColor={builder.accentColor}
          fontFamily={builder.fontFamily}
          handleUpdateCoverLetterField={builder.handleUpdateCoverLetterField}
          isLoading={builder.isLoading}
          fontClass={builder.fontClass}
          typographyConfig={builder.typographyConfig}
          setTypographyConfig={builder.setTypographyConfig}
          commonTemplateProps={builder.commonTemplateProps}
          activeQrConfig={builder.activeQrConfig}
          qrDataUrl={builder.qrDataUrl}
          activeColor={builder.activeColor}
          cv={builder.cv}
          paperRef={builder.paperRef}
        />

        {/* ================= FLOATING CANVAS & FULLSCREEN CONTROLS (7.2) ================= */}
        <CanvasFloatingControls
          zoom={builder.zoom}
          setZoom={builder.setZoom}
          lang={builder.lang}
          canvasBgTheme={builder.canvasBgTheme}
          handleSelectCanvasBgTheme={builder.handleSelectCanvasBgTheme}
          currentCanvasBg={builder.activeCanvasBgTheme}
          isPreviewMode={builder.isPreviewMode}
          setIsPreviewMode={builder.setIsPreviewMode}
          isPublicView={isPublicView}
          handlePrint={builder.handlePrint}
          handleExportImage={builder.handleExportImage}
          isExportingImage={builder.isExportingImage}
        />
      </div>

      {/* ================= 11 SPECIALIZED MODALS ================= */}

      {/* 5.1: TEMPLATE GALLERY MODAL */}
      <TemplateGalleryModal
        isOpen={modals.showGalleryModal}
        onClose={() => modals.setShowGalleryModal(false)}
        currentTemplate={builder.template}
        onSelectTemplate={(tpl) => builder.setTemplate(tpl)}
        t={builder.t}
        lang={builder.lang}
      />

      {/* 5.2: CV PARSER / PDF & DOC IMPORT MODAL */}
      <CVParserModal
        isOpen={modals.showImportModal}
        onClose={() => {
          modals.setShowImportModal(false);
          modals.setParsedResult(null);
          modals.setParseError(null);
        }}
        lang={builder.lang}
        t={builder.t}
        importTab={modals.importTab}
        setImportTab={modals.setImportTab}
        importFile={modals.importFile}
        setImportFile={modals.setImportFile}
        importRawText={modals.importRawText}
        setImportRawText={modals.setImportRawText}
        isParsingCV={modals.isParsingCV}
        parseError={modals.parseError}
        setParseError={modals.setParseError}
        parsedResult={modals.parsedResult}
        setParsedResult={modals.setParsedResult}
        importPreviewTab={modals.importPreviewTab}
        setImportPreviewTab={modals.setImportPreviewTab}
        cvFileInputRef={modals.cvFileInputRef}
        handleParseFile={handleParseFile}
        handleParseRawText={handleParseRawText}
        handleApplyImportedCV={handleApplyImportedCV}
      />

      {/* 5.3: NEW CV PROFILE MODAL */}
      <NewProfileModal
        isOpen={profiles.showNewProfileModal}
        onClose={() => profiles.setShowNewProfileModal(false)}
        lang={builder.lang}
        newProfileName={profiles.newProfileName}
        setNewProfileName={profiles.setNewProfileName}
        newProfileRole={profiles.newProfileRole}
        setNewProfileRole={profiles.setNewProfileRole}
        newProfileCloneFromCurrent={profiles.newProfileCloneFromCurrent}
        setNewProfileCloneFromCurrent={profiles.setNewProfileCloneFromCurrent}
        onCreateProfile={profiles.handleCreateNewProfile}
      />

      {/* 5.4: CV DATA EXPORT / IMPORT MODAL */}
      <DataBackupModal
        isOpen={modals.showDataModal}
        onClose={() => {
          modals.setShowDataModal(false);
          modals.setImportPreview(null);
          modals.setImportErrorMsg(null);
        }}
        lang={builder.lang}
        t={builder.t}
        dataModalTab={modals.dataModalTab}
        setDataModalTab={modals.setDataModalTab}
        importPreview={modals.importPreview}
        setImportPreview={modals.setImportPreview}
        importErrorMsg={modals.importErrorMsg}
        setImportErrorMsg={modals.setImportErrorMsg}
        jsonFileInputRef={modals.jsonFileInputRef}
        handleExportFullJSON={builder.handleExportFullJSON}
        handleExportCurrentProfileJSON={builder.handleExportCurrentProfileJSON}
        handleCopyJSON={builder.handleCopyJSON}
        handleApplyImport={handleApplyImport}
        processImportFile={processImportFile}
      />

      {/* 5.5: TECH BULLET POINTS LIBRARY MODAL */}
      <TechBulletsModal
        isOpen={modals.showTechModal}
        onClose={() => modals.setShowTechModal(false)}
        lang={builder.lang}
        t={builder.t}
        cv={builder.cv}
        techTarget={modals.techTarget}
        setTechTarget={modals.setTechTarget}
        techSearchQuery={modals.techSearchQuery}
        setTechSearchQuery={modals.setTechSearchQuery}
        techCategoryFilter={modals.techCategoryFilter}
        setTechCategoryFilter={modals.setTechCategoryFilter}
        copiedBulletId={modals.copiedBulletId}
        insertedBulletId={modals.insertedBulletId}
        handleCopyBullet={handleCopyBullet}
        handleInsertBullet={handleInsertBullet}
      />

      {/* 5.6: CV STRENGTH & ATS CHECKLIST MODAL */}
      <CVStrengthModal
        isOpen={modals.showStrengthModal}
        onClose={() => modals.setShowStrengthModal(false)}
        lang={builder.lang}
        t={builder.t}
        cv={builder.cv}
        cvStrength={builder.cvStrength}
        onOpenTechModal={() => modals.setShowTechModal(true)}
        onNavigateDrawer={(tab) => {
          builder.setDrawerTab(tab as any);
          builder.setActiveRailTab('content');
          builder.setIsDrawerOpen(true);
        }}
      />

      {/* 5.7: JD MATCHER & KEYWORD GAP MODAL */}
      <JDMatcherModal
        isOpen={modals.showJDModal}
        onClose={() => modals.setShowJDModal(false)}
        lang={builder.lang}
        t={builder.t}
        cv={builder.cv}
        jdInputText={modals.jdInputText}
        setJdInputText={modals.setJdInputText}
        selectedSampleJdId={modals.selectedSampleJdId}
        setSelectedSampleJdId={modals.setSelectedSampleJdId}
        jdMatchResult={builder.jdMatchResult}
        jdFilter={modals.jdFilter}
        setJdFilter={modals.setJdFilter}
        handleSelectSampleJD={modals.handleSelectSampleJD}
        handleAddKeywordToSkills={handleAddKeywordToSkills}
        handleCopyKeyword={handleCopyKeyword}
        copiedKeyword={modals.copiedKeyword}
        addedSkillKeyword={modals.addedSkillKeyword}
      />

      {/* 5.8: TECH NOMENCLATURE LINTER STUDIO */}
      <TechLinterModal
        isOpen={modals.showTechLinterModal}
        onClose={() => modals.setShowTechLinterModal(false)}
        lang={builder.lang}
        t={builder.t}
        cv={builder.cv}
        techLintReport={builder.techLintReport}
        handleFixSingleTechIssue={builder.handleFixSingleTechIssue}
        handleFixAllTechIssues={builder.handleFixAllTechIssues}
        handleIgnoreTechIssue={builder.handleIgnoreTechIssue}
        ignoredIssueIds={builder.ignoredIssueIds}
        setToastMessage={builder.setToastMessage}
      />

      {/* 5.9: PUBLIC SHAREABLE WEB LINK */}
      <PublicShareModal
        isOpen={modals.isShareModalOpen && !isPublicView}
        onClose={() => modals.setIsShareModalOpen(false)}
        lang={builder.lang}
        t={builder.t}
        sharePublicUrl={builder.sharePublicUrl}
        shareQrDataUrl={builder.shareQrDataUrl}
        isShareCopied={builder.isShareCopied}
        handleCopyShareUrl={builder.handleCopyShareUrl}
        handleDownloadShareQr={builder.handleDownloadShareQr}
        handleShareLinkedIn={builder.handleShareLinkedIn}
        handleShareEmail={builder.handleShareEmail}
        handleShareTwitter={builder.handleShareTwitter}
        shareIncludeCoverLetter={builder.shareIncludeCoverLetter}
        setShareIncludeCoverLetter={builder.setShareIncludeCoverLetter}
        shareAllowDownload={builder.shareAllowDownload}
        setShareAllowDownload={builder.setShareAllowDownload}
        privacyHidePhone={builder.privacyHidePhone}
        setPrivacyHidePhone={builder.setPrivacyHidePhone}
        privacyHideLocation={builder.privacyHideLocation}
        setPrivacyHideLocation={builder.setPrivacyHideLocation}
        shareModalRef={modals.shareModalRef}
        setToastMessage={builder.setToastMessage}
      />

      {/* 5.10: CONTACT CANDIDATE MODAL */}
      <ContactCandidateModal
        isOpen={modals.isContactModalOpen}
        onClose={() => modals.setIsContactModalOpen(false)}
        lang={builder.lang}
        t={builder.t}
        cv={builder.cv}
        privacyHidePhone={builder.privacyHidePhone}
      />

      {/* 5.11: PUBLIC MOBILE QR CODE MODAL */}
      <MobileQRModal
        isOpen={modals.isPublicQrModalOpen}
        onClose={() => modals.setIsPublicQrModalOpen(false)}
        lang={builder.lang}
        t={builder.t}
        shareQrDataUrl={builder.shareQrDataUrl}
        handleDownloadShareQr={builder.handleDownloadShareQr}
      />

      {/* 5.12: KANBAN JOB APPLICATION TRACKER */}
      <JobTrackerModal
        isOpen={modals.showJobTrackerModal}
        onClose={() => modals.setShowJobTrackerModal(false)}
        lang={builder.lang}
        userId={auth.user.id}
      />

      {/* 5.13: PROGRESSIVE AUTH & CLOUD SYNC MODAL */}
      <AuthModal
        isOpen={modals.showAuthModal}
        onClose={() => modals.setShowAuthModal(false)}
        lang={builder.lang}
        loginWithProvider={auth.loginWithProvider}
        onLoginSuccess={(u) => {
          builder.setToastMessage(
            builder.lang === 'en'
              ? `Welcome, ${u.name}! Cloud sync is active.`
              : `Chào mừng ${u.name}! Đã kích hoạt đồng bộ Cloud.`
          );
        }}
      />

      {/* ================= PRINT & COMPACT CSS STYLES (A4 ACCURATE) ================= */}
      <style jsx global>{`
        /* Dynamic CV Typography Engine */
        .cv-paper.font-inter, .cv-paper.font-inter *:not([class*="font-mono"]) {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .cv-paper.font-bevietnam, .cv-paper.font-bevietnam *:not([class*="font-mono"]) {
          font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        .cv-paper.font-jakarta, .cv-paper.font-jakarta *:not([class*="font-mono"]) {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        .cv-paper.font-roboto, .cv-paper.font-roboto *:not([class*="font-mono"]) {
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        .cv-paper.font-merriweather, .cv-paper.font-merriweather *:not([class*="font-mono"]) {
          font-family: 'Merriweather', Georgia, serif !important;
        }
        .cv-paper.font-jetbrains, .cv-paper.font-jetbrains * {
          font-family: 'JetBrains Mono', Consolas, Monaco, monospace !important;
        }
        .cv-paper .font-mono {
          font-family: 'JetBrains Mono', Consolas, Monaco, monospace !important;
        }

        .cv-compact {
          line-height: 1.35 !important;
        }

        .cv-compact h1 {
          font-size: 1.65rem !important;
          margin-bottom: 2px !important;
        }

        .cv-compact h2 {
          font-size: 0.72rem !important;
          padding-bottom: 2px !important;
          margin-bottom: 4px !important;
        }

        .cv-compact p {
          line-height: 1.38 !important;
          margin-bottom: 2px !important;
        }

        /* Dynamic Fine-grain Typography Engine */
        .cv-paper {
          font-size: var(--cv-body-size, 13.5px);
          line-height: var(--cv-line-height, 1.45);
        }

        .cv-paper p,
        .cv-paper li,
        .cv-paper .text-\[11px\],
        .cv-paper .text-xs:not(h1 *):not(h2 *):not(.font-bold):not([class*="uppercase"]) {
          font-size: var(--cv-body-size, 13.5px) !important;
          line-height: var(--cv-line-height, 1.45) !important;
        }

        .cv-paper h2,
        .cv-paper h2 * {
          font-size: var(--cv-heading-size, 16.5px) !important;
        }

        /* Fine-grain Section Gap */
        .cv-paper .space-y-6 > * + *,
        .cv-paper .space-y-5 > * + *,
        .cv-paper .space-y-4 > * + * {
          margin-top: var(--cv-section-gap, 18px) !important;
        }

        /* Fine-grain Item Gap */
        .cv-paper .space-y-3 > * + *,
        .cv-paper .space-y-2 > * + * {
          margin-top: var(--cv-item-gap, 10px) !important;
        }

        /* Fine-grain Page Padding */
        .cv-paper .p-8,
        .cv-paper .p-7,
        .cv-paper .p-6,
        .cv-paper .p-5 {
          padding-top: var(--cv-pad-top-bottom, 24px) !important;
          padding-bottom: var(--cv-pad-top-bottom, 24px) !important;
          padding-left: var(--cv-pad-left-right, 28px) !important;
          padding-right: var(--cv-pad-left-right, 28px) !important;
        }

        .cv-paper .px-8,
        .cv-paper .px-6,
        .cv-paper .px-5 {
          padding-left: var(--cv-pad-left-right, 28px) !important;
          padding-right: var(--cv-pad-left-right, 28px) !important;
        }

        .cv-paper .py-8,
        .cv-paper .py-6,
        .cv-paper .py-5,
        .cv-paper .py-4 {
          padding-top: var(--cv-pad-top-bottom, 24px) !important;
          padding-bottom: var(--cv-pad-top-bottom, 24px) !important;
        }

        .cv-public-view .no-print {
          display: none !important;
        }

        @media print {
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }

          .h-screen {
            height: auto !important;
            overflow: visible !important;
          }

          .overflow-hidden {
            overflow: visible !important;
          }

          header,
          nav,
          aside,
          .no-print,
          #customCursorWrapper,
          .noise-overlay,
          #preloader,
          #projectModal {
            display: none !important;
          }

          main {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            background-image: none !important;
            display: block !important;
          }

          main > div {
            transform: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
            width: 100% !important;
          }

          .cv-paper {
            box-shadow: none !important;
            border: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
            width: 210mm !important;
            max-width: 210mm !important;
            min-height: 297mm !important;
            transform: none !important;
            background-color: #ffffff !important;
          }

          .cv-compact {
            max-height: 297mm !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          .cv-editable {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            outline: none !important;
            background: transparent !important;
          }

          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
