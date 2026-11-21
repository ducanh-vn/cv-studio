'use client';

import React, { useState } from 'react';
import {
  Globe,
  Minimize2,
  Grid,
  Check,
  RotateCcw,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  PlusCircle,
  Award,
} from 'lucide-react';
import type {
  CVData,
  Language,
  SectionKey,
  CanvasBgThemeId,
  CustomSectionPreset,
} from '@/types/cvBuilder';
import {
  CV_SECTIONS,
  CUSTOM_SECTION_PRESETS,
  CANVAS_BG_THEMES,
} from '@/constants/cvConstants';
import { CVTypographySliders } from '@/components/CVTypographySliders';
import type { CVTypographyConfig } from '@/lib/cvTypography';

export interface LayoutTabProps {
  lang: Language;
  setLang: (lang: Language) => void;
  handleSwitchLanguage?: (lang: Language) => void;
  t: any;
  syncContactInfoBetweenLangs: () => void;
  isCompact: boolean;
  toggleCompactMode: () => void;
  canvasBgTheme: string;
  handleSelectCanvasBgTheme: (themeId: CanvasBgThemeId) => void;
  typographyConfig: CVTypographyConfig;
  setTypographyConfig: (config: CVTypographyConfig) => void;
  sectionOrder: SectionKey[];
  sectionVisibility: Record<SectionKey, boolean>;
  cv: CVData;
  resetSections: () => void;
  toggleSectionVisibility: (key: SectionKey) => void;
  moveSection: (key: SectionKey, direction: 'up' | 'down') => void;
  removeCustomSection: (id: string) => void;
  addCustomSection: (presetId: string) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const LayoutTab: React.FC<LayoutTabProps> = ({
  lang,
  setLang,
  handleSwitchLanguage: customHandleSwitchLanguage,
  t,
  syncContactInfoBetweenLangs,
  isCompact,
  toggleCompactMode,
  canvasBgTheme,
  handleSelectCanvasBgTheme,
  typographyConfig,
  setTypographyConfig,
  sectionOrder,
  sectionVisibility,
  cv,
  resetSections,
  toggleSectionVisibility,
  moveSection,
  removeCustomSection,
  addCustomSection,
  zoom,
  setZoom,
}) => {
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);
  const handleSwitchLanguage = customHandleSwitchLanguage || setLang;

  return (
<div className="space-y-5">
                  {/* Bilingual Language Switcher */}
                  <div className="space-y-2">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'CV LANGUAGE' : 'NGÔN NGỮ HIỂN THỊ CV'}
                    </span>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-[#111827] border border-white/10 rounded-xl">
                      <button
                        onClick={() => handleSwitchLanguage('vi')}
                        className={`py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                          lang === 'vi'
                            ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>🇻🇳 Tiếng Việt (VI)</span>
                      </button>
                      <button
                        onClick={() => handleSwitchLanguage('en')}
                        className={`py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                          lang === 'en'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>🇬🇧 English (EN)</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {lang === 'en'
                        ? 'Maintain independent Vietnamese and English versions to apply for domestic and foreign companies.'
                        : 'Hệ thống lưu trữ độc lập 2 bản CV Tiếng Việt & Tiếng Anh để nộp cả công ty trong nước & quốc tế.'}
                    </p>

                    {/* Sync contact info button */}
                    <button
                      type="button"
                      onClick={syncContactInfoBetweenLangs}
                      className="w-full py-2 px-3 rounded-xl bg-[#111827] hover:bg-white/5 text-cyan-300 font-medium text-[11px] flex items-center justify-center space-x-1.5 transition-colors border border-white/10 shadow-xs cursor-pointer"
                      title={lang === 'vi' ? t.copyToEn : t.copyToVi}
                    >
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{lang === 'vi' ? t.copyToEn : t.copyToVi}</span>
                    </button>
                  </div>

                  {/* 1-Page Fit (Compact Mode) Toggle Card */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'PRINT & PAGE FIT' : 'KIỂM SOÁT TRANG IN'}
                    </span>
                    <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isCompact ? 'bg-amber-400/20 text-amber-300' : 'bg-neutral-800 text-neutral-400'}`}>
                            <Minimize2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-white font-semibold text-xs">
                              {lang === 'en' ? '1-Page Fit (Compact)' : 'Chuẩn 1 Trang A4 (Auto-fit)'}
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              {isCompact ? (lang === 'en' ? 'Active' : 'Đang bật') : (lang === 'en' ? 'Disabled' : 'Đang tắt')}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={toggleCompactMode}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                            isCompact
                              ? 'bg-amber-400 text-black border-amber-300 shadow-md shadow-amber-400/20'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                          }`}
                        >
                          {isCompact ? (lang === 'en' ? 'ON' : 'BẬT') : (lang === 'en' ? 'OFF' : 'TẮT')}
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        {lang === 'en'
                          ? 'Automatically optimizes line heights, margins, and font sizes to ensure all content fits neatly onto a single A4 page (297mm) without spilling over.'
                          : 'Tự động co giãn khoảng cách dòng, đệm lề và font chữ để nội dung vừa khít trong đúng 1 mặt giấy A4 tiêu chuẩn (297mm), tránh tràn trang khi xuất PDF.'}
                      </p>
                    </div>
                  </div>

                  {/* ================= WORKSPACE CANVAS BACKGROUND SETTINGS ================= */}
                  <div className="space-y-2.5 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Grid className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-300">
                          {lang === 'en' ? 'CANVAS WORKSPACE THEME' : 'HỌA TIẾT NỀN BÀN LÀM VIỆC'}
                        </span>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-medium">
                        {CANVAS_BG_THEMES.find((t) => t.id === canvasBgTheme)?.nameVi}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {lang === 'en'
                        ? 'Customize the workspace background surrounding your CV to match your style or DucAnh Portfolio.'
                        : 'Tùy chỉnh không gian bàn làm việc bao quanh tờ CV theo sở thích hoặc phong cách Portfolio.'}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {CANVAS_BG_THEMES.map((theme) => {
                        const isSelected = canvasBgTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => handleSelectCanvasBgTheme(theme.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                              isSelected
                                ? 'bg-[#161F30] border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                                : 'bg-[#111827] border-white/10 hover:border-white/20 hover:bg-[#141C2E]'
                            }`}
                          >
                            {/* Swatch Preview Box */}
                            <div
                              className="w-full h-11 rounded-lg border border-white/10 mb-2 relative overflow-hidden flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                              style={{
                                backgroundColor: theme.previewBg,
                                backgroundImage: theme.previewPattern || 'none',
                                backgroundSize: theme.style.backgroundSize || 'auto',
                              }}
                            >
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-black/70 text-neutral-300 backdrop-blur-xs">
                                {theme.previewBadge}
                              </span>
                            </div>

                            <div>
                              <div className={`text-xs font-semibold truncate ${isSelected ? 'text-cyan-300' : 'text-neutral-200'}`}>
                                {lang === 'en' ? theme.nameEn : theme.nameVi}
                              </div>
                              <div className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">
                                {lang === 'en' ? theme.tagEn : theme.tagVi}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fine-grain Typography Sliders */}
                  <div className="pt-1">
                    <CVTypographySliders
                      config={typographyConfig}
                      onChange={setTypographyConfig}
                      lang={lang}
                    />
                  </div>

                  {/* ================= SECTION REORDERING & VISIBILITY ================= */}
                  <div className="space-y-2.5 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                        {lang === 'en' ? 'SECTIONS ORDER & VISIBILITY' : 'THỨ TỰ & ẨN/HIỆN CÁC MỤC'}
                      </span>
                      <button
                        type="button"
                        onClick={resetSections}
                        className="text-[10px] text-neutral-400 hover:text-cyan-400 transition-colors cursor-pointer"
                        title={lang === 'en' ? 'Reset to default order' : 'Khôi phục thứ tự mặc định'}
                      >
                        {lang === 'en' ? 'Reset Order' : 'Mặc định'}
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {lang === 'en'
                        ? 'Reorder sections (↑ ↓) or toggle visibility (eye icon) to customize your CV hierarchy.'
                        : 'Bấm mũi tên (↑ ↓) để đổi thứ tự ưu tiên hoặc bật/tắt (icon mắt) để ẩn/hiện mục trên CV.'}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {sectionOrder.map((secKey, index) => {
                        const meta = CV_SECTIONS.find((s) => s.key === secKey);
                        const customSec = cv.customSections?.find((s) => s.id === secKey);
                        if (!meta && !customSec) return null;
                        const isVisible = sectionVisibility[secKey] ?? true;
                        const isCustom = !meta && !!customSec;
                        const IconComponent = meta ? meta.icon : Award;
                        const label = meta ? (lang === 'en' ? meta.labelEn : meta.labelVi) : customSec?.title;
                        const desc = meta
                          ? lang === 'en'
                            ? meta.descEn
                            : meta.descVi
                          : lang === 'en'
                          ? 'Custom section • Click on CV to edit'
                          : 'Mục tùy chỉnh • Nhấp trên CV để sửa';

                        return (
                          <div
                            key={secKey}
                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                              isVisible
                                ? isCustom
                                  ? 'bg-[#111827] border-indigo-500/30 text-neutral-200 shadow-xs ring-1 ring-indigo-500/10'
                                  : 'bg-[#111827] border-white/10 text-neutral-200 shadow-xs'
                                : 'bg-[#111827]/40 border-white/5 text-neutral-500 opacity-60'
                            }`}
                          >
                            {/* Left: Index badge & Icon & Title */}
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <span className="w-5 h-5 rounded-md bg-white/5 border border-white/5 flex items-center justify-center font-mono text-[10px] text-neutral-400 font-bold shrink-0">
                                {index + 1}
                              </span>
                              <div
                                className={`p-1 rounded-lg shrink-0 ${
                                  isVisible
                                    ? isCustom
                                      ? 'bg-amber-500/15 text-amber-400'
                                      : 'bg-indigo-500/10 text-indigo-400'
                                    : 'bg-neutral-800 text-neutral-500'
                                }`}
                              >
                                <IconComponent className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <span
                                    className={`text-xs font-semibold truncate ${
                                      isVisible ? 'text-white' : 'text-neutral-400 line-through'
                                    }`}
                                  >
                                    {label}
                                  </span>
                                  {isCustom && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                      {lang === 'en' ? 'Custom' : 'Tùy chỉnh'}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[9px] text-neutral-500 truncate">{desc}</div>
                              </div>
                            </div>

                            {/* Right: Controls (Visibility Toggle + Move Up/Down + Delete if Custom) */}
                            <div className="flex items-center space-x-0.5 shrink-0">
                              {/* Visibility Toggle */}
                              <button
                                type="button"
                                onClick={() => toggleSectionVisibility(secKey)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isVisible
                                    ? 'text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300'
                                    : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300'
                                }`}
                                title={
                                  isVisible
                                    ? lang === 'en'
                                      ? 'Hide Section'
                                      : 'Ẩn mục này'
                                    : lang === 'en'
                                    ? 'Show Section'
                                    : 'Hiện mục này'
                                }
                              >
                                {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>

                              {/* Move Up */}
                              <button
                                type="button"
                                onClick={() => moveSection(secKey, 'up')}
                                disabled={index === 0}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title={lang === 'en' ? 'Move Up' : 'Chuyển lên'}
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>

                              {/* Move Down */}
                              <button
                                type="button"
                                onClick={() => moveSection(secKey, 'down')}
                                disabled={index === sectionOrder.length - 1}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title={lang === 'en' ? 'Move Down' : 'Chuyển xuống'}
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete if custom */}
                              {isCustom && customSec && (
                                <button
                                  type="button"
                                  onClick={() => removeCustomSection(customSec.id)}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  title={lang === 'en' ? 'Delete this custom section' : 'Xóa mục tùy chỉnh này'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Custom Section Button & Presets Menu */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddSectionMenu(!showAddSectionMenu)}
                        className="w-full py-2 px-3 rounded-xl border border-dashed border-indigo-500/40 hover:border-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                      >
                        <PlusCircle className="w-4 h-4 text-indigo-400" />
                        <span>{lang === 'en' ? 'Add Custom Section' : 'Thêm mục tùy chỉnh mới'}</span>
                      </button>

                      {showAddSectionMenu && (
                        <div className="mt-2 p-2.5 rounded-xl bg-[#0e131f] border border-indigo-500/30 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block px-1">
                            {lang === 'en' ? 'CHOOSE A PRESET TO ADD:' : 'CHỌN MẪU MỤC ĐỂ THÊM NHANH:'}
                          </span>
                          <div className="space-y-1">
                            {CUSTOM_SECTION_PRESETS.map((preset) => {
                              const PresetIcon = preset.icon;
                              return (
                                <button
                                  key={preset.presetId}
                                  type="button"
                                  onClick={() => {
                                    addCustomSection(preset.presetId);
                                    setShowAddSectionMenu(false);
                                  }}
                                  className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:border-white/20 border border-transparent transition-all flex items-center space-x-2.5 cursor-pointer group/preset"
                                >
                                  <div className="p-1.5 rounded-md bg-indigo-500/20 text-indigo-300 group-hover/preset:bg-indigo-500 group-hover/preset:text-white transition-colors shrink-0">
                                    <PresetIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold text-white truncate">
                                      {lang === 'en' ? preset.labelEn : preset.labelVi}
                                    </div>
                                    <div className="text-[10px] text-neutral-400 truncate">
                                      {lang === 'en' ? preset.descEn : preset.descVi}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Canvas Zoom Presets */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'ZOOM PRESETS' : 'TỶ LỆ THU PHÓNG'}
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[75, 90, 100, 120].map((z) => (
                        <button
                          key={z}
                          onClick={() => setZoom(z)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border text-center transition-all cursor-pointer ${
                            zoom === z
                              ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                              : 'bg-[#111827] border-white/5 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {z}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
  );
};

export default LayoutTab;
