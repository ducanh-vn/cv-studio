'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Layers,
  ChevronDown,
  Plus,
  Pencil,
  Copy,
  Trash2,
  FileUp,
  Database,
  Undo2,
  Redo2,
  Eye,
  Share2,
  Download,
  ChevronRight,
  Camera,
  ImageIcon,
  FileText,
  Loader2,
  X,
  Kanban,
} from 'lucide-react';
import type { CVData, Language } from '@/types/cvBuilder';
import type { CVProfile } from '@/lib/cvProfiles';
import { UserSyncMenu } from '@/components/auth';
import type { AuthUser, SyncStatus } from '@/types/auth';
import type { ImageExportFormat, ExportResolution } from '@/lib/exportImage';

export interface EditorTopbarProps {
  isPreviewMode?: boolean;
  isPublicView?: boolean;
  cv: CVData;
  lang: Language;
  t: Record<string, string>;
  profiles: CVProfile[];
  activeProfileId: string;
  handleSwitchProfile: (id: string) => void;
  handleRenameProfile: (id: string, newName: string) => void;
  handleDuplicateProfile: (id: string) => void;
  handleDeleteProfile: (id: string) => void;
  setShowNewProfileModal: (show: boolean) => void;
  setShowImportModal: (show: boolean) => void;
  setShowDataModal: (show: boolean) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  setIsPreviewMode: (show: boolean) => void;
  setIsShareModalOpen: (show: boolean) => void;
  onOpenJobTracker?: () => void;
  handlePrint: () => void;
  handleExportImage: (format: ImageExportFormat, resolution: ExportResolution) => void;
  isExportingImage: boolean;
  exportResolution: ExportResolution;
  setExportResolution: (res: ExportResolution) => void;
  isSaving?: boolean;
  undoHistoryIndex?: number;
  undoHistory?: any[];
  setParsedResult?: (val: any) => void;
  setParseError?: (val: any) => void;
  activeProfile?: CVProfile;
  auth?: {
    user: AuthUser;
    isAuthenticated: boolean;
    isGuest: boolean;
    syncStatus: SyncStatus;
    lastSyncedAt: string | null;
    isSyncing: boolean;
    onOpenAuthModal: () => void;
    onLogout: () => void;
    onTriggerSync: () => Promise<boolean>;
  };
}

export function EditorTopbar({
  isPreviewMode = false,
  isPublicView = false,
  cv,
  lang,
  t,
  profiles,
  activeProfileId,
  handleSwitchProfile,
  handleRenameProfile,
  handleDuplicateProfile,
  handleDeleteProfile,
  setShowNewProfileModal,
  setShowImportModal,
  setShowDataModal,
  handleUndo,
  handleRedo,
  canUndo = true,
  canRedo = true,
  setIsPreviewMode,
  setIsShareModalOpen,
  onOpenJobTracker,
  handlePrint,
  handleExportImage,
  isExportingImage,
  exportResolution,
  setExportResolution,
  isSaving = false,
  undoHistoryIndex = 0,
  undoHistory = [],
  setParsedResult,
  setParseError,
  activeProfile: customActiveProfile,
  auth,
}: EditorTopbarProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingProfileName, setEditingProfileName] = useState('');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const activeProfile = customActiveProfile || profiles.find((p) => p.id === activeProfileId) || profiles[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
        setEditingProfileId(null);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isPreviewMode || isPublicView) return null;

  return (
        <header className="no-print h-14 min-h-[56px] max-h-[56px] bg-[#111827] border-b border-white/10 px-3 sm:px-5 flex items-center justify-between z-40 select-none flex-shrink-0">
          {/* Cụm Trái: Quay lại, Tên CV, Badge Đã lưu */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <Link
              href="/"
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
              title={lang === 'en' ? 'Back to Portfolio' : 'Quay lại Portfolio'}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="h-4 w-px bg-white/10 flex-shrink-0" />

            <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-white max-w-[110px] sm:max-w-[160px] truncate" title={cv.name || 'Untitled CV'}>
                {cv.name || 'Untitled CV'}
              </span>
              <span className="text-neutral-500 text-xs flex-shrink-0">/</span>

              {/* CV Profile Switcher Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#161B26] hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all cursor-pointer group shadow-xs select-none"
                  title={lang === 'en' ? 'Switch or manage CV Profiles' : 'Nhấp để đổi hoặc quản lý các phiên bản CV'}
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-medium text-xs text-cyan-300 max-w-[110px] sm:max-w-[150px] md:max-w-[180px] truncate">
                    {activeProfile?.name || 'Hồ sơ CV'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 font-mono hidden lg:inline-block">
                    {profiles.length} bản
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-neutral-400 group-hover:text-white transition-transform ${
                      isProfileMenuOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {/* Profile Switcher Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-80 bg-[#161B26] border border-white/10 rounded-xl shadow-2xl p-2.5 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 select-none">
                    <div className="px-2 py-1 mb-1.5 flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {lang === 'en' ? 'CV PROFILES' : 'CÁC PHIÊN BẢN CV'} ({profiles.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setShowNewProfileModal(true);
                        }}
                        className="flex items-center space-x-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{lang === 'en' ? 'New Profile' : 'Tạo mới'}</span>
                      </button>
                    </div>

                    {/* Profiles List */}
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                      {profiles.map((p) => {
                        const isActive = p.id === activeProfileId;
                        const isEditing = editingProfileId === p.id;

                        return (
                          <div
                            key={p.id}
                            className={`p-2 rounded-lg border transition-all ${
                              isActive
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-white'
                                : 'bg-white/5 border-transparent hover:border-white/10 text-neutral-300 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              {isEditing ? (
                                <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                                  <input
                                    type="text"
                                    value={editingProfileName}
                                    onChange={(e) => setEditingProfileName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleRenameProfile(p.id, editingProfileName);
                                      if (e.key === 'Escape') setEditingProfileId(null);
                                    }}
                                    autoFocus
                                    className="w-full bg-black/60 border border-cyan-500/50 rounded px-2 py-0.5 text-xs text-white outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRenameProfile(p.id, editingProfileName)}
                                    className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                                    title="Lưu tên"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingProfileId(null)}
                                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-neutral-300 cursor-pointer"
                                    title="Hủy"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleSwitchProfile(p.id)}
                                    className="flex-1 text-left min-w-0 cursor-pointer"
                                  >
                                    <div className="flex items-center space-x-1.5">
                                      <span className="font-semibold text-xs truncate">{p.name}</span>
                                      {isActive && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono shrink-0">
                                          Đang mở
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                                      {p.targetRole || 'Software Engineer'} • Mẫu: <span className="capitalize">{p.template}</span> • {p.activeLang === 'en' ? 'EN' : 'VI'}
                                    </div>
                                  </button>

                                  <div className="flex items-center space-x-0.5 shrink-0">
                                    {/* Duplicate */}
                                    <button
                                      type="button"
                                      onClick={() => handleDuplicateProfile(p.id)}
                                      className="p-1 rounded text-neutral-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
                                      title="Nhân bản phiên bản này"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>

                                    {/* Rename */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProfileId(p.id);
                                        setEditingProfileName(p.name);
                                      }}
                                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                      title="Đổi tên phiên bản"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>

                                    {/* Delete */}
                                    {profiles.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteProfile(p.id);
                                        }}
                                        className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                                        title="Xóa phiên bản này"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Create New Profile Button */}
                    <div className="mt-2 pt-2 border-t border-white/5 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setShowNewProfileModal(true);
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? '+ Create New CV Profile' : '+ Thêm phiên bản CV mới'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setShowImportModal(true);
                          setParsedResult?.(null);
                          setParseError?.(null);
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs border border-emerald-500/20"
                      >
                        <FileUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'en' ? 'Extract CV from PDF / Word →' : 'Trích xuất CV từ PDF / Word →'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Indicator trạng thái lưu dạng text nhỏ màu xám mờ ngay cạnh dropdown chọn phiên bản */}
              <div className="flex items-center space-x-1 text-[11px] text-neutral-400/80 select-none pl-1 flex-shrink-0">
                {isSaving ? (
                  <span className="flex items-center space-x-1 text-cyan-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="hidden sm:inline">{lang === 'en' ? 'Saving...' : 'Đang lưu...'}</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-neutral-400/80 hover:text-neutral-300">
                    <Check className="w-3 h-3 text-emerald-400/80" />
                    <span className="hidden sm:inline">{lang === 'en' ? 'Saved' : 'Đã lưu'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cụm Phải: Undo / Redo, Xem trước, Chia sẻ (icon-only), Nút chính Xuất PDF */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Undo / Redo Controls */}
            <div className="flex items-center bg-[#161B26] border border-white/10 rounded-lg p-0.5 text-xs shadow-xs">
              <button
                type="button"
                onClick={handleUndo}
                disabled={undoHistoryIndex <= 0}
                className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                  undoHistoryIndex > 0
                    ? 'text-neutral-200 hover:text-white hover:bg-white/10 active:scale-90 cursor-pointer shadow-xs'
                    : 'text-neutral-500/60 cursor-not-allowed opacity-50'
                }`}
                title={
                  undoHistoryIndex > 0
                    ? (lang === 'en' ? `Undo (${undoHistoryIndex} action${undoHistoryIndex > 1 ? 's' : ''}) - Ctrl+Z` : `Hoàn tác (${undoHistoryIndex} thao tác) - Ctrl+Z`)
                    : (lang === 'en' ? 'Undo (No previous action - Ctrl+Z)' : 'Hoàn tác (Chưa có thao tác nào - Ctrl+Z)')
                }
                aria-label="Undo"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-3 bg-white/10 my-auto" />
              <button
                type="button"
                onClick={handleRedo}
                disabled={undoHistoryIndex >= undoHistory.length - 1}
                className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                  undoHistoryIndex < undoHistory.length - 1
                    ? 'text-neutral-200 hover:text-white hover:bg-white/10 active:scale-90 cursor-pointer shadow-xs'
                    : 'text-neutral-500/60 cursor-not-allowed opacity-50'
                }`}
                title={
                  undoHistoryIndex < undoHistory.length - 1
                    ? (lang === 'en' ? `Redo (${undoHistory.length - 1 - undoHistoryIndex} action${undoHistory.length - 1 - undoHistoryIndex > 1 ? 's' : ''}) - Ctrl+Y` : `Làm lại (${undoHistory.length - 1 - undoHistoryIndex} thao tác) - Ctrl+Y`)
                    : (lang === 'en' ? 'Redo (No undone action - Ctrl+Y)' : 'Làm lại (Chưa có thao tác hoàn tác - Ctrl+Y)')
                }
                aria-label="Redo"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Nút Xem trước (icon mắt + text ngắn) */}
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/10 bg-[#161B26] hover:bg-white/5 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              title={lang === 'en' ? 'Preview Fullscreen (ESC to exit)' : 'Xem trước toàn màn hình (bấm ESC để thoát)'}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{lang === 'en' ? 'Preview' : 'Xem trước'}</span>
            </button>

            {/* Nút Bảng theo dõi ứng tuyển (Kanban Tracker) */}
            {onOpenJobTracker && (
              <button
                type="button"
                onClick={onOpenJobTracker}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
                title={lang === 'en' ? 'Job Application Kanban Tracker' : 'Bảng theo dõi ứng tuyển (Kanban)'}
              >
                <Kanban className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">{lang === 'en' ? 'Job Tracker' : 'Ứng tuyển'}</span>
              </button>
            )}

            {/* Nút Chia sẻ (chỉ hiện icon Share có tooltip) */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center justify-center p-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white transition-all cursor-pointer shadow-xs"
              title={t.shareModalTitle || (lang === 'en' ? 'Share Public Link' : 'Chia sẻ đường dẫn công khai')}
              aria-label="Share CV Link"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {/* Nút chính Xuất PDF (Màu nổi bật nhất) */}
            <div className="relative" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                disabled={isExportingImage}
                className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                title={lang === 'en' ? 'Export CV (PDF, PNG, JPG)' : 'Xuất CV (PDF, PNG, JPG)'}
              >
                {isExportingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'en' ? 'Exporting...' : 'Đang xuất...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">{lang === 'en' ? 'Export PDF' : 'Xuất PDF'}</span>
                    <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {isExportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#161B26] border border-white/10 rounded-xl shadow-2xl p-2.5 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 select-none">
                  <div className="px-2 py-1 mb-1.5 flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      {lang === 'en' ? 'EXPORT CV & DOCUMENTS' : 'ĐỊNH DẠNG XUẤT HỒ SƠ'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono">
                      A4 • 210x297mm
                    </span>
                  </div>

                  {/* Option 1: PDF Export */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      handlePrint();
                    }}
                    className="w-full flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {lang === 'en' ? 'Export PDF (Print Ready)' : 'Xuất PDF chuẩn in ấn'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">.pdf</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        {lang === 'en' ? 'Vector crisp quality, standard A4 layout for print & ATS.' : 'Chuẩn giấy in A4, giữ nguyên chữ vector sắc nét, tối ưu cho máy quét ATS.'}
                      </p>
                    </div>
                  </button>

                  {/* Option 2: PNG High-Res */}
                  <button
                    type="button"
                    onClick={() => handleExportImage('png', exportResolution)}
                    className="w-full flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer group mt-1"
                  >
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors shrink-0 mt-0.5">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
                          <span>{lang === 'en' ? 'Export High-Res PNG' : 'Xuất ảnh PNG sắc nét'}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                            {exportResolution === 2 ? '300 DPI' : `${exportResolution}x`}
                          </span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">.png</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        {lang === 'en' ? 'Ultra sharp retina quality, perfect for sending via Zalo, LinkedIn, Messenger.' : 'Độ phân giải cao siêu nét, không vỡ hạt, cực tiện gửi xem nhanh qua Zalo, LinkedIn.'}
                      </p>
                    </div>
                  </button>

                  {/* Option 3: JPG High-Quality */}
                  <button
                    type="button"
                    onClick={() => handleExportImage('jpeg', exportResolution)}
                    className="w-full flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer group mt-1"
                  >
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors shrink-0 mt-0.5">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {lang === 'en' ? 'Export High-Quality JPG' : 'Xuất ảnh JPG chất lượng cao'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">.jpg</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        {lang === 'en' ? 'Compressed 95% quality, smaller file size, fast preview on phones.' : 'Nén 95% chất lượng cao, dung lượng nhẹ, mở cực nhanh trên mọi thiết bị di động.'}
                      </p>
                    </div>
                  </button>

                  {/* Resolution Selector Strip */}
                  <div className="mt-2 pt-2 border-t border-white/5 px-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {lang === 'en' ? 'Image Resolution:' : 'Độ phân giải ảnh:'}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {exportResolution === 1 ? '794 x 1123 px' : exportResolution === 2 ? '1588 x 2246 px (300 DPI)' : '2382 x 3369 px (Ultra 4K)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 p-0.5 bg-neutral-900/80 rounded-lg border border-white/5">
                      {[
                        { res: 1 as const, label: '1x Web' },
                        { res: 2 as const, label: '2x HD ⭐' },
                        { res: 3 as const, label: '3x Ultra' },
                      ].map(({ res, label }) => (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setExportResolution(res)}
                          className={`py-1 text-[10px] font-medium rounded transition-all cursor-pointer ${
                            exportResolution === res
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 4: JSON Backup */}
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        setShowDataModal(true);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white text-[11px] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Database className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{lang === 'en' ? 'Backup / Restore (.JSON)' : 'Sao lưu / Khôi phục (.JSON)'}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-neutral-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Cloud Sync Menu (Progressive Auth) */}
            {auth && (
              <UserSyncMenu
                user={auth.user}
                isAuthenticated={auth.isAuthenticated}
                isGuest={auth.isGuest}
                syncStatus={auth.syncStatus}
                lastSyncedAt={auth.lastSyncedAt}
                isSyncing={auth.isSyncing}
                lang={lang}
                onOpenAuthModal={auth.onOpenAuthModal}
                onLogout={auth.onLogout}
                onTriggerSync={auth.onTriggerSync}
              />
            )}
          </div>
        </header>
  );
}

export default EditorTopbar;
