'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Grid,
  X,
  Check,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import type {
  CanvasBgThemeId,
  CanvasBgThemeOption,
  Language,
} from '@/types/cvBuilder';
import { CANVAS_BG_THEMES } from '@/constants/cvConstants';
import type { ImageExportFormat, ExportResolution } from '@/lib/exportImage';

export interface CanvasFloatingControlsProps {
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  lang: Language;
  canvasBgTheme: CanvasBgThemeId | string;
  handleSelectCanvasBgTheme: (themeId: CanvasBgThemeId) => void;
  currentCanvasBg: CanvasBgThemeOption;
  isPreviewMode: boolean;
  setIsPreviewMode: (preview: boolean) => void;
  isPublicView?: boolean;
  handlePrint?: () => void;
  handleExportImage?: (format: ImageExportFormat, resolution: ExportResolution) => void;
  isExportingImage?: boolean;
}

export const CanvasFloatingControls: React.FC<CanvasFloatingControlsProps> = ({
  zoom,
  setZoom,
  lang,
  canvasBgTheme,
  handleSelectCanvasBgTheme,
  currentCanvasBg,
  isPreviewMode,
  setIsPreviewMode,
  isPublicView = false,
  handlePrint,
  handleExportImage,
  isExportingImage = false,
}) => {
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const bgPickerRef = useRef<HTMLDivElement>(null);

  // Close bg picker when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bgPickerRef.current && !bgPickerRef.current.contains(e.target as Node)) {
        setIsBgPickerOpen(false);
      }
    }
    if (isBgPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isBgPickerOpen]);

  return (
    <>
      {/* Floating Zoom & Canvas Background Control Pill - Fixed at Bottom Right of Editor Canvas */}
      {!isPreviewMode && !isPublicView && (
        <div className="no-print fixed bottom-16 right-3 md:absolute md:bottom-6 md:right-6 z-30 flex items-center bg-[#161B26]/95 border border-white/10 rounded-full p-1 text-xs shadow-2xl backdrop-blur-md select-none transition-all hover:bg-[#161B26] hover:border-white/20">
          <button
            type="button"
            onClick={() => setZoom(Math.max(30, zoom - 10))}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title={lang === 'en' ? 'Zoom Out (-10%)' : 'Thu nhỏ (-10%)'}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                if (zoom <= 55) {
                  setZoom(90);
                } else {
                  const padding = 24;
                  const availableWidth = Math.max(280, window.innerWidth - padding);
                  const fitZoom = Math.max(35, Math.min(80, Math.floor((availableWidth / 794) * 100)));
                  setZoom(fitZoom);
                }
              } else {
                setZoom(zoom === 100 ? 90 : 100);
              }
            }}
            className="px-2 py-0.5 font-mono text-[11px] text-neutral-200 hover:text-white font-medium select-none cursor-pointer hover:bg-white/5 rounded-full transition-colors"
            title={lang === 'en' ? 'Click to toggle zoom' : 'Nhấp để chuyển đổi mức zoom'}
          >
            {zoom}%
          </button>
          <button
            type="button"
            onClick={() => setZoom(Math.min(150, zoom + 10))}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title={lang === 'en' ? 'Zoom In (+10%)' : 'Phóng to (+10%)'}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Vertical Divider */}
          <div className="w-px h-3.5 bg-white/15 mx-1" />

          {/* Quick Canvas Background Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsBgPickerOpen(!isBgPickerOpen)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                isBgPickerOpen
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
              title={lang === 'en' ? 'Change Workspace Canvas Background' : 'Tùy chọn nền bàn làm việc'}
            >
              <Grid className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300" />
              <span className="hidden sm:inline text-[10px]">{currentCanvasBg.previewBadge}</span>
            </button>

            {/* Floating Quick Background Popover */}
            {isBgPickerOpen && (
              <div
                ref={bgPickerRef}
                className="absolute bottom-full right-0 mb-3 w-72 bg-[#121722]/98 border border-white/15 rounded-2xl p-3 shadow-2xl backdrop-blur-xl z-50 text-xs animate-in fade-in zoom-in-95 space-y-2.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-1.5">
                    <Grid className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold text-white text-[11px] uppercase tracking-wider">
                      {lang === 'en' ? 'Canvas Background' : 'Họa tiết nền Workspace'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBgPickerOpen(false)}
                    className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto no-scrollbar">
                  {CANVAS_BG_THEMES.map((theme) => {
                    const isSelected = canvasBgTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          handleSelectCanvasBgTheme(theme.id);
                        }}
                        className={`p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                          isSelected
                            ? 'bg-[#182338] border-cyan-500 ring-1 ring-cyan-500/50 shadow-sm'
                            : 'bg-[#111827] border-white/10 hover:border-white/20 hover:bg-[#161F30]'
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded-lg border border-white/10 mb-1.5 relative overflow-hidden flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                          style={{
                            backgroundColor: theme.previewBg,
                            backgroundImage: theme.previewPattern || 'none',
                            backgroundSize: theme.style.backgroundSize || 'auto',
                          }}
                        >
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className={`text-[11px] font-semibold truncate ${isSelected ? 'text-cyan-300' : 'text-neutral-200'}`}>
                            {lang === 'en' ? theme.nameEn : theme.nameVi}
                          </div>
                          <div className="text-[9px] text-neutral-400 truncate mt-0.5">
                            {theme.previewBadge}
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
      )}

      {/* ================= FULLSCREEN PREVIEW EXIT PILL ================= */}
      {isPreviewMode && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#161B26]/95 border border-white/20 backdrop-blur-xl px-4 py-2 rounded-full shadow-2xl flex items-center space-x-3 text-xs text-neutral-200 select-none animate-in fade-in slide-in-from-bottom duration-200">
          <button
            onClick={() => setIsPreviewMode(false)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'en' ? 'Exit Preview (ESC)' : 'Thoát xem trước (ESC)'}</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 hover:text-white rounded cursor-pointer"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-white">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1 hover:text-white rounded cursor-pointer"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          {handlePrint && (
            <>
              <div className="h-4 w-px bg-white/10" />
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
                title="Xuất PDF in ấn"
              >
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>PDF</span>
              </button>
            </>
          )}
          {handleExportImage && (
            <button
              onClick={() => handleExportImage('png', 2)}
              disabled={isExportingImage}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
              title="Xuất ảnh PNG sắc nét (300 DPI)"
            >
              {isExportingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
              <span>{isExportingImage ? (lang === 'en' ? 'Exporting...' : 'Đang xuất...') : (lang === 'en' ? 'PNG (HD)' : 'Ảnh PNG (HD)')}</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default CanvasFloatingControls;
