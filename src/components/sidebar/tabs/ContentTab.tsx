'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Globe,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Sparkles,
  Wand2,
  X,
  Award,
} from 'lucide-react';
import type {
  CVData,
  Language,
  SectionKey,
} from '@/types/cvBuilder';
import { CV_SECTIONS } from '@/constants/cvConstants';
import {
  CustomTechLink,
  TechLinkPlatform,
  PlatformMeta,
  TECH_PLATFORM_META,
  POPULAR_LINK_PRESETS,
  detectLinkPlatform,
  ensureCustomLinks,
  getActiveTechLinks,
  formatLinkDisplay,
} from '@/lib/customTechLinks';
import TechLinkIcon from '@/components/TechLinkIcon';

export interface ContentTabProps {
  lang: Language;
  t: any;
  cv: CVData;
  setCv: React.Dispatch<React.SetStateAction<CVData>>;
  drawerTab: string;
  setDrawerTab: (tab: any) => void;
  sectionOrder: SectionKey[];
  sectionVisibility: Record<SectionKey, boolean>;

  // Custom links handlers
  handleAddCustomLink?: (platform?: TechLinkPlatform, presetUrl?: string, presetLabel?: string) => void;
  handleUpdateCustomLink?: (id: string, updates: Partial<CustomTechLink>) => void;
  handleToggleCustomLink?: (id: string) => void;
  handleRemoveCustomLink?: (id: string) => void;
  handleMoveCustomLink?: (index: number, direction: 'up' | 'down') => void;

  // Modals & Linter
  handleOpenTechModal: (target?: { type: 'timeline' | 'project'; id: string; title: string }) => void;
  handleQuickLintSkills: () => void;

  // Timeline (Experience)
  addTimelineItem: (index?: number) => void;
  updateTimelineItem: (id: string, field: any, val: any) => void;
  deleteTimelineItem: (id: string) => void;

  // Projects
  addProjectItem: (index?: number) => void;
  updateProjectItem: (id: string, field: any, val: any) => void;
  deleteProjectItem: (id: string) => void;

  // Skills
  addSkill: (name: string) => void;
  removeSkill: (idx: number) => void;
  newSkillText?: string;
  setNewSkillText?: (text: string) => void;

  // Education
  addEducationItem: (index?: number) => void;
  updateEducationItem: (id: string, field: any, val: any) => void;
  deleteEducationItem: (id: string) => void;

  // Custom Sections
  removeCustomSection: (id: string) => void;
  updateCustomSectionTitle: (id: string, title: string) => void;
  updateCustomSectionContent: (id: string, content: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, field: any, val: any) => void;
  deleteCustomSectionItem: (sectionId: string, itemId: string) => void;

  // Optional toast
  setToastMessage?: (msg: string | null) => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  lang,
  t,
  cv,
  setCv,
  drawerTab,
  setDrawerTab,
  sectionOrder,
  sectionVisibility,
  handleAddCustomLink: customHandleAddCustomLink,
  handleUpdateCustomLink: customHandleUpdateCustomLink,
  handleToggleCustomLink: customHandleToggleCustomLink,
  handleRemoveCustomLink: customHandleRemoveCustomLink,
  handleMoveCustomLink: customHandleMoveCustomLink,
  handleOpenTechModal,
  handleQuickLintSkills,
  addTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,

  addProjectItem,
  updateProjectItem,
  deleteProjectItem,
  addSkill,
  removeSkill,
  newSkillText: propNewSkillText,
  setNewSkillText: propSetNewSkillText,
  addEducationItem,
  updateEducationItem,
  deleteEducationItem,
  removeCustomSection,
  updateCustomSectionTitle,
  updateCustomSectionContent,
  addCustomSectionItem,
  updateCustomSectionItem,
  deleteCustomSectionItem,
  setToastMessage,
}) => {
  // Horizontal Scroll for Section Navigation Tabs
  const sectionTabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkSectionTabsScroll = () => {
    if (!sectionTabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sectionTabsRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  const handleScrollSectionTabs = (direction: 'left' | 'right') => {
    if (!sectionTabsRef.current) return;
    const offset = direction === 'left' ? -140 : 140;
    sectionTabsRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkSectionTabsScroll, 250);
  };

  const handleSectionTabsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!sectionTabsRef.current) return;
    if (e.deltaY !== 0) {
      e.preventDefault();
      sectionTabsRef.current.scrollLeft += e.deltaY;
      checkSectionTabsScroll();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkSectionTabsScroll();
      if (sectionTabsRef.current) {
        const activeEl = sectionTabsRef.current.querySelector<HTMLElement>('[data-active="true"]');
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [drawerTab]);

  // Skill input state
  const [localSkillText, setLocalSkillText] = useState('');
  const newSkillText = propNewSkillText !== undefined ? propNewSkillText : localSkillText;
  const setNewSkillText = propSetNewSkillText || setLocalSkillText;

  // Custom links handlers fallback
  const handleAddCustomLink = customHandleAddCustomLink || ((platform?: TechLinkPlatform, presetUrl?: string, presetLabel?: string) => {
    const p = platform || 'website';
    const newId = `link-${Date.now()}`;
    const meta = TECH_PLATFORM_META[p];
    const newLink: CustomTechLink = {
      id: newId,
      platform: p,
      url: presetUrl || (meta ? (meta.placeholder.startsWith('http') ? meta.placeholder : `https://${meta.placeholder}`) : 'https://'),
      label: presetLabel || (meta ? meta.defaultLabel : 'Link'),
      enabled: true,
    };
    const currentLinks = ensureCustomLinks(cv);
    setCv({ ...cv, customLinks: [...currentLinks, newLink] });
    setToastMessage?.(lang === 'en' ? `Added ${meta?.name || p} link` : `Đã thêm liên kết ${meta?.name || p}`);
  });

  const handleUpdateCustomLink = customHandleUpdateCustomLink || ((id: string, updates: Partial<CustomTechLink>) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.map((l: CustomTechLink) => {
      if (l.id !== id) return l;
      const next = { ...l, ...updates };
      if (updates.url && !updates.platform) {
        const detected = detectLinkPlatform(updates.url);
        if (detected !== 'custom' && detected !== l.platform) {
          next.platform = detected;
        }
        const pMeta = TECH_PLATFORM_META[next.platform];
        if (!updates.label && (!l.label || l.label === pMeta?.defaultLabel)) {
          next.label = formatLinkDisplay(updates.url, next.platform);
        }
      }
      return next;
    });
    setCv({ ...cv, customLinks: updated });
  });

  const handleToggleCustomLink = customHandleToggleCustomLink || ((id: string) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.map((l: CustomTechLink) => (l.id === id ? { ...l, enabled: !l.enabled } : l));
    setCv({ ...cv, customLinks: updated });
  });

  const handleRemoveCustomLink = customHandleRemoveCustomLink || ((id: string) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.filter((l: CustomTechLink) => l.id !== id);
    setCv({ ...cv, customLinks: updated });
  });

  const handleMoveCustomLink = customHandleMoveCustomLink || ((index: number, direction: 'up' | 'down') => {
    const currentLinks = ensureCustomLinks(cv);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentLinks.length) return;
    const copy = [...currentLinks];
    const [removed] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, removed);
    setCv({ ...cv, customLinks: copy });
  });

  return (
<div className="space-y-4">
                  {/* Mode hint banner */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-[11px] text-neutral-300 leading-snug">
                      {lang === 'en'
                        ? 'Tip: Click text directly on the CV to edit, or use the forms below.'
                        : 'Mẹo: Nhấp trực tiếp vào chữ trên CV để sửa, hoặc dùng form bên dưới.'}
                    </span>
                  </div>

                  {/* Section navigation segmented pills with single sleek horizontal scrollbar & scroll arrows */}
                  <div className="relative -mx-4 bg-[#111827] border-b border-white/10 group">
                    {/* Left Scroll Button */}
                    {canScrollLeft && (
                      <button
                        type="button"
                        onClick={() => handleScrollSectionTabs('left')}
                        className="absolute left-0 inset-y-0 z-10 w-7 bg-gradient-to-r from-[#111827] via-[#111827]/95 to-transparent flex items-center justify-start pl-1 text-indigo-400 hover:text-white transition-all cursor-pointer shadow-md"
                        title={lang === 'en' ? 'Scroll left' : 'Cuộn sang trái'}
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-4 h-4 shrink-0 drop-shadow" />
                      </button>
                    )}

                    {/* Horizontal Scrollable Tabs Bar with single sleek scrollbar */}
                    <div
                      ref={sectionTabsRef}
                      onScroll={checkSectionTabsScroll}
                      onWheel={handleSectionTabsWheel}
                      className="flex text-xs overflow-x-auto custom-scrollbar-x px-3 pb-1.5 pt-0.5 scroll-smooth"
                    >
                      {[
                        { id: 'profile', label: t.profileTab, isHidden: false },
                        ...sectionOrder.map((key) => {
                          const meta = CV_SECTIONS.find((s) => s.key === key);
                          const customSec = cv.customSections?.find((s) => s.id === key);
                          return {
                            id: key,
                            label: meta
                              ? lang === 'en'
                                ? meta.labelEn
                                : meta.labelVi
                              : customSec?.title || (lang === 'en' ? 'Custom' : 'Tùy chỉnh'),
                            isHidden: !sectionVisibility[key],
                          };
                        }),
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          data-active={drawerTab === tab.id ? 'true' : 'false'}
                          onClick={() => {
                            setDrawerTab(tab.id as any);
                          }}
                          className={`px-3 py-1.5 font-medium whitespace-nowrap transition-colors border-b-2 text-[11px] cursor-pointer flex items-center space-x-1 shrink-0 ${
                            drawerTab === tab.id
                              ? 'border-indigo-400 text-indigo-300 bg-white/5 font-semibold'
                              : 'border-transparent text-neutral-400 hover:text-neutral-200'
                          } ${tab.isHidden ? 'opacity-40' : ''}`}
                        >
                          <span className={tab.isHidden ? 'line-through' : ''}>{tab.label}</span>
                          {tab.isHidden && <span className="text-[9px] text-amber-400/80 font-mono no-underline">(ẩn)</span>}
                        </button>
                      ))}
                    </div>

                    {/* Right Scroll Button */}
                    {canScrollRight && (
                      <button
                        type="button"
                        onClick={() => handleScrollSectionTabs('right')}
                        className="absolute right-0 inset-y-0 z-10 w-7 bg-gradient-to-l from-[#111827] via-[#111827]/95 to-transparent flex items-center justify-end pr-1 text-indigo-400 hover:text-white transition-all cursor-pointer shadow-md"
                        title={lang === 'en' ? 'Scroll right' : 'Cuộn sang phải'}
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-4 h-4 shrink-0 drop-shadow" />
                      </button>
                    )}
                  </div>

                  {/* Section forms */}
                  {drawerTab === 'profile' && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Full Name' : 'Họ và tên'}</label>
                        <input
                          type="text"
                          value={cv.name}
                          onChange={(e) => setCv({ ...cv, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Job Title / Role' : 'Chức danh / Vị trí'}</label>
                        <input
                          type="text"
                          value={cv.role}
                          onChange={(e) => setCv({ ...cv, role: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-neutral-400 mb-1">Email</label>
                          <input
                            type="email"
                            value={cv.email}
                            onChange={(e) => setCv({ ...cv, email: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Phone' : 'Số điện thoại'}</label>
                          <input
                            type="text"
                            value={cv.phone}
                            onChange={(e) => setCv({ ...cv, phone: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Location' : 'Địa chỉ / Khu vực'}</label>
                        <input
                          type="text"
                          value={cv.location}
                          onChange={(e) => setCv({ ...cv, location: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs"
                        />
                      </div>
                      {/* Custom Tech Links Manager */}
                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                              <Globe className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{t.techLinksTitle}</span>
                            </h4>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              {t.techLinksSubtitle}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {getActiveTechLinks(cv).length} {lang === 'en' ? 'active' : 'hiển thị'}
                          </span>
                        </div>

                        {/* Quick Presets Pills */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                            {t.quickPresetsTitle}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {POPULAR_LINK_PRESETS.map((preset) => {
                              const alreadyAdded = ensureCustomLinks(cv).some((l: CustomTechLink) => l.platform === preset.platform);
                              return (
                                <button
                                  key={preset.platform}
                                  type="button"
                                  onClick={() => handleAddCustomLink(preset.platform)}
                                  className={`text-[10px] px-2 py-1 rounded-md border flex items-center space-x-1 transition-all cursor-pointer ${
                                    alreadyAdded
                                      ? 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                                      : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-medium'
                                  }`}
                                >
                                  <TechLinkIcon platform={preset.platform} className="w-3 h-3 shrink-0" />
                                  <span>+ {preset.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Links List */}
                        <div className="space-y-2">
                          {ensureCustomLinks(cv).map((link: CustomTechLink, idx: number, arr: CustomTechLink[]) => (
                            <div
                              key={link.id}
                              className={`p-2.5 rounded-xl border transition-all space-y-2 ${
                                link.enabled
                                  ? 'bg-[#101420] border-white/10 hover:border-white/20'
                                  : 'bg-neutral-900/40 border-white/5 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2 min-w-0">
                                  <div className="p-1 rounded-lg bg-white/5 border border-white/10 shrink-0 text-cyan-400">
                                    <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5" />
                                  </div>
                                  <select
                                    value={link.platform}
                                    onChange={(e) => handleUpdateCustomLink(link.id, { platform: e.target.value as TechLinkPlatform })}
                                    className="bg-[#090C13] border border-white/10 rounded-md px-1.5 py-0.5 text-[11px] text-white outline-none cursor-pointer"
                                  >
                                    {(Object.entries(TECH_PLATFORM_META) as [TechLinkPlatform, PlatformMeta][]).map(([pKey, pMeta]) => (
                                      <option key={pKey} value={pKey} className="bg-neutral-900 text-white">
                                        {pMeta.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="flex items-center space-x-1 shrink-0">
                                  {/* Move Up */}
                                  <button
                                    type="button"
                                    onClick={() => handleMoveCustomLink(idx, 'up')}
                                    disabled={idx === 0}
                                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    title="Di chuyển lên"
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                  {/* Move Down */}
                                  <button
                                    type="button"
                                    onClick={() => handleMoveCustomLink(idx, 'down')}
                                    disabled={idx === arr.length - 1}
                                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    title="Di chuyển xuống"
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                  {/* Toggle Visibility */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCustomLink(link.id)}
                                    className={`p-1 rounded transition-colors cursor-pointer ${
                                      link.enabled
                                        ? 'text-cyan-400 hover:bg-cyan-500/10'
                                        : 'text-neutral-500 hover:text-neutral-300'
                                    }`}
                                    title={link.enabled ? 'Ẩn liên kết này trên CV' : 'Hiện liên kết này trên CV'}
                                  >
                                    {link.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                  </button>
                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCustomLink(link.id)}
                                    className="p-1 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                    title="Xóa liên kết này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Input URL & Label */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <span className="block text-[10px] text-neutral-400 mb-0.5">{t.linkUrl}</span>
                                  <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => handleUpdateCustomLink(link.id, { url: e.target.value })}
                                    placeholder={TECH_PLATFORM_META[link.platform]?.placeholder || 'https://...'}
                                    className="w-full px-2 py-1 rounded bg-[#090C13] border border-white/10 text-[11px] text-white outline-none focus:border-cyan-400 font-mono"
                                  />
                                </div>
                                <div>
                                  <span className="block text-[10px] text-neutral-400 mb-0.5">{t.linkLabel}</span>
                                  <input
                                    type="text"
                                    value={link.label || ''}
                                    onChange={(e) => handleUpdateCustomLink(link.id, { label: e.target.value })}
                                    placeholder="ducanh.dev"
                                    className="w-full px-2 py-1 rounded bg-[#090C13] border border-white/10 text-[11px] text-white outline-none focus:border-cyan-400 font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Custom Link Button */}
                        <button
                          type="button"
                          onClick={() => handleAddCustomLink('custom')}
                          className="w-full py-2 px-3 rounded-lg border border-dashed border-white/20 hover:border-cyan-400/50 hover:bg-cyan-500/5 text-cyan-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t.addTechLinkBtn}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {drawerTab === 'summary' && (
                    <div className="space-y-3">
                      <label className="block text-neutral-400">{lang === 'en' ? 'Professional summary & core competencies' : 'Tóm tắt mục tiêu nghề nghiệp & năng lực cốt lõi'}</label>
                      <textarea
                        rows={8}
                        value={cv.summary}
                        onChange={(e) => setCv({ ...cv, summary: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 leading-relaxed text-xs"
                      />
                    </div>
                  )}

                  {drawerTab === 'experience' && (
                    <div className="space-y-4">
                      {/* Tech Bullet Tip Banner */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-cyan-500/10 border border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <p className="text-[11px] text-neutral-300 leading-tight">
                            <span className="font-semibold text-amber-300">Google XYZ: </span>
                            {t.techTipBanner}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenTechModal(cv.timeline.length > 0 ? { type: 'timeline', id: cv.timeline[0].id, title: cv.timeline[0].role } : undefined)}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shrink-0 ml-2 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{t.techBrowseLibrary}</span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{lang === 'en' ? 'Work Experience List' : 'Danh sách kinh nghiệm'} ({cv.timeline.length})</span>
                        <button
                          onClick={() => addTimelineItem()}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1 text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.addItem}</span>
                        </button>
                      </div>
                      {cv.timeline.map((item, idx) => (
                        <div key={item.id} className="p-3 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-indigo-300">#{idx + 1}</span>
                            <button
                              onClick={() => deleteTimelineItem(item.id)}
                              className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                              title={lang === 'en' ? 'Delete this item' : 'Xoá mục này'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.role}
                            onChange={(e) => updateTimelineItem(item.id, 'role', e.target.value)}
                            placeholder={lang === 'en' ? 'Job Title & Company' : 'Chức danh & Công ty'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                          />
                          <input
                            type="text"
                            value={item.period}
                            onChange={(e) => updateTimelineItem(item.id, 'period', e.target.value)}
                            placeholder={lang === 'en' ? 'Period (e.g. 2022 — PRESENT)' : 'Giai đoạn (VD: 2022 — HIỆN TẠI)'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none font-mono text-xs"
                          />
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <label className="text-neutral-400 text-[11px]">{lang === 'en' ? 'Responsibilities & Impact' : 'Mô tả & Đóng góp'}</label>
                              <button
                                type="button"
                                onClick={() => handleOpenTechModal({ type: 'timeline', id: item.id, title: item.role })}
                                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium transition-colors cursor-pointer"
                                title={lang === 'en' ? 'Browse tech bullet points for this role' : 'Xem gợi ý mô tả chuẩn công nghệ cho vị trí này'}
                              >
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>{t.techInsertSuggestion}</span>
                              </button>
                            </div>
                            <textarea
                              rows={3}
                              value={item.desc}
                              onChange={(e) => updateTimelineItem(item.id, 'desc', e.target.value)}
                              placeholder={lang === 'en' ? 'Job responsibilities & achievements (use • for bullets)...' : 'Chi tiết công việc & thành tích (dùng • để tách ý)...'}
                              className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {drawerTab === 'projects' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{lang === 'en' ? 'Project List' : 'Danh sách dự án'} ({cv.projects.length})</span>
                        <button
                          onClick={() => addProjectItem()}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1 text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.addProject}</span>
                        </button>
                      </div>
                      {cv.projects.map((proj, idx) => (
                        <div key={proj.id} className="p-3 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-indigo-300">#{idx + 1}</span>
                            <button
                              onClick={() => deleteProjectItem(proj.id)}
                              className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                              title={lang === 'en' ? 'Delete this project' : 'Xoá dự án này'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => updateProjectItem(proj.id, 'title', e.target.value)}
                            placeholder={lang === 'en' ? 'Project Title' : 'Tên dự án'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={proj.category}
                              onChange={(e) => updateProjectItem(proj.id, 'category', e.target.value)}
                              placeholder={lang === 'en' ? 'Category' : 'Thể loại'}
                              className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                            />
                            <input
                              type="text"
                              value={proj.year}
                              onChange={(e) => updateProjectItem(proj.id, 'year', e.target.value)}
                              placeholder={lang === 'en' ? 'Year' : 'Năm'}
                              className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none font-mono text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <label className="text-neutral-400 text-[11px]">{lang === 'en' ? 'Description & Impact' : 'Mô tả & Đóng góp'}</label>
                              <button
                                type="button"
                                onClick={() => handleOpenTechModal({ type: 'project', id: proj.id, title: proj.title })}
                                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium transition-colors cursor-pointer"
                                title={lang === 'en' ? 'Browse tech bullet points for this project' : 'Xem gợi ý mô tả chuẩn công nghệ cho dự án này'}
                              >
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>{t.techInsertProjectSuggestion}</span>
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={proj.desc}
                              onChange={(e) => updateProjectItem(proj.id, 'desc', e.target.value)}
                              placeholder={lang === 'en' ? 'Project description & achievements...' : 'Mô tả dự án & thành tựu kỹ thuật...'}
                              className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {drawerTab === 'skills' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-neutral-400 mb-1.5">{lang === 'en' ? 'Add new skill' : 'Thêm kỹ năng mới'}</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newSkillText}
                            onChange={(e) => setNewSkillText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addSkill(newSkillText);
                                setNewSkillText('');
                              }
                            }}
                            placeholder={lang === 'en' ? 'Enter skill name (e.g. Docker)...' : 'Nhập tên kỹ năng (VD: Docker)...'}
                            className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none text-xs"
                          />
                          <button
                            onClick={() => {
                              addSkill(newSkillText);
                              setNewSkillText('');
                            }}
                            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
                          >
                            {t.addSkill}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-400 mb-2">{lang === 'en' ? 'Current Skills' : 'Danh sách kỹ năng hiện tại'} ({cv.skills.length})</label>
                        <div className="flex flex-wrap gap-1.5">
                          {cv.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-white/10 text-neutral-200 flex items-center space-x-1.5 text-xs"
                            >
                              <span>{s}</span>
                              <button
                                onClick={() => removeSkill(idx)}
                                className="text-neutral-400 hover:text-rose-400 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Quick Tech Linter for Skills */}
                      <button
                        type="button"
                        onClick={handleQuickLintSkills}
                        className="w-full py-2 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                        title={lang === 'en' ? 'Normalize all skill names to industry standard casing' : 'Chuẩn hóa toàn bộ tên kỹ năng theo quy chuẩn quốc tế'}
                      >
                        <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>{t.techLinterQuickSkillsBtn}</span>
                      </button>
                    </div>
                  )}

                  {drawerTab === 'education' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{t.education} ({cv.education.length})</span>
                        <button
                          onClick={() => addEducationItem()}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1 text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.addEducation}</span>
                        </button>
                      </div>
                      {cv.education.map((edu, idx) => (
                        <div key={edu.id} className="p-3 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-indigo-300">#{idx + 1}</span>
                            <button
                              onClick={() => deleteEducationItem(edu.id)}
                              className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducationItem(edu.id, 'school', e.target.value)}
                            placeholder={lang === 'en' ? 'School / University' : 'Tên trường / Cơ sở đào tạo'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                          />
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducationItem(edu.id, 'degree', e.target.value)}
                            placeholder={lang === 'en' ? 'Degree / Major' : 'Chuyên ngành / Bằng cấp'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                          />
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => updateEducationItem(edu.id, 'year', e.target.value)}
                            placeholder={lang === 'en' ? 'Niên khóa' : 'Niên khóa'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none font-mono text-xs"
                          />
                          <textarea
                            rows={2}
                            value={edu.desc || ''}
                            onChange={(e) => updateEducationItem(edu.id, 'desc', e.target.value)}
                            placeholder={lang === 'en' ? 'Honors, GPA, details...' : 'Mô tả thành tích, GPA...'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Custom section form */}
                  {drawerTab.startsWith('custom_') && (() => {
                    const customSec = cv.customSections?.find((s) => s.id === drawerTab);
                    if (!customSec) return null;
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                          <span className="font-semibold text-white text-xs flex items-center space-x-1.5">
                            <Award className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{customSec.title}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCustomSection(customSec.id)}
                            className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{lang === 'en' ? 'Delete Section' : 'Xóa mục này'}</span>
                          </button>
                        </div>

                        <div>
                          <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Section Title' : 'Tiêu đề mục'}</label>
                          <input
                            type="text"
                            value={customSec.title}
                            onChange={(e) => updateCustomSectionTitle(customSec.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs font-semibold"
                          />
                        </div>

                        {customSec.type === 'text' ? (
                          <div>
                            <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Content' : 'Nội dung văn bản'}</label>
                            <textarea
                              rows={5}
                              value={customSec.content || ''}
                              onChange={(e) => updateCustomSectionContent(customSec.id, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs leading-relaxed"
                            />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="block text-neutral-400 text-xs">
                                {lang === 'en' ? 'Items List' : 'Danh sách các mục con'}
                              </label>
                              <button
                                type="button"
                                onClick={() => addCustomSectionItem(customSec.id)}
                                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>{lang === 'en' ? '+ Add Item' : '+ Thêm dòng mới'}</span>
                              </button>
                            </div>

                            {customSec.items?.map((item, idx) => (
                              <div key={item.id} className="p-3 rounded-lg bg-neutral-900 border border-white/10 space-y-2 relative group">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-mono text-neutral-500 font-bold">#{idx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => deleteCustomSectionItem(customSec.id, item.id)}
                                    className="text-neutral-500 hover:text-rose-400 p-1"
                                    title="Xóa dòng này"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => updateCustomSectionItem(customSec.id, item.id, 'title', e.target.value)}
                                  placeholder={lang === 'en' ? 'Title / Name' : 'Tên chứng chỉ / giải thưởng / mục con'}
                                  className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs font-semibold"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={item.subtitle || ''}
                                    onChange={(e) => updateCustomSectionItem(customSec.id, item.id, 'subtitle', e.target.value)}
                                    placeholder={lang === 'en' ? 'Issuer / Organization' : 'Đơn vị cấp / Tổ chức'}
                                    className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                                  />
                                  <input
                                    type="text"
                                    value={item.date || ''}
                                    onChange={(e) => updateCustomSectionItem(customSec.id, item.id, 'date', e.target.value)}
                                    placeholder="2024"
                                    className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none font-mono text-xs"
                                  />
                                </div>
                                <textarea
                                  rows={2}
                                  value={item.desc || ''}
                                  onChange={(e) => updateCustomSectionItem(customSec.id, item.id, 'desc', e.target.value)}
                                  placeholder={lang === 'en' ? 'Description...' : 'Mô tả chi tiết hoặc thành tựu...'}
                                  className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
  );
};

export default ContentTab;
