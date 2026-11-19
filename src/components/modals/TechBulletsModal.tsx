'use client';

import React from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Copy,
  Lightbulb,
  X,
} from 'lucide-react';
import {
  BULLET_CATEGORIES,
  TECH_BULLET_POINTS,
  type TechBulletPoint,
} from '@/lib/techBulletPoints';
import type { CVData, Language } from '@/types/cvBuilder';

export interface TechTarget {
  type: 'timeline' | 'project';
  id: string;
  title?: string;
}

export interface TechBulletsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Record<string, string>;
  cv: CVData;
  techTarget: TechTarget | null;
  setTechTarget: (target: TechTarget | null) => void;
  techSearchQuery: string;
  setTechSearchQuery: (query: string) => void;
  techCategoryFilter: string;
  setTechCategoryFilter: (category: string) => void;
  copiedBulletId: string | null;
  insertedBulletId: string | null;
  handleCopyBullet: (bullet: TechBulletPoint) => void;
  handleInsertBullet: (bullet: TechBulletPoint) => void;
}

export function TechBulletsModal({
  isOpen,
  onClose,
  lang,
  t,
  cv,
  techTarget,
  setTechTarget,
  techSearchQuery,
  setTechSearchQuery,
  techCategoryFilter,
  setTechCategoryFilter,
  copiedBulletId,
  insertedBulletId,
  handleCopyBullet,
  handleInsertBullet,
}: TechBulletsModalProps) {
  if (!isOpen) return null;

  return (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-neutral-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-neutral-800 flex items-start justify-between bg-gradient-to-r from-amber-950/20 via-neutral-900 to-indigo-950/20">
              <div className="flex items-start space-x-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-amber-600/30 border border-amber-500/40 text-amber-400 shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {t.techModalTitle}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-[10px] font-bold text-amber-300 tracking-wider font-mono">
                      GOOGLE XYZ
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                    {t.techModalSubtitle}
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

            {/* Target Selector & Google XYZ Formula Banner */}
            <div className="px-6 sm:px-8 py-3 bg-[#131316] border-b border-neutral-800 space-y-2.5">
              {/* Target Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-neutral-400 font-medium">{t.techTargetLabel}</span>
                  <select
                    value={techTarget ? `${techTarget.type}:${techTarget.id}` : 'none'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'none') {
                        setTechTarget(null);
                      } else {
                        const [type, id] = val.split(':') as ['timeline' | 'project', string];
                        if (type === 'timeline') {
                          const item = cv.timeline.find((x) => x.id === id);
                          setTechTarget({ type: 'timeline', id, title: item?.role || 'Kinh nghiệm' });
                        } else {
                          const proj = cv.projects.find((x) => x.id === id);
                          setTechTarget({ type: 'project', id, title: proj?.title || 'Dự án' });
                        }
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-cyan-300 font-medium text-xs outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="none">-- {t.techTargetCopyOnly} --</option>
                    {cv.timeline.length > 0 && (
                      <optgroup label={lang === 'en' ? 'Work Experience (Timeline)' : 'Kinh nghiệm làm việc'}>
                        {cv.timeline.map((item, idx) => (
                          <option key={item.id} value={`timeline:${item.id}`}>
                            #{idx + 1}: {item.role}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {cv.projects.length > 0 && (
                      <optgroup label={lang === 'en' ? 'Featured Projects' : 'Dự án tiêu biểu'}>
                        {cv.projects.map((proj, idx) => (
                          <option key={proj.id} value={`project:${proj.id}`}>
                            #{idx + 1}: {proj.title}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
                {techTarget ? (
                  <span className="text-[11px] text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>
                      {lang === 'en' ? `Target: ${techTarget.title || 'Selected item'}` : `Mục tiêu: ${techTarget.title || 'Mục đang chọn'}`}
                    </span>
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-full border border-neutral-700">
                    {lang === 'en' ? 'Mode: Copy to clipboard' : 'Chế độ: Sao chép nhanh'}
                  </span>
                )}
              </div>

              {/* Formula Tip Callout */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 text-xs flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-[11px] text-neutral-300">
                  <span className="font-semibold text-amber-300">{t.techFormulaLabel} </span>
                  <span className="font-mono text-neutral-200">"Accomplished [X] as measured by [Y], by doing [Z]"</span>
                  <span className="text-neutral-400 hidden md:inline ml-1.5">— {t.techFormulaDesc}</span>
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="px-6 sm:px-8 py-3 bg-[#151518] border-b border-neutral-800 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={techSearchQuery}
                  onChange={(e) => setTechSearchQuery(e.target.value)}
                  placeholder={t.techSearchPlaceholder}
                  className="w-full pl-10 pr-9 py-2 rounded-xl bg-neutral-900 border border-neutral-700/80 text-white placeholder-neutral-500 text-xs outline-none focus:border-amber-400/80 transition-all"
                />
                {techSearchQuery && (
                  <button
                    onClick={() => setTechSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {BULLET_CATEGORIES.map((cat) => {
                  const count =
                    cat.id === 'all'
                      ? TECH_BULLET_POINTS.length
                      : TECH_BULLET_POINTS.filter((b) => b.category === cat.id).length;
                  const isActive = techCategoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setTechCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0 ${
                        isActive
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                      }`}
                    >
                      <span>{lang === 'en' ? cat.labelEn : cat.labelVi}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-black/20 text-neutral-950 font-mono font-bold' : 'bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of Bullet Cards */}
            <div className="px-6 sm:px-8 py-4 flex-1 overflow-y-auto space-y-3.5 max-h-[50vh]">
              {TECH_BULLET_POINTS.filter((item) => {
                const matchesCategory = techCategoryFilter === 'all' || item.category === techCategoryFilter;
                if (!matchesCategory) return false;
                if (!techSearchQuery.trim()) return true;
                const q = techSearchQuery.toLowerCase();
                return (
                  item.textVi.toLowerCase().includes(q) ||
                  item.textEn.toLowerCase().includes(q) ||
                  item.techStack.some((tech) => tech.toLowerCase().includes(q)) ||
                  item.actionVerbVi.toLowerCase().includes(q) ||
                  item.actionVerbEn.toLowerCase().includes(q) ||
                  item.metric.toLowerCase().includes(q)
                );
              }).map((bullet) => {
                const isCopied = copiedBulletId === bullet.id;
                const isInserted = insertedBulletId === bullet.id;
                const categoryDef = BULLET_CATEGORIES.find((c) => c.id === bullet.category);
                const activeText = lang === 'en' ? bullet.textEn : bullet.textVi;

                return (
                  <div
                    key={bullet.id}
                    className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition-all shadow-sm space-y-3 group"
                  >
                    {/* Header Row: Category Badge + Action Verb + Metric Highlight */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryDef?.badgeColor || 'bg-neutral-800 text-neutral-300'}`}>
                          {lang === 'en' ? categoryDef?.labelEn : categoryDef?.labelVi}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold">
                          ⚡ {lang === 'en' ? bullet.actionVerbEn : bullet.actionVerbVi}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-amber-300/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center space-x-1">
                        <span>📈</span>
                        <span>{bullet.metric}</span>
                      </span>
                    </div>

                    {/* Bullet Description Text */}
                    <p className="text-xs sm:text-[13px] text-neutral-200 leading-relaxed font-normal">
                      • {activeText}
                    </p>

                    {/* Tech Stack Tags & Actions */}
                    <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {bullet.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800"
                          >
                            #{tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyBullet(bullet)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                            isCopied
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
                          }`}
                          title="Sao chép câu gợi ý này"
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t.techCopied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{t.techCopyBtn}</span>
                            </>
                          )}
                        </button>

                        {/* Insert Button */}
                        <button
                          type="button"
                          onClick={() => handleInsertBullet(bullet)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                            isInserted
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold shadow-md shadow-amber-500/20 active:scale-95'
                          }`}
                          title={techTarget ? `Chèn ngay vào "${techTarget.title}"` : 'Sao chép & áp dụng'}
                        >
                          {isInserted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              <span>{t.techInserted}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                              <span>{t.techInsertBtn}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Empty Search State */}
              {TECH_BULLET_POINTS.filter((item) => {
                const matchesCategory = techCategoryFilter === 'all' || item.category === techCategoryFilter;
                if (!matchesCategory) return false;
                if (!techSearchQuery.trim()) return true;
                const q = techSearchQuery.toLowerCase();
                return (
                  item.textVi.toLowerCase().includes(q) ||
                  item.textEn.toLowerCase().includes(q) ||
                  item.techStack.some((tech) => tech.toLowerCase().includes(q)) ||
                  item.actionVerbVi.toLowerCase().includes(q) ||
                  item.actionVerbEn.toLowerCase().includes(q) ||
                  item.metric.toLowerCase().includes(q)
                );
              }).length === 0 && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-neutral-400 text-xs">
                    {t.techNoResults}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTechSearchQuery('');
                      setTechCategoryFilter('all');
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
                  >
                    {lang === 'en' ? 'Reset search filter' : 'Xoá bộ lọc tìm kiếm'}
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-3.5 bg-[#131316] border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-neutral-400 text-[11px]">
                {lang === 'en'
                  ? '💡 You can click text directly on your CV to further refine numbers and details.'
                  : '💡 Bạn có thể nhấp trực tiếp vào chữ trên CV để tiếp tục chỉnh sửa con số và chi tiết thực tế.'}
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

export default TechBulletsModal;
