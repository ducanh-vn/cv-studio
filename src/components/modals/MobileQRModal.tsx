'use client';

import React from 'react';
import {
  QrCode,
  Download,
  Loader2,
} from 'lucide-react';
import type { Language } from '@/types/cvBuilder';

export interface MobileQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Record<string, string>;
  shareQrDataUrl: string;
  handleDownloadShareQr: () => void;
}

export function MobileQRModal({
  isOpen,
  onClose,
  lang,
  t,
  shareQrDataUrl,
  handleDownloadShareQr,
}: MobileQRModalProps) {
  if (!isOpen) return null;

  return (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#111622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center p-6 text-center animate-in zoom-in-95 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{t.publicScanQrBtn}</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                {lang === 'en'
                  ? 'Scan this QR code with your mobile camera or Zalo to open this interactive CV instantly on your phone.'
                  : 'Mở ứng dụng Camera hoặc Zalo trên điện thoại để quét và trải nghiệm bản CV trực tuyến.'}
              </p>
            </div>

            {shareQrDataUrl ? (
              <div className="p-3 bg-white rounded-2xl border-4 border-cyan-500/30 shadow-2xl">
                <img src={shareQrDataUrl} alt="Public CV QR" className="w-52 h-52 object-contain" />
              </div>
            ) : (
              <div className="w-52 h-52 rounded-2xl bg-neutral-800 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
              </div>
            )}

            <div className="flex items-center space-x-2 w-full pt-1">
              <button
                type="button"
                onClick={handleDownloadShareQr}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.shareDownloadQrBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
  );
}

export default MobileQRModal;
