'use client';

import React from 'react';
import { Layers, X } from 'lucide-react';
import type { Language } from '@/types/cvBuilder';

export interface NewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  newProfileName: string;
  setNewProfileName: (val: string) => void;
  newProfileRole: string;
  setNewProfileRole: (val: string) => void;
  newProfileCloneFromCurrent: boolean;
  setNewProfileCloneFromCurrent: (val: boolean) => void;
  onCreateProfile: () => void;
}

export function NewProfileModal({
  isOpen,
  onClose,
  lang,
  newProfileName,
  setNewProfileName,
  newProfileRole,
  setNewProfileRole,
  newProfileCloneFromCurrent,
  setNewProfileCloneFromCurrent,
  onCreateProfile,
}: NewProfileModalProps) {
  if (!isOpen) return null;

  return (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
          <div className="w-full max-w-md bg-[#161B26] border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lang === 'en' ? 'Create New CV Profile' : 'Tạo Phiên Bản CV Mới'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {lang === 'en'
                      ? 'Tailor your CV for specific roles or companies'
                      : 'Tùy biến nội dung cho từng vị trí hoặc công ty mục tiêu'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onClose()}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {lang === 'en' ? 'Profile Name' : 'Tên phiên bản CV'} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'e.g., Senior Frontend Engineer' : 'Ví dụ: Senior Frontend Engineer (React focus)'}
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-lg text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {lang === 'en' ? 'Target Role / Job Title' : 'Vị trí công việc mục tiêu'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'e.g., Frontend Specialist' : 'Ví dụ: Frontend Lead / React Specialist'}
                  value={newProfileRole}
                  onChange={(e) => setNewProfileRole(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-lg text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProfileCloneFromCurrent}
                    onChange={(e) => setNewProfileCloneFromCurrent(e.target.checked)}
                    className="rounded border-white/20 bg-neutral-800 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-white font-medium">
                    {lang === 'en' ? 'Clone content from current CV' : 'Sao chép nội dung từ phiên bản CV hiện tại'}
                  </span>
                </label>
                <p className="text-[11px] text-neutral-400 pl-6 leading-relaxed">
                  {newProfileCloneFromCurrent
                    ? 'Giữ lại toàn bộ kinh nghiệm, học vấn và kỹ năng của bản hiện tại để bạn chỉ việc chỉnh sửa nhanh.'
                    : 'Bắt đầu với một bản mẫu mặc định ban đầu.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Cancel' : 'Hủy'}
              </button>
              <button
                type="button"
                onClick={onCreateProfile}
                disabled={!newProfileName.trim()}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer transition-all"
              >
                {lang === 'en' ? 'Create Profile' : 'Tạo Phiên Bản'}
              </button>
            </div>
          </div>
        </div>
  );
}

export default NewProfileModal;
