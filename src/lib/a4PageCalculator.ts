import { A4_ASPECT_RATIO, A4_THRESHOLDS, A4_TEXTS } from '@/constants/a4PageConstants';
import type { PageFillStatus, A4PageMetrics } from '@/types/a4PageGauge';
import type { CVTypographyConfig } from '@/lib/cvTypography';
import { COMPACT_TYPOGRAPHY_PRESET } from '@/lib/cvTypography';

/**
 * Calculates standard A4 page height based on element width.
 */
export function getA4TargetHeight(pageWidthPx: number): number {
  if (pageWidthPx <= 0) return 1123; // fallback 96dpi A4 height
  return Math.round(pageWidthPx * A4_ASPECT_RATIO);
}

/**
 * Categorizes the fill percentage into 4 UX status tiers.
 */
export function determinePageFillStatus(fillPercentage: number): PageFillStatus {
  if (fillPercentage <= A4_THRESHOLDS.SPACIOUS_MAX) {
    return 'spacious';
  }
  if (fillPercentage <= A4_THRESHOLDS.OPTIMAL_MAX) {
    return 'optimal';
  }
  if (fillPercentage <= A4_THRESHOLDS.TIGHT_MAX) {
    return 'tight';
  }
  return 'overflow';
}

/**
 * Pure calculation helper returning full metrics for the A4 gauge.
 */
export function calculateA4Metrics(
  contentHeightPx: number,
  pageWidthPx: number,
  lang: 'vi' | 'en' = 'vi'
): A4PageMetrics {
  const targetHeightPx = getA4TargetHeight(pageWidthPx);
  const fillPercentage = targetHeightPx > 0 
    ? Math.round((contentHeightPx / targetHeightPx) * 100) 
    : 0;

  const status = determinePageFillStatus(fillPercentage);
  const isOverflow = status === 'overflow';
  const overflowPx = isOverflow ? Math.max(0, contentHeightPx - targetHeightPx) : 0;

  const texts = A4_TEXTS[lang] || A4_TEXTS.vi;
  const statusLabel = texts[status];

  const recommendations: string[] = [];
  if (status === 'spacious') {
    recommendations.push(texts.spaciousTip);
  } else if (status === 'optimal') {
    recommendations.push(texts.optimalTip);
  } else if (status === 'tight') {
    recommendations.push(texts.tightTip);
  } else {
    recommendations.push(texts.overflowTip);
  }

  return {
    contentHeightPx,
    targetHeightPx,
    fillPercentage,
    overflowPx,
    status,
    isOverflow,
    statusLabel,
    recommendations,
  };
}

/**
 * Suggests adjusted typography config to fit overflowing content into 1 page.
 */
export function computeAutoFitTypography(
  current: CVTypographyConfig,
  currentFillPercent: number
): CVTypographyConfig {
  if (currentFillPercent <= 100) return current;

  // If severe overflow (> 115%), jump directly to compact preset
  if (currentFillPercent > 115) {
    return { ...COMPACT_TYPOGRAPHY_PRESET };
  }

  // Mild overflow: gracefully reduce spacing and font by 1-2 units
  return {
    bodyFontSize: Math.max(11.5, current.bodyFontSize - 0.5),
    headingFontSize: Math.max(14.5, current.headingFontSize - 1),
    lineHeight: Math.max(1.3, Number((current.lineHeight - 0.08).toFixed(2))),
    sectionSpacing: Math.max(10, current.sectionSpacing - 3),
    itemSpacing: Math.max(6, current.itemSpacing - 2),
    pagePaddingTopBottom: Math.max(16, current.pagePaddingTopBottom - 4),
    pagePaddingLeftRight: Math.max(20, current.pagePaddingLeftRight - 3),
  };
}
