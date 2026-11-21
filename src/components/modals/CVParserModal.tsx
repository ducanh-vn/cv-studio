'use client';

import React from 'react';
import {
  FileUp,
  FileText,
  Upload,
  Sparkles,
  AlertCircle,
  Check,
  Loader2,
  X,
} from 'lucide-react';
import { ParsedCVResult, SAMPLE_CV_TEXTS } from '@/lib/cvParser';
import type { Language } from '@/types/cvBuilder';

export interface CVParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Record<string, string>;
  importTab: 'upload' | 'paste' | 'sample';
  setImportTab: (tab: 'upload' | 'paste' | 'sample') => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  importRawText: string;
  setImportRawText: (text: string) => void;
  isParsingCV: boolean;
  parseError: string | null;
  setParseError: (err: string | null) => void;
  parsedResult: ParsedCVResult | null;
  setParsedResult: (res: ParsedCVResult | null) => void;
  importPreviewTab: 'profile' | 'skills' | 'timeline' | 'projects' | 'education';
  setImportPreviewTab: (tab: 'profile' | 'skills' | 'timeline' | 'projects' | 'education') => void;
  cvFileInputRef: React.RefObject<HTMLInputElement>;
  handleParseFile: (file: File) => Promise<void>;
  handleParseRawText: (text: string, title?: string) => Promise<void>;
  handleApplyImportedCV: (mode: 'new_profile' | 'overwrite_current') => void;
}

export function CVParserModal({
  isOpen,
  onClose,
  lang,
  t,
  importTab,
  setImportTab,
  importFile,
  setImportFile,
  importRawText,
  setImportRawText,
  isParsingCV,
  parseError,
  setParseError,
  parsedResult,
  setParsedResult,
  importPreviewTab,
  setImportPreviewTab,
  cvFileInputRef,
  handleParseFile,
  handleParseRawText,
  handleApplyImportedCV,
}: CVParserModalProps) {
  if (!isOpen) return null;

  return (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#141822] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-4xl h-[92vh] max-h-[92vh] md:h-[86vh] md:max-h-[86vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 sm:px-7 py-3.5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/30 via-[#141822] to-cyan-950/30 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-blue-600/30 border border-emerald-500/40 text-emerald-400 shrink-0">
                  <FileUp className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {t.cvParserTitle}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[9px] font-bold text-emerald-300 tracking-wider font-mono">
                      PDF • DOCX • TEXT
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">
                    {t.cvParserSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setParsedResult(null);
                  setParseError(null);
                }}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={cvFileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.json,.md"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleParseFile(file);
                }
                e.target.value = '';
              }}
            />

            {/* Modal Body */}
            {!parsedResult ? (
              /* STEP 1: UPLOAD / PASTE / SAMPLE INPUT SCREEN */
              <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-4">
                {/* Method Tabs */}
                <div className="flex items-center space-x-2 bg-[#090C13] border border-white/10 rounded-xl p-1 text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setImportTab('upload');
                      setParseError(null);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      importTab === 'upload'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t.cvParserTabUpload}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportTab('paste');
                      setParseError(null);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      importTab === 'paste'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.cvParserTabPaste}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportTab('sample');
                      setParseError(null);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      importTab === 'sample'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.cvParserTabSample}</span>
                  </button>
                </div>

                {/* Error Banner */}
                {parseError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{parseError}</span>
                  </div>
                )}

                {/* Loading State */}
                {isParsingCV && (
                  <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-[#0B0F19] rounded-2xl border border-white/5">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    <span className="text-sm font-semibold text-white">{t.cvParserParsingStatus}</span>
                    <span className="text-xs text-neutral-400">
                      {lang === 'en'
                        ? 'Analyzing text sections, extracting technical skills & experience...'
                        : 'Đang bóc tách thông tin liên hệ, kinh nghiệm, kỹ năng và học vấn...'}
                    </span>
                  </div>
                )}

                {!isParsingCV && importTab === 'upload' && (
                  <div
                    onClick={() => cvFileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleParseFile(file);
                    }}
                    className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group space-y-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-transform group-hover:scale-105">
                      <FileUp className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        {t.cvParserDropzoneText}
                      </h4>
                      <p className="text-xs text-neutral-400 max-w-md">
                        {t.cvParserDropzoneHint}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 flex-wrap justify-center">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10 font-mono">
                        .PDF
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10 font-mono">
                        .DOCX
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10 font-mono">
                        .TXT
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10 font-mono">
                        .JSON
                      </span>
                    </div>
                  </div>
                )}

                {!isParsingCV && importTab === 'paste' && (
                  <div className="flex-1 flex flex-col space-y-3 min-h-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">{t.cvParserPastePrompt}</span>
                      <span className="text-neutral-500 font-mono text-[11px]">
                        {importRawText.trim() ? importRawText.trim().split(/\s+/).filter(Boolean).length : 0} {lang === 'en' ? 'words' : 'từ'}
                      </span>
                    </div>
                    <textarea
                      value={importRawText}
                      onChange={(e) => setImportRawText(e.target.value)}
                      placeholder={
                        lang === 'en'
                          ? 'Paste your raw CV text here (Summary, Skills, Experience, Education...)'
                          : 'Dán toàn bộ văn bản CV của bạn vào đây (Họ tên, Thông tin liên hệ, Tóm tắt, Kỹ năng, Kinh nghiệm làm việc, Dự án, Học vấn)...'
                      }
                      className="flex-1 min-h-[220px] w-full bg-[#080B11] border border-white/10 rounded-xl p-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/60 font-mono leading-relaxed resize-none overflow-y-auto"
                    />
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleParseRawText(importRawText, lang === 'en' ? 'Pasted Text' : 'Văn bản đã dán')}
                        disabled={!importRawText.trim() || importRawText.trim().length < 20}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Parse & Extract CV →' : 'Trích xuất & Bóc tách CV →'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {!isParsingCV && importTab === 'sample' && (
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-400">
                      {lang === 'en'
                        ? 'Select a realistic pre-configured CV to test the parsing and extraction engine instantly:'
                        : 'Chọn một mẫu CV thực tế dưới đây để thử nghiệm ngay khả năng trích xuất thông tin tự động:'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SAMPLE_CV_TEXTS.map((sample) => (
                        <div
                          key={sample.id}
                          className="p-4 rounded-xl bg-[#0F1420] border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                                {sample.badge}
                              </span>
                            </div>
                            <h5 className="font-bold text-white text-xs sm:text-sm">
                              {lang === 'en' ? sample.titleEn : sample.title}
                            </h5>
                            <p className="text-[11px] text-neutral-400 line-clamp-3 font-mono leading-relaxed">
                              {sample.text.slice(0, 150)}...
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleParseRawText(sample.text, sample.title)}
                            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{lang === 'en' ? 'Load & Parse This Sample →' : 'Thử nghiệm mẫu này ngay →'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* STEP 2: EXTRACTION PREVIEW & APPLY SCREEN */
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                {/* Extraction Stats Header Banner */}
                <div className="p-4 sm:p-5 pb-3 border-b border-white/10 bg-[#101420] shrink-0 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">
                            {t.cvParserSuccessBadge}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                            {parsedResult.detectedLang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                            {parsedResult.confidenceScore}% {lang === 'en' ? 'confidence' : 'độ tin cậy'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5 truncate max-w-md">
                          {parsedResult.fileName || (lang === 'en' ? 'Pasted Text' : 'Văn bản đã dán')}
                        </p>
                      </div>
                    </div>

                    {/* Stats Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                        ⚡ <strong>{parsedResult.stats.skillsCount}</strong> {lang === 'en' ? 'skills' : 'kỹ năng'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                        💼 <strong>{parsedResult.stats.experienceCount}</strong> {lang === 'en' ? 'jobs' : 'kinh nghiệm'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                        🚀 <strong>{parsedResult.stats.projectsCount}</strong> {lang === 'en' ? 'projects' : 'dự án'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                        🎓 <strong>{parsedResult.stats.educationCount}</strong> {lang === 'en' ? 'education' : 'học vấn'}
                      </span>
                    </div>
                  </div>

                  {/* Preview Navigation Tabs */}
                  <div className="flex items-center space-x-1.5 bg-[#090C13] border border-white/10 rounded-xl p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setImportPreviewTab('profile')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        importPreviewTab === 'profile'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      👤 {lang === 'en' ? 'Profile & Contact' : 'Hồ sơ & Liên hệ'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportPreviewTab('skills')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        importPreviewTab === 'skills'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      ⚡ {lang === 'en' ? 'Skills' : 'Kỹ năng'} ({parsedResult.cv.skills.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportPreviewTab('timeline')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        importPreviewTab === 'timeline'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      💼 {lang === 'en' ? 'Experience' : 'Kinh nghiệm'} ({parsedResult.cv.timeline.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportPreviewTab('projects')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        importPreviewTab === 'projects'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      🚀 {lang === 'en' ? 'Projects' : 'Dự án'} ({parsedResult.cv.projects.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportPreviewTab('education')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        importPreviewTab === 'education'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      🎓 {lang === 'en' ? 'Education' : 'Học vấn'} ({parsedResult.cv.education.length})
                    </button>
                  </div>
                </div>

                {/* Preview Content Tab Body */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#0D111A]">
                  {/* Tab Profile */}
                  {importPreviewTab === 'profile' && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-[#141A26] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                            {lang === 'en' ? 'Basic Information' : 'Thông tin cá nhân'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-neutral-500">{lang === 'en' ? 'Full Name:' : 'Họ và tên:'}</span>
                            <div className="font-bold text-white text-sm">{parsedResult.cv.name}</div>
                          </div>
                          <div>
                            <span className="text-neutral-500">{lang === 'en' ? 'Target Role:' : 'Vị trí công việc:'}</span>
                            <div className="font-semibold text-cyan-300">{parsedResult.cv.role}</div>
                          </div>
                          <div>
                            <span className="text-neutral-500">Email:</span>
                            <div className="text-neutral-200 font-mono">{parsedResult.cv.email}</div>
                          </div>
                          <div>
                            <span className="text-neutral-500">{lang === 'en' ? 'Phone:' : 'Số điện thoại:'}</span>
                            <div className="text-neutral-200 font-mono">{parsedResult.cv.phone}</div>
                          </div>
                          <div>
                            <span className="text-neutral-500">{lang === 'en' ? 'Location:' : 'Địa chỉ:'}</span>
                            <div className="text-neutral-200">{parsedResult.cv.location}</div>
                          </div>
                          <div>
                            <span className="text-neutral-500">GitHub:</span>
                            <div className="text-neutral-200 font-mono truncate">{parsedResult.cv.github}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#141A26] border border-white/10 space-y-1.5">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                          {lang === 'en' ? 'Professional Summary' : 'Tóm tắt sự nghiệp'}
                        </span>
                        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                          {parsedResult.cv.summary}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab Skills */}
                  {importPreviewTab === 'skills' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">
                          {lang === 'en'
                            ? `Extracted ${parsedResult.cv.skills.length} technical skills:`
                            : `Đã phát hiện ${parsedResult.cv.skills.length} kỹ năng công nghệ:`}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 p-3.5 rounded-xl bg-[#141A26] border border-white/10">
                        {parsedResult.cv.skills.map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab Timeline */}
                  {importPreviewTab === 'timeline' && (
                    <div className="space-y-3">
                      {parsedResult.cv.timeline.map((item: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#141A26] border border-white/10 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-white text-xs sm:text-sm">{item.role}</div>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 shrink-0">
                              {item.period}
                            </span>
                          </div>
                          {item.desc && (
                            <p className="text-xs text-neutral-400 whitespace-pre-line leading-relaxed">
                              {item.desc}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab Projects */}
                  {importPreviewTab === 'projects' && (
                    <div className="space-y-3">
                      {parsedResult.cv.projects.length === 0 ? (
                        <div className="text-center py-8 text-neutral-500 text-xs">
                          {lang === 'en' ? 'No specific project section detected.' : 'Chưa phát hiện mục dự án riêng biệt.'}
                        </div>
                      ) : (
                        parsedResult.cv.projects.map((proj: any, idx: number) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-[#141A26] border border-white/10 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-bold text-white text-xs sm:text-sm">{proj.title}</div>
                                <div className="text-xs text-cyan-300 font-medium">{proj.category}</div>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 shrink-0">
                                {proj.year}
                              </span>
                            </div>
                            {proj.desc && (
                              <p className="text-xs text-neutral-400 whitespace-pre-line leading-relaxed">
                                {proj.desc}
                              </p>
                            )}
                            {(proj.liveDemo || proj.github) && (
                              <div className="text-[11px] text-cyan-400 truncate font-mono">
                                🔗 {proj.liveDemo || proj.github}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Tab Education */}
                  {importPreviewTab === 'education' && (
                    <div className="space-y-3">
                      {parsedResult.cv.education.map((edu: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#141A26] border border-white/10 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-white text-xs sm:text-sm">{edu.school}</div>
                              <div className="text-xs text-cyan-300 font-medium">{edu.degree}</div>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 shrink-0">
                              {edu.year}
                            </span>
                          </div>
                          {edu.desc && (
                            <p className="text-xs text-neutral-400 leading-relaxed">{edu.desc}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Extraction Actions Footer */}
                <div className="p-3.5 sm:p-4 bg-[#090C13] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setParsedResult(null);
                      setParseError(null);
                    }}
                    className="px-3 py-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {t.cvParserReuploadBtn}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleApplyImportedCV('overwrite_current')}
                      className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      {t.cvParserApplyCurrentBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyImportedCV('new_profile')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{t.cvParserCreateNewProfileBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 Footer */}
            {!parsedResult && (
              <div className="px-5 sm:px-7 py-2.5 bg-[#0E121B] border-t border-white/10 flex items-center justify-between text-xs shrink-0">
                <span className="text-neutral-400 text-[11px] line-clamp-1 mr-2">
                  {lang === 'en'
                    ? '💡 Privacy first: All file parsing is processed locally on your server and stays 100% private.'
                    : '💡 Bảo mật tuyệt đối: Mọi tài liệu CV tải lên được xử lý nội bộ và không chia sẻ ra bên ngoài.'}
                </span>
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors cursor-pointer shrink-0"
                >
                  {lang === 'en' ? 'Close' : 'Đóng'}
                </button>
              </div>
            )}
          </div>
        </div>
  );
}

export default CVParserModal;
