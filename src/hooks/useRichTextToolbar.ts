'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { RichTextFormat, ToolbarPosition } from '@/types/cvRichText';
import { wrapSelection } from '@/lib/cvRichText';

export interface UseRichTextToolbarParams {
  containerRef: React.RefObject<HTMLElement>;
  value: string;
  onChange: (newVal: string) => void;
  enabled?: boolean;
}

export function useRichTextToolbar({
  containerRef,
  value,
  onChange,
  enabled = true,
}: UseRichTextToolbarParams) {
  const [toolbarPos, setToolbarPos] = useState<ToolbarPosition>({
    top: 0,
    left: 0,
    isVisible: false,
    selectedText: '',
  });

  const selectionRangeRef = useRef<{ start: number; end: number } | null>(null);

  const checkSelection = useCallback(() => {
    if (!enabled || !containerRef.current) {
      setToolbarPos((prev) => (prev.isVisible ? { ...prev, isVisible: false } : prev));
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setToolbarPos((prev) => (prev.isVisible ? { ...prev, isVisible: false } : prev));
      return;
    }

    const range = selection.getRangeAt(0);
    const container = containerRef.current;

    // Verify selection is strictly inside this editable element
    if (!container.contains(range.commonAncestorContainer)) {
      setToolbarPos((prev) => (prev.isVisible ? { ...prev, isVisible: false } : prev));
      return;
    }

    const text = selection.toString();
    if (!text.trim()) {
      setToolbarPos((prev) => (prev.isVisible ? { ...prev, isVisible: false } : prev));
      return;
    }

    const rect = range.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Calculate selection character indices in text
    const fullText = container.innerText || '';
    const rangeBefore = range.cloneRange();
    rangeBefore.selectNodeContents(container);
    rangeBefore.setEnd(range.startContainer, range.startOffset);
    const startIndex = rangeBefore.toString().length;
    const endIndex = startIndex + text.length;

    selectionRangeRef.current = { start: startIndex, end: endIndex };

    setToolbarPos({
      top: rect.top - 46,
      left: rect.left + rect.width / 2,
      isVisible: true,
      selectedText: text,
    });
  }, [containerRef, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseUp = () => {
      // Delay slightly so selection finalizes
      setTimeout(checkSelection, 20);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Shift'].includes(e.key)) {
        setTimeout(checkSelection, 20);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [checkSelection, enabled]);

  const applyFormat = useCallback(
    (format: RichTextFormat, url?: string) => {
      if (!selectionRangeRef.current || !containerRef.current) return;

      const { start, end } = selectionRangeRef.current;
      const currentText = containerRef.current.innerText || value;

      const result = wrapSelection(currentText, start, end, format, url);
      containerRef.current.innerText = result.newText;
      onChange(result.newText);

      // Hide toolbar after applying format
      setToolbarPos((prev) => ({ ...prev, isVisible: false }));
    },
    [containerRef, value, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!enabled) return;

      const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier) {
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          checkSelection();
          applyFormat('bold');
        } else if (e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          checkSelection();
          applyFormat('italic');
        } else if (e.key === '`') {
          e.preventDefault();
          checkSelection();
          applyFormat('code');
        }
      }
    },
    [enabled, checkSelection, applyFormat]
  );

  return {
    toolbarPos,
    applyFormat,
    handleKeyDown,
    closeToolbar: () => setToolbarPos((prev) => ({ ...prev, isVisible: false })),
  };
}
