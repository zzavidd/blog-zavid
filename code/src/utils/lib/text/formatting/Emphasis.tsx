import { Typography } from '@mui/material';

import { Link } from 'components/Link';
import {
  Emphasis,
  emphasisRegexMapping,
  getCombinedEmphasisRegex,
} from 'utils/lib/text/regex';
import Logger from 'utils/logger';

export function applyEmphasisFormatting(paragraph: string) {
  if (!paragraph) return '';
  const combinedEmphasisRegex = getCombinedEmphasisRegex();

  // Split by combined regex into fragments.
  const fragments = paragraph.split(combinedEmphasisRegex).filter((e) => e);
  const formattedParagraph = fragments.map((fragment, key) => {
    let transformation: string | JSX.Element = fragment;

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
            const textToCustomise = matches[1];
            transformation = (
              <Typography key={key} display={'inline'}>
                {textToCustomise}
              </Typography>
            );
            break;
          case Emphasis.BOLDITALIC:
            const textToBoldItalize = applyEmphasisFormatting(matches[1]);
            transformation = (
              <Typography
                fontWeight={'bold'}
                fontStyle={'italic'}
                display={'inline'}
                key={key}>
                {textToBoldItalize}
              </Typography>
            );
            break;
          case Emphasis.ITALIC:
            const textToItalize = applyEmphasisFormatting(matches[1]);
            transformation = (
              <Typography fontStyle={'italic'} display={'inline'} key={key}>
                {textToItalize}
              </Typography>
            );
            break;
          case Emphasis.BOLD:
            const textToBold = applyEmphasisFormatting(matches[1]);
            transformation = (
              <Typography fontWeight={'bold'} display={'inline'} key={key}>
                {textToBold}
              </Typography>
            );
            break;
          case Emphasis.UNDERLINE:
            const textToUnderline = applyEmphasisFormatting(matches[1]);
            transformation = (
              <Typography
                sx={{ textDecoration: 'underline' }}
                display={'inline'}
                key={key}>
                {textToUnderline}
              </Typography>
            );
            break;
          case Emphasis.STRIKETHROUGH:
            const textToStrikethrough = applyEmphasisFormatting(matches[1]);
            transformation = (
              <Typography
                sx={{ textDecoration: 'line-through' }}
                display={'inline'}
                key={key}>
                {textToStrikethrough}
              </Typography>
            );
            break;
          case Emphasis.HYPERLINK:
            const textToHyperlink = applyEmphasisFormatting(matches[1]);
            const link = matches[2];
            transformation = (
              <Link href={link} key={key}>
                {textToHyperlink}
              </Link>
            );
            break;
          case Emphasis.HIGHLIGHT:
            const highlightColor = matches[1];
            const textToHighlight = applyEmphasisFormatting(matches[2]);
            transformation = (
              <Typography
                sx={{
                  backgroundColor: highlightColor,
                  borderRadius: (t) => `${t.shape.borderRadius}px`,
                  padding: (t) => t.spacing(1),
                }}
                display={'inline'}
                key={key}>
                {textToHighlight}
              </Typography>
            );
            break;
          case Emphasis.COLOR:
            const color = matches[1];
            const textToColor = applyEmphasisFormatting(matches[2]);
            transformation = (
              <Typography sx={{ color }} display={'inline'} key={key}>
                {textToColor}
              </Typography>
            );
            break;
          case Emphasis.SUPERSCRIPT:
            const textToSuper = applyEmphasisFormatting(matches[1]);
            transformation = (
              <Typography
                sx={{ verticalAlign: 'super' }}
                display={'inline'}
                key={key}>
                {textToSuper}
              </Typography>
            );
            break;
          case Emphasis.SUBSCRIPT:
            const textToSub = applyEmphasisFormatting(matches[1]);
            transformation = (
              <Typography
                sx={{ verticalAlign: 'sub' }}
                display={'inline'}
                key={key}>
                {textToSub}
              </Typography>
            );
            break;
          case Emphasis.ESCAPE:
            transformation = matches[1];
            break;
          default:
            break;
        }
      } catch (e: any) {
        throw new Error(e);
      }
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
    .replace(/\s\./g, '.')
    .replace(/\s+\,/g, ',');

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
