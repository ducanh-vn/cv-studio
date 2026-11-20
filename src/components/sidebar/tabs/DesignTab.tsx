'use client';

import React from 'react';
import {
  LayoutTemplate,
  Grid,
  Check,
  Camera,
  Upload,
  Trash2,
  QrCode,
  ExternalLink,
  Copy,
  X,
  ChevronRight,
} from 'lucide-react';
import type {
  CVData,
  Language,
  TemplateId,
  TemplateDef,
  CVFontFamily,
  CanvasBgThemeId,
} from '@/types/cvBuilder';
import {
  TEMPLATES_COLLECTION,
  CV_FONT_OPTIONS,
  CANVAS_BG_THEMES,
} from '@/constants/cvConstants';
import { CVTypographySliders } from '@/components/CVTypographySliders';
import {
  CVQRConfig,
  QRPosition,
  QRColorMode,
  getQRTargetText,
  getDefaultQRLabel,
  ensureQRConfig,
} from '@/lib/cvQRCode';
import type { CVTypographyConfig } from '@/lib/cvTypography';

export interface DesignTabProps {
  lang: Language;
  t: any;
  activeTemplateDef: TemplateDef;
  template: TemplateId;
  setTemplate: (template: TemplateId) => void;
  setShowGalleryModal: (show: boolean) => void;
  accentColor: 'blue' | 'yellow' | 'emerald' | 'slate' | 'rose';
  setAccentColor: (color: 'blue' | 'yellow' | 'emerald' | 'slate' | 'rose') => void;
  fontFamily: string;
  setFontFamily: (font: any) => void;
  canvasBgTheme: string;
  handleSelectCanvasBgTheme: (themeId: CanvasBgThemeId) => void;
  typographyConfig: CVTypographyConfig;
  setTypographyConfig: (config: CVTypographyConfig) => void;
  cv: CVData;
  setCv: React.Dispatch<React.SetStateAction<CVData>>;
  triggerAvatarUpload: () => void;
  handleRemoveAvatar: () => void;
  activeQrConfig: CVQRConfig;
  handleUpdateQRConfig: (updates: Partial<CVQRConfig>) => void;
  handleUpdateQRTargetUrl?: (newVal: string) => void;
  qrDataUrl: string;
  handleCopyQRUrl: (url: string) => void;
  qrCopied: boolean;
  setActiveRailTab?: (tab: any) => void;
  setContentSubTab?: (subTab: string) => void;
}

export const DesignTab: React.FC<DesignTabProps> = ({
  lang,
  t,
  activeTemplateDef,
  template,
  setTemplate,
  setShowGalleryModal,
  accentColor,
  setAccentColor,
  fontFamily,
  setFontFamily,
  canvasBgTheme,
  handleSelectCanvasBgTheme,
  typographyConfig,
  setTypographyConfig,
  cv,
  setCv,
  triggerAvatarUpload,
  handleRemoveAvatar,
  activeQrConfig,
  handleUpdateQRConfig,
  handleUpdateQRTargetUrl: customHandleUpdateQRTargetUrl,
  qrDataUrl,
  handleCopyQRUrl,
  qrCopied,
  setActiveRailTab,
  setContentSubTab,
}) => {
  const handleUpdateQRTargetUrl = customHandleUpdateQRTargetUrl || ((newVal: string) => {
    const currentTarget = activeQrConfig.targetType;
    if (currentTarget === 'website') {
      setCv((prev) => ({
        ...prev,
        website: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else if (currentTarget === 'linkedin') {
      setCv((prev) => ({
        ...prev,
        linkedin: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else if (currentTarget === 'github') {
      setCv((prev) => ({
        ...prev,
        github: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else {
      setCv((prev) => ({
        ...prev,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    }
  });

  return (
<div className="space-y-5">
                  {/* Active Template Card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                        {lang === 'en' ? 'CV TEMPLATE' : 'MẪU GIAO DIỆN'}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-medium">14 {lang === 'en' ? 'Templates' : 'Mẫu'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#111827] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                          <LayoutTemplate className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-xs">{activeTemplateDef.name}</div>
                          <div className="text-[10px] text-neutral-400">{activeTemplateDef.category}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowGalleryModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-medium text-[11px] transition-colors cursor-pointer"
                      >
                        {t.changeTemplate}
                      </button>
                    </div>

                    {/* Quick switcher thumbnails / cards */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {TEMPLATES_COLLECTION.slice(0, 6).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setTemplate(item.id)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                            template === item.id
                              ? 'bg-indigo-500/15 border-indigo-500 text-white font-semibold shadow-xs'
                              : 'bg-[#111827] border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/15'
                          }`}
                        >
                          <div className="text-[11px] truncate">{item.name}</div>
                          <div className="text-[9px] text-neutral-500 truncate">{item.category}</div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowGalleryModal(true)}
                      className="w-full py-1.5 text-center text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                    >
                      {lang === 'en' ? 'Browse all 14 templates →' : 'Khám phá tất cả 14 mẫu giao diện →'}
                    </button>
                  </div>

                  {/* Accent Color */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'ACCENT COLOR' : 'BẢNG MÀU CHỦ ĐẠO'}
                    </span>
                    <div className="grid grid-cols-5 gap-2 p-2.5 rounded-xl bg-[#111827] border border-white/10">
                      {(['blue', 'yellow', 'emerald', 'slate', 'rose'] as const).map((c) => {
                        const colorHex =
                          c === 'blue'
                            ? '#0284c7'
                            : c === 'yellow'
                            ? '#eab308'
                            : c === 'emerald'
                            ? '#10b981'
                            : c === 'slate'
                            ? '#475569'
                            : '#f43f5e';
                        const isSelected = accentColor === c;
                        return (
                          <button
                            key={c}
                            onClick={() => setAccentColor(c)}
                            className="flex flex-col items-center space-y-1 p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                            title={`Màu ${c}`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full transition-transform ${
                                isSelected ? 'scale-115 ring-2 ring-white ring-offset-2 ring-offset-[#111827]' : 'opacity-70 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: colorHex }}
                            />
                            <span className="text-[9px] text-neutral-400 capitalize">{c}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Typography & Modern CV Fonts */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                        {lang === 'en' ? 'TYPOGRAPHY & FONTS' : 'KIỂU CHỮ & PHÔNG CV'}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono font-medium">
                        {CV_FONT_OPTIONS.find((f) => f.id === fontFamily || (fontFamily === 'sans' && f.id === 'inter') || (fontFamily === 'serif' && f.id === 'merriweather') || (fontFamily === 'mono' && f.id === 'jetbrains'))?.name || 'Inter'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {lang === 'en'
                        ? 'Modern ATS-friendly fonts curated for tech, business & creative CVs.'
                        : 'Các phông chữ thịnh hành nhất hiện nay, chuẩn quét ATS và tối ưu trên trang A4.'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {CV_FONT_OPTIONS.map((f) => {
                        const isSelected =
                          fontFamily === f.id ||
                          (f.id === 'inter' && fontFamily === 'sans') ||
                          (f.id === 'merriweather' && fontFamily === 'serif') ||
                          (f.id === 'jetbrains' && fontFamily === 'mono');
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFontFamily(f.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                              isSelected
                                ? 'bg-indigo-500/15 border-indigo-500 text-white shadow-xs ring-1 ring-indigo-500/50'
                                : 'bg-[#111827] border-white/5 text-neutral-300 hover:text-white hover:border-white/20 hover:bg-[#161f30]'
                            }`}
                          >
                            <div className="flex items-start justify-between w-full mb-1">
                              <span
                                className="text-xl font-bold leading-none"
                                style={{ fontFamily: f.fontFamilyCss }}
                              >
                                Aa
                              </span>
                              {isSelected ? (
                                <span className="w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-indigo-400/40" />
                              ) : null}
                            </div>
                            <div>
                              <div
                                className="text-xs font-semibold tracking-tight text-neutral-100 truncate"
                                style={{ fontFamily: f.fontFamilyCss }}
                              >
                                {f.name}
                              </div>
                              <div className="text-[9px] text-indigo-300/80 font-medium mt-0.5 truncate">
                                {lang === 'en' ? f.tagEn : f.tagVi}
                              </div>
                            </div>
                          </button>
                        );
                      })}
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
                  <div className="pt-3 border-t border-white/10">
                    <CVTypographySliders
                      config={typographyConfig}
                      onChange={setTypographyConfig}
                      lang={lang}
                    />
                  </div>

                  {/* Avatar photo card */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'AVATAR PHOTO' : 'ẢNH THẺ ĐẠI DIỆN'}
                    </span>
                    <div className="p-3 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-300 font-medium">
                          {lang === 'en' ? 'Show photo on CV' : 'Hiển thị ảnh thẻ'}
                        </span>
                        <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-neutral-300 select-none">
                          <input
                            type="checkbox"
                            checked={cv.showAvatar}
                            onChange={(e) => setCv({ ...cv, showAvatar: e.target.checked })}
                            className="rounded border-neutral-700 text-indigo-500 focus:ring-0 accent-indigo-500 cursor-pointer"
                          />
                          <span className="text-[10px] text-neutral-400">{cv.showAvatar ? (lang === 'en' ? 'Visible' : 'Đang bật') : (lang === 'en' ? 'Hidden' : 'Đang ẩn')}</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          onClick={triggerAvatarUpload}
                          className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/10 hover:border-indigo-400 cursor-pointer relative group flex-shrink-0 bg-neutral-800 transition-colors"
                          title={lang === 'en' ? 'Click to upload photo from computer' : 'Nhấp để tải ảnh từ máy tính'}
                        >
                          {cv.avatar ? (
                            <img src={cv.avatar} alt={cv.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500">
                              <Camera className="w-5 h-5" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Upload className="w-4 h-4 text-indigo-300" />
                          </div>
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <button
                            onClick={triggerAvatarUpload}
                            className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center space-x-1.5 transition-colors text-xs shadow-xs cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{lang === 'en' ? 'Upload from device' : 'Tải ảnh từ máy tính'}</span>
                          </button>
                          {cv.avatar && (
                            <button
                              onClick={handleRemoveAvatar}
                              className="w-full py-1 px-3 rounded-lg border border-white/10 hover:border-rose-500 text-neutral-400 hover:text-rose-400 flex items-center justify-center space-x-1 transition-colors text-[11px] cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{lang === 'en' ? 'Remove photo' : 'Xóa ảnh'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic QR Code Section */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white text-xs">{t.qrCodeTitle}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeQrConfig.enabled}
                          onChange={(e) => handleUpdateQRConfig({ enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {t.qrCodeSubtitle}
                    </p>

                    {activeQrConfig.enabled && (
                      <div className="space-y-3 pt-1 border-t border-white/5">
                        {/* Target Selection Pills */}
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1.5 font-medium">
                            {t.qrTargetTypeLabel}
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            {[
                              { id: 'website' as const, label: t.qrTargetWebsite, icon: '🌐' },
                              { id: 'linkedin' as const, label: t.qrTargetLinkedin, icon: '💼' },
                              { id: 'github' as const, label: t.qrTargetGithub, icon: '🐙' },
                              { id: 'vcard' as const, label: t.qrTargetVcard, icon: '📇' },
                              { id: 'custom' as const, label: t.qrTargetCustom, icon: '🔗' },
                            ].map((target) => (
                              <button
                                key={target.id}
                                type="button"
                                onClick={() => {
                                  const defaultLabel = getDefaultQRLabel(target.id, lang);
                                  handleUpdateQRConfig({
                                    targetType: target.id,
                                    labelVi: lang === 'vi' ? defaultLabel : activeQrConfig.labelVi,
                                    labelEn: lang === 'en' ? defaultLabel : activeQrConfig.labelEn,
                                  });
                                }}
                                className={`px-2 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center space-x-1.5 ${
                                  target.id === 'custom' ? 'col-span-2' : ''
                                } ${
                                  activeQrConfig.targetType === target.id
                                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-semibold shadow-xs'
                                    : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                                }`}
                              >
                                <span>{target.icon}</span>
                                <span className="truncate">{target.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive URL Input for Website, LinkedIn, GitHub, or Custom */}
                        {activeQrConfig.targetType !== 'vcard' ? (
                          <div className="space-y-1.5 bg-neutral-900/80 p-2.5 rounded-lg border border-cyan-500/20">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-medium text-cyan-300 flex items-center space-x-1.5">
                                <span>
                                  {activeQrConfig.targetType === 'website' && '🌐'}
                                  {activeQrConfig.targetType === 'linkedin' && '💼'}
                                  {activeQrConfig.targetType === 'github' && '🐙'}
                                  {activeQrConfig.targetType === 'custom' && '🔗'}
                                </span>
                                <span>
                                  {activeQrConfig.targetType === 'website' && t.qrUrlWebsiteLabel}
                                  {activeQrConfig.targetType === 'linkedin' && t.qrUrlLinkedinLabel}
                                  {activeQrConfig.targetType === 'github' && t.qrUrlGithubLabel}
                                  {activeQrConfig.targetType === 'custom' && t.qrUrlCustomLabel}
                                </span>
                              </label>

                              {/* Quick Actions: Open & Copy */}
                              <div className="flex items-center space-x-1 text-[10px]">
                                {getQRTargetText(activeQrConfig, cv).startsWith('http') && (
                                  <a
                                    href={getQRTargetText(activeQrConfig, cv)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={t.qrOpenUrl}
                                    className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center space-x-1 transition-all cursor-pointer"
                                  >
                                    <ExternalLink className="w-2.5 h-2.5 text-cyan-400" />
                                    <span>{t.qrOpenUrl}</span>
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleCopyQRUrl(getQRTargetText(activeQrConfig, cv))}
                                  title={t.qrCopyUrl}
                                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center space-x-1 transition-all cursor-pointer"
                                >
                                  {qrCopied ? (
                                    <>
                                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                                      <span className="text-emerald-400">{lang === 'en' ? 'Copied' : 'Đã chép'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-2.5 h-2.5" />
                                      <span>{t.qrCopyUrl}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Direct URL Input */}
                            <div className="relative">
                              <input
                                type="text"
                                value={
                                  activeQrConfig.targetType === 'website'
                                    ? (cv.website || '')
                                    : activeQrConfig.targetType === 'linkedin'
                                    ? (cv.linkedin || '')
                                    : activeQrConfig.targetType === 'github'
                                    ? (cv.github || '')
                                    : (activeQrConfig.customUrl || '')
                                }
                                onChange={(e) => handleUpdateQRTargetUrl(e.target.value)}
                                placeholder={
                                  activeQrConfig.targetType === 'website'
                                    ? 'https://ducanh.dev'
                                    : activeQrConfig.targetType === 'linkedin'
                                    ? 'https://linkedin.com/in/ducanh-vn'
                                    : activeQrConfig.targetType === 'github'
                                    ? 'https://github.com/ducanh-vn'
                                    : t.qrCustomUrlPlaceholder
                                }
                                className="w-full bg-[#0B0E17] border border-white/15 rounded-lg pl-2.5 pr-7 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                              />
                              {(activeQrConfig.targetType === 'website'
                                ? cv.website
                                : activeQrConfig.targetType === 'linkedin'
                                ? cv.linkedin
                                : activeQrConfig.targetType === 'github'
                                ? cv.github
                                : activeQrConfig.customUrl) && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQRTargetUrl('')}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 cursor-pointer"
                                  title={lang === 'en' ? 'Clear' : 'Xóa'}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <p className="text-[10px] text-neutral-400 leading-tight">
                              {lang === 'en'
                                ? '✨ Directly edits the target link & updates QR code live on canvas.'
                                : '✨ Chỉnh sửa trực tiếp đường link & tự động cập nhật mã QR trên CV.'}
                            </p>
                          </div>
                        ) : (
                          /* vCard details box when 'vcard' */
                          <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-[11px] font-medium text-cyan-300 flex items-center space-x-1.5">
                                <span>📇</span>
                                <span>{lang === 'en' ? 'vCard Contact Card' : 'Danh thiếp liên hệ vCard:'}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveRailTab?.('content');
                                  setContentSubTab?.('profile');
                                }}
                                className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center space-x-0.5 cursor-pointer"
                              >
                                <span>{lang === 'en' ? 'Edit Profile' : 'Sửa Profile'}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[10px] text-neutral-400 leading-snug">
                              {t.qrUrlVcardNote}
                            </p>
                            <div className="bg-black/50 rounded p-2 text-[10px] space-y-0.5 text-neutral-300 font-mono border border-white/5">
                              <div className="truncate"><span className="text-neutral-500">Tên:</span> {cv.name || 'Nguyen Duc Anh'}</div>
                              <div className="truncate"><span className="text-neutral-500">Chức danh:</span> {cv.role || 'Software Engineer'}</div>
                              <div className="truncate"><span className="text-neutral-500">Email:</span> {cv.email || '(Chưa nhập)'}</div>
                              <div className="truncate"><span className="text-neutral-500">SĐT:</span> {cv.phone || '(Chưa nhập)'}</div>
                              <div className="truncate"><span className="text-neutral-500">Website:</span> {cv.website || '(Chưa nhập)'}</div>
                            </div>
                          </div>
                        )}

                        {/* Position & Color Controls */}
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <label className="block text-neutral-400 mb-1">{t.qrPositionLabel}</label>
                            <select
                              value={activeQrConfig.position}
                              onChange={(e) => handleUpdateQRConfig({ position: e.target.value as QRPosition })}
                              className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                            >
                              <option value="header">{t.qrPositionHeader}</option>
                              <option value="footer">{t.qrPositionFooter}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-neutral-400 mb-1">{t.qrColorModeLabel}</label>
                            <select
                              value={activeQrConfig.colorMode}
                              onChange={(e) => handleUpdateQRConfig({ colorMode: e.target.value as QRColorMode })}
                              className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                            >
                              <option value="dark">{t.qrColorDark}</option>
                              <option value="accent">{t.qrColorAccent}</option>
                            </select>
                          </div>
                        </div>

                        {/* Caption Input */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] text-neutral-400">{t.qrCaptionLabel}</label>
                            <label className="flex items-center space-x-1 text-[10px] text-neutral-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={activeQrConfig.showCaption}
                                onChange={(e) => handleUpdateQRConfig({ showCaption: e.target.checked })}
                                className="rounded bg-neutral-800 border-white/20 text-cyan-500 focus:ring-0"
                              />
                              <span>{t.qrShowCaption}</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            value={lang === 'en' ? activeQrConfig.labelEn : activeQrConfig.labelVi}
                            onChange={(e) => {
                              if (lang === 'en') {
                                handleUpdateQRConfig({ labelEn: e.target.value });
                              } else {
                                handleUpdateQRConfig({ labelVi: e.target.value });
                              }
                            }}
                            className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        {/* Live QR Preview in Drawer */}
                        {qrDataUrl && (
                          <div className="p-2.5 rounded-lg bg-neutral-900 border border-white/10 flex items-start space-x-3">
                            <div className="p-1 bg-white rounded-md shrink-0 shadow-xs mt-0.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={qrDataUrl} alt="QR Preview" className="w-12 h-12 object-contain" />
                            </div>
                            <div className="min-w-0 flex-1 text-[10px] space-y-1">
                              <div className="font-semibold text-white flex items-center justify-between">
                                <span>{t.qrLivePreview}</span>
                                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-normal">
                                  {lang === 'en' ? 'Auto-Sync' : 'Đồng bộ tức thì'}
                                </span>
                              </div>
                              <div
                                onClick={() => handleCopyQRUrl(getQRTargetText(activeQrConfig, cv))}
                                title={lang === 'en' ? 'Click to copy' : 'Nhấp để sao chép liên kết'}
                                className="text-cyan-300 font-mono text-[10px] break-all bg-black/60 p-1.5 rounded border border-cyan-500/20 hover:border-cyan-400/50 cursor-pointer transition-colors flex items-start justify-between group"
                              >
                                <span className="line-clamp-2 leading-relaxed">{getQRTargetText(activeQrConfig, cv)}</span>
                                <span className="shrink-0 ml-1.5 text-neutral-400 group-hover:text-cyan-300">
                                  {qrCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </span>
                              </div>
                              {getQRTargetText(activeQrConfig, cv).startsWith('http') && (
                                <div className="flex items-center space-x-2 pt-0.5">
                                  <a
                                    href={getQRTargetText(activeQrConfig, cv)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1 text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                                  >
                                    <ExternalLink className="w-2.5 h-2.5" />
                                    <span>{t.qrOpenUrl} ↗</span>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyQRUrl(getQRTargetText(activeQrConfig, cv))}
                                    className="inline-flex items-center space-x-1 text-[10px] text-neutral-400 hover:text-white cursor-pointer"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>{qrCopied ? t.qrUrlCopied : t.qrCopyUrl}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
  );
};

export default DesignTab;
