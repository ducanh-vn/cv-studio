'use client';

import React from 'react';
import {
  Palette,
  FileEdit,
  Sliders,
  Sparkles,
  FileJson,
  Mail,
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
}: SidebarRailProps) {
  if (isPreviewMode || isPublicView) return null;

  return (
          <nav className="no-print w-[70px] min-w-[70px] max-w-[70px] bg-[#111827] border-r border-white/10 flex flex-col items-center py-3 z-30 select-none flex-shrink-0 justify-between">
            {/* Top Tabs */}
            <div className="w-full flex flex-col items-center space-y-1">
              {[
                {
                  id: 'design' as const,
                  label: t.railDesign,
                  icon: <Palette className="w-5 h-5 mb-1" />,
                  badge: null,
                },
                {
                  id: 'content' as const,
                  label: t.railContent,
                  icon: <FileEdit className="w-5 h-5 mb-1" />,
                  badge: null,
                },
                {
                  id: 'layout' as const,
                  label: t.railLayout,
                  icon: <Sliders className="w-5 h-5 mb-1" />,
                  badge: null,
                },
                {
                  id: 'ai-ats' as const,
                  label: t.railAiAts,
                  icon: <Sparkles className="w-5 h-5 mb-1 text-amber-400" />,
                  badge: (
                    <span
                      className={`absolute -top-1 -right-2 text-[9px] font-bold font-mono px-1 py-0.2 rounded-full border leading-none shadow-xs ${
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
                  icon: <FileJson className="w-5 h-5 mb-1 text-cyan-400" />,
                  badge: null,
                },
                {
                  id: 'cover_letter' as const,
                  label: t.coverLetterNavTitle,
                  icon: <Mail className="w-5 h-5 mb-1 text-purple-400" />,
                  badge: (
                    <span className="absolute -top-1 -right-2 text-[8px] font-bold font-mono px-1 py-0.2 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 leading-none shadow-xs">
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
                      } else {
                        setActiveRailTab(tab.id);
                        if (tab.id === 'cover_letter') {
                          setDocMode?.('cover_letter');
                        }
                        setIsDrawerOpen(true);
                      }
                    }}
                    className={`w-full py-3 px-1 flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                      isActive
                        ? 'text-white bg-white/10 border-l-2 border-indigo-500'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                    title={tab.label}
                  >
                    <div className="relative flex items-center justify-center">
                      {tab.icon}
                      {tab.badge}
                    </div>
                    <span className="text-[10px] font-medium tracking-tight text-center leading-tight mt-0.5">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom: Collapse / Expand Rail Toggle */}
            <div className="w-full px-2 pt-2 border-t border-white/10 flex flex-col items-center">
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
