'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Github, Loader2, Cloud } from 'lucide-react';
import type { AuthUser, AuthProvider } from '@/types/auth';
import { AUTH_TEXTS } from '@/constants/authConstants';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'vi' | 'en';
  onLoginSuccess?: (user: AuthUser) => void;
  loginWithProvider: (provider: 'google' | 'github') => Promise<AuthUser>;
}

export function AuthModal({
  isOpen,
  onClose,
  lang = 'vi',
  onLoginSuccess,
  loginWithProvider,
}: AuthModalProps) {
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(null);
  const t = AUTH_TEXTS[lang] || AUTH_TEXTS.vi;

  if (!isOpen) return null;

  const handleLogin = async (provider: 'google' | 'github') => {
    try {
      setLoadingProvider(provider);
      const user = await loginWithProvider(provider);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      onClose();
    } catch (err) {
      console.error('[AuthModal] Login error:', err);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f141f] shadow-2xl overflow-hidden p-6 text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center pt-2 pb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3 shadow-inner">
            <Cloud className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">{t.modalTitle}</h2>
          <p className="text-xs text-neutral-400 mt-1.5 px-4 leading-relaxed">
            {t.modalSubtitle}
          </p>
        </div>

        {/* Safety & Merge Guarantee Banner */}
        <div className="mb-4 p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-emerald-300 block">{t.mergeNoticeTitle}</span>
            <span className="text-neutral-300 text-[11px] leading-relaxed block mt-0.5">
              {t.mergeNoticeDesc}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Google Button */}
          <button
            type="button"
            disabled={loadingProvider !== null}
            onClick={() => handleLogin('google')}
            className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loadingProvider === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
            )}
            <span>{t.googleBtn}</span>
          </button>

          {/* GitHub Button */}
          <button
            type="button"
            disabled={loadingProvider !== null}
            onClick={() => handleLogin('github')}
            className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl border border-white/15 bg-neutral-800/80 hover:bg-neutral-800 text-white text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loadingProvider === 'github' ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Github className="w-4 h-4 text-white" />
            )}
            <span>{t.githubBtn}</span>
          </button>
        </div>

        {/* Value Propositions */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
          <div className="flex items-center space-x-2 text-[11px] text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{t.benefit1}</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{t.benefit2}</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{t.benefit3}</span>
          </div>
        </div>

        {/* Continue as Guest Button */}
        <div className="mt-4 pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors underline underline-offset-4 cursor-pointer"
          >
            {t.stayGuestBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
