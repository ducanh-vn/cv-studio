import type { PageMode, PageSheetMetric, MultiPageInfo } from '@/types/cvPageLayout';
import { CV_PAGE_TEXTS } from '@/constants/cvPageConstants';

/**
 * Pure calculation helper returning total page count based on content height and mode.
 */
export function calculateTotalPages(
  totalHeightPx: number,
  a4HeightPx: number,
  mode: PageMode = 'auto'
): number {
  if (mode === 'single') return 1;
  if (mode === 'two-page') return 2;

  if (a4HeightPx <= 0 || totalHeightPx <= 0) return 1;

  // Add 2% tolerance before tipping to page 2 (for trailing padding / sub-pixel variance)
  const singlePageLimit = a4HeightPx * 1.02;
  if (totalHeightPx <= singlePageLimit) {
    return 1;
  }

  const twoPageLimit = a4HeightPx * 2.02;
  if (totalHeightPx <= twoPageLimit) {
    return 2;
  }

  // Max 3 pages supported for standard resumes
  return Math.min(3, Math.ceil(totalHeightPx / a4HeightPx));
}

/**
 * Generates coordinate boundaries for each individual A4 page sheet.
 */
export function generatePageSheetMetrics(
  totalPages: number,
  a4HeightPx: number,
  scrollPosPx: number = 0
): PageSheetMetric[] {
  const sheets: PageSheetMetric[] = [];
  const safeA4Height = Math.max(1, a4HeightPx);

  for (let page = 1; page <= totalPages; page++) {
    const topPx = (page - 1) * safeA4Height;
    const bottomPx = page * safeA4Height;
    const isCurrent = scrollPosPx >= topPx - safeA4Height * 0.25 && scrollPosPx < bottomPx - safeA4Height * 0.25;

    sheets.push({
      pageNumber: page,
      topPx,
      heightPx: safeA4Height,
      bottomPx,
      isCurrent,
    });
  }

  // Fallback: If no sheet matched isCurrent, default to page 1
  if (sheets.length > 0 && !sheets.some((s) => s.isCurrent)) {
    sheets[0].isCurrent = true;
  }

  return sheets;
}

/**
 * Returns full multi-page summary metadata.
 */
export function getMultiPageInfo(
  totalHeightPx: number,
  pageWidthPx: number,
  a4HeightPx: number,
  mode: PageMode = 'auto',
  scrollPosPx: number = 0
): MultiPageInfo {
  const totalPages = calculateTotalPages(totalHeightPx, a4HeightPx, mode);
  const sheets = generatePageSheetMetrics(totalPages, a4HeightPx, scrollPosPx);
  const currentSheet = sheets.find((s) => s.isCurrent) || sheets[0];
  const currentPage = currentSheet ? currentSheet.pageNumber : 1;

  return {
    totalPages,
    currentPage,
    isMultiPage: totalPages > 1,
    pageMode: mode,
    sheets,
  };
}

/**
 * Returns formatted page badge string (e.g. "Trang 1 / 2" or "Page 1 of 2").
 */
export function formatPageLabel(
  current: number,
  total: number,
  lang: 'vi' | 'en' = 'vi'
): string {
  const texts = CV_PAGE_TEXTS[lang] || CV_PAGE_TEXTS.vi;
  return texts.pageOf(current, total);
}
