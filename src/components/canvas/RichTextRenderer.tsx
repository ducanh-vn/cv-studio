'use client';

import React, { useMemo } from 'react';
import { parseRichTokens } from '@/lib/cvRichText';

export interface RichTextRendererProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  text,
  className = '',
  style,
}) => {
  const tokens = useMemo(() => parseRichTokens(text), [text]);

  if (!text) return null;

  return (
    <span className={className} style={style}>
      {tokens.map((token, index) => {
        if (token.type === 'bold') {
          return (
            <strong key={`b-${index}`} className="font-semibold text-neutral-900">
              {token.content}
            </strong>
          );
        }
        if (token.type === 'italic') {
          return (
            <em key={`i-${index}`} className="italic text-neutral-800">
              {token.content}
            </em>
          );
        }
        if (token.type === 'code') {
          return (
            <code
              key={`c-${index}`}
              className="px-1.5 py-0.5 mx-0.5 bg-neutral-100 border border-neutral-200/80 rounded font-mono text-[0.88em] text-neutral-900 font-medium inline-block align-baseline select-text"
            >
              {token.content}
            </code>
          );
        }
        if (token.type === 'link') {
          return (
            <a
              key={`a-${index}`}
              href={token.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 underline decoration-cyan-400 hover:text-cyan-900 cursor-pointer transition-colors"
            >
              {token.content}
            </a>
          );
        }
        return <React.Fragment key={`t-${index}`}>{token.content}</React.Fragment>;
      })}
    </span>
  );
};

export default RichTextRenderer;
