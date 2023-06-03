import { MjmlText } from '@faire/mjml-react';
import { Typography } from '@mui/material';
import React from 'react';

import type { FormatTextOptions } from 'utils/lib/text';
import {
  applyEmphasisFormatting,
  removeEmphasisFormatting,
} from 'utils/lib/text/formatting/Emphasis';
import {
  Section,
  sectionRegexMapping,
  strayRegexToOmit,
} from 'utils/lib/text/regex';

import FormatEmail from './Paragraph/FormatEmail';
import FormatSite from './Paragraph/FormatSite';

/**
 * Formats a paragraph of text.
 * @param paragraph The paragraph to be formatted.
 * @param key The paragraph index.
 * @param options The formatting options.
 */
export function formatParagraph(
  paragraph: string,
  key: number,
  options: FormatTextOptions = {},
): React.ReactNode {
  if (!paragraph) return <React.Fragment />;

  const emphasise = (text: string) => applyEmphasisFormatting(text);

  const foundSection = Object.entries(sectionRegexMapping).find(([, regex]) =>
    regex.test(paragraph),
  );

  if (foundSection) {
    const [section, regex] = foundSection!;
    const match = paragraph.match(regex)!;
    if (options.forEmails) {
      return FormatEmail[section as Section](match);
    }
    return FormatSite[section as Section](match);
  } else {
    if (options.forEmails) {
      return (
        <MjmlText>
          <p>{emphasise(paragraph)}</p>
        </MjmlText>
      );
    }
    return (
      <Typography variant={'body1'} mt={key ? 5 : 0} key={key}>
        {emphasise(paragraph)}
      </Typography>
    );
  }
}

/**
 * Deformats a paragraph of text.
 * @param paragraph The paragraph to be deformatted.
 * @param key The paragraph index.
 */
export function deformatParagraph(paragraph: string, key: number): string {
  if (!paragraph) return '';
  if (strayRegexToOmit.test(paragraph)) return '';

  // Replace plus symbols with bullet points
  paragraph = paragraph.replace(/\+\s/g, '• ');

  // Initialise with space separate paragraphs
  const init = key > 0 ? ' ' : '';
  let detransformedParagraph: string = init;

  const foundSection = Object.entries(sectionRegexMapping).find(([, regex]) => {
    return regex.test(paragraph);
  });

  if (foundSection) {
    const [section, regex] = foundSection;
    const [, text] = paragraph.match(regex)!;

    switch (section) {
      case Section.HEADING:
      case Section.SUBHEADING:
      case Section.BULLET_LIST:
      case Section.NUMBERED_LIST:
        detransformedParagraph += removeEmphasisFormatting(text);
        break;
      case Section.IMAGE:
      case Section.DIVIDER:
      case Section.TWEET:
      case Section.INSTAGRAM:
      case Section.SPOTIFY:
        detransformedParagraph = '';
        break;
      case Section.BLOCKQUOTE:
        detransformedParagraph += `"${removeEmphasisFormatting(text)}"`;
        break;
      default:
        break;
    }
  } else {
    detransformedParagraph += removeEmphasisFormatting(paragraph);
  }

  return detransformedParagraph;
}
