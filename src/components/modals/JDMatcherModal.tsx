'use client';

import React from 'react';
import {
  Target,
  Check,
  Copy,
  Plus,
  Search,
  RotateCcw,
  FileText,
  AlertTriangle,
  X,
} from 'lucide-react';
import {
  SAMPLE_JDS,
  type SampleJD,
  type JDMatchResult,
} from '@/lib/jdMatcher';
import { TECH_CATEGORY_META } from '@/lib/jdMatcher';
import type { CVData, Language } from '@/types/cvBuilder';

export interface JDMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Record<string, string>;
  cv: CVData;
  jdInputText: string;
  setJdInputText: (text: string) => void;
  selectedSampleJdId?: string | null;
  setSelectedSampleJdId?: (id: string | null) => void;
  jdMatchResult: JDMatchResult;
  jdFilter: 'all' | 'missing' | 'matched';
  setJdFilter: (filter: 'all' | 'missing' | 'matched') => void;
  handleSelectSampleJD: (sample: SampleJD) => void;
  handleAddKeywordToSkills: (keywordName: string) => void;
  handleCopyKeyword: (keywordName: string) => void;
  copiedKeyword?: string | null;
  addedSkillKeyword?: string | null;
}

export function JDMatcherModal({
  isOpen,
  onClose,
  lang,
  t,
  cv,
  jdInputText,
  setJdInputText,
  selectedSampleJdId,
  setSelectedSampleJdId,
  jdMatchResult,
  jdFilter,
  setJdFilter,
  handleSelectSampleJD,
  handleAddKeywordToSkills,
  handleCopyKeyword,
  copiedKeyword,
  addedSkillKeyword,
}: JDMatcherModalProps) {
  if (!isOpen) return null;

  return (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#141822] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-5xl h-[92vh] max-h-[92vh] md:h-[88vh] md:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 sm:px-7 py-3 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/30 via-[#141822] to-cyan-950/30 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 via-cyan-500/15 to-blue-600/30 border border-indigo-500/40 text-cyan-400 shrink-0">
                  <Target className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {t.jdMatcherTitle}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[9px] font-bold text-indigo-300 tracking-wider font-mono">
                      ATS KEYWORD GAP
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">
                    {t.jdMatcherSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onClose()}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Sample JD Presets Bar */}
            <div className="px-5 sm:px-7 py-2 bg-[#0B0E17] border-b border-white/10 flex items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-neutral-400 text-[11px] font-medium shrink-0">
                  {t.jdSamplePrompt}
                </span>
                {SAMPLE_JDS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSampleJD(sample)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                      selectedSampleJdId === sample.id
                        ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 font-semibold shadow-xs'
                        : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    <span>
                      {sample.id === 'frontend-sr' && '🚀'}
                      {sample.id === 'backend-sr' && '⚙️'}
                      {sample.id === 'devops-cloud' && '☁️'}
                      {sample.id === 'ai-software' && '🤖'}
                    </span>
                    <span>
                      {sample.id === 'frontend-sr' && (lang === 'en' ? 'Frontend (React/Next)' : 'Frontend (React/Next)')}
                      {sample.id === 'backend-sr' && (lang === 'en' ? 'Backend (Node/Go)' : 'Backend (Node/Go)')}
                      {sample.id === 'devops-cloud' && (lang === 'en' ? 'DevOps (AWS/K8s)' : 'DevOps (AWS/K8s)')}
                      {sample.id === 'ai-software' && (lang === 'en' ? 'AI Engineer (Python/RAG)' : 'AI Engineer (Python/RAG)')}
                    </span>
                  </button>
                ))}
              </div>
              {jdInputText && (
                <button
                  type="button"
                  onClick={() => {
                    setJdInputText('');
                    setSelectedSampleJdId?.(null);
                  }}
                  className="px-2 py-1 rounded-lg text-[11px] text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.jdClearBtn}</span>
                </button>
              )}
            </div>

            {/* Main Interactive 2-Column Workspace */}
            <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden flex flex-col md:grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {/* Left Column: Job Description Textarea */}
              <div className="md:col-span-5 flex flex-col p-4 sm:p-5 bg-[#0E121B] shrink-0 md:shrink md:h-full min-h-0 space-y-2.5">
                <div className="flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold text-white">{t.jdInputLabel}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-neutral-400 text-[11px]">
                    <span>
                      {jdInputText.trim() ? jdInputText.trim().split(/\s+/).filter(Boolean).length : 0} {lang === 'en' ? 'words' : 'từ'}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          if (navigator.clipboard) {
                            const text = await navigator.clipboard.readText();
                            if (text) {
                              setJdInputText(text);
                              setSelectedSampleJdId?.(null);
                            }
                          }
                        } catch {
                          // Clipboard permission denied or unavailable
                        }
                      }}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                      title={t.jdPasteClipboard}
                    >
                      <Copy className="w-3 h-3" />
                      <span>{t.jdPasteClipboard}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={jdInputText}
                  onChange={(e) => {
                    setJdInputText(e.target.value);
                    setSelectedSampleJdId?.(null);
                  }}
                  placeholder={t.jdPastePlaceholder}
                  className="h-36 sm:h-44 md:h-full md:flex-1 w-full bg-[#080B11] border border-white/10 rounded-xl p-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/60 font-mono leading-relaxed resize-none overflow-y-auto"
                />

                <p className="text-[10px] text-neutral-400 leading-tight shrink-0">
                  {lang === 'en'
                    ? '💡 Real-time ATS match scoring automatically tracks your CV skills, experience, and projects.'
                    : '💡 Tự động so khớp các kỹ năng công nghệ trong JD với toàn bộ nội dung CV theo thời gian thực.'}
                </p>
              </div>

              {/* Right Column: Keyword Match & Gap Breakdown */}
              <div className="md:col-span-7 flex flex-col bg-[#141822] min-h-[380px] md:min-h-0 md:h-full overflow-hidden">
                {/* Fixed Top Header (Non-scrolling: Score + Categories + Filter Tabs) */}
                <div className="p-3.5 sm:p-4 pb-2.5 border-b border-white/10 bg-[#101420] shrink-0 space-y-2">
                  {/* Score & Rating Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                        {jdMatchResult.matchScore}%
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${jdMatchResult.ratingBg} ${jdMatchResult.ratingColor}`}>
                            {lang === 'en' ? jdMatchResult.ratingEn : jdMatchResult.ratingVi}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {jdMatchResult.matchedCount} / {jdMatchResult.totalJDKeywords} {lang === 'en' ? 'keywords' : 'từ khóa đã phủ'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 max-w-[260px] text-right hidden sm:block">
                      {lang === 'en' ? jdMatchResult.summaryEn : jdMatchResult.summaryVi}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
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

                  {/* Category Coverage Breakdown (Horizontal Scroll Chips) */}
                  {jdMatchResult.categoryBreakdown.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      {jdMatchResult.categoryBreakdown.map((cat) => (
                        <span
                          key={cat.category}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-neutral-300 flex-shrink-0 flex items-center space-x-1"
                        >
                          <span>{lang === 'en' ? cat.titleEn : cat.titleVi}:</span>
                          <strong className="text-white font-mono">{cat.matched}/{cat.total}</strong>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Filter Tabs */}
                  <div className="flex items-center space-x-1.5 bg-[#090C13] border border-white/10 rounded-xl p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setJdFilter('all')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        jdFilter === 'all'
                          ? 'bg-white/15 text-white font-bold shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t.jdAllFilter} ({jdMatchResult.totalJDKeywords})
                    </button>
                    <button
                      type="button"
                      onClick={() => setJdFilter('missing')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                        jdFilter === 'missing'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-xs'
                          : 'text-amber-400/80 hover:text-amber-300'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>{t.jdKeywordsMissing} ({jdMatchResult.missingCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setJdFilter('matched')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                        jdFilter === 'matched'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
                          : 'text-emerald-400/80 hover:text-emerald-300'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{t.jdKeywordsMatched} ({jdMatchResult.matchedCount})</span>
                    </button>
                  </div>
                </div>

                {/* Keyword Cards List (Fills entire remaining space, independently scrollable) */}
                <div className="flex-1 min-h-[220px] md:min-h-0 overflow-y-auto p-3.5 sm:p-4 space-y-2.5">
                  {/* Missing Keywords */}
                  {(jdFilter === 'all' || jdFilter === 'missing') &&
                    jdMatchResult.missingKeywords.map((k) => {
                      const meta = TECH_CATEGORY_META[k.category] || {
                        titleVi: k.category,
                        titleEn: k.category,
                        color: 'text-neutral-400',
                        badgeBg: 'bg-white/10 text-neutral-300 border-white/10',
                      };
                      const isAdded = addedSkillKeyword === k.name || cv.skills.some((s) => s.toLowerCase() === k.name.toLowerCase());
                      const isCopied = copiedKeyword === k.name;

                      return (
                        <div
                          key={`missing-${k.name}`}
                          className="p-3 rounded-xl bg-amber-950/15 border border-amber-500/25 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center flex-wrap gap-1.5">
                              <span className="font-bold text-amber-300 text-sm">{k.name}</span>
                              <span className={`text-[9px] px-2 py-0.2 rounded-full border ${meta.badgeBg}`}>
                                {lang === 'en' ? meta.titleEn : meta.titleVi}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                                {lang === 'en' ? `in JD: ${k.countInJD}x` : `JD nhắc: ${k.countInJD} lần`}
                              </span>
                              {k.priority === 'high' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  {lang === 'en' ? 'HIGH PRIORITY' : 'YÊU CẦU CAO'}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-400 leading-snug">
                              {lang === 'en' ? k.recommendationEn : k.recommendationVi}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAddKeywordToSkills?.(k.name)}
                              disabled={isAdded}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs active:scale-95'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{t.jdAddedToSkills}</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{t.jdAddToSkills}</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyKeyword?.(k.name)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                              title={t.jdCopyKeyword}
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  {/* Matched Keywords */}
                  {(jdFilter === 'all' || jdFilter === 'matched') &&
                    jdMatchResult.matchedKeywords.map((k) => {
                      const meta = TECH_CATEGORY_META[k.category] || {
                        titleVi: k.category,
                        titleEn: k.category,
                        color: 'text-neutral-400',
                        badgeBg: 'bg-white/10 text-neutral-300 border-white/10',
                      };
                      const isCopied = copiedKeyword === k.name;

                      return (
                        <div
                          key={`matched-${k.name}`}
                          className="p-3 rounded-xl bg-emerald-950/15 border border-emerald-500/25 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center flex-wrap gap-1.5">
                              <span className="font-bold text-emerald-300 text-sm">{k.name}</span>
                              <span className={`text-[9px] px-2 py-0.2 rounded-full border ${meta.badgeBg}`}>
                                {lang === 'en' ? meta.titleEn : meta.titleVi}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center space-x-1">
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>
                                  {lang === 'en' ? `in CV: ${k.countInCV}x` : `Đã có trong CV: ${k.countInCV} lần`}
                                </span>
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400">
                              {lang === 'en'
                                ? `Matched with job requirement (${k.countInJD}x in JD). Well covered!`
                                : `Trùng khớp với yêu cầu của tin tuyển dụng (${k.countInJD} lần trong JD).`}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyKeyword(k.name)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer shrink-0"
                            title={t.jdCopyKeyword}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}

                  {/* Empty State: Missing filter has 0 missing */}
                  {jdFilter === 'missing' && jdMatchResult.missingCount === 0 && jdMatchResult.totalJDKeywords > 0 && (
                    <div className="text-center py-10 px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-semibold text-emerald-300">
                        {lang === 'en' ? 'All JD Keywords Covered!' : 'Đã có đầy đủ từ khóa trong CV!'}
                      </h4>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        {lang === 'en'
                          ? 'Congratulations! Your CV includes every technical skill and keyword found in this Job Description.'
                          : 'Chúc mừng! Hồ sơ CV của bạn đã bao phủ trọn vẹn toàn bộ các kỹ năng công nghệ được phát hiện trong tin tuyển dụng này.'}
                      </p>
                    </div>
                  )}

                  {/* Empty State: Matched filter has 0 matched */}
                  {jdFilter === 'matched' && jdMatchResult.matchedCount === 0 && jdMatchResult.totalJDKeywords > 0 && (
                    <div className="text-center py-10 px-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-semibold text-amber-300">
                        {lang === 'en' ? 'No Matched Keywords Yet' : 'Chưa có từ khóa trùng khớp'}
                      </h4>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        {lang === 'en'
                          ? 'None of the keywords from this JD were found in your CV. Click "Missing Keywords" tab to add them.'
                          : 'Chưa tìm thấy từ khóa nào trong CV trùng khớp với JD. Hãy chuyển sang tab "Từ khóa còn thiếu" để bổ sung ngay vào Kỹ năng.'}
                      </p>
                    </div>
                  )}

                  {/* Empty State: No JD keywords detected */}
                  {jdMatchResult.totalJDKeywords === 0 && (
                    <div className="text-center py-10 px-4 rounded-xl border border-dashed border-white/10 bg-white/5 space-y-2">
                      <Search className="w-8 h-8 text-neutral-500 mx-auto animate-pulse" />
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        {t.jdEmptyKeywords}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-7 py-2.5 bg-[#0E121B] border-t border-white/10 flex items-center justify-between text-xs shrink-0">
              <span className="text-neutral-400 text-[11px] line-clamp-1 mr-2">
                {t.jdAtsTip}
              </span>
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors cursor-pointer shrink-0"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
  );
}

export default JDMatcherModal;
