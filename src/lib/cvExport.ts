import {
  exportCVToImage,
  ImageExportFormat,
  ExportResolution,
} from '@/lib/exportImage';
import { sanitizeFileName } from '@/lib/cvFormatters';
import type { Language, TemplateId } from '@/types/cvBuilder';

export interface GenerateExportFileNameParams {
  baseName?: string;
  docType: 'CV' | 'CoverLetter';
  template: TemplateId | string;
  lang: Language;
  resolution?: ExportResolution;
}

export interface ExportDocumentImageParams {
  elementId: string;
  format: ImageExportFormat;
  resolution?: ExportResolution;
  fileName: string;
  quality?: number;
}

/**
 * Triggers standard browser print dialog for A4 PDF export.
 * Uses a short timeout so any open popovers or menus close cleanly before printing.
 */
export function printDocument(): void {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.print();
    }, 100);
  }
}

/**
 * Generates a clean, consistent filename for exported CV or Cover Letter images
 */
export function generateExportFileName({
  baseName,
  docType,
  template,
  lang,
  resolution = 2,
}: GenerateExportFileNameParams): string {
  const safeName = sanitizeFileName(baseName || 'Nguyen_Duc_Anh', 'Nguyen_Duc_Anh');
  return `${safeName}_${docType}_${template}_${lang.toUpperCase()}_${resolution}x`;
}

/**
 * High-resolution canvas/paper capture and download as PNG or JPG
 */
export async function exportDocumentImage({
  elementId,
  format,
  resolution = 2,
  fileName,
  quality = 0.95,
}: ExportDocumentImageParams): Promise<{ success: boolean; error?: string }> {
  return await exportCVToImage({
    elementId,
    format,
    resolution,
    fileName,
    quality,
  });
}
