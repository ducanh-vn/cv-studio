import type { RichTextFormat, RichToken } from '@/types/cvRichText';
import { RICH_DELIMITERS } from '@/constants/cvRichTextConstants';

/**
 * Strips all markdown syntax delimiters returning clean, plain text for ATS analysis and plain export.
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1')        // **bold** -> bold
    .replace(/\*([^*]+)\*/g, '$1')            // *italic* -> italic
    .replace(/_([^_]+)_/g, '$1')              // _italic_ -> italic
    .replace(/`([^`]+)`/g, '$1');             // `code` -> code
}

/**
 * Tokenizes markdown-formatted text into an array of tokens for safe JSX rendering.
 */
export function parseRichTokens(rawText: string): RichToken[] {
  if (!rawText) return [];

  const tokens: RichToken[] = [];
  // Unified regex matching: [label](url), **bold**, `code`, *italic*
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(rawText)) !== null) {
    // Plain text before match
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        content: rawText.slice(lastIndex, match.index),
      });
    }

    if (match[1] && match[2]) {
      // Hyperlink
      tokens.push({
        type: 'link',
        content: match[1],
        url: match[2],
      });
    } else if (match[3]) {
      // Bold
      tokens.push({
        type: 'bold',
        content: match[3],
      });
    } else if (match[4]) {
      // Code / Tech Badge
      tokens.push({
        type: 'code',
        content: match[4],
      });
    } else if (match[5]) {
      // Italic
      tokens.push({
        type: 'italic',
        content: match[5],
      });
    }

    lastIndex = pattern.lastIndex;
  }

  // Remaining plain text after last match
  if (lastIndex < rawText.length) {
    tokens.push({
      type: 'text',
      content: rawText.slice(lastIndex),
    });
  }

  return tokens;
}

/**
 * Pure helper wrapping or toggling formatting around a substring selection.
 */
export function wrapSelection(
  text: string,
  start: number,
  end: number,
  format: RichTextFormat,
  url?: string
): { newText: string; newSelectionStart: number; newSelectionEnd: number } {
  if (start < 0 || end < start || start > text.length) {
    return { newText: text, newSelectionStart: start, newSelectionEnd: end };
  }

  const before = text.slice(0, start);
  const selected = text.slice(start, end);
  const after = text.slice(end);

  if (format === 'link') {
    const targetUrl = url?.trim() || 'https://';
    const wrapped = `[${selected || 'link'}](${targetUrl})`;
    return {
      newText: before + wrapped + after,
      newSelectionStart: start,
      newSelectionEnd: start + wrapped.length,
    };
  }

  const delimiter = RICH_DELIMITERS[format];
  const dLen = delimiter.length;

  // Check if selection is already wrapped from outside: before ends with delim and after starts with delim
  if (before.endsWith(delimiter) && after.startsWith(delimiter)) {
    const newBefore = before.slice(0, -dLen);
    const newAfter = after.slice(dLen);
    return {
      newText: newBefore + selected + newAfter,
      newSelectionStart: start - dLen,
      newSelectionEnd: end - dLen,
    };
  }

  // Check if selected itself starts and ends with delim
  if (selected.startsWith(delimiter) && selected.endsWith(delimiter) && selected.length >= dLen * 2) {
    const unwrapped = selected.slice(dLen, -dLen);
    return {
      newText: before + unwrapped + after,
      newSelectionStart: start,
      newSelectionEnd: start + unwrapped.length,
    };
  }

  // Wrap selection
  const wrapped = `${delimiter}${selected}${delimiter}`;
  return {
    newText: before + wrapped + after,
    newSelectionStart: start,
    newSelectionEnd: start + wrapped.length,
  };
}
