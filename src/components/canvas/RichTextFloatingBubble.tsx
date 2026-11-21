'use client';

import React, { useState } from 'react';
import { Bold, Italic, Code, Link as LinkIcon, Check, X } from 'lucide-react';
import type { RichTextFormat, ToolbarPosition } from '@/types/cvRichText';
import { RICH_TEXT_PROMPTS } from '@/constants/cvRichTextConstants';

export interface RichTextFloatingBubbleProps {
  position: ToolbarPosition;
  onFormat: (format: RichTextFormat, url?: string) => void;
  onClose: () => void;
  lang?: 'vi' | 'en';
}

export const RichTextFloatingBubble: React.FC<RichTextFloatingBubbleProps> = ({
  position,
  onFormat,
  onClose,
  lang = 'vi',
}) => {
  const [isLinkPrompt, setIsLinkPrompt] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!position.isVisible) return null;

  const prompts = RICH_TEXT_PROMPTS[lang] || RICH_TEXT_PROMPTS.vi;

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl.trim()) {
      onFormat('link', linkUrl.trim());
    }
    setIsLinkPrompt(false);
    setLinkUrl('');
  };

  return (
    <div
      className="no-print fixed z-[9999] -translate-x-1/2 -translate-y-full mb-2 pointer-events-auto select-none animate-in fade-in zoom-in-95 duration-100"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="bg-[#161B26]/95 border border-white/20 rounded-full shadow-2xl backdrop-blur-md px-1.5 py-1 flex items-center space-x-0.5 text-neutral-300">
        {!isLinkPrompt ? (
          <>
            {/* Bold */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onFormat('bold');
              }}
              className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title={prompts.boldTip}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onFormat('italic');
              }}
              className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title={prompts.italicTip}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            {/* Code / Tech Badge */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onFormat('code');
              }}
              className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title={prompts.codeTip}
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            <div className="w-px h-3.5 bg-white/15 mx-0.5" />

            {/* Link */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setIsLinkPrompt(true);
              }}
              className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title={prompts.linkTip}
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <form onSubmit={handleLinkSubmit} className="flex items-center space-x-1 px-1">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder={prompts.urlPlaceholder}
              autoFocus
              className="bg-black/40 border border-white/20 text-white text-xs rounded-full px-2 py-0.5 outline-none w-36 font-mono"
            />
            <button
              type="submit"
              className="p-1 text-emerald-400 hover:text-emerald-300 rounded-full hover:bg-white/10 cursor-pointer"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setIsLinkPrompt(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </form>
        )}
      </div>

      {/* Downward triangle arrow */}
      <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#161B26] mx-auto mt-0.5" />
    </div>
  );
};

export default RichTextFloatingBubble;
