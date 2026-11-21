'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PageMode, MultiPageInfo } from '@/types/cvPageLayout';
import { getMultiPageInfo } from '@/lib/cvPageSplitter';

export interface UseCVPageLayoutParams {
  paperRef: React.RefObject<HTMLDivElement>;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  initialMode?: PageMode;
  lang?: 'vi' | 'en';
  dependencies?: any[];
}

export function useCVPageLayout({
  paperRef,
  scrollContainerRef,
  initialMode = 'auto',
  lang = 'vi',
  dependencies = [],
}: UseCVPageLayoutParams) {
  const [pageMode, setPageMode] = useState<PageMode>(initialMode);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [manualBreaks, setManualBreaks] = useState<string[]>([]);
  const [scrollPos, setScrollPos] = useState(0);

  const [multiPageInfo, setMultiPageInfo] = useState<MultiPageInfo>(() =>
    getMultiPageInfo(0, 794, 1123, initialMode, 0)
  );

  const rafIdRef = useRef<number | null>(null);

  const updateMetrics = useCallback(() => {
    if (!paperRef.current) return;

    const el = paperRef.current;
    const width = el.clientWidth || 794;
    const height = el.scrollHeight || 1123;
    const a4Height = Math.round(width * (297 / 210));

    const info = getMultiPageInfo(height, width, a4Height, pageMode, scrollPos);
    setMultiPageInfo((prev) => {
      if (
        prev.totalPages === info.totalPages &&
        prev.currentPage === info.currentPage &&
        prev.isMultiPage === info.isMultiPage &&
        prev.pageMode === info.pageMode
      ) {
        return prev;
      }
      return info;
    });
  }, [paperRef, pageMode, scrollPos]);

  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      updateMetrics();
    });
  }, [updateMetrics]);

  // Track scrolling to identify which page is currently centered in view
  useEffect(() => {
    const container = scrollContainerRef?.current || window;

    const handleScroll = () => {
      const top = scrollContainerRef?.current
        ? scrollContainerRef.current.scrollTop
        : window.scrollY;
      setScrollPos(top);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef]);

  // Re-calculate layout when DOM or dependencies change
  useEffect(() => {
    scheduleUpdate();

    const element = paperRef.current;
    if (!element) return;

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => scheduleUpdate());
      resizeObserver.observe(element);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [paperRef, scheduleUpdate, pageMode, scrollPos, ...dependencies]);

  // Jump to specific page sheet
  const scrollToPage = useCallback(
    (pageNumber: number) => {
      if (!paperRef.current) return;
      const sheet = multiPageInfo.sheets.find((s) => s.pageNumber === pageNumber);
      if (!sheet) return;

      const targetTop = sheet.topPx;
      if (scrollContainerRef?.current) {
        scrollContainerRef.current.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      } else {
        const elTop = paperRef.current.offsetTop;
        window.scrollTo({
          top: elTop + targetTop - 60,
          behavior: 'smooth',
        });
      }
    },
    [paperRef, multiPageInfo.sheets, scrollContainerRef]
  );

  const toggleManualBreak = useCallback((key: string) => {
    setManualBreaks((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  return {
    multiPageInfo,
    pageMode,
    setPageMode,
    showPageNumbers,
    setShowPageNumbers,
    manualBreaks,
    toggleManualBreak,
    scrollToPage,
    refreshPageLayout: scheduleUpdate,
  };
}
