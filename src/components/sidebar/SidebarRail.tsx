'use client';

import React from 'react';
import {
  Palette,
  FileEdit,
  Sliders,
  Sparkles,
  FileJson,
  Mail,
  Kanban,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Language } from '@/types/cvBuilder';
import type { CVStrengthEvaluation } from '@/lib/cvStrength';

export type RailTabId = 'design' | 'content' | 'layout' | 'ai-ats' | 'data' | 'cover_letter';

export interface SidebarRailProps {
  isPreviewMode?: boolean;
  isPublicView?: boolean;
  t: Record<string, string>;
  lang?: Language;
  cvStrength: CVStrengthEvaluation;
  activeRailTab: RailTabId;
  setActiveRailTab: (tab: RailTabId) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setDocMode?: (mode: 'cv' | 'cover_letter') => void;
  onOpenJobTracker?: () => void;
}

export function SidebarRail({
  isPreviewMode = false,
  isPublicView = false,
  t,
  lang = 'vi',
  cvStrength,
  activeRailTab,
  setActiveRailTab,
  isDrawerOpen,
  setIsDrawerOpen,
  setDocMode,
  onOpenJobTracker,
}: SidebarRailProps) {
  if (isPreviewMode || isPublicView) return null;

  return (
    <nav className="no-print fixed bottom-0 inset-x-0 h-14 md:h-full md:static md:w-[70px] md:min-w-[70px] md:max-w-[70px] bg-[#111827]/95 md:bg-[#111827] backdrop-blur-md md:backdrop-blur-none border-t md:border-t-0 md:border-r border-white/10 flex flex-row md:flex-col items-center py-0 md:py-3 z-40 md:z-30 select-none flex-shrink-0 justify-between">
      {/* Navigation Tabs (Horizontal on mobile, vertical on desktop) */}
      <div className="w-full h-full flex flex-row md:flex-col items-center justify-around md:justify-start md:space-y-1">
        {[
          {
            id: 'design' as const,
            label: t.railDesign,
            icon: <Palette className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />,
            badge: null,
          },
          {
            id: 'content' as const,
            label: t.railContent,
            icon: <FileEdit className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />,
            badge: null,
          },
          {
            id: 'layout' as const,
            label: t.railLayout,
            icon: <Sliders className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />,
            badge: null,
          },
          {
            id: 'ai-ats' as const,
            label: t.railAiAts,
            icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1 text-amber-400" />,
            badge: (
              <span
                className={`absolute -top-1 -right-1 md:-right-2 text-[8px] md:text-[9px] font-bold font-mono px-1 py-0.2 rounded-full border leading-none shadow-xs ${
                  cvStrength.score >= 80
                    ? 'bg-emerald-500 text-white border-emerald-400'
                    : cvStrength.score >= 60
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-rose-500 text-white border-rose-400'
                }`}
              >
                {cvStrength.score}%
              </span>
            ),
          },
          {
            id: 'data' as const,
            label: t.railData,
            icon: <FileJson className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1 text-cyan-400" />,
            badge: null,
          },
          {
            id: 'cover_letter' as const,
            label: t.coverLetterNavTitle,
            icon: <Mail className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1 text-purple-400" />,
            badge: (
              <span className="absolute -top-1 -right-1 md:-right-2 text-[7px] md:text-[8px] font-bold font-mono px-1 py-0.2 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 leading-none shadow-xs">
                SYNC
              </span>
            ),
          },
        ].map((tab) => {
          const isActive = activeRailTab === tab.id && isDrawerOpen;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (activeRailTab === tab.id) {
                  setIsDrawerOpen(!isDrawerOpen);
                  if (tab.id !== 'cover_letter') {
                    setDocMode?.('cv');
                  }
                } else {
                  setActiveRailTab(tab.id);
                  if (tab.id === 'cover_letter') {
                    setDocMode?.('cover_letter');
                  } else {
                    setDocMode?.('cv');
                  }
                  setIsDrawerOpen(true);
                }
              }}
              className={`flex-1 md:flex-initial md:w-full h-full md:h-auto py-1 md:py-3 px-0.5 md:px-1 flex flex-col items-center justify-center relative transition-all cursor-pointer border-t-2 md:border-t-0 md:border-l-2 ${
                isActive
                  ? 'text-white bg-white/10 border-indigo-500'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border-transparent'
              }`}
              title={tab.label}
            >
              <div className="relative flex items-center justify-center">
                {tab.icon}
                {tab.badge}
              </div>
              <span className="text-[9px] md:text-[10px] font-medium tracking-tight text-center leading-tight mt-0.5 max-w-[48px] md:max-w-none truncate">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Nút Bảng theo dõi ứng tuyển (Kanban Tracker) */}
        {onOpenJobTracker && (
          <button
            type="button"
            onClick={onOpenJobTracker}
            className="flex-1 md:flex-initial md:w-full h-full md:h-auto py-1 md:py-3 px-0.5 md:px-1 flex flex-col items-center justify-center relative transition-all cursor-pointer text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border-t-2 md:border-t-0 md:border-l-2 border-transparent hover:border-emerald-500 group"
            title={lang === 'en' ? 'Job Application Kanban Tracker' : 'Bảng theo dõi ứng tuyển (Kanban)'}
          >
            <div className="relative flex items-center justify-center">
              <Kanban className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 md:-right-2 text-[7px] md:text-[8px] font-bold font-mono px-1 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 leading-none shadow-xs">
                JOB
              </span>
            </div>
            <span className="text-[9px] md:text-[10px] font-medium tracking-tight text-center leading-tight mt-0.5 text-neutral-300 group-hover:text-white max-w-[48px] md:max-w-none truncate">
              {lang === 'en' ? 'Tracker' : 'Ứng tuyển'}
            </span>
          </button>
        )}
      </div>

      {/* Bottom: Collapse / Expand Rail Toggle (Desktop only) */}
      <div className="hidden md:flex w-full px-2 pt-2 border-t border-white/10 flex-col items-center">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="w-full py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
          title={isDrawerOpen ? (lang === 'en' ? 'Collapse Drawer' : 'Thu gọn bảng công cụ') : (lang === 'en' ? 'Expand Drawer' : 'Mở rộng bảng công cụ')}
        >
          {isDrawerOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </nav>
  );
}

export default SidebarRail;
