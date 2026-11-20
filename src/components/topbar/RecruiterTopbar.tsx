'use client';

import React, { useState } from 'react';
import {
  FileText,
  Mail,
  Globe,
  LayoutTemplate,
  ChevronDown,
  ZoomOut,
  ZoomIn,
  QrCode,
  Link as LinkIcon,
  Check,
  Download,
  PhoneCall,
} from 'lucide-react';
import { TEMPLATES_COLLECTION } from '@/constants/cvConstants';
import type { CVData, Language, TemplateId } from '@/types/cvBuilder';

export interface RecruiterTopbarProps {
  isPublicView?: boolean;
  isPreviewMode?: boolean;
  cv: CVData;
  lang: Language;
  t: Record<string, string>;
  shareIncludeCoverLetter?: boolean;
  docMode: 'cv' | 'cover_letter';
  setDocMode: (mode: 'cv' | 'cover_letter') => void;
  handleToggleLang: () => void;
  template: TemplateId | string;
  setTemplate: (tpl: TemplateId) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  setIsPublicQrModalOpen: (open: boolean) => void;
  handleCopyShareUrl: () => void;
  isShareCopied: boolean;
  shareAllowDownload?: boolean;
  handlePrint: () => void;
  setIsContactModalOpen: (open: boolean) => void;
}

export function RecruiterTopbar({
  isPublicView = true,
  isPreviewMode = false,
  cv,
  lang,
  t,
  shareIncludeCoverLetter = false,
  docMode,
  setDocMode,
  handleToggleLang,
  template,
  setTemplate,
  zoom,
  setZoom,
  setIsPublicQrModalOpen,
  handleCopyShareUrl,
  isShareCopied,
  shareAllowDownload = true,
  handlePrint,
  setIsContactModalOpen,
}: RecruiterTopbarProps) {
  const [publicTemplateMenuOpen, setPublicTemplateMenuOpen] = useState(false);
  const activeTemplateDef = TEMPLATES_COLLECTION.find((t) => t.id === template) || TEMPLATES_COLLECTION[0];

  if (!isPublicView || isPreviewMode) return null;

  return (
        <header className="no-print h-14 min-h-[56px] max-h-[56px] bg-[#0D111A]/95 border-b border-white/10 px-3 sm:px-5 flex items-center justify-between z-40 select-none flex-shrink-0 backdrop-blur-md">
          {/* Cụm Trái: Candidate Info & Badge */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            {cv.avatar ? (
              <img
                src={cv.avatar}
                alt={cv.name}
                className="w-8 h-8 rounded-full object-cover border border-cyan-400/50 shadow-xs flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0">
                {cv.name ? cv.name.charAt(0) : 'CV'}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[120px] sm:max-w-[180px]">
                  {cv.name || 'Nguyễn Đức Anh'}
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-medium font-mono shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t.publicOpenToWork}</span>
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 truncate hidden xs:block max-w-[160px] sm:max-w-[220px]">
                {cv.role || 'Fullstack Developer'}
              </div>
            </div>
          </div>

          {/* Cụm Giữa: Switcher Bản CV / Thư xin việc & Ngôn ngữ VI/EN */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Doc mode toggle if enabled */}
            {shareIncludeCoverLetter && (
              <div className="flex items-center bg-[#161B26] border border-white/10 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setDocMode('cv')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                    docMode === 'cv'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t.publicResumeTab}</span>
                  <span className="md:hidden">CV</span>
                </button>
                <button
                  onClick={() => setDocMode('cover_letter')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                    docMode === 'cover_letter'
                      ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t.publicCoverLetterTab}</span>
                  <span className="md:hidden">Letter</span>
                </button>
              </div>
            )}

            {/* Language Toggle VI / EN */}
            <button
              onClick={handleToggleLang}
              className="px-2.5 py-1 rounded-lg bg-[#161B26] hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center space-x-1"
              title={lang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
            </button>

            {/* Template Quick Switcher Dropdown for Recruiters */}
            <div className="relative">
              <button
                onClick={() => setPublicTemplateMenuOpen(!publicTemplateMenuOpen)}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#161B26] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                title={t.publicChangeLayout}
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
                <span className="capitalize">{activeTemplateDef.name}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {publicTemplateMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#161B26] border border-white/10 rounded-xl shadow-2xl p-2 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-white/5 mb-1">
                    {t.publicChangeLayout} (10 Mẫu)
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {TEMPLATES_COLLECTION.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => {
                          setTemplate(tpl.id);
                          setPublicTemplateMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          template === tpl.id
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                            : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="capitalize">{tpl.name}</span>
                        <span className="text-[10px] text-neutral-500">{tpl.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Zoom Controls on Public View */}
            <div className="hidden sm:flex items-center bg-[#161B26] border border-white/10 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"
                title="Thu nhỏ (-10%)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="px-2 py-0.5 font-mono text-[11px] text-neutral-300 hover:text-white font-medium select-none cursor-pointer"
                title="Reset về 100%"
              >
                {zoom}%
              </button>
              <button
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"
                title="Phóng to (+10%)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cụm Phải: Nút Quét QR Mobile, Tải PDF & Liên Hệ Ứng Viên */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Mobile QR Viewer Button */}
            <button
              onClick={() => setIsPublicQrModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#161B26] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center space-x-1"
              title={t.publicScanQrBtn}
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">{t.publicScanQrBtn}</span>
            </button>

            {/* Copy Public Link Button */}
            <button
              onClick={handleCopyShareUrl}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#161B26] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center space-x-1"
              title={t.publicShareLink}
            >
              {isShareCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />}
              <span className="hidden xl:inline">{isShareCopied ? (lang === 'en' ? 'Copied' : 'Đã sao chép') : t.publicShareLink}</span>
            </button>

            {/* Export / Download PDF if allowed */}
            {shareAllowDownload && (
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                title={t.publicDownloadPdf}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.publicDownloadPdf}</span>
              </button>
            )}

            {/* Contact Candidate CTA Button */}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
              title={t.publicContactBtn}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.publicContactBtn}</span>
            </button>
          </div>
        </header>
  );
}

export default RecruiterTopbar;
