import {
  Emphasis,
  emphasisRegexMapping,
  getCombinedEmphasisRegex,
} from 'lib/text/regex';
import TextStyle from 'styles/Components/Text.styles';

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

      try {
        switch (emphasis) {
          case Emphasis.CUSTOM:
            const textToCustomise = matches![1];
            transformation = <span key={key}>{textToCustomise}</span>;
            break;
          case Emphasis.BOLDITALIC:
            const textToBoldItalize = applyEmphasisFormatting(matches![1]);
            transformation = (
              <strong key={key}>
                <em>{textToBoldItalize}</em>
              </strong>
            );
            break;
          case Emphasis.ITALIC:
            const textToItalize = applyEmphasisFormatting(matches![1]);
            transformation = <em key={key}>{textToItalize}</em>;
            break;
          case Emphasis.BOLD:
            const textToBold = applyEmphasisFormatting(matches![1]);
            transformation = <strong key={key}>{textToBold}</strong>;
            break;
          case Emphasis.UNDERLINE:
            const textToUnderline = applyEmphasisFormatting(matches![1]);
            transformation = <u key={key}>{textToUnderline}</u>;
            break;
          case Emphasis.STRIKETHROUGH:
            const textToStrikethrough = applyEmphasisFormatting(matches![1]);
            transformation = <s key={key}>{textToStrikethrough}</s>;
            break;
          case Emphasis.HYPERLINK:
            const textToHyperlink = applyEmphasisFormatting(matches![1]);
            const link = matches![2];
            transformation = (
              <TextStyle.Emphasis.Anchor
                href={link}
                rel={'noopener noreferrer'}
                key={key}>
                {textToHyperlink}
              </TextStyle.Emphasis.Anchor>
            );
            break;
          case Emphasis.HIGHLIGHT:
            const highlightColor = matches![1];
            const textToHighlight = applyEmphasisFormatting(matches![2]);
            transformation = (
              <mark
                style={{
                  backgroundColor: highlightColor,
                  borderRadius: '10px',
                  padding: '0.2em',
                }}
                key={key}>
                {textToHighlight}
              </mark>
            );
            break;
          case Emphasis.COLOR:
            const color = matches![1];
            const textToColor = applyEmphasisFormatting(matches![2]);
            transformation = (
              <span style={{ color }} key={key}>
                {textToColor}
              </span>
            );
            break;
          case Emphasis.SUPERSCRIPT:
            const textToSuper = applyEmphasisFormatting(matches![1]);
            transformation = <sup key={key}>{textToSuper}</sup>;
            break;
          case Emphasis.SUBSCRIPT:
            const textToSub = applyEmphasisFormatting(matches![1]);
            transformation = <sub key={key}>{textToSub}</sub>;
            break;
          case Emphasis.ESCAPE:
            transformation = matches![1];
            break;
          default:
            break;
        }
      } catch (e: any) {
        console.error(e.message);
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
              transformation = removeEmphasisFormatting(matches![1]);
              break;
            case Emphasis.HIGHLIGHT:
            case Emphasis.COLOR:
              transformation = removeEmphasisFormatting(matches![2]);
              break;
            default:
              break;
          }
        } catch (e) {
          console.error(e);
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
