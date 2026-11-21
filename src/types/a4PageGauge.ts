export type PageFillStatus = 'spacious' | 'optimal' | 'tight' | 'overflow';

export interface A4PageMetrics {
  contentHeightPx: number;
  targetHeightPx: number;
  fillPercentage: number;
  overflowPx: number;
  status: PageFillStatus;
  isOverflow: boolean;
  statusLabel: string;
  recommendations: string[];
}

export interface A4StatusStyle {
  textColor: string;
  bgColor: string;
  borderColor: string;
  barColor: string;
  badgeBg: string;
}

export interface AutoFitOptions {
  reduceFont?: boolean;
  reduceSpacing?: boolean;
  enableCompact?: boolean;
}
