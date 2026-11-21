export type RichTextFormat = 'bold' | 'italic' | 'code' | 'link';

export interface ToolbarPosition {
  top: number;
  left: number;
  isVisible: boolean;
  selectedText: string;
}

export type RichTokenType = 'text' | 'bold' | 'italic' | 'code' | 'link';

export interface RichToken {
  type: RichTokenType;
  content: string;
  url?: string;
}
