'use client';

import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import type { A4PageMetrics } from '@/types/a4PageGauge';
import { A4_TEXTS } from '@/constants/a4PageConstants';

export interface A4PageOverflowOverlayProps {
  metrics: A4PageMetrics;
  lang?: 'vi' | 'en';
  onAutoFit?: () => void;
  isPublicView?: boolean;
}

export const A4PageOverflowOverlay: React.FC<A4PageOverflowOverlayProps> = ({
  metrics,
  lang = 'vi',
  onAutoFit,
  isPublicView = false,
}) => {
  if (isPublicView) return null;

  const texts = A4_TEXTS[lang] || A4_TEXTS.vi;
  const isOverflow = metrics.isOverflow;

  return (
    <>
      {/* 1-Page A4 Cutoff Indicator Line (Only visible on screen editor, never printed) */}
      <div
        className={`no-print absolute left-0 right-0 border-b-2 border-dashed z-30 pointer-events-none flex items-center justify-between px-3 select-none transition-colors duration-300 ${
          isOverflow ? 'border-rose-500' : 'border-amber-500/80'
        }`}
        style={{ top: '297mm' }}
      >
        <div className="flex items-center space-x-1.5">
          {isOverflow && (
            <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-t font-mono shadow-sm tracking-wide flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>{texts.overflow} (+{metrics.overflowPx}px)</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isOverflow && onAutoFit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAutoFit();
              }}
              className="pointer-events-auto bg-purple-600 hover:bg-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-t font-sans shadow-md flex items-center space-x-1 cursor-pointer transition-colors"
              title={texts.autoFitBtn}
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>{texts.autoFitBtn}</span>
            </button>
          )}

          <span
            className={`text-black text-[9px] font-bold px-2 py-0.5 rounded-t font-mono shadow-sm tracking-wide ${
              isOverflow ? 'bg-rose-500 text-white' : 'bg-amber-500 text-black'
            }`}
          >
            {texts.cutoffNotice}
          </span>
        </div>
      </div>

      {/* Overflow Background Highlight Zone (only when overflowing beyond 297mm) */}
      {isOverflow && (
        <div
          className="no-print absolute left-0 right-0 bottom-0 bg-rose-500/[0.04] border-x-2 border-b-2 border-rose-500/30 z-20 pointer-events-none transition-opacity duration-300"
          style={{ top: '297mm' }}
        >
          <div className="absolute top-2 left-3 flex items-center space-x-1 text-rose-500/80 font-mono text-[10px] font-semibold tracking-wider uppercase select-none">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Trang 2 / Page 2 Overflow</span>
          </div>
        </div>
      )}
    </>
  );
};
