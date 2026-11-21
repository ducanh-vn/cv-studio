export type PageMode = 'auto' | 'single' | 'two-page' | 'multi';

export interface PageSheetMetric {
  pageNumber: number;
  topPx: number;
  heightPx: number;
  bottomPx: number;
  isCurrent: boolean;
}

export interface PageBreakConfig {
  mode: PageMode;
  maxPages: number;
  showPageNumbers: boolean;
  manualBreaks: string[]; // section or item keys before which to force a page break
}

export interface MultiPageInfo {
  totalPages: number;
  currentPage: number;
  isMultiPage: boolean;
  pageMode: PageMode;
  sheets: PageSheetMetric[];
}
