import type { ReactElement } from 'react';
import React from 'react';

import {
  deformatParagraph,
  formatParagraph,
} from 'lib/text/formatting/section';
import type { FormatCSS } from 'lib/text/regex';
import { newLinesExceptNumberedListsRegex } from 'lib/text/regex';

/**
 * Apply rich formatting to text.
 * @param fullText The text to format
 * @param options The formatitng options.
 */
export function formatText(
  fullText: string,
  options: FormatTextOptions = {},
): ReactElement {
  if (!fullText) return <React.Fragment></React.Fragment>;

  const formattedText = fullText
    .split(newLinesExceptNumberedListsRegex)
    .map((paragraph, key) => formatParagraph(paragraph, key, options));

  return <React.Fragment>{formattedText}</React.Fragment>;
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
    .join(joinDelimiter);

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
  if (!keepRichFormatting) text = deformatText(originalText);
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
  const deformattedText = deformatText(originalText);
  const [excerpt] = deformattedText.split(/\n|\s{2,}/).filter((e) => e);
  return excerpt;
}

export interface FormatTextOptions {
  css?: FormatCSS;
  inline?: boolean;
  socialWrappers?: SocialWrappers;
  onLongPress?: onLongPress;
}

export interface DeformatTextOptions {
  joinDelimiter?: string;
}

export interface TruncateOptions {
  limit?: number;
  keepRichFormatting?: boolean;
}

interface SocialWrappers {
  Tweet?: any;
  InstagramPost?: any;
}

export interface onLongPress {
  action?: (target: CurrentEventTarget) => void;
  duration?: number;
}

export type Target = EventTarget | CurrentEventTarget;
export type CurrentEventTarget = EventTarget & HTMLElement;
