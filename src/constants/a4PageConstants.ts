import type { PageFillStatus, A4StatusStyle } from '@/types/a4PageGauge';

/**
 * Standard ISO 216 A4 Paper dimensions
 * Width: 210mm, Height: 297mm
 * Aspect Ratio (Height / Width): 297 / 210 = 1.4142857
 */
export const A4_ASPECT_RATIO = 297 / 210;

export const A4_THRESHOLDS = {
  SPACIOUS_MAX: 70,
  OPTIMAL_MAX: 95,
  TIGHT_MAX: 102,
} as const;

export const A4_STATUS_STYLES: Record<PageFillStatus, A4StatusStyle> = {
  spacious: {
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    barColor: 'bg-cyan-500',
    badgeBg: 'bg-cyan-500/20',
  },
  optimal: {
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    barColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-500/20',
  },
  tight: {
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    barColor: 'bg-amber-500',
    badgeBg: 'bg-amber-500/20',
  },
  overflow: {
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    barColor: 'bg-rose-500',
    badgeBg: 'bg-rose-500/20',
  },
};

export const A4_TEXTS = {
  vi: {
    spacious: 'Nhiều khoảng trống',
    optimal: 'Đầy chuẩn A4',
    tight: 'Khít 1 trang',
    overflow: 'Tràn sang trang 2',
    spaciousTip: 'CV còn rộng, bạn có thể bổ sung thêm dự án/thành tích hoặc tăng nhẹ cỡ chữ & khoảng cách.',
    optimalTip: 'Bố cục cân đối lý tưởng, tận dụng trọn vẹn 1 mặt giấy A4 chuẩn ATS.',
    tightTip: 'Nội dung vừa khít chân trang A4, chú ý khi thêm mục mới.',
    overflowTip: 'Nội dung vượt quá 1 trang A4. Khi xuất PDF có thể bị đẩy sang trang 2 hoặc cắt dòng.',
    autoFitBtn: 'Tự động co vừa 1 trang',
    fitSuccess: 'Đã tự động tối ưu khoảng cách để vừa trọn 1 trang A4!',
    cutoffNotice: 'Giới hạn trang 1 (297mm) — Phần bên dưới sẽ tràn sang trang 2',
    overflowNotice: 'CẢNH BÁO: Vùng tràn trang (sẽ bị nhảy sang trang 2 khi in hoặc xuất PDF)',
  },
  en: {
    spacious: 'Space available',
    optimal: 'Optimal 1-Page',
    tight: 'Tight fit',
    overflow: 'Page overflow',
    spaciousTip: 'Plenty of space left. You can add more achievements or slightly increase font/margins.',
    optimalTip: 'Perfect balanced layout for single-page ATS-ready resume.',
    tightTip: 'Content is touching the bottom margin of page 1. Keep an eye on new additions.',
    overflowTip: 'Content exceeds 1 page. May create an unwanted second page or cut off during export.',
    autoFitBtn: 'Auto-fit to 1 page',
    fitSuccess: 'Successfully adjusted spacing to fit onto a single A4 page!',
    cutoffNotice: 'Page 1 boundary (297mm) — Content below spills into Page 2',
    overflowNotice: 'WARNING: Overflow zone (will push onto Page 2 when printing or exporting)',
  },
} as const;
