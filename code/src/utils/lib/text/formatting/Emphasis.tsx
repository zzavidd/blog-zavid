import {
  Emphasis,
  emphasisRegexMapping,
  getCombinedEmphasisRegex,
} from 'utils/lib/text/regex';
import Logger from 'utils/logger';

import type { FormatTextOptions } from '../functions';

import InlineFormatEmail from './Format/InlineFormatEmail';
import InlineFormatSite from './Format/InlineFormatSite';

export function applyEmphasisFormatting(
  paragraph: string,
  options: FormatTextOptions = {},
) {
  if (!paragraph) return '';
  const combinedEmphasisRegex = getCombinedEmphasisRegex();
  const Formatter = options.forEmails ? InlineFormatEmail : InlineFormatSite;

  // Split by combined regex into fragments.
  const fragments = paragraph.split(combinedEmphasisRegex).filter((e) => e);
  const formattedParagraph = fragments.map((fragment, key) => {
    let transformation: React.ReactNode = fragment;

    // Find and replace all fragments with components.
    const foundEmphasis = Object.entries(emphasisRegexMapping).find(
      ([, regex]) => regex.pure.test(fragment),
    );

    if (foundEmphasis) {
      const [emphasis, { pure: regex }] = foundEmphasis;
      const match = fragment.match(regex)!;
      transformation = Formatter[emphasis as Emphasis](match, key);
    }

    return transformation;
  });

  return formattedParagraph;
}

export function removeEmphasisFormatting(paragraph: string): string {
  if (!paragraph) return '';

  const combinedEmphasisRegex = getCombinedEmphasisRegex({
    alterForHyperlinks: true,
  });

  const deformattedParagraph = paragraph
    .split(combinedEmphasisRegex)
    .map((fragment) => {
      let transformation = fragment;

      // Find and replace all fragments with components.
      const foundEmphasis = Object.entries(emphasisRegexMapping).find(
        ([, regex]) => regex.pure.test(fragment),
      );

      if (foundEmphasis) {
        const [emphasis, { pure: regex }] = foundEmphasis;
        const matches = fragment.match(regex);
        if (!matches) return;

        try {
          switch (emphasis) {
            case Emphasis.CUSTOM:
            case Emphasis.BOLDITALIC:
            case Emphasis.ITALIC:
            case Emphasis.BOLD:
            case Emphasis.UNDERLINE:
            case Emphasis.STRIKETHROUGH:
            case Emphasis.HYPERLINK:
            case Emphasis.SUPERSCRIPT:
            case Emphasis.SUBSCRIPT:
            case Emphasis.ESCAPE:
              transformation = removeEmphasisFormatting(matches[1]);
              break;
            case Emphasis.HIGHLIGHT:
            case Emphasis.COLOR:
              transformation = removeEmphasisFormatting(matches[2]);
              break;
            default:
              break;
          }
        } catch (e) {
          Logger.error(e);
        }
      }
      return transformation;
    })
    .filter((e) => e)
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s([.,;:!?])/g, '$1');

  // 1. Split by regex and replace with deformatted values.
  // 2. Remove blank values.
  // 3. Join separate text by whitespace.
  // 4. Remove unnecessary whitespace characters.
  // 5. Remove whitespace before commas.
  // const deformattedParagraph = paragraph
  //   .split(combinedEmphasisRegex)
  //   .filter((e) => e)
  //   .join(' ')
  //   .replace(/\s{2,}/g, ' ')
  //   .replace(/\s+\,/g, ',');

  return deformattedParagraph;
}
