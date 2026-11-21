'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Cloud,
  CheckCircle,
  Loader2,
  LogOut,
  RefreshCw,
  ChevronDown,
  User,
  Github,
} from 'lucide-react';
import type { AuthUser, SyncStatus } from '@/types/auth';
import { AUTH_TEXTS } from '@/constants/authConstants';
import { formatLastSyncedTime } from '@/lib/authHelpers';

export interface UserSyncMenuProps {
  user: AuthUser;
  isAuthenticated: boolean;
  isGuest: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  lang?: 'vi' | 'en';
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onTriggerSync: () => Promise<boolean>;
}

export function UserSyncMenu({
  user,
  isAuthenticated,
  isGuest,
  syncStatus,
  lastSyncedAt,
  isSyncing,
  lang = 'vi',
  onOpenAuthModal,
  onLogout,
  onTriggerSync,
}: UserSyncMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = AUTH_TEXTS[lang] || AUTH_TEXTS.vi;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // If in Guest mode, render one-click trigger button to open AuthModal
  if (isGuest || !isAuthenticated) {
    return (
      <button
        type="button"
        onClick={onOpenAuthModal}
        className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
        title={t.guestBadge}
      >
        <Cloud className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden lg:inline">{lang === 'en' ? 'Sync Cloud' : 'Đồng bộ Cloud'}</span>
      </button>
    );
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  const firstName = user.name ? user.name.split(' ')[0] : 'User';
  const relativeSyncedTime = formatLastSyncedTime(lastSyncedAt, lang);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button when Authenticated */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#161B26] hover:bg-white/5 text-neutral-200 hover:text-white text-xs font-medium transition-colors cursor-pointer"
        title={t.syncedBadge}
      >
        {/* Avatar */}
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-5 h-5 rounded-full object-cover border border-cyan-400/40"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
            {userInitial}
          </div>
        )}

        {/* User Name & Status */}
        <span className="hidden md:inline font-medium max-w-[90px] truncate text-neutral-200">
          {firstName}
        </span>

        {/* Sync Icon */}
        {isSyncing ? (
          <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        )}

        <ChevronDown className="w-3 h-3 text-neutral-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 bg-[#0f141f] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Profile Card */}
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 mb-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-cyan-400/50"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-sm font-bold">
                {userInitial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-white truncate block">
                  {user.name}
                </span>
                {user.provider === 'github' && (
                  <Github className="w-3 h-3 text-neutral-400 shrink-0" />
                )}
              </div>
              <span className="text-[11px] text-neutral-400 truncate block">
                {user.email}
              </span>
            </div>
          </div>

          {/* Cloud Sync State Details */}
          <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isSyncing ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <div className="text-[11px]">
                <span className="font-medium text-emerald-300 block">
                  {isSyncing ? t.syncingBadge : t.syncedBadge}
                </span>
                <span className="text-neutral-400 text-[10px] block">
                  {t.lastSyncedPrefix}{relativeSyncedTime}
                </span>
              </div>
            </div>

            {/* Manual Sync Button */}
            <button
              type="button"
              disabled={isSyncing}
              onClick={() => onTriggerSync()}
              className="p-1.5 rounded-md hover:bg-emerald-500/20 text-emerald-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title={t.syncNowBtn}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-white/10" />

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-500/10 transition-colors text-xs font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.signOutBtn}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserSyncMenu;
