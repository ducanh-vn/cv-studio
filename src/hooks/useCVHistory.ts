'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type {
  CVData,
  Language,
  TemplateId,
  CVFontFamily,
  SectionKey,
  CVSnapshot,
} from '@/types/cvBuilder';
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_VISIBILITY,
} from '@/constants/cvConstants';
import type { CVTypographyConfig } from '@/lib/cvTypography';

export interface UseCVHistoryOptions {
  cv: CVData;
  setCvState: (cv: CVData) => void;
  lang: Language;
  setCvVi: (cv: CVData) => void;
  setCvEn: (cv: CVData) => void;
  template: TemplateId;
  setTemplate: (t: TemplateId) => void;
  accentColor: 'blue' | 'yellow' | 'emerald' | 'slate' | 'rose';
  setAccentColor: (c: 'blue' | 'yellow' | 'emerald' | 'slate' | 'rose') => void;
  fontFamily: CVFontFamily;
  setFontFamily: (f: CVFontFamily) => void;
  isCompact: boolean;
  setIsCompact: (c: boolean) => void;
  typographyConfig: CVTypographyConfig;
  setTypographyConfig: (t: CVTypographyConfig) => void;
  sectionOrder: SectionKey[];
  setSectionOrder: (o: SectionKey[]) => void;
  sectionVisibility: Record<SectionKey, boolean>;
  setSectionVisibility: (v: Record<SectionKey, boolean>) => void;
  isLoading: boolean;
  setToastMessage: (msg: string | null) => void;
  isPreviewMode?: boolean;
  setIsPreviewMode?: (preview: boolean) => void;
  defaultSnapshot?: CVSnapshot;
}

export interface UseCVHistoryReturn {
  undoHistory: CVSnapshot[];
  setUndoHistory: React.Dispatch<React.SetStateAction<CVSnapshot[]>>;
  undoHistoryIndex: number;
  setUndoHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useCVHistory({
  cv,
  setCvState,
  lang,
  setCvVi,
  setCvEn,
  template,
  setTemplate,
  accentColor,
  setAccentColor,
  fontFamily,
  setFontFamily,
  isCompact,
  setIsCompact,
  typographyConfig,
  setTypographyConfig,
  sectionOrder,
  setSectionOrder,
  sectionVisibility,
  setSectionVisibility,
  isLoading,
  setToastMessage,
  isPreviewMode = false,
  setIsPreviewMode,
  defaultSnapshot,
}: UseCVHistoryOptions): UseCVHistoryReturn {
  const [undoHistory, setUndoHistory] = useState<CVSnapshot[]>([
    defaultSnapshot || {
      cv,
      template: 'rabbit',
      accentColor: 'blue',
      fontFamily: 'inter',
      isCompact: false,
      sectionOrder: DEFAULT_SECTION_ORDER,
      sectionVisibility: DEFAULT_SECTION_VISIBILITY,
    },
  ]);
  const [undoHistoryIndex, setUndoHistoryIndex] = useState(0);
  const isUndoRedoAction = useRef(false);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRecordedSnapRef = useRef<string>('');

  // Continuous History Recording Engine
  useEffect(() => {
    if (isLoading) return;

    const currentSnap: CVSnapshot = {
      cv,
      template,
      accentColor,
      fontFamily,
      isCompact,
      typography: typographyConfig,
      sectionOrder,
      sectionVisibility,
    };
    const snapStr = JSON.stringify(currentSnap);

    // Initial snapshot once loaded
    if (!lastRecordedSnapRef.current) {
      lastRecordedSnapRef.current = snapStr;
      setUndoHistory([currentSnap]);
      setUndoHistoryIndex(0);
      return;
    }

    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      lastRecordedSnapRef.current = snapStr;
      return;
    }

    if (snapStr === lastRecordedSnapRef.current) return;

    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }

    // Debounce: 400ms so typing text groups into coherent undo units
    historyTimeoutRef.current = setTimeout(() => {
      lastRecordedSnapRef.current = snapStr;
      setUndoHistory((prevHistory) => {
        const currentSlice = prevHistory.slice(0, undoHistoryIndex + 1);
        const updated = [...currentSlice, currentSnap];
        if (updated.length > 50) updated.shift();
        return updated;
      });
      setUndoHistoryIndex((prevIdx) => {
        return Math.min(prevIdx + 1, 49);
      });
    }, 400);

    return () => {
      if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    };
  }, [
    cv,
    template,
    accentColor,
    fontFamily,
    isCompact,
    typographyConfig,
    sectionOrder,
    sectionVisibility,
    isLoading,
    undoHistoryIndex,
  ]);

  const handleUndo = useCallback(() => {
    if (undoHistoryIndex > 0) {
      const prevIdx = undoHistoryIndex - 1;
      const snap = undoHistory[prevIdx];
      isUndoRedoAction.current = true;
      setUndoHistoryIndex(prevIdx);
      setCvState(snap.cv);
      if (lang === 'vi') {
        setCvVi(snap.cv);
      } else {
        setCvEn(snap.cv);
      }
      setTemplate(snap.template);
      setAccentColor(snap.accentColor);
      setFontFamily(snap.fontFamily);
      setIsCompact(snap.isCompact);
      if (snap.sectionOrder) setSectionOrder(snap.sectionOrder);
      if (snap.sectionVisibility) setSectionVisibility(snap.sectionVisibility);
      if (snap.typography) setTypographyConfig(snap.typography);
      setToastMessage(lang === 'en' ? 'Undo applied (Ctrl+Z)' : 'Đã hoàn tác (Ctrl+Z)');
      setTimeout(() => setToastMessage(null), 2000);
    }
  }, [
    undoHistoryIndex,
    undoHistory,
    lang,
    setCvState,
    setCvVi,
    setCvEn,
    setTemplate,
    setAccentColor,
    setFontFamily,
    setIsCompact,
    setSectionOrder,
    setSectionVisibility,
    setTypographyConfig,
    setToastMessage,
  ]);

  const handleRedo = useCallback(() => {
    if (undoHistoryIndex < undoHistory.length - 1) {
      const nextIdx = undoHistoryIndex + 1;
      const snap = undoHistory[nextIdx];
      isUndoRedoAction.current = true;
      setUndoHistoryIndex(nextIdx);
      setCvState(snap.cv);
      if (lang === 'vi') {
        setCvVi(snap.cv);
      } else {
        setCvEn(snap.cv);
      }
      setTemplate(snap.template);
      setAccentColor(snap.accentColor);
      setFontFamily(snap.fontFamily);
      setIsCompact(snap.isCompact);
      if (snap.sectionOrder) setSectionOrder(snap.sectionOrder);
      if (snap.sectionVisibility) setSectionVisibility(snap.sectionVisibility);
      if (snap.typography) setTypographyConfig(snap.typography);
      setToastMessage(lang === 'en' ? 'Redo applied (Ctrl+Y)' : 'Đã làm lại (Ctrl+Y)');
      setTimeout(() => setToastMessage(null), 2000);
    }
  }, [
    undoHistoryIndex,
    undoHistory,
    lang,
    setCvState,
    setCvVi,
    setCvEn,
    setTemplate,
    setAccentColor,
    setFontFamily,
    setIsCompact,
    setSectionOrder,
    setSectionVisibility,
    setTypographyConfig,
    setToastMessage,
  ]);

  // Listen to keyboard shortcuts (Escape to exit preview, Ctrl+Z / Ctrl+Y for undo/redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPreviewMode && setIsPreviewMode) {
          setIsPreviewMode(false);
        }
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode, setIsPreviewMode, handleUndo, handleRedo]);

  return {
    undoHistory,
    setUndoHistory,
    undoHistoryIndex,
    setUndoHistoryIndex,
    handleUndo,
    handleRedo,
    canUndo: undoHistoryIndex > 0,
    canRedo: undoHistoryIndex < undoHistory.length - 1,
  };
}

export default useCVHistory;
