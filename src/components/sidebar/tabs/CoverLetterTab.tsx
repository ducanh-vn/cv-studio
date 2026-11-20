'use client';

import React from 'react';
import {
  Sparkles,
  RefreshCw,
  Check,
  Copy,
  Building,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import type {
  Language,
} from '@/types/cvBuilder';
import {
  CoverLetterData,
  CoverLetterPreset,
  COVER_LETTER_PRESETS,
} from '@/lib/coverLetter';

export interface CoverLetterTabProps {
  lang: Language;
  t: any;
  currentCoverLetter: CoverLetterData;
  handleSyncCoverLetterWithCV: () => void;
  handleCopyCoverLetterText: () => void;
  isCoverLetterCopied: boolean;
  activeCoverLetterPresetId: string;
  handleApplyCoverLetterPreset: (preset: CoverLetterPreset) => void;
  handleUpdateCoverLetterField: (field: any, value: string) => void;
  setDocMode: (mode: 'cv' | 'cover_letter') => void;
  setActiveRailTab: (tab: any) => void;
}

export const CoverLetterTab: React.FC<CoverLetterTabProps> = ({
  lang,
  t,
  currentCoverLetter,
  handleSyncCoverLetterWithCV,
  handleCopyCoverLetterText,
  isCoverLetterCopied,
  activeCoverLetterPresetId,
  handleApplyCoverLetterPreset,
  handleUpdateCoverLetterField,
  setDocMode,
  setActiveRailTab,
}) => {
  return (
<div className="space-y-4">
                  {/* Matching Banner */}
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-white text-xs">
                        {lang === 'en' ? 'Synchronized Matching Design' : 'Đồng bộ thiết kế với CV'}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-[11px] leading-relaxed">
                      {t.coverLetterStudioSubtitle}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={handleSyncCoverLetterWithCV}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                        title={t.clSyncFromCvBtn}
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{t.clSyncFromCvBtn}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyCoverLetterText}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer"
                        title={t.clCopyTextBtn}
                      >
                        {isCoverLetterCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCoverLetterCopied ? (lang === 'en' ? 'Copied!' : 'Đã sao chép!') : t.clCopyTextBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* Preset Selector */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{t.clPresetsTitle}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">4 {lang === 'en' ? 'presets' : 'mẫu'}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {COVER_LETTER_PRESETS.map((preset) => {
                        const isSelected = activeCoverLetterPresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleApplyCoverLetterPreset(preset)}
                            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-xs'
                                : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs">
                                {lang === 'en' ? preset.titleEn : preset.titleVi}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                            </div>
                            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{preset.badge}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recipient & Company Details */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white text-xs">{t.clRecipientSection}</span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clRecipientName}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.recipientName}
                          onChange={(e) => handleUpdateCoverLetterField('recipientName', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clRecipientRole}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.recipientRole}
                          onChange={(e) => handleUpdateCoverLetterField('recipientRole', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clCompanyName}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.companyName}
                          onChange={(e) => handleUpdateCoverLetterField('companyName', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clCompanyAddress}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.companyAddress}
                          onChange={(e) => handleUpdateCoverLetterField('companyAddress', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clJobTitle}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.jobTitle}
                          onChange={(e) => handleUpdateCoverLetterField('jobTitle', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-cyan-300 font-semibold text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clDate}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.date}
                          onChange={(e) => handleUpdateCoverLetterField('date', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Letter Body Paragraphs */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-white text-xs">{t.clBodySection}</span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clSalutation}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.salutation}
                          onChange={(e) => handleUpdateCoverLetterField('salutation', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clOpening}</label>
                        <textarea
                          rows={3}
                          value={currentCoverLetter.opening}
                          onChange={(e) => handleUpdateCoverLetterField('opening', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg p-2.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clBody1}</label>
                        <textarea
                          rows={4}
                          value={currentCoverLetter.body1}
                          onChange={(e) => handleUpdateCoverLetterField('body1', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg p-2.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clBody2}</label>
                        <textarea
                          rows={4}
                          value={currentCoverLetter.body2}
                          onChange={(e) => handleUpdateCoverLetterField('body2', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg p-2.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clClosing}</label>
                        <textarea
                          rows={3}
                          value={currentCoverLetter.closing}
                          onChange={(e) => handleUpdateCoverLetterField('closing', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg p-2.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clSignOff}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.signOff}
                          onChange={(e) => handleUpdateCoverLetterField('signOff', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Switch Back to CV Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDocMode('cv');
                        setActiveRailTab('design');
                      }}
                      className="w-full py-2 px-3 rounded-lg border border-white/15 hover:bg-white/5 text-neutral-300 hover:text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t.clBackToCvBtn}</span>
                    </button>
                  </div>
                </div>
  );
};

export default CoverLetterTab;
