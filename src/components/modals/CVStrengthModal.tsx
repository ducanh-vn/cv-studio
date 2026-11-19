'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Target,
  X,
} from 'lucide-react';
import type { CVStrengthEvaluation } from '@/lib/cvStrength';
import type { CVData, Language } from '@/types/cvBuilder';

export interface CVStrengthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Record<string, string>;
  cv: CVData;
  cvStrength: CVStrengthEvaluation;
  onOpenTechModal?: () => void;
  onNavigateDrawer?: (tab: string) => void;
}

export function CVStrengthModal({
  isOpen,
  onClose,
  lang,
  t,
  cv,
  cvStrength,
  onOpenTechModal,
  onNavigateDrawer,
}: CVStrengthModalProps) {
  const [strengthFilter, setStrengthFilter] = useState<'all' | 'pending' | 'passed'>('all');

  if (!isOpen) return null;

  return (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-neutral-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-neutral-800 flex items-start justify-between bg-gradient-to-r from-emerald-950/20 via-neutral-900 to-cyan-950/20">
              <div className="flex items-start space-x-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-600/30 border border-emerald-500/40 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {t.strengthModalTitle}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 tracking-wider font-mono">
                      14 ATS BENCHMARKS
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                    {t.strengthModalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onClose()}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Rating Hero Card */}
            <div className="px-6 sm:px-8 py-5 bg-[#141417] border-b border-neutral-800">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 via-[#18181f] to-neutral-900 border border-neutral-800 shadow-md flex flex-col md:flex-row items-center gap-6">
                {/* Circular Score Gauge */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="text-neutral-800 stroke-current"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className={`stroke-current transition-all duration-1000 ease-out ${
                        cvStrength.score >= 90
                          ? 'text-emerald-400'
                          : cvStrength.score >= 75
                          ? 'text-cyan-400'
                          : cvStrength.score >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                      strokeWidth="8"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * Math.min(100, Math.max(0, cvStrength.score))) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                      {cvStrength.score}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono uppercase">
                      / 100 PTS
                    </span>
                  </div>
                </div>

                {/* Score Details & Diagnosis */}
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${cvStrength.ratingBg} ${cvStrength.ratingColor}`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? cvStrength.ratingEn : cvStrength.ratingVi}</span>
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      • {cvStrength.passedCount}/{cvStrength.totalCount} {t.strengthCriteriaPassed}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {lang === 'en' ? cvStrength.summaryEn : cvStrength.summaryVi}
                  </p>
                  {/* Category mini pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                    {cvStrength.categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between text-[11px]"
                      >
                        <span className="text-neutral-400 truncate pr-1">
                          {lang === 'en' ? cat.titleEn : cat.titleVi}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            cat.earned === cat.total ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {cat.earned}/{cat.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist Filter Tabs */}
            <div className="px-6 sm:px-8 py-3 bg-[#131316] border-b border-neutral-800 flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setStrengthFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  strengthFilter === 'all'
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                {t.strengthFilterAll} ({cvStrength.totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStrengthFilter('pending')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1.5 ${
                  strengthFilter === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <span>{t.strengthFilterPending}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-mono text-[10px]">
                  {cvStrength.totalCount - cvStrength.passedCount}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStrengthFilter('passed')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1.5 ${
                  strengthFilter === 'passed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <span>{t.strengthFilterPassed}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 font-mono text-[10px]">
                  {cvStrength.passedCount}
                </span>
              </button>
            </div>

            {/* Checklist Items Container */}
            <div className="px-6 sm:px-8 py-4 flex-1 overflow-y-auto space-y-3 max-h-[46vh]">
              {cvStrength.items
                .filter((item) => {
                  if (strengthFilter === 'pending') return !item.passed;
                  if (strengthFilter === 'passed') return item.passed;
                  return true;
                })
                .map((item) => {
                  const title = lang === 'en' ? item.titleEn : item.titleVi;
                  const desc = lang === 'en' ? item.descEn : item.descVi;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.passed
                          ? 'bg-neutral-900/60 border-neutral-800/80'
                          : 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5 shrink-0">
                          {item.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <h4
                              className={`text-xs sm:text-sm font-semibold ${
                                item.passed ? 'text-neutral-200' : 'text-amber-200 font-bold'
                              }`}
                            >
                              {title}
                            </h4>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                                item.passed
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {item.passed ? `+${item.points} pts` : `0/${item.points} pts`}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-relaxed max-w-2xl">
                            {desc}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 self-end sm:self-center">
                        {item.passed ? (
                          <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{lang === 'en' ? 'Verified' : 'Đạt chuẩn'}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (item.actionSpecial === 'openTechModal') {
                                onOpenTechModal?.();
                              } else if (item.actionTab) {
                                onNavigateDrawer?.(item.actionTab);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer"
                          >
                            <span>
                              {lang === 'en'
                                ? item.actionLabelEn || t.strengthFixBtn
                                : item.actionLabelVi || t.strengthFixBtn}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* ATS Golden Rules Banner */}
            <div className="px-6 sm:px-8 py-3 bg-[#111114] border-t border-neutral-800 text-[11px]">
              <div className="space-y-1 text-neutral-400">
                <span className="font-bold text-cyan-300 block text-xs">
                  {t.strengthAtsTipsTitle}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                  <p>{t.strengthAtsTip1}</p>
                  <p>{t.strengthAtsTip2}</p>
                  <p>{t.strengthAtsTip3}</p>
                  <p>{t.strengthAtsTip4}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-3.5 bg-[#131316] border-t border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400 text-[11px]">
                {lang === 'en'
                  ? '💡 Tip: Aim for 90+ points to maximize interview callback rates with tech recruiters.'
                  : '💡 Mẹo: Hãy hướng tới 90+ điểm để tối đa hóa tỷ lệ gọi phỏng vấn từ các công ty công nghệ.'}
              </span>
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
  );
}

export default CVStrengthModal;
