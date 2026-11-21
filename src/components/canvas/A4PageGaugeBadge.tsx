'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FileText, AlertTriangle, CheckCircle2, Sparkles, Info } from 'lucide-react';
import type { A4PageMetrics } from '@/types/a4PageGauge';
import { A4_STATUS_STYLES, A4_TEXTS } from '@/constants/a4PageConstants';

export interface A4PageGaugeBadgeProps {
  metrics: A4PageMetrics;
  lang?: 'vi' | 'en';
  onAutoFit?: () => void;
  className?: string;
}

export const A4PageGaugeBadge: React.FC<A4PageGaugeBadgeProps> = ({
  metrics,
  lang = 'vi',
  onAutoFit,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const style = A4_STATUS_STYLES[metrics.status];
  const texts = A4_TEXTS[lang] || A4_TEXTS.vi;

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Clamp bar width between 5% and 100%
  const progressWidth = Math.min(100, Math.max(5, metrics.fillPercentage));

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Clickable Badge Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-all text-xs font-mono font-medium cursor-pointer select-none ${style.bgColor} ${style.borderColor} ${style.textColor} hover:brightness-110 shadow-sm`}
        title={metrics.recommendations[0] || ''}
      >
        {metrics.isOverflow ? (
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-rose-400" />
        ) : metrics.status === 'optimal' ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <FileText className="w-3.5 h-3.5 opacity-80" />
        )}

        <span>{metrics.contentHeightPx > 0 ? `${metrics.fillPercentage}% A4` : '--% A4'}</span>

        {/* Mini Progress Bar */}
        <div className="w-8 h-1.5 bg-black/40 rounded-full overflow-hidden hidden sm:block border border-white/10">
          <div
            className={`h-full transition-all duration-300 rounded-full ${style.barColor}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        {metrics.contentHeightPx > 0 && (
          <span className="hidden md:inline font-sans text-[11px] font-normal opacity-90">
            • {metrics.statusLabel}
          </span>
        )}
      </button>

      {/* Detail Popover */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 mt-2 w-72 p-3.5 rounded-xl bg-[#161B26] border border-white/15 shadow-2xl z-50 text-xs text-neutral-300 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
            <div className="flex items-center space-x-1.5 font-semibold text-white">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'A4 Page Capacity' : 'Độ chứa trang A4'}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${style.badgeBg} ${style.textColor}`}>
              {metrics.fillPercentage}%
            </span>
          </div>

          {/* Progress bar with percentage */}
          <div className="mb-2.5">
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full transition-all duration-300 rounded-full ${style.barColor}`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
              <span>0%</span>
              <span className="text-amber-400">100% (1 Trang)</span>
              <span>150%</span>
            </div>
          </div>

          {/* Recommendation message */}
          <p className="text-[11px] leading-relaxed text-neutral-300 mb-3 bg-white/5 p-2 rounded-lg border border-white/5">
            {metrics.recommendations[0]}
          </p>

          {/* Overflow Auto-fit Action */}
          {metrics.isOverflow && onAutoFit && (
            <button
              type="button"
              onClick={() => {
                onAutoFit();
                setIsOpen(false);
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{texts.autoFitBtn}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
