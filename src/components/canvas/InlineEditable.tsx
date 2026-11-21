'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CVReadOnlyContext } from './CVReadOnlyContext';
import { RichTextRenderer } from './RichTextRenderer';
import { RichTextFloatingBubble } from './RichTextFloatingBubble';
import { useRichTextToolbar } from '@/hooks/useRichTextToolbar';

export interface InlineEditableProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  tag?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
  singleLine?: boolean;
  style?: React.CSSProperties;
  readOnly?: boolean;
  richText?: boolean;
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
  richText = true,
}: InlineEditableProps) {
  const isReadOnlyFromContext = React.useContext(CVReadOnlyContext);
  const isReadOnly = readOnly || isReadOnlyFromContext;
  const editRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { toolbarPos, applyFormat, handleKeyDown, closeToolbar } = useRichTextToolbar({
    containerRef: editRef,
    value: value ?? '',
    onChange,
    enabled: isFocused && richText,
  });

  // When switching to edit mode, focus and place cursor at end
  useEffect(() => {
    if (isFocused && editRef.current) {
      editRef.current.innerText = value ?? '';
      editRef.current.focus();

      try {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } catch (e) {
        // Fallback focus
      }
    }
  }, [isFocused]);

  const Tag = tag as any;

  // View Mode: Display mode using RichTextRenderer with isolated DOM lifecycle (key="view-mode")
  if (isReadOnly || !isFocused) {
    return (
      <Tag
        key="view-mode"
        style={style}
        tabIndex={isReadOnly ? undefined : 0}
        onClick={() => {
          if (!isReadOnly) setIsFocused(true);
        }}
        onFocus={() => {
          if (!isReadOnly) setIsFocused(true);
        }}
        className={`cv-editable outline-none transition-all rounded px-0.5 -mx-0.5 ${
          !singleLine ? 'whitespace-pre-line' : ''
        } ${
          isReadOnly
            ? 'cursor-default select-text'
            : 'hover:ring-1 hover:ring-cyan-400 hover:ring-dashed hover:bg-neutral-50/60 cursor-pointer'
        } ${className}`}
        data-placeholder={placeholder}
        title={isReadOnly ? undefined : 'Nhấp trực tiếp để sửa (Hỗ trợ in đậm/nghiêng)'}
      >
        <RichTextRenderer text={value ?? ''} />
      </Tag>
    );
  }

  // Edit Mode: Native contentEditable with key="edit-mode" (isolated DOM lifecycle)
  return (
    <>
      <Tag
        key="edit-mode"
        ref={editRef}
        style={style}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
          setIsFocused(false);
          onChange(e.currentTarget.innerText.trim());
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          handleKeyDown(e);
          if (singleLine && e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        className={`cv-editable outline-none transition-all rounded px-0.5 -mx-0.5 cursor-text ${
          !singleLine ? 'whitespace-pre-line' : ''
        } ring-2 ring-cyan-500 bg-cyan-50/20 text-neutral-950 ${className}`}
        data-placeholder={placeholder}
        title="Nhấp trực tiếp để sửa (Bôi đen để in đậm Ctrl+B hoặc in nghiêng Ctrl+I)"
      />
      {toolbarPos.isVisible && (
        <RichTextFloatingBubble
          position={toolbarPos}
          onFormat={applyFormat}
          onClose={closeToolbar}
        />
      )}
    </>
  );
}

export default InlineEditable;
