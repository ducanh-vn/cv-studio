'use client';

import React from 'react';
import {
  Globe,
  Globe2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Loader2,
  Send,
  X,
} from 'lucide-react';
import type { Language } from '@/types/cvBuilder';

export interface PublicShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Record<string, string>;
  sharePublicUrl: string;
  shareQrDataUrl: string;
  isShareCopied: boolean;
  handleCopyShareUrl: () => void;
  handleDownloadShareQr: () => void;
  handleShareLinkedIn: () => void;
  handleShareEmail: () => void;
  handleShareTwitter: () => void;
  shareIncludeCoverLetter: boolean;
  setShareIncludeCoverLetter: (val: boolean) => void;
  shareAllowDownload: boolean;
  setShareAllowDownload: (val: boolean) => void;
  privacyHidePhone: boolean;
  setPrivacyHidePhone: (val: boolean) => void;
  privacyHideLocation: boolean;
  setPrivacyHideLocation: (val: boolean) => void;
  shareModalRef?: React.RefObject<HTMLDivElement>;
  setToastMessage?: (msg: string | null) => void;
}

export function PublicShareModal({
  isOpen,
  onClose,
  lang,
  t,
  sharePublicUrl,
  shareQrDataUrl,
  isShareCopied,
  handleCopyShareUrl,
  handleDownloadShareQr,
  handleShareLinkedIn,
  handleShareEmail,
  handleShareTwitter,
  shareIncludeCoverLetter,
  setShareIncludeCoverLetter,
  shareAllowDownload,
  setShareAllowDownload,
  privacyHidePhone,
  setPrivacyHidePhone,
  privacyHideLocation,
  setPrivacyHideLocation,
  shareModalRef,
  setToastMessage,
}: PublicShareModalProps) {
  if (!isOpen) return null;

  return (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            ref={shareModalRef}
            className="w-full max-w-2xl bg-[#111622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0E121B] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{t.shareModalTitle}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{t.shareModalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onClose()}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-neutral-300">
              {/* Public Link Box */}
              <div className="p-4 rounded-xl bg-[#090C13] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{t.shareUrlLabel}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Web View</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 truncate select-all">
                    {sharePublicUrl}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyShareUrl}
                    className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
                  >
                    {isShareCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isShareCopied ? t.shareCopiedBtn : t.shareCopyBtn}</span>
                  </button>
                  <a
                    href={sharePublicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs flex items-center space-x-1 transition-colors shrink-0"
                    title={t.shareOpenBtn}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.shareOpenBtn}</span>
                  </a>
                </div>
              </div>

              {/* QR Code & 1-Tap Social Share */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* QR Block */}
                <div className="p-4 rounded-xl bg-[#090C13] border border-white/10 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="font-bold text-white text-xs block mb-1">{t.shareQrTitle}</span>
                    <p className="text-[11px] text-neutral-400">
                      {lang === 'en'
                        ? 'Recruiters scan this on mobile to read your CV instantly.'
                        : 'Nhà tuyển dụng có thể dùng camera điện thoại để quét và xem ngay.'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3.5 pt-1">
                    {shareQrDataUrl ? (
                      <div className="p-1.5 rounded-xl bg-white border border-neutral-300 shadow-md shrink-0">
                        <img src={shareQrDataUrl} alt="QR Code" className="w-20 h-20" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
                        <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
                      </div>
                    )}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="text-[10px] text-neutral-400 font-mono">PNG • 240×240px</div>
                      <button
                        type="button"
                        onClick={handleDownloadShareQr}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 hover:text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>{t.shareDownloadQrBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1-Tap Share Buttons */}
                <div className="p-4 rounded-xl bg-[#090C13] border border-white/10 flex flex-col justify-between space-y-2.5">
                  <div>
                    <span className="font-bold text-white text-xs block mb-1">{t.shareSocialTitle}</span>
                    <p className="text-[11px] text-neutral-400">
                      {lang === 'en' ? 'Send direct link to recruiters and networks.' : 'Gửi nhanh tới nhà tuyển dụng qua các kênh phổ biến.'}
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={handleShareLinkedIn}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#0A66C2]/15 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/40 text-[#70B5F9] font-medium text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Globe2 className="w-3.5 h-3.5" />
                      <span>{t.shareViaLinkedin}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShareEmail}
                      className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-medium text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.shareViaEmail}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShareTwitter}
                      className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 font-medium text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{t.shareViaTwitter}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy & View Options */}
              <div className="p-4 rounded-xl bg-[#090C13] border border-white/10 space-y-3">
                <span className="font-bold text-white text-xs block">{t.sharePrivacyTitle}</span>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareIncludeCoverLetter}
                      onChange={(e) => setShareIncludeCoverLetter(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-neutral-300">{t.shareIncludeCoverLetter}</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareAllowDownload}
                      onChange={(e) => setShareAllowDownload(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-neutral-300">{t.shareAllowDownload}</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyHidePhone}
                      onChange={(e) => setPrivacyHidePhone(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-neutral-300">{t.shareHidePhone}</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyHideLocation}
                      onChange={(e) => setPrivacyHideLocation(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-neutral-300">{t.shareHideLocation}</span>
                  </label>
                </div>
              </div>

              {/* Embed Code (iFrame) */}
              <div className="p-4 rounded-xl bg-[#090C13] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{t.shareEmbedTitle}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const code = `<iframe src="${sharePublicUrl}" width="100%" height="900" frameborder="0"></iframe>`;
                      navigator.clipboard.writeText(code);
                      setToastMessage?.(lang === 'en' ? 'Embed code copied!' : 'Đã sao chép mã nhúng iFrame!');
                      setTimeout(() => setToastMessage?.(null), 2000);
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Sao chép mã</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 font-mono text-[11px] text-neutral-400 select-all overflow-x-auto">
                  {`<iframe src="${sharePublicUrl}" width="100%" height="900" frameborder="0"></iframe>`}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0E121B] border-t border-white/10 flex items-center justify-end">
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

export default PublicShareModal;
