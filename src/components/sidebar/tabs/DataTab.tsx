'use client';

import React from 'react';
import {
  Layers,
  Copy,
  Trash2,
  Plus,
  FileDown,
  Download,
  FileText,
  FileUp,
  Sparkles,
  Upload,
  Check,
  RotateCcw,
} from 'lucide-react';
import type {
  Language,
} from '@/types/cvBuilder';
import { CVProfile } from '@/lib/cvProfiles';

export interface DataTabProps {
  lang: Language;
  t: any;
  profiles: CVProfile[];
  activeProfileId: string;
  handleSwitchProfile: (id: string) => void;
  handleDuplicateProfile: (id: string) => void;
  handleDeleteProfile: (id: string) => void;
  setShowNewProfileModal: (show: boolean) => void;
  handleExportFullJSON: () => void;
  handleExportCurrentProfileJSON: () => void;
  handleCopyJSON: () => void;
  setShowImportModal: (show: boolean) => void;
  setParsedResult?: (res: any) => void;
  setParseError?: (err: any) => void;
  jsonFileInputRef: React.RefObject<HTMLInputElement>;
  importPreview: any;
  setImportPreview: (preview: any) => void;
  importErrorMsg: string | null;
  setImportErrorMsg: (msg: string | null) => void;
  handleApplyImport: () => void;
  handleReset: () => void;
}

export const DataTab: React.FC<DataTabProps> = ({
  lang,
  t,
  profiles,
  activeProfileId,
  handleSwitchProfile,
  handleDuplicateProfile,
  handleDeleteProfile,
  setShowNewProfileModal,
  handleExportFullJSON,
  handleExportCurrentProfileJSON,
  handleCopyJSON,
  setShowImportModal,
  setParsedResult,
  setParseError,
  jsonFileInputRef,
  importPreview,
  setImportPreview,
  importErrorMsg,
  setImportErrorMsg,
  handleApplyImport,
  handleReset,
}) => {
  return (
<div className="space-y-5">
                  {/* CV Profiles Manager Section */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white text-xs">
                          {lang === 'en' ? 'CV PROFILES & VERSIONS' : 'CÁC PHIÊN BẢN CV (PROFILES)'}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono">
                        {profiles.length} phiên bản
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {lang === 'en'
                        ? 'Manage multiple CV variations tailored for specific job roles (Frontend, Fullstack, Lead, Remote).'
                        : 'Tạo nhiều biến thể CV khác nhau phù hợp với từng vị trí ứng tuyển (Frontend, Fullstack, Quản lý, Remote).'}
                    </p>

                    {/* Profiles List */}
                    <div className="space-y-2 pt-1">
                      {profiles.map((p) => {
                        const isActive = p.id === activeProfileId;
                        return (
                          <div
                            key={p.id}
                            className={`p-2.5 rounded-lg border transition-all ${
                              isActive
                                ? 'bg-cyan-950/30 border-cyan-500/40 text-white'
                                : 'bg-[#161B26] border-white/5 hover:border-white/15 text-neutral-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-xs text-white truncate">{p.name}</span>
                                  {isActive && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                                      Đang mở
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-neutral-400 mt-0.5">
                                  {p.targetRole || 'Software Engineer'} • Mẫu: <span className="text-neutral-200 capitalize">{p.template}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-1 shrink-0">
                                {!isActive && (
                                  <button
                                    type="button"
                                    onClick={() => handleSwitchProfile(p.id)}
                                    className="px-2 py-1 rounded bg-white/10 hover:bg-cyan-600 text-white text-[10px] font-medium transition-colors cursor-pointer"
                                  >
                                    Mở bản này
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateProfile(p.id)}
                                  className="p-1 rounded text-neutral-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
                                  title="Nhân bản"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                {profiles.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProfile(p.id);
                                    }}
                                    className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => setShowNewProfileModal(true)}
                        className="w-full py-2 px-3 rounded-lg border border-dashed border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white flex items-center justify-center space-x-1.5 transition-all text-xs cursor-pointer bg-cyan-500/5 hover:bg-cyan-500/10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? '+ Create New Profile' : '+ Thêm phiên bản CV mới'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Export Section */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center space-x-2">
                      <FileDown className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white text-xs">{t.exportSectionTitle}</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {t.exportSectionDesc}
                    </p>
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={handleExportFullJSON}
                        className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-95 text-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.exportFullBtn}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleExportCurrentProfileJSON}
                        className="w-full py-1.5 px-3 rounded-lg border border-white/10 hover:border-cyan-500 text-neutral-300 hover:text-white flex items-center justify-center space-x-2 transition-all text-xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t.exportCurrentBtn} ({lang.toUpperCase()})</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyJSON}
                        className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-cyan-300" />
                        <span>{t.copyJsonBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* CV Parser / PDF & Doc Import Section */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/20 via-[#111827] to-cyan-950/20 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <FileUp className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white text-xs">{t.cvParserDrawerCardTitle}</span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                        AI EXTRACT
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {lang === 'en'
                        ? 'Upload an existing CV (.pdf, .docx, .txt) or paste text to automatically extract contact, skills, experience, and projects.'
                        : 'Tải lên file CV có sẵn (.pdf, .docx, .txt) hoặc dán văn bản để hệ thống tự động bóc tách thông tin điền vào CV.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowImportModal(true);
                        setParsedResult?.(null);
                        setParseError?.(null);
                      }}
                      className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-95 text-xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                      <span>{t.cvParserDrawerBtn}</span>
                    </button>
                  </div>

                  {/* Import Section */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center space-x-2">
                      <FileUp className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white text-xs">{t.importSectionTitle}</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {t.importSectionDesc}
                    </p>
                    <button
                      type="button"
                      onClick={() => jsonFileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-lg border-2 border-dashed border-white/20 hover:border-cyan-400 text-neutral-300 hover:text-white flex items-center justify-center space-x-2 transition-all text-xs cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>{lang === 'en' ? 'Upload JSON File' : 'Tải lên file JSON'}</span>
                    </button>

                    {/* Import Preview Card if file selected */}
                    {importPreview && (
                      <div className="p-3 rounded-lg bg-neutral-900 border border-emerald-500/40 space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400 text-xs">File hợp lệ</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                            {importPreview.type === 'full' ? 'Full Package' : 'Single Profile'}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-300 space-y-0.5">
                          <div>• {importPreview.summary.name || 'CV'} ({importPreview.summary.role})</div>
                          <div>• Kinh nghiệm: {importPreview.summary.timelineCount} | Dự án: {importPreview.summary.projectsCount}</div>
                        </div>
                        <div className="flex space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={handleApplyImport}
                            className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Áp dụng</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setImportPreview(null); setImportErrorMsg(null); }}
                            className="px-2.5 py-1 rounded border border-white/10 hover:bg-white/5 text-neutral-400 text-xs cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reset Section */}
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={handleReset}
                      className="w-full py-2 px-3 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.reset}</span>
                    </button>
                  </div>
                </div>
  );
};

export default DataTab;
