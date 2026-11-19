'use client';

import React, { useState } from 'react';
import {
  SpellCheck,
  Check,
  CheckCheck,
  Copy,
  Sparkles,
  Wand2,
  BookOpen,
  Search,
  Zap,
  Terminal,
  X,
} from 'lucide-react';
import {
  lintCVTechnologies,
  lintAndFormatText,
  TECH_STANDARDS_REGISTRY,
  type TechLintIssue,
} from '@/lib/techLinter';
import type { CVData, Language } from '@/types/cvBuilder';
import { TECH_CATEGORY_META } from '@/lib/jdMatcher';

export interface TechLinterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Record<string, string>;
  cv: CVData;
  techLintReport: ReturnType<typeof lintCVTechnologies>;
  handleFixSingleTechIssue: (issue: TechLintIssue) => void;
  handleFixAllTechIssues: () => void;
  handleIgnoreTechIssue: (issueId: string) => void;
  ignoredIssueIds?: Set<string>;
  setToastMessage?: (msg: string | null) => void;
}

export function TechLinterModal({
  isOpen,
  onClose,
  lang,
  t,
  cv,
  techLintReport,
  handleFixSingleTechIssue,
  handleFixAllTechIssues,
  handleIgnoreTechIssue,
  ignoredIssueIds = new Set(),
  setToastMessage,
}: TechLinterModalProps) {
  const [techLinterActiveTab, setTechLinterActiveTab] = useState<'issues' | 'playground' | 'registry'>('issues');
  const [techLinterFilter, setTechLinterFilter] = useState<'all' | 'skills' | 'timeline' | 'projects' | 'custom' | 'summary'>('all');
  const [techLinterCategory, setTechLinterCategory] = useState<string>('all');
  const [playgroundInput, setPlaygroundInput] = useState('');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [playgroundReplacements, setPlaygroundReplacements] = useState<{ original: string; replacement: string; def: any }[]>([]);
  const [techRegistrySearch, setTechRegistrySearch] = useState('');
  const [registryCategory, setRegistryCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handleRunPlayground = () => {
    if (!playgroundInput.trim()) return;
    const res = lintAndFormatText(playgroundInput);
    setPlaygroundOutput(res.cleanText);
    setPlaygroundReplacements(res.replacements);
  };

  return (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-[#111622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0E121B] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-inner">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-sm sm:text-base">
                      {t.techLinterModalTitle}
                    </h3>
                    {techLintReport.totalIssuesCount > 0 ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black">
                        {techLintReport.totalIssuesCount} {t.techLinterIssuesFound}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {t.techLinterCleanBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5 max-w-xl line-clamp-1 sm:line-clamp-none">
                    {t.techLinterModalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onClose()}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Đóng (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center px-4 sm:px-5 bg-[#0D1017] border-b border-white/10 space-x-2 sm:space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setTechLinterActiveTab('issues')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
                  techLinterActiveTab === 'issues'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <SpellCheck className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Detected Issues' : 'Lỗi phát hiện'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  techLintReport.totalIssuesCount > 0
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-white/10 text-neutral-300'
                }`}>
                  {techLintReport.totalIssuesCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTechLinterActiveTab('playground')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
                  techLinterActiveTab === 'playground'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Text Playground' : 'Thử nghiệm văn bản'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTechLinterActiveTab('registry')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
                  techLinterActiveTab === 'registry'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Standards Registry' : 'Từ điển 120+ công nghệ'}</span>
              </button>
            </div>

            {/* TAB 1: DETECTED ISSUES & DIFF CARDS */}
            {techLinterActiveTab === 'issues' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Action Bar: 1-Click Fix All & Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl bg-[#090C13] border border-white/10">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleFixAllTechIssues}
                      disabled={techLintReport.totalIssuesCount === 0}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>{t.techLinterFixAll} ({techLintReport.totalIssuesCount})</span>
                    </button>

                    {techLintReport.totalIssuesCount > 0 && (
                      <span className="text-[11px] text-neutral-400 hidden md:inline">
                        {lang === 'en' ? 'Standardize all sections in one click' : 'Chuẩn hóa toàn bộ CV chỉ với 1 cú nhấp'}
                      </span>
                    )}
                  </div>

                  {/* Section & Category Filters */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                    <select
                      value={techLinterFilter}
                      onChange={(e) => setTechLinterFilter(e.target.value as any)}
                      aria-label={lang === 'en' ? 'Filter by section' : 'Lọc theo mục'}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-200 text-xs outline-none cursor-pointer"
                    >
                      <option value="all">{lang === 'en' ? 'All Sections' : 'Tất cả các mục'}</option>
                      <option value="skills">{lang === 'en' ? 'Skills' : 'Kỹ năng'} ({techLintReport.issues.filter(i => i.section === 'skills').length})</option>
                      <option value="projects">{lang === 'en' ? 'Projects' : 'Dự án'} ({techLintReport.issues.filter(i => i.section === 'projects').length})</option>
                      <option value="timeline">{lang === 'en' ? 'Experience' : 'Kinh nghiệm'} ({techLintReport.issues.filter(i => i.section === 'timeline').length})</option>
                      <option value="summary">{lang === 'en' ? 'Summary' : 'Tóm tắt'} ({techLintReport.issues.filter(i => i.section === 'summary').length})</option>
                      <option value="custom">{lang === 'en' ? 'Custom Sections' : 'Mục tùy chỉnh'} ({techLintReport.issues.filter(i => i.section === 'custom').length})</option>
                      <option value="cover_letter">{lang === 'en' ? 'Cover Letter' : 'Thư xin việc'} ({techLintReport.issues.filter(i => i.section === 'cover_letter').length})</option>
                    </select>

                    <select
                      value={techLinterCategory}
                      onChange={(e) => setTechLinterCategory(e.target.value)}
                      aria-label={lang === 'en' ? 'Filter by category' : 'Lọc theo danh mục'}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-200 text-xs outline-none cursor-pointer"
                    >
                      <option value="all">{lang === 'en' ? 'All Categories' : 'Tất cả danh mục'}</option>
                      <option value="languages">Languages</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="devops">DevOps & Cloud</option>
                      <option value="mobile">Mobile</option>
                      <option value="frameworks">Frameworks</option>
                      <option value="architecture">APIs & Architecture</option>
                      <option value="ai_ml">AI & ML</option>
                      <option value="testing">Testing</option>
                      <option value="tools">Tooling & VCS</option>
                    </select>
                  </div>
                </div>

                {/* Issues List / Clean State */}
                {techLintReport.totalIssuesCount === 0 ? (
                  <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                      <CheckCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-lg">
                        {t.techLinterCleanTitle}
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-300/90 max-w-lg mx-auto">
                        {lang === 'en'
                          ? 'All 120+ technologies in your CV and Cover Letter follow official brand casing guidelines. Perfect for ATS parsing and technical review.'
                          : 'Toàn bộ 120+ danh pháp công nghệ trong CV và Thư xin việc đều chuẩn 100% theo quy chuẩn thương hiệu quốc tế. Hoàn hảo để vượt qua bộ lọc ATS và gây ấn tượng mạnh với Tech Lead.'}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTechLinterActiveTab('playground')}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Terminal className="w-3.5 h-3.5 text-purple-400" />
                        <span>{lang === 'en' ? 'Open Text Playground' : 'Thử nghiệm văn bản tự do'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTechLinterActiveTab('registry')}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{lang === 'en' ? 'Browse Standards Registry' : 'Tra cứu từ điển quy chuẩn'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Active Issues Filtered
                  (() => {
                    const activeIssues = techLintReport.issues.filter(
                      (issue) =>
                        !ignoredIssueIds.has(issue.id) &&
                        (techLinterFilter === 'all' || issue.section === techLinterFilter) &&
                        (techLinterCategory === 'all' || issue.category === techLinterCategory)
                    );

                    if (activeIssues.length === 0) {
                      return (
                        <div className="p-8 text-center rounded-xl bg-[#090C13] border border-white/5 space-y-2">
                          <p className="text-xs text-neutral-400">
                            {lang === 'en'
                              ? 'No issues match the selected filters.'
                              : 'Không có lỗi nào phù hợp với bộ lọc hiện tại.'}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setTechLinterFilter('all');
                              setTechLinterCategory('all');
                            }}
                            className="text-xs text-purple-400 hover:underline cursor-pointer"
                          >
                            {lang === 'en' ? 'Reset filters' : 'Đặt lại bộ lọc'}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                          <span>
                            {lang === 'en' ? 'Showing' : 'Đang hiển thị'}{' '}
                            <strong className="text-white">{activeIssues.length}</strong>{' '}
                            {lang === 'en' ? 'unresolved issues' : 'lỗi cần tối ưu'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {activeIssues.map((issue) => {
                            const catMeta = TECH_CATEGORY_META[issue.category as keyof typeof TECH_CATEGORY_META];
                            return (
                              <div
                                key={issue.id}
                                className="p-4 rounded-xl bg-[#0E121B] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group"
                              >
                                <div className="space-y-2 flex-1 min-w-0">
                                  {/* Tags header */}
                                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                    <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium">
                                      {issue.section === 'skills' && (lang === 'en' ? 'Skills' : 'Kỹ năng')}
                                      {issue.section === 'projects' && `${lang === 'en' ? 'Project' : 'Dự án'}: ${issue.targetTitle || 'Item'}`}
                                      {issue.section === 'timeline' && `${lang === 'en' ? 'Experience' : 'Kinh nghiệm'}: ${issue.targetTitle || 'Item'}`}
                                      {issue.section === 'summary' && (lang === 'en' ? 'Summary' : 'Tóm tắt')}
                                      {issue.section === 'custom' && (lang === 'en' ? 'Custom Section' : 'Mục tùy chỉnh')}
                                      {issue.section === 'cover_letter' && (lang === 'en' ? 'Cover Letter' : 'Thư xin việc')}
                                    </span>
                                    {catMeta && (
                                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300">
                                        {lang === 'en' ? catMeta.titleEn : catMeta.titleVi}
                                      </span>
                                    )}
                                  </div>

                                  {/* Diff before / after */}
                                  <div className="flex items-center space-x-2">
                                    <span className="line-through text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 rounded-md font-mono text-xs font-semibold">
                                      {issue.original}
                                    </span>
                                    <span className="text-neutral-500 font-bold">➔</span>
                                    <span className="text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-md font-mono text-xs font-bold shadow-xs">
                                      {issue.replacement}
                                    </span>
                                  </div>

                                  {/* Context snippet if available */}
                                  {issue.contextSnippet && (
                                    <div className="p-2 rounded-lg bg-[#07090E] border border-white/5 text-[11px] text-neutral-300 font-mono leading-relaxed truncate">
                                      <span className="text-neutral-500 text-[10px] mr-1.5 select-none font-sans uppercase">Đoạn văn:</span>
                                      "{issue.contextSnippet}"
                                    </div>
                                  )}

                                  {/* Brand Reason */}
                                  <p className="text-[11px] text-neutral-400 italic flex items-center space-x-1">
                                    <span>💡</span>
                                    <span>{lang === 'en' ? issue.reasonEn : issue.reasonVi}</span>
                                  </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex sm:flex-col items-center gap-1.5 shrink-0 self-end sm:self-center">
                                  <button
                                    type="button"
                                    onClick={() => handleFixSingleTechIssue(issue)}
                                    className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-1 transition-colors cursor-pointer shadow-sm"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{t.techLinterFixSingle}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleIgnoreTechIssue(issue.id)}
                                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200 text-xs transition-colors cursor-pointer"
                                  >
                                    <span>{t.techLinterIgnoreSingle}</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}

            {/* TAB 2: TEXT PLAYGROUND */}
            {techLinterActiveTab === 'playground' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      {lang === 'en'
                        ? 'Paste any paragraph or bullet points below to test real-time tech casing normalization.'
                        : 'Dán bất kỳ đoạn văn, bullet point hay JD tuyển dụng nào vào đây để tự động chuẩn hóa danh pháp.'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-300">
                      {lang === 'en' ? 'Input Text:' : 'Văn bản gốc cần kiểm tra:'}
                    </label>
                    <div className="flex items-center space-x-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() =>
                          setPlaygroundInput(
                            'Toi co kinh nghiem su dung nodejs, reactjs, typescript va viet restful apis tren github voi docker va postgresql.'
                          )
                        }
                        className="text-purple-400 hover:underline cursor-pointer"
                      >
                        {lang === 'en' ? 'Load Sample' : 'Nạp mẫu ví dụ'}
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={playgroundInput}
                    onChange={(e) => setPlaygroundInput(e.target.value)}
                    placeholder={lang === 'en' ? 'Paste text here (e.g. built apis with nodejs and express)...' : 'Dán văn bản vào đây (VD: toi xay dung he thong voi nodejs, reactjs va postgre)...'}
                    className="w-full p-3 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs outline-none focus:border-purple-500 font-mono transition-colors"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleRunPlayground}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Normalize Now' : '✨ Chuẩn hóa ngay'}</span>
                  </button>
                </div>

                {playgroundOutput && (
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                        <CheckCheck className="w-4 h-4" />
                        <span>{lang === 'en' ? 'Normalized Output:' : 'Kết quả sau khi chuẩn hóa:'}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(playgroundOutput);
                            setToastMessage?.(lang === 'en' ? 'Copied to clipboard!' : 'Đã sao chép kết quả!');
                            setTimeout(() => setToastMessage?.(null), 2000);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[11px] font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-cyan-400" />
                        <span>{lang === 'en' ? 'Copy Text' : 'Sao chép'}</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#090C13] border border-emerald-500/30 text-white text-xs font-mono leading-relaxed select-text">
                      {playgroundOutput}
                    </div>

                    {playgroundReplacements.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] text-neutral-400">
                          {lang === 'en' ? 'Replacements made:' : 'Các danh pháp đã được sửa:'} ({playgroundReplacements.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {playgroundReplacements.map((r, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-200 border border-white/5 flex items-center space-x-1 font-mono">
                              <span className="line-through text-rose-400">{r.original}</span>
                              <span className="text-neutral-500">➔</span>
                              <span className="text-emerald-400 font-bold">{r.replacement}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: STANDARDS REGISTRY (120+ TECHNOLOGIES) */}
            {techLinterActiveTab === 'registry' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Search & filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={techRegistrySearch}
                      onChange={(e) => setTechRegistrySearch(e.target.value)}
                      placeholder={lang === 'en' ? 'Search 120+ tech standards (e.g. Node, React, Docker)...' : 'Tìm kiếm 120+ công nghệ (VD: Node, React, Docker)...'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                    />
                  </div>
                  <span className="text-xs text-neutral-400 self-center">
                    {lang === 'en' ? 'Total' : 'Tổng số'}: <strong className="text-white">{TECH_STANDARDS_REGISTRY.length}</strong> {lang === 'en' ? 'standards' : 'quy chuẩn'}
                  </span>
                </div>

                {/* Registry items grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {TECH_STANDARDS_REGISTRY.filter((def) =>
                    !techRegistrySearch.trim() ||
                    def.canonical.toLowerCase().includes(techRegistrySearch.toLowerCase()) ||
                    def.aliases.some((a) => a.toLowerCase().includes(techRegistrySearch.toLowerCase()))
                  ).map((def, idx) => {
                    const catMeta = TECH_CATEGORY_META[def.category];
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0E121B] border border-white/5 hover:border-purple-500/30 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-white text-xs text-purple-300">
                            {def.canonical}
                          </span>
                          {catMeta && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                              {lang === 'en' ? catMeta.titleEn : catMeta.titleVi}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                          {lang === 'en' ? def.reasonEn : def.reasonVi}
                        </p>
                        <div className="text-[9px] text-neutral-500 truncate font-mono">
                          Lỗi thường gặp: {def.aliases.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 bg-[#0E121B] border-t border-white/10 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-neutral-400">
                {techLintReport.totalIssuesCount > 0 ? (
                  <span>
                    {lang === 'en' ? 'Unsaved linting fixes will be applied to the active CV.' : 'Các sửa đổi sẽ được áp dụng trực tiếp vào bản CV hiện tại.'}
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.techLinterCleanBadge}</span>
                  </span>
                )}
              </span>

              <button
                type="button"
                onClick={() => onClose()}
                className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
  );
}

export default TechLinterModal;
