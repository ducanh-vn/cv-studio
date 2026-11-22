'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { A4PageMetrics } from '@/types/a4PageGauge';
import { calculateA4Metrics, computeAutoFitTypography } from '@/lib/a4PageCalculator';
import type { CVTypographyConfig } from '@/lib/cvTypography';

export interface UseA4PageGaugeParams {
  paperRef: React.RefObject<HTMLDivElement>;
  contentRef?: React.RefObject<HTMLDivElement>;
  lang?: 'vi' | 'en';
  typographyConfig?: CVTypographyConfig;
  setTypographyConfig?: (config: CVTypographyConfig | ((prev: CVTypographyConfig) => CVTypographyConfig)) => void;
  setIsCompact?: (compact: boolean | ((prev: boolean) => boolean)) => void;
  dependencies?: any[];
}

export function useA4PageGauge({
  paperRef,
  contentRef,
  lang = 'vi',
  typographyConfig,
  setTypographyConfig,
  setIsCompact,
  dependencies = [],
}: UseA4PageGaugeParams) {
  const [metrics, setMetrics] = useState<A4PageMetrics>(() =>
    calculateA4Metrics(0, 0, lang)
  );

  const rafIdRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    const targetEl = contentRef?.current || paperRef.current;
    if (!targetEl) return;

    const paperEl = paperRef.current || targetEl;
    // clientWidth provides the width of the A4 paper
    const width = paperEl.clientWidth || targetEl.clientWidth;
    // offsetHeight provides the pure rendered height of CV content, free from absolute overlays
    const height = targetEl.offsetHeight || targetEl.scrollHeight;

    if (width > 0 && height > 0) {
      const newMetrics = calculateA4Metrics(height, width, lang);
      setMetrics((prev) => {
        if (
          prev.contentHeightPx === newMetrics.contentHeightPx &&
          prev.targetHeightPx === newMetrics.targetHeightPx &&
          prev.fillPercentage === newMetrics.fillPercentage &&
          prev.status === newMetrics.status
        ) {
          return prev;
        }
        return newMetrics;
      });
    }
  }, [paperRef, contentRef, lang]);

  const scheduleMeasure = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      measure();
    });
  }, [measure]);

  // Listen to DOM mutations and window resize
  useEffect(() => {
    scheduleMeasure();

    // Retries in case paperRef attaches post-skeleton loading or after fonts load
    const t1 = setTimeout(scheduleMeasure, 150);
    const t2 = setTimeout(scheduleMeasure, 500);
    const t3 = setTimeout(scheduleMeasure, 1200);

    window.addEventListener('resize', scheduleMeasure);

    const element = contentRef?.current || paperRef.current;
    if (!element) {
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        window.removeEventListener('resize', scheduleMeasure);
      };
    }

    // Use ResizeObserver for accurate dimensional tracking
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        scheduleMeasure();
      });
      resizeObserver.observe(element);
    }

    // Also observe mutations in case text/nodes are added dynamically
    let mutationObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        scheduleMeasure();
      });
      mutationObserver.observe(element, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', scheduleMeasure);
      if (resizeObserver) resizeObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [paperRef, contentRef, scheduleMeasure, ...dependencies]);

  // Auto-fit function to adjust typography and spacing so content fits 1 A4 page
  const autoFitToSinglePage = useCallback(() => {
    if (!metrics.isOverflow) return;

    if (setIsCompact) {
      setIsCompact(true);
    }

    if (typographyConfig && setTypographyConfig) {
      const optimized = computeAutoFitTypography(typographyConfig, metrics.fillPercentage);
      setTypographyConfig(optimized);
    }

    // Schedule re-measurement after state updates apply
    setTimeout(() => {
      scheduleMeasure();
    }, 150);
  }, [metrics.isOverflow, metrics.fillPercentage, setIsCompact, typographyConfig, setTypographyConfig, scheduleMeasure]);

  return {
    metrics,
    autoFitToSinglePage,
    refreshMetrics: scheduleMeasure,
  };
}
