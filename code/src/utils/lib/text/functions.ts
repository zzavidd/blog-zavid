import type { Theme, TypographyProps } from '@mui/material';
import type React from 'react';

import {
  deformatParagraph,
  formatParagraph,
} from 'utils/lib/text/formatting/Section';
import { newLinesExceptNumberedListsRegex } from 'utils/lib/text/regex';

/**
 * Apply rich formatting to text.
 * @param fullText The text to format
 * @param options The formatitng options.
 */
export function formatText(
  fullText: string,
  options: FormatTextOptions,
): React.ReactNode {
  if (!fullText) return null;

  const formattedText = fullText
    .split(newLinesExceptNumberedListsRegex)
    .map((paragraph, key) => formatParagraph(paragraph, key, options));
  return formattedText;
}

/**
 * Remove rich formatting from text, stripping it down to plain text.
 * @param fullText The text to deformat.
 * @param options The deformatting options.
 */
export function deformatText(
  fullText: string,
  options: DeformatTextOptions = {},
): string {
  if (!fullText) return '';

  const { joinDelimiter = ' ' } = options;

  const deformattedText = fullText
    .split('\n')
    .map(deformatParagraph)
    .join(joinDelimiter)
    .replaceAll(/\s{2,}/g, ' ');

  return deformattedText;
}

/**
 * Apply substitutions to placeholder variables in text.
 * @param text The text which contains variables to be substituted.
 * @param substitutions The map of substitutions.
 */
export function applySubstitutions(
  text: string,
  substitutions: Record<string, string | number>,
): string {
  if (text) {
    const variableRegex = new RegExp(/\$\{(.*?)\}/g); // Regex for substitutions
    text = text.replace(variableRegex, (_, p1) => {
      const value = substitutions[p1];
      return value ? value.toString() : '';
    });
  }
  return text;
}

/**
 * Truncates text to a certain number of characters.
 * @param originalText The text to be truncated.
 * @param options The truncation options.
 */
export function truncateText(
  originalText: string,
  options: TruncateOptions = {},
): string {
  if (!originalText) return '';

  const { limit = 45, keepRichFormatting = false } = options;

  let text = originalText;
  if (!keepRichFormatting) {
    text = deformatText(originalText);
  }
  const truncatedText = text.split(' ').slice(0, limit).join(' ');
  if (truncatedText.length <= limit) return originalText;

  return `${truncatedText}....`;
}

/**
 * Extracts an excerpt from text by deformatting it and retrieving the first paragraph.
 * @param originalText The text to extract the excerpt from.
 */
export function extractExcerpt(originalText: string): string {
  if (!originalText) return '';
  const [paragraph] = originalText.split(/\n|\s{2,}/).filter((e) => e);
  const excerpt = deformatText(paragraph);
  return excerpt;
}

export interface FormatTextOptions {
  dataTestId?: string;
  forEmails?: boolean;
  theme?: Theme;
  TypographyProps?: TypographyProps<'p'>;
}

export interface DeformatTextOptions {
  joinDelimiter?: string;
}

export interface TruncateOptions {
  limit?: number;
  keepRichFormatting?: boolean;
}

export type Target = EventTarget | CurrentEventTarget;
export type CurrentEventTarget = EventTarget & HTMLElement;
