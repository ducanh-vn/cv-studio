import type { RichTextFormat } from '@/types/cvRichText';

export const RICH_DELIMITERS: Record<Exclude<RichTextFormat, 'link'>, string> = {
  bold: '**',
  italic: '*',
  code: '`',
};

export interface ToolbarActionItem {
  id: RichTextFormat;
  labelVi: string;
  labelEn: string;
  shortcut: string;
}

export const RICH_TOOLBAR_ACTIONS: ToolbarActionItem[] = [
  {
    id: 'bold',
    labelVi: 'In đậm',
    labelEn: 'Bold',
    shortcut: 'Ctrl+B',
  },
  {
    id: 'italic',
    labelVi: 'In nghiêng',
    labelEn: 'Italic',
    shortcut: 'Ctrl+I',
  },
  {
    id: 'code',
    labelVi: 'Thẻ công nghệ',
    labelEn: 'Tech tag',
    shortcut: 'Ctrl+`',
  },
  {
    id: 'link',
    labelVi: 'Chèn liên kết',
    labelEn: 'Insert link',
    shortcut: 'Ctrl+K',
  },
];

export const RICH_TEXT_PROMPTS = {
  vi: {
    enterUrl: 'Nhập đường dẫn liên kết (URL):',
    urlPlaceholder: 'https://...',
    boldTip: 'In đậm số liệu / từ khóa nổi bật (Ctrl+B)',
    italicTip: 'In nghiêng thuật ngữ (Ctrl+I)',
    codeTip: 'Định dạng dạng thẻ công nghệ (Ctrl+`)',
    linkTip: 'Chèn đường dẫn liên kết (Ctrl+K)',
  },
  en: {
    enterUrl: 'Enter destination URL:',
    urlPlaceholder: 'https://...',
    boldTip: 'Bold metric or key accomplishment (Ctrl+B)',
    italicTip: 'Italicize term (Ctrl+I)',
    codeTip: 'Tech stack tag format (Ctrl+`)',
    linkTip: 'Insert hyperlink (Ctrl+K)',
  },
} as const;
