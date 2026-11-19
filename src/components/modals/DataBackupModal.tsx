'use client';

import React from 'react';
import {
  Database,
  FileDown,
  FileUp,
  Download,
  Copy,
  FileText,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import type { Language } from '@/types/cvBuilder';
import type { ImportPreviewResult } from '@/lib/cvBackup';
import { readJsonFile, parseImportJsonString } from '@/lib/cvBackup';

export interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Record<string, string>;
  dataModalTab: 'export' | 'import';
  setDataModalTab: (tab: 'export' | 'import') => void;
  importPreview: ImportPreviewResult | null;
  setImportPreview: (preview: ImportPreviewResult | null) => void;
  importErrorMsg: string | null;
  setImportErrorMsg: (msg: string | null) => void;
  jsonFileInputRef?: React.RefObject<HTMLInputElement>;
  onTriggerImportFile?: () => void;
  handleExportFullJSON: () => void;
  handleExportCurrentProfileJSON: () => void;
  handleCopyJSON: () => void;
  handleApplyImport: () => void;
  processImportFile?: (file: File) => void;
}

export function DataBackupModal({
  isOpen,
  onClose,
  lang,
  t,
  dataModalTab,
  setDataModalTab,
  importPreview,
  setImportPreview,
  importErrorMsg,
  setImportErrorMsg,
  jsonFileInputRef,
  onTriggerImportFile,
  handleExportFullJSON,
  handleExportCurrentProfileJSON,
  handleCopyJSON,
  handleApplyImport,
  processImportFile,
}: DataBackupModalProps) {
  if (!isOpen) return null;

  const [isDraggingFile, setIsDraggingFile] = React.useState(false);

  const handleProcessFile = async (file: File) => {
    if (processImportFile) {
      processImportFile(file);
      return;
    }
    try {
      const raw = await readJsonFile(file);
      const preview = parseImportJsonString(raw);
      setImportPreview(preview);
      setImportErrorMsg(null);
    } catch (err: any) {
      if (err.message === 'FILE_TYPE_INVALID') {
        setImportErrorMsg(lang === 'en' ? 'Please select a valid .json file.' : 'Vui lòng chọn tệp có định dạng .json');
      } else if (err.message === 'FILE_READ_ERROR') {
        setImportErrorMsg(lang === 'en' ? 'Failed to read file.' : 'Không thể đọc tệp đã chọn.');
      } else if (err.message === 'INVALID_CV_SCHEMA') {
        setImportErrorMsg(t.importInvalidMsg);
      } else {
        setImportErrorMsg(lang === 'en' ? `Failed to parse JSON file: ${err.message}` : `Lỗi đọc file JSON: ${err.message}`);
      }
    }
  };

  const triggerFileClick = () => {
    if (onTriggerImportFile) {
      onTriggerImportFile();
    } else if (jsonFileInputRef?.current) {
      jsonFileInputRef.current.click();
    }
  };

  return (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-neutral-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                    {t.dataModalTitle}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {t.dataModalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setImportPreview(null);
                  setImportErrorMsg(null);
                }}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="px-6 sm:px-8 py-2.5 bg-[#131316] border-b border-neutral-800 flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setDataModalTab('export')}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                  dataModalTab === 'export'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{t.exportTab}</span>
              </button>
              <button
                type="button"
                onClick={() => setDataModalTab('import')}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                  dataModalTab === 'import'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>{t.importTab}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs">
              {dataModalTab === 'export' && (
                <div className="space-y-4">
                  {/* Option 1: Full Bilingual Package */}
                  <div className="p-5 rounded-2xl bg-[#1f1f26] border border-neutral-700/80 hover:border-cyan-500/50 transition-all space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{t.exportFullBtn}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 font-bold">
                            {lang === 'en' ? 'RECOMMENDED' : 'KHUYÊN DÙNG'}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                          {t.exportFullHint}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportFullJSON}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.exportFullBtn}</span>
                    </button>
                  </div>

                  {/* Option 2: Current Profile */}
                  <div className="p-5 rounded-2xl bg-[#1f1f26] border border-neutral-700/80 space-y-3">
                    <div>
                      <span className="font-bold text-white text-sm">{t.exportCurrentBtn} ({lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'})</span>
                      <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                        {t.exportCurrentHint}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={handleExportCurrentProfileJSON}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-700 hover:border-cyan-500 text-neutral-200 hover:text-white flex items-center justify-center space-x-2 transition-all font-semibold"
                      >
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span>{lang === 'en' ? 'Download .json (' + lang.toUpperCase() + ')' : 'Tải file .json (' + lang.toUpperCase() + ')'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyJSON}
                        className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center space-x-2 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t.copyJsonBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {dataModalTab === 'import' && (
                <div className="space-y-4">
                  {/* Dropzone */}
                  <div
                    onClick={() => triggerFileClick()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      if (e.dataTransfer.files?.[0]) handleProcessFile(e.dataTransfer.files[0]);
                    }}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      isDraggingFile
                        ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                        : 'border-neutral-700 hover:border-cyan-500/80 bg-[#1f1f26]/60'
                    }`}
                  >
                    <FileUp className="w-10 h-10 mx-auto text-cyan-400 mb-2.5 animate-bounce" />
                    <p className="text-white font-semibold text-sm">{t.importDropzone}</p>
                    <p className="text-neutral-400 text-xs mt-1">{t.importDropzoneHint}</p>
                    <span className="inline-block mt-3 px-3.5 py-1.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-mono border border-neutral-700">
                      *.json
                    </span>
                  </div>

                  {/* Error Alert */}
                  {importErrorMsg && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{importErrorMsg}</span>
                    </div>
                  )}

                  {/* Preview & Apply Card */}
                  {importPreview && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 text-xs animate-in fade-in">
                      <div className="flex items-center justify-between text-emerald-400 font-bold text-sm">
                        <span>{t.previewTitle}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 uppercase font-mono font-bold">
                          {importPreview.type === 'full' ? 'Bilingual Package' : 'Single Profile'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-neutral-300 bg-black/20 p-3 rounded-xl border border-neutral-800">
                        <div>• {t.previewProfile}: <strong className="text-white">{importPreview.summary.name || 'CV'}</strong></div>
                        <div>• Chức danh: <strong className="text-white">{importPreview.summary.role}</strong></div>
                        <div>• {t.previewExp}: <strong className="text-white">{importPreview.summary.timelineCount} mục</strong></div>
                        <div>• {t.previewProjects}: <strong className="text-white">{importPreview.summary.projectsCount} dự án</strong></div>
                        <div>• {t.previewSkills}: <strong className="text-white">{importPreview.summary.skillsCount} kỹ năng</strong></div>
                        <div>• {t.previewEdu}: <strong className="text-white">{importPreview.summary.eduCount} mục</strong></div>
                      </div>
                      <div className="flex space-x-2.5 pt-1">
                        <button
                          type="button"
                          onClick={handleApplyImport}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          <span>{t.applyImportBtn}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImportPreview(null);
                            setImportErrorMsg(null);
                          }}
                          className="px-4 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-400 text-xs transition-colors"
                        >
                          {t.cancelImportBtn}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
  );
}

export default DataBackupModal;
