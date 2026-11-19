'use client';

import React, { useState } from 'react';
import { LayoutTemplate, X, Plus, Check } from 'lucide-react';
import { TEMPLATES_COLLECTION } from '@/constants/cvConstants';
import type { Language, TemplateId } from '@/types/cvBuilder';

export interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: TemplateId | string;
  onSelectTemplate: (templateId: TemplateId) => void;
  t: Record<string, string>;
  lang?: Language;
}

export function TemplateGalleryModal({
  isOpen,
  onClose,
  currentTemplate,
  onSelectTemplate,
  t,
  lang = 'vi',
}: TemplateGalleryModalProps) {
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'popular' | 'sidebar' | 'ats' | 'creative'>('all');

  if (!isOpen) return null;

  const filteredTemplates = TEMPLATES_COLLECTION.filter((item) =>
    galleryFilter === 'all' ? true : item.category === galleryFilter
  );

  return (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-neutral-700 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                  <LayoutTemplate className="w-5 h-5 text-cyan-400" />
                  <span>{t.galleryTitle}</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {t.gallerySubtitle}
                </p>
              </div>
              <button
                onClick={() => onClose()}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-8 py-3 bg-[#131316] border-b border-neutral-800/80 flex items-center space-x-2 overflow-x-auto text-xs">
              {[
                { id: 'all', label: t.filterAll },
                { id: 'popular', label: t.filterPopular },
                { id: 'sidebar', label: t.filterSidebar },
                { id: 'ats', label: t.filterAts },
                { id: 'creative', label: t.filterCreative },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setGalleryFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    galleryFilter === f.id
                      ? 'bg-cyan-500 text-black font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="p-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((item) => {
                const isActive = currentTemplate === item.id;

                return (
                  <div
                    key={item.id}
                    className={`group bg-[#1f1f26] border rounded-2xl p-4 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-xl ${
                      isActive ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {/* Visual Mini Mockup Preview */}
                    <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-white shadow-inner p-2 border border-neutral-300 pointer-events-none relative">
                      {item.id === 'rabbit' && (
                        <div className="h-full flex flex-col gap-1.5">
                          <div className="w-full h-[28%] bg-[#0f172a] rounded p-1.5 flex flex-col justify-between">
                            <div className="flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              <div className="w-10 h-1 bg-neutral-400 rounded" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="w-3/4 h-2 bg-white rounded" />
                              <div className="w-1/2 h-1 bg-cyan-400 rounded" />
                            </div>
                          </div>
                          <div className="flex-1 flex gap-1.5 p-1">
                            <div className="w-3/5 pl-2 border-l-2 border-cyan-500 space-y-1.5 relative">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 absolute -left-[4px] top-1" />
                              <div className="w-3/4 h-1 bg-neutral-800 rounded" />
                              <div className="w-full h-0.5 bg-neutral-300 rounded" />
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 absolute -left-[4px] top-5" />
                              <div className="w-3/4 h-1 bg-neutral-800 rounded pt-2" />
                              <div className="w-full h-0.5 bg-neutral-300 rounded" />
                            </div>
                            <div className="w-2/5 space-y-1">
                              <div className="w-full h-1 bg-cyan-600 rounded" />
                              <div className="w-full h-1.5 bg-cyan-100 rounded" />
                              <div className="w-full h-1.5 bg-cyan-100 rounded" />
                            </div>
                          </div>
                        </div>
                      )}

                      {item.id === 'cascade' && (
                        <div className="h-full flex">
                          <div className="w-[36%] bg-[#0f172a] h-full rounded-l p-1.5 flex flex-col space-y-1.5">
                            <div className="w-6 h-6 rounded-full bg-neutral-400 mx-auto" />
                            <div className="w-full h-1 bg-cyan-400 rounded" />
                            <div className="w-full h-0.5 bg-neutral-400 rounded" />
                          </div>
                          <div className="flex-1 p-2 space-y-1.5">
                            <div className="w-3/4 h-2 bg-neutral-900 rounded" />
                            <div className="w-full h-0.5 bg-neutral-300 rounded" />
                          </div>
                        </div>
                      )}

                      {item.id === 'chicken' && (
                        <div className="h-full flex flex-col gap-1.5">
                          <div className="w-full h-[32%] bg-[#0f172a] rounded p-1.5 flex items-center justify-between">
                            <div className="space-y-1 w-2/3">
                              <div className="w-3/4 h-1.5 bg-white rounded" />
                              <div className="w-1/2 h-1 bg-cyan-400 rounded" />
                            </div>
                            <div className="w-5 h-5 rounded-full bg-neutral-500" />
                          </div>
                          <div className="flex-1 flex gap-1.5 p-1">
                            <div className="w-3/5 space-y-1">
                              <div className="w-2/3 h-1.5 bg-neutral-800 rounded" />
                              <div className="w-full h-0.5 bg-neutral-300 rounded" />
                            </div>
                            <div className="w-2/5 space-y-1">
                              <div className="w-full h-1.5 bg-neutral-800 rounded" />
                            </div>
                          </div>
                        </div>
                      )}

                      {item.id === 'iconic' && (
                        <div className="h-full flex flex-col p-1.5 space-y-1.5">
                          <div className="flex justify-between items-center pb-1 border-b">
                            <div className="w-1/2 h-2 bg-neutral-900 rounded" />
                            <div className="w-5 h-5 rounded-full bg-cyan-600" />
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 rounded bg-cyan-600" />
                            <div className="w-1/3 h-1.5 bg-neutral-800 rounded" />
                          </div>
                          <div className="w-full h-0.5 bg-neutral-300 rounded" />
                        </div>
                      )}

                      {item.id === 'basic' && (
                        <div className="h-full flex flex-col p-2 space-y-2 text-center">
                          <div className="space-y-1">
                            <div className="w-1/2 h-2 bg-neutral-900 mx-auto rounded" />
                            <div className="w-3/4 h-0.5 bg-neutral-400 mx-auto rounded" />
                          </div>
                          <div className="h-px bg-neutral-300 w-full" />
                          <div className="space-y-1 text-left">
                            <div className="w-1/3 h-1.5 bg-neutral-800 rounded" />
                            <div className="w-full h-0.5 bg-neutral-300 rounded" />
                          </div>
                        </div>
                      )}

                      {item.id === 'decker' && (
                        <div className="h-full flex flex-col p-1.5 space-y-1.5">
                          <div className="w-3/4 h-2 bg-neutral-900 rounded" />
                          <div className="w-16 h-2 bg-cyan-600 rounded-full" />
                          <div className="w-full h-0.5 bg-neutral-300 rounded" />
                        </div>
                      )}

                      {item.id === 'crisp' && (
                        <div className="h-full flex flex-col p-1.5 gap-1.5">
                          <div className="flex justify-between items-center pb-1 border-b border-neutral-300">
                            <div className="w-24 h-2 bg-neutral-900 rounded" />
                            <div className="w-6 h-6 rounded-full bg-neutral-300" />
                          </div>
                          <div className="flex-1 flex gap-2">
                            <div className="w-1/3 space-y-1">
                              <div className="w-full h-1 bg-cyan-600 rounded" />
                            </div>
                            <div className="w-2/3 space-y-1">
                              <div className="w-1/2 h-1 bg-cyan-600 rounded" />
                              <div className="w-full h-0.5 bg-neutral-300 rounded" />
                            </div>
                          </div>
                        </div>
                      )}

                      {item.id === 'bubbles' && (
                        <div className="h-full flex flex-col p-1.5 space-y-1.5">
                          <div className="w-3/4 h-2 bg-neutral-900 rounded" />
                          <div className="p-1 rounded-lg bg-neutral-100 border border-neutral-200 space-y-0.5">
                            <div className="w-1/3 h-1 bg-cyan-600 rounded" />
                            <div className="w-full h-0.5 bg-neutral-300 rounded" />
                          </div>
                        </div>
                      )}

                      {item.id === 'enfold' && (
                        <div className="h-full flex gap-1.5">
                          <div className="w-[70%] p-1 space-y-1.5">
                            <div className="w-3/4 h-2 bg-neutral-900 rounded" />
                            <div className="w-full h-0.5 bg-neutral-300 rounded" />
                          </div>
                          <div className="w-[30%] bg-[#0f172a] rounded p-1 flex flex-col space-y-1">
                            <div className="w-5 h-5 rounded-full bg-neutral-600 mx-auto" />
                          </div>
                        </div>
                      )}

                      {item.id === 'editorial' && (
                        <div className="h-full flex flex-col p-2 space-y-1.5 border-t-2 border-neutral-900">
                          <div className="w-3/4 h-3 bg-neutral-950 rounded font-serif" />
                          <div className="text-[7px] font-mono text-neutral-400 pt-1">01 / TỔNG QUAN</div>
                          <div className="w-full h-0.5 bg-neutral-400 rounded" />
                        </div>
                      )}
                    </div>

                    {/* Template Card Meta */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{item.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300">
                          {lang === 'en' ? (item.badgeEn || item.badge) : item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {lang === 'en' ? (item.descEn || item.desc) : item.desc}
                      </p>

                      <button
                        onClick={() => {
                          onSelectTemplate(item.id as TemplateId);
                          onClose();
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                          isActive
                            ? 'bg-emerald-500 text-black'
                            : 'bg-[#2a2a34] hover:bg-cyan-500 hover:text-black text-cyan-400'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.inUse}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>{t.useTemplate}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
  );
}

export default TemplateGalleryModal;
