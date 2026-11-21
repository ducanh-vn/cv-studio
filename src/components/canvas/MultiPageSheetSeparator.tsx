'use client';

import React from 'react';
import { FileText, ArrowDown, ArrowUp } from 'lucide-react';
import { CV_PAGE_TEXTS } from '@/constants/cvPageConstants';

export interface MultiPageSheetSeparatorProps {
  pageNumber: number;
  lang?: 'vi' | 'en';
  onScrollToPage?: (page: number) => void;
  isPublicView?: boolean;
}

export const MultiPageSheetSeparator: React.FC<MultiPageSheetSeparatorProps> = ({
  pageNumber,
  lang = 'vi',
  onScrollToPage,
  isPublicView = false,
}) => {
  const texts = CV_PAGE_TEXTS[lang] || CV_PAGE_TEXTS.vi;
  const previousPage = pageNumber - 1;
  const topMm = `${297 * previousPage}mm`;

  return (
    <div
      className="no-print absolute left-0 right-0 z-30 pointer-events-none select-none"
      style={{ top: topMm }}
    >
      {/* Dashed boundary demarcation line */}
      <div className="relative border-b-2 border-dashed border-cyan-500/80 flex items-center justify-between px-3 py-1">
        <div className="flex items-center space-x-1.5">
          <span className="bg-cyan-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-t font-mono shadow-sm tracking-wide flex items-center space-x-1">
            <FileText className="w-3 h-3 text-cyan-200" />
            <span>
              {texts.endOfPage(previousPage)} • {texts.startOfPage(pageNumber)}
            </span>
          </span>
        </div>

        {/* Quick jump navigation button */}
        {!isPublicView && onScrollToPage && (
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onScrollToPage(previousPage);
              }}
              className="pointer-events-auto bg-[#161B26]/90 hover:bg-[#161B26] text-neutral-300 hover:text-white border border-white/10 text-[9px] px-1.5 py-0.5 rounded-t flex items-center space-x-0.5 cursor-pointer transition-colors shadow-xs"
              title={texts.jumpToPage(previousPage)}
            >
              <ArrowUp className="w-2.5 h-2.5 text-cyan-400" />
              <span>P.{previousPage}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onScrollToPage(pageNumber);
              }}
              className="pointer-events-auto bg-[#161B26]/90 hover:bg-[#161B26] text-neutral-300 hover:text-white border border-white/10 text-[9px] px-1.5 py-0.5 rounded-t flex items-center space-x-0.5 cursor-pointer transition-colors shadow-xs"
              title={texts.jumpToPage(pageNumber)}
            >
              <ArrowDown className="w-2.5 h-2.5 text-cyan-400" />
              <span>P.{pageNumber}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
