'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layers, ChevronUp, ChevronDown, Check } from 'lucide-react';
import type { PageMode, MultiPageInfo } from '@/types/cvPageLayout';
import { PAGE_MODE_OPTIONS, CV_PAGE_TEXTS } from '@/constants/cvPageConstants';
import { formatPageLabel } from '@/lib/cvPageSplitter';

export interface PageNavigatorControlsProps {
  multiPageInfo: MultiPageInfo;
  pageMode: PageMode;
  onSelectMode: (mode: PageMode) => void;
  onScrollToPage: (pageNumber: number) => void;
  showPageNumbers?: boolean;
  onTogglePageNumbers?: () => void;
  lang?: 'vi' | 'en';
  isPublicView?: boolean;
}

export const PageNavigatorControls: React.FC<PageNavigatorControlsProps> = ({
  multiPageInfo,
  pageMode,
  onSelectMode,
  onScrollToPage,
  showPageNumbers = true,
  onTogglePageNumbers,
  lang = 'vi',
  isPublicView = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const texts = CV_PAGE_TEXTS[lang] || CV_PAGE_TEXTS.vi;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const { totalPages, currentPage, isMultiPage } = multiPageInfo;
  if (!isMultiPage && pageMode === 'auto') {
    return null;
  }

  const label = formatPageLabel(currentPage, totalPages, lang);

  return (
    <div className="relative inline-block no-print" ref={containerRef}>
      <div className="flex items-center space-x-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full px-2.5 py-0.5 text-xs font-mono font-medium shadow-xs">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center space-x-1 hover:text-white cursor-pointer select-none"
          title={texts.pageModeTooltip}
        >
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>{label}</span>
        </button>

        {!isPublicView && (
          <div className="flex items-center space-x-0.5 border-l border-cyan-500/30 pl-1 ml-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onScrollToPage(Math.max(1, currentPage - 1))}
              className="p-0.5 text-cyan-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title={texts.prevPage}
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onScrollToPage(Math.min(totalPages, currentPage + 1))}
              className="p-0.5 text-cyan-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title={texts.nextPage}
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Mode selection popover */}
      {isOpen && !isPublicView && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 p-3 rounded-xl bg-[#161B26] border border-white/15 shadow-2xl z-50 text-xs text-neutral-300 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="font-semibold text-white mb-2 pb-1.5 border-b border-white/10 flex items-center justify-between">
            <span>{texts.pageModeTooltip}</span>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">
              {totalPages} A4
            </span>
          </div>

          <div className="space-y-1.5 mb-2.5">
            {PAGE_MODE_OPTIONS.map((opt) => {
              const isSelected = pageMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelectMode(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'hover:bg-white/5 text-neutral-300'
                  }`}
                >
                  <div>
                    <div className="font-medium">
                      {lang === 'en' ? opt.labelEn : opt.labelVi}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      {lang === 'en' ? opt.descEn : opt.descVi}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {onTogglePageNumbers && (
            <label className="flex items-center space-x-2 pt-2 border-t border-white/10 text-[11px] text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPageNumbers}
                onChange={onTogglePageNumbers}
                className="rounded border-neutral-600 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <span>{texts.showNumbersLabel}</span>
            </label>
          )}
        </div>
      )}
    </div>
  );
};
