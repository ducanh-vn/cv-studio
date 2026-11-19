'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CVReadOnlyContext } from './CVReadOnlyContext';

export interface InlineEditableProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  tag?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
  singleLine?: boolean;
  style?: React.CSSProperties;
  readOnly?: boolean;
}

export function InlineEditable({
  value,
  onChange,
  className = '',
  placeholder = 'Nhấp để nhập...',
  tag = 'span',
  singleLine = false,
  style,
  readOnly = false,
}: InlineEditableProps) {
  const isReadOnlyFromContext = React.useContext(CVReadOnlyContext);
  const isReadOnly = readOnly || isReadOnlyFromContext;
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (ref.current && !isFocused) {
      if (ref.current.innerText !== (value ?? '')) {
        ref.current.innerText = value ?? '';
      }
    }
  }, [value, isFocused]);

  const Tag = tag as any;

  if (isReadOnly) {
    return (
      <Tag style={style} className={`${className} cursor-default select-text`}>
        {value ?? ''}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsFocused(true)}
      onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
        setIsFocused(false);
        onChange(e.currentTarget.innerText.trim());
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (singleLine && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      className={`cv-editable outline-none transition-all rounded px-0.5 -mx-0.5 cursor-text ${
        !singleLine ? 'whitespace-pre-line' : ''
      } ${
        isFocused
          ? 'ring-2 ring-cyan-500 bg-cyan-50/20 text-neutral-950'
          : 'hover:ring-1 hover:ring-cyan-400 hover:ring-dashed hover:bg-neutral-50/60'
      } ${className}`}
      data-placeholder={placeholder}
      title="Nhấp trực tiếp để sửa"
    />
  );
}

export default InlineEditable;
