'use client';

import React from 'react';
import {
  Mail,
  Gauge,
} from 'lucide-react';
import type {
  CVData,
  Language,
  TemplateId,
  TemplateDef,
  CVFontFamily,
  CanvasBgThemeOption,
} from '@/types/cvBuilder';
import { CVReadOnlyContext } from '@/components/canvas/CVReadOnlyContext';
import CoverLetterCanvas from '@/components/CoverLetterCanvas';
import { CVSkeletonLoading } from '@/components/canvas/CVSkeletonLoading';
import { CVTemplateSwitch } from '@/components/templates/CVTemplateSwitch';
import { CVTemplateProps } from '@/components/templates/types';
import { CVQRCodeFooter } from '@/components/CVQRCodeBlock';
import { CVQRConfig, getQRTargetText } from '@/lib/cvQRCode';
import type { CVTypographyConfig } from '@/lib/cvTypography';
import { CVStrengthEvaluation } from '@/lib/cvStrength';
import { CoverLetterData } from '@/lib/coverLetter';
import { useA4PageGauge } from '@/hooks/useA4PageGauge';
import { useCVPageLayout } from '@/hooks/useCVPageLayout';
import { A4PageGaugeBadge } from '@/components/canvas/A4PageGaugeBadge';
import { A4PageOverflowOverlay } from '@/components/canvas/A4PageOverflowOverlay';
import { MultiPageSheetSeparator } from '@/components/canvas/MultiPageSheetSeparator';
import { PageNavigatorControls } from '@/components/canvas/PageNavigatorControls';


export interface CVCanvasWorkspaceProps {
  currentCanvasBg: CanvasBgThemeOption;
  isPublicView: boolean;
  isPreviewMode?: boolean;
  docMode: 'cv' | 'cover_letter';
  setDocMode?: (mode: 'cv' | 'cover_letter') => void;
  lang: Language;
  t: any;
  activeTemplateDef: TemplateDef;
  isCompact: boolean;
  setIsCompact?: (compact: boolean | ((prev: boolean) => boolean)) => void;
  cvStrength: CVStrengthEvaluation;
  zoom: number;
  currentCoverLetter: CoverLetterData;
  template: TemplateId;
  accentColor: 'blue' | 'yellow' | 'emerald' | 'slate' | 'rose';
  fontFamily: CVFontFamily;
  handleUpdateCoverLetterField: (field: any, value: string) => void;
  isLoading: boolean;
  fontClass: string;
  typographyConfig: CVTypographyConfig;
  setTypographyConfig?: (config: CVTypographyConfig | ((prev: CVTypographyConfig) => CVTypographyConfig)) => void;
  commonTemplateProps: CVTemplateProps;
  activeQrConfig: CVQRConfig;
  qrDataUrl: string;
  activeColor: any;
  cv: CVData;
  paperRef?: React.RefObject<HTMLDivElement>;
}

export const CVCanvasWorkspace: React.FC<CVCanvasWorkspaceProps> = ({
  currentCanvasBg,
  isPublicView,
  isPreviewMode = false,
  docMode,
  setDocMode,
  lang,
  t,
  activeTemplateDef,
  isCompact,
  setIsCompact,
  cvStrength,
  zoom,
  currentCoverLetter,
  template,
  accentColor,
  fontFamily,
  handleUpdateCoverLetterField,
  isLoading,
  fontClass,
  typographyConfig,
  setTypographyConfig,
  commonTemplateProps,
  activeQrConfig,
  qrDataUrl,
  activeColor,
  cv,
  paperRef,
}) => {
  const internalPaperRef = React.useRef<HTMLDivElement>(null);
  const targetPaperRef = paperRef || internalPaperRef;

  const { metrics, autoFitToSinglePage } = useA4PageGauge({
    paperRef: targetPaperRef,
    lang,
    typographyConfig,
    setTypographyConfig,
    setIsCompact,
    dependencies: [cv, template, isCompact, typographyConfig, lang, isLoading],
  });

  const {
    multiPageInfo,
    pageMode,
    setPageMode,
    showPageNumbers,
    setShowPageNumbers,
    scrollToPage,
  } = useCVPageLayout({
    paperRef: targetPaperRef,
    lang,
    dependencies: [cv, template, isCompact, typographyConfig, lang],
  });
  return (
    <main
      className="flex-1 h-full overflow-y-auto relative flex flex-col items-center py-8 sm:py-12 px-4 sm:px-10 pb-32 no-scrollbar transition-all"
      style={currentCanvasBg.style}
    >
      {/* Minimal Floating Status Pill */}
      {!isPreviewMode && (
        <div className="no-print relative z-10 mb-4 px-3 sm:px-4 py-1.5 rounded-2xl sm:rounded-full bg-[#161B26]/90 border border-white/10 backdrop-blur-md shadow-lg text-[11px] text-neutral-400 flex items-center gap-1.5 sm:gap-2 select-none flex-wrap justify-center flex-shrink-0 max-w-full">
        {isPublicView ? (
          <>
            <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.publicVerifiedBadge}</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center space-x-1">
              <span className="text-neutral-500">{lang === 'en' ? 'Template:' : 'Mẫu:'}</span>
              <strong className="text-white font-medium capitalize">{activeTemplateDef.name}</strong>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-300">
              {lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-cyan-400 font-mono font-medium">A4 210 × 297 mm</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400">
              {lang === 'en' ? 'Verified Recruiter View' : 'Chế độ xem trực tuyến cho Nhà tuyển dụng'}
            </span>
          </>
        ) : docMode === 'cover_letter' ? (
          <>
            <span className="flex items-center space-x-1">
              <span className="text-purple-400 font-semibold flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Matching Cover Letter' : 'Thư xin việc đồng bộ'}</span>
              </span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center space-x-1">
              <span className="text-neutral-500">{lang === 'en' ? 'Template:' : 'Mẫu đồng bộ:'}</span>
              <strong className="text-white font-medium capitalize">{activeTemplateDef.name}</strong>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center space-x-1">
              <span>{lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-cyan-400 font-mono font-medium">A4 210 × 297 mm</span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="text-neutral-400 hidden sm:inline">
              {lang === 'en' ? 'Click any text on letter to edit directly' : 'Nhấp trực tiếp vào chữ trên thư để chỉnh sửa'}
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center space-x-1">
              <span className="text-neutral-500">{lang === 'en' ? 'Template:' : 'Mẫu:'}</span>
              <strong className="text-white font-medium">{activeTemplateDef.name}</strong>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center space-x-1">
              <span>{lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className={isCompact ? 'text-amber-400 font-medium' : 'text-neutral-400'}>
              {isCompact ? (lang === 'en' ? '1-Page Fit' : 'Chuẩn 1 trang A4') : (lang === 'en' ? 'Standard' : 'Tiêu chuẩn')}
            </span>
            <span className="text-neutral-600">•</span>
            {/* Live A4 Page Capacity Gauge Badge */}
            <A4PageGaugeBadge
              metrics={metrics}
              lang={lang}
              onAutoFit={autoFitToSinglePage}
            />
            {/* Multi-Page Navigator Controls */}
            {multiPageInfo.isMultiPage && (
              <>
                <span className="text-neutral-600">•</span>
                <PageNavigatorControls
                  multiPageInfo={multiPageInfo}
                  pageMode={pageMode}
                  onSelectMode={setPageMode}
                  onScrollToPage={scrollToPage}
                  showPageNumbers={showPageNumbers}
                  onTogglePageNumbers={() => setShowPageNumbers((p) => !p)}
                  lang={lang}
                  isPublicView={isPublicView}
                />
              </>
            )}
            <span className="text-neutral-600">•</span>
            <span
              className="flex items-center space-x-1 font-mono font-semibold"
              style={{
                color: cvStrength.score >= 90 ? '#34d399' : cvStrength.score >= 75 ? '#22d3ee' : cvStrength.score >= 50 ? '#fbbf24' : '#fb7185',
              }}
            >
              <Gauge className="w-3 h-3" />
              <span>{cvStrength.score}% ATS</span>
            </span>
            <span className="text-neutral-600 hidden xl:inline">•</span>
            <span className="text-neutral-400 hidden xl:inline">
              {lang === 'en' ? 'Click any text on CV to edit directly' : 'Nhấp trực tiếp vào chữ để sửa'}
            </span>
          </>
        )}
      </div>
      )}

      {/* Cover Letter Mode Indicator & Quick Return Banner */}
      {docMode === 'cover_letter' && !isPublicView && setDocMode && !isPreviewMode && (
        <div className="no-print mb-4 flex items-center space-x-2 bg-purple-900/60 border border-purple-500/30 text-purple-200 px-4 py-1.5 rounded-full text-xs shadow-lg backdrop-blur-md">
          <span>✉️ {lang === 'en' ? 'Matching Cover Letter' : 'Đang xem Thư xin việc'}</span>
          <button
            type="button"
            onClick={() => setDocMode('cv')}
            className="px-2.5 py-0.5 rounded-full bg-purple-500 hover:bg-purple-400 text-white font-medium text-[11px] transition-colors cursor-pointer ml-1"
          >
            {lang === 'en' ? '← Back to CV' : '← Quay lại chỉnh sửa CV'}
          </button>
        </div>
      )}

      <div
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
        }}
        className="transition-transform duration-200"
      >
        {/* ================= THE A4 SHEET ================= */}
        <CVReadOnlyContext.Provider value={isPublicView || isPreviewMode}>
          {docMode === 'cover_letter' ? (
            <CoverLetterCanvas
              coverLetter={currentCoverLetter}
              template={template}
              accentColor={accentColor}
              fontFamily={fontFamily}
              lang={lang}
              onUpdateField={handleUpdateCoverLetterField}
              isEditable={!isPublicView}
            />
          ) : isLoading ? (
            <CVSkeletonLoading />
          ) : (
            <div
              ref={targetPaperRef}
              id="cv-paper"
              className={`cv-paper bg-white text-neutral-900 shadow-2xl relative w-[210mm] min-h-[297mm] rounded-sm ${fontClass} ${
                isCompact ? 'cv-compact leading-snug' : 'leading-relaxed'
              } ${isPublicView ? 'cv-public-view' : ''} overflow-hidden animate-in fade-in duration-300`}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                ['--cv-body-size' as any]: `${typographyConfig.bodyFontSize}px`,
                ['--cv-heading-size' as any]: `${typographyConfig.headingFontSize}px`,
                ['--cv-line-height' as any]: `${typographyConfig.lineHeight}`,
                ['--cv-section-gap' as any]: `${typographyConfig.sectionSpacing}px`,
                ['--cv-item-gap' as any]: `${typographyConfig.itemSpacing}px`,
                ['--cv-pad-top-bottom' as any]: `${typographyConfig.pagePaddingTopBottom}px`,
                ['--cv-pad-left-right' as any]: `${typographyConfig.pagePaddingLeftRight}px`,
              }}
            >
              {/* If Single Page Mode or only 1 page: Show Single-page Cutoff Line & Overflow Overlay System */}
              {!isPreviewMode && !isPublicView && (
                pageMode === 'single' || !multiPageInfo.isMultiPage ? (
                  <A4PageOverflowOverlay
                    metrics={metrics}
                    lang={lang}
                    onAutoFit={autoFitToSinglePage}
                    isPublicView={isPublicView}
                  />
                ) : (
                  /* Multi-Page Sheet Demarcation Separators */
                  Array.from({ length: multiPageInfo.totalPages - 1 }, (_, i) => i + 2).map((pageNum) => (
                    <MultiPageSheetSeparator
                      key={pageNum}
                      pageNumber={pageNum}
                      lang={lang}
                      onScrollToPage={scrollToPage}
                      isPublicView={isPublicView}
                    />
                  ))
                )
              )}

              {/* Optional Subtle Page Number Indicators on Canvas sheets */}
              {showPageNumbers && multiPageInfo.totalPages > 1 && (
                <div className="no-print pointer-events-none select-none">
                  {multiPageInfo.sheets.map((s) => (
                    <div
                      key={s.pageNumber}
                      className="absolute right-6 text-[10px] text-neutral-400 font-mono tracking-wider opacity-75"
                      style={{ top: `${s.bottomPx - 22}px` }}
                    >
                      {cv.name} • {s.pageNumber} / {multiPageInfo.totalPages}
                    </div>
                  ))}
                </div>
              )}

              {/* Dynamic Template Switcher (10 Architectural Templates) */}
              <CVTemplateSwitch {...commonTemplateProps} templateId={template} />

              {/* Dynamic Personal QR Code Footer Strip */}
              {activeQrConfig.enabled && activeQrConfig.position === 'footer' && (
                <div className="px-8 pb-4 pt-2">
                  <CVQRCodeFooter
                    qrDataUrl={qrDataUrl}
                    config={activeQrConfig}
                    lang={lang}
                    accentColorHex={activeColor.primary}
                    candidateName={cv.name}
                    websiteUrl={getQRTargetText(activeQrConfig, cv)}
                  />
                </div>
              )}
            </div>
          )}
        </CVReadOnlyContext.Provider>
      </div>
    </main>
  );
};

export default CVCanvasWorkspace;
