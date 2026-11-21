import type { PageMode, PageBreakConfig } from '@/types/cvPageLayout';

/**
 * Visual gap between consecutive A4 sheets rendered on the workspace canvas.
 */
export const A4_SHEET_GAP_PX = 28;

export const DEFAULT_PAGE_BREAK_CONFIG: PageBreakConfig = {
  mode: 'auto',
  maxPages: 3,
  showPageNumbers: true,
  manualBreaks: [],
};

export const PAGE_MODE_OPTIONS: { id: PageMode; labelVi: string; labelEn: string; descVi: string; descEn: string }[] = [
  {
    id: 'auto',
    labelVi: 'Tự động phân trang',
    labelEn: 'Auto Paginate',
    descVi: 'Tự động ngắt sang trang 2 nếu nội dung dài hơn 1 trang A4',
    descEn: 'Automatically creates page 2 when content exceeds A4 height',
  },
  {
    id: 'single',
    labelVi: 'Khóa 1 trang A4',
    labelEn: 'Lock 1 Page',
    descVi: 'Ép nội dung nằm gọn gàng trong 1 trang A4 duy nhất',
    descEn: 'Strictly fits all content onto a single A4 page',
  },
  {
    id: 'two-page',
    labelVi: 'Cố định 2 trang A4',
    labelEn: '2 Pages A4',
    descVi: 'Phân chia nội dung trải đều sang đúng 2 trang A4 chuẩn',
    descEn: 'Formats layout evenly across exactly 2 A4 pages',
  },
];

export const CV_PAGE_TEXTS = {
  vi: {
    page: 'Trang',
    pageOf: (current: number, total: number) => `Trang ${current} / ${total}`,
    endOfPage: (page: number) => `Hết Trang ${page}`,
    startOfPage: (page: number) => `Bắt đầu Trang ${page}`,
    pageBreakLine: 'Vạch ngắt trang A4 (297mm)',
    jumpToPage: (page: number) => `Cuộn tới Trang ${page}`,
    showNumbersLabel: 'Hiển thị số trang ở chân giấy',
    autoPaginated: 'Đã tự động chia thành 2 trang A4 chuẩn',
    prevPage: 'Trang trước',
    nextPage: 'Trang sau',
    pageModeTooltip: 'Chế độ hiển thị số trang CV',
  },
  en: {
    page: 'Page',
    pageOf: (current: number, total: number) => `Page ${current} of ${total}`,
    endOfPage: (page: number) => `End of Page ${page}`,
    startOfPage: (page: number) => `Start of Page ${page}`,
    pageBreakLine: 'A4 Page boundary (297mm)',
    jumpToPage: (page: number) => `Jump to Page ${page}`,
    showNumbersLabel: 'Display page numbers on footer',
    autoPaginated: 'Automatically split into 2 A4 pages',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    pageModeTooltip: 'CV Page display mode',
  },
} as const;
