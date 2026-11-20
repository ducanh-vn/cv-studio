'use client';

import React from 'react';
import {
  Gauge,
  Target,
  Check,
  AlertTriangle,
  Wand2,
  Sparkles,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import type {
  Language,
} from '@/types/cvBuilder';
import {
  SAMPLE_JDS,
  SampleJD,
  JDMatchResult,
} from '@/lib/jdMatcher';
import { CVStrengthEvaluation } from '@/lib/cvStrength';

export interface AiAtsTabProps {
  lang: Language;
  t: any;
  cvStrength: CVStrengthEvaluation;
  setShowStrengthModal: (show: boolean) => void;
  jdMatchResult: JDMatchResult;
  setShowJDModal: (show: boolean) => void;
  selectedSampleJdId?: string | null;
  handleSelectSampleJD: (sample: SampleJD) => void;
  techLintReport: any;
  setShowTechLinterModal: (show: boolean) => void;
  handleFixAllTechIssues: () => void;
  handleOpenTechModal: (target?: any) => void;
  setDrawerTab: (tab: any) => void;
  setActiveRailTab: (tab: any) => void;
  setIsDrawerOpen: (open: boolean) => void;
}

export const AiAtsTab: React.FC<AiAtsTabProps> = ({
  lang,
  t,
  cvStrength,
  setShowStrengthModal,
  jdMatchResult,
  setShowJDModal,
  selectedSampleJdId,
  handleSelectSampleJD,
  techLintReport,
  setShowTechLinterModal,
  handleFixAllTechIssues,
  handleOpenTechModal,
  setDrawerTab,
  setActiveRailTab,
  setIsDrawerOpen,
}) => {
  return (
<div className="space-y-5">
                  {/* ATS Score Card */}
                  <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gauge className={`w-4 h-4 ${cvStrength.score >= 90 ? 'text-emerald-400' : cvStrength.score >= 75 ? 'text-cyan-400' : cvStrength.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`} />
                        <span className="font-bold text-white text-xs">
                          {lang === 'en' ? 'ATS Score Benchmark' : 'Thước đo Chuẩn ATS'}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cvStrength.ratingBg} ${cvStrength.ratingColor}`}>
                        {lang === 'en' ? cvStrength.ratingEn : cvStrength.ratingVi}
                      </span>
                    </div>

                    {/* Progress Bar & Big Score */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold font-mono text-white">{cvStrength.score}%</span>
                        <span className="text-[11px] text-neutral-400">
                          {cvStrength.passedCount}/{cvStrength.totalCount} {lang === 'en' ? 'criteria passed' : 'tiêu chuẩn đạt'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            cvStrength.score >= 90
                              ? 'bg-emerald-500'
                              : cvStrength.score >= 75
                              ? 'bg-cyan-500'
                              : cvStrength.score >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${cvStrength.score}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {lang === 'en' ? cvStrength.summaryEn : cvStrength.summaryVi}
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowStrengthModal(true)}
                      className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{lang === 'en' ? 'View 14 ATS Benchmarks →' : 'Xem chi tiết 14 tiêu chuẩn ATS →'}</span>
                    </button>
                  </div>

                  {/* JD Matcher Card in Drawer */}
                  <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-white text-xs">
                          {t.jdMatcherDrawerCardTitle}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${jdMatchResult.ratingBg} ${jdMatchResult.ratingColor}`}>
                        {lang === 'en' ? jdMatchResult.ratingEn : jdMatchResult.ratingVi}
                      </span>
                    </div>

                    {/* Progress Bar & Match Score */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold font-mono text-white">{jdMatchResult.matchScore}%</span>
                        <span className="text-[11px] text-neutral-400">
                          {jdMatchResult.matchedCount}/{jdMatchResult.totalJDKeywords} {lang === 'en' ? 'keywords matched' : 'từ khóa khớp'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            jdMatchResult.matchScore >= 80
                              ? 'bg-emerald-500'
                              : jdMatchResult.matchScore >= 65
                              ? 'bg-cyan-500'
                              : jdMatchResult.matchScore >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${jdMatchResult.matchScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Keyword Quick Counts */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                        <span className="flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{t.jdKeywordsMatched}:</span>
                        </span>
                        <strong className="font-mono font-bold">{jdMatchResult.matchedCount}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between">
                        <span className="flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>{t.jdKeywordsMissing}:</span>
                        </span>
                        <strong className="font-mono font-bold">{jdMatchResult.missingCount}</strong>
                      </div>
                    </div>

                    {/* Quick Sample JD Pills */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                        {t.jdSamplePrompt}
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {SAMPLE_JDS.slice(0, 4).map((sample) => (
                          <button
                            key={sample.id}
                            type="button"
                            onClick={() => handleSelectSampleJD(sample)}
                            className={`px-2 py-1.5 rounded-lg text-[10px] text-left transition-all border truncate cursor-pointer ${
                              selectedSampleJdId === sample.id
                                ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 font-semibold'
                                : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
                            }`}
                            title={lang === 'en' ? sample.titleEn : sample.titleVi}
                          >
                            {sample.id === 'frontend-sr' && '🚀 Frontend'}
                            {sample.id === 'backend-sr' && '⚙️ Backend'}
                            {sample.id === 'devops-cloud' && '☁️ DevOps'}
                            {sample.id === 'ai-software' && '🤖 AI Engineer'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowJDModal(true)}
                      className="w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t.jdMatcherDrawerBtn}</span>
                    </button>
                  </div>

                  {/* Tech Linter Card in Drawer */}
                  <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wand2 className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-white text-xs">
                          {lang === 'en' ? 'Tech Nomenclature Linter' : 'Chuẩn Hóa Danh Pháp Tech'}
                        </span>
                      </div>
                      {techLintReport.totalIssuesCount > 0 ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-500/15 border-amber-500/30 text-amber-300 font-mono">
                          {techLintReport.totalIssuesCount} {t.techLinterIssuesFound}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-emerald-500/15 border-emerald-500/30 text-emerald-300">
                          {t.techLinterCleanBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {lang === 'en'
                        ? 'Auto-scan & fix casing for 120+ technologies (Node.js, TypeScript, Next.js, GitHub, RESTful API...).'
                        : 'Quét và sửa lỗi viết hoa/thường 120+ công nghệ theo đúng quy chuẩn thương hiệu quốc tế.'}
                    </p>

                    {/* Primary Button to Open Tech Linter */}
                    <button
                      type="button"
                      onClick={() => setShowTechLinterModal(true)}
                      className="w-full py-2 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>{lang === 'en' ? 'Open Tech Linter Studio' : 'Mở Studio Chuẩn Hóa Tech Linter'}</span>
                      {techLintReport.totalIssuesCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-bold font-mono ml-1">
                          {techLintReport.totalIssuesCount}
                        </span>
                      )}
                    </button>

                    {techLintReport.totalIssuesCount > 0 && (
                      <div className="space-y-2 pt-1 border-t border-white/5">
                        <div className="flex flex-wrap gap-1.5">
                          {techLintReport.issues.slice(0, 3).map((issue: any) => (
                            <span key={issue.id} className="text-[10px] px-2 py-1 rounded bg-neutral-800 text-neutral-300 border border-white/5 flex items-center space-x-1">
                              <span className="line-through text-rose-400">{issue.original}</span>
                              <span className="text-neutral-500">➔</span>
                              <span className="text-emerald-400 font-semibold">{issue.replacement}</span>
                            </span>
                          ))}
                          {techLintReport.totalIssuesCount > 3 && (
                            <span className="text-[10px] px-1.5 py-1 text-neutral-500">+{techLintReport.totalIssuesCount - 3} nữa</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleFixAllTechIssues}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer shadow-sm"
                        >
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span className="truncate">{t.techLinterFixAll} ({techLintReport.totalIssuesCount})</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Big AI Suggestion Button - NEVER CLIPPED */}
                  <div className="space-y-2">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'AI WRITING ASSISTANT' : 'GỢI Ý NỘI DUNG CHUẨN KỸ THUẬT'}
                    </span>
                    <button
                      onClick={() => handleOpenTechModal()}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-600/25 hover:from-amber-500/35 hover:to-orange-500/35 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
                      <span className="font-bold">
                        {lang === 'en' ? 'AI Tech Bullet Points (Google XYZ)' : 'Gợi ý mô tả tối ưu bằng AI (Google XYZ)'}
                      </span>
                    </button>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {lang === 'en'
                        ? 'Browse 24+ high-impact bullet templates using Google formula: Accomplished [X], as measured by [Y], by doing [Z].'
                        : 'Kho 24+ mẫu mô tả kỹ thuật chuẩn Google XYZ: Đạt được [X], đo lường bằng [Y], thông qua thực hiện [Z].'}
                    </p>
                  </div>

                  {/* Top Quick Fixes */}
                  {cvStrength.items.filter((b) => !b.passed).length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-white/10">
                      <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                        {lang === 'en' ? 'CRITICAL SUGGESTIONS' : 'ĐỀ XUẤT CẦN TỐI ƯU NGAY'}
                      </span>
                      <div className="space-y-2">
                        {cvStrength.items
                          .filter((b) => !b.passed)
                          .slice(0, 3)
                          .map((b) => (
                            <div key={b.id} className="p-2.5 rounded-lg bg-[#111827] border border-white/5 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-neutral-200 text-xs truncate max-w-[200px]">
                                  {lang === 'en' ? b.titleEn : b.titleVi}
                                </span>
                                <span className="text-[10px] font-bold text-amber-400 font-mono">+{b.points} pts</span>
                              </div>
                              <p className="text-[10px] text-neutral-400 line-clamp-2">
                                {lang === 'en' ? b.descEn : b.descVi}
                              </p>
                              {b.actionTab && (
                                <button
                                  onClick={() => {
                                    setDrawerTab(b.actionTab as any);
                                    setActiveRailTab('content');
                                    setIsDrawerOpen(true);
                                  }}
                                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 cursor-pointer"
                                >
                                  <span>{lang === 'en' ? 'Fix in form →' : 'Mở form sửa ngay →'}</span>
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
  );
};

export default AiAtsTab;
