'use client';

import React from 'react';
import {
  PhoneCall,
  Mail,
  Send,
  ExternalLink,
  Globe2,
  FolderGit2,
  Globe,
  X,
} from 'lucide-react';
import type { CVData, Language } from '@/types/cvBuilder';

export interface ContactCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Record<string, string>;
  cv: CVData;
  privacyHidePhone?: boolean;
}

export function ContactCandidateModal({
  isOpen,
  onClose,
  lang,
  t,
  cv,
  privacyHidePhone = false,
}: ContactCandidateModalProps) {
  if (!isOpen) return null;

  return (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#111622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0E121B] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{t.publicContactBtn}</h3>
                  <p className="text-xs text-neutral-400">{cv.name || 'Nguyễn Đức Anh'} • {cv.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onClose()}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              {cv.email && (
                <a
                  href={`mailto:${cv.email}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090C13] border border-white/10 hover:border-emerald-500/50 hover:bg-white/5 transition-all text-neutral-200 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">Email trực tiếp</div>
                      <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">{cv.email}</div>
                    </div>
                  </div>
                  <Send className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
                </a>
              )}

              {cv.phone && !privacyHidePhone && (
                <a
                  href={`tel:${cv.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090C13] border border-white/10 hover:border-cyan-500/50 hover:bg-white/5 transition-all text-neutral-200 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">Số điện thoại</div>
                      <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">{cv.phone}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
                </a>
              )}

              {cv.linkedin && (
                <a
                  href={cv.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090C13] border border-white/10 hover:border-[#0A66C2]/50 hover:bg-white/5 transition-all text-neutral-200 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#0A66C2]/10 text-[#70B5F9] shrink-0">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">LinkedIn Profile</div>
                      <div className="font-semibold text-white group-hover:text-[#70B5F9] transition-colors truncate">{cv.linkedin}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
                </a>
              )}

              {cv.github && (
                <a
                  href={cv.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090C13] border border-white/10 hover:border-purple-500/50 hover:bg-white/5 transition-all text-neutral-200 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">GitHub Profile</div>
                      <div className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate">{cv.github}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
                </a>
              )}

              {cv.website && (
                <a
                  href={cv.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090C13] border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all text-neutral-200 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">Portfolio Website</div>
                      <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">{cv.website}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
                </a>
              )}
            </div>

            <div className="p-4 bg-[#0E121B] border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
  );
}

export default ContactCandidateModal;
