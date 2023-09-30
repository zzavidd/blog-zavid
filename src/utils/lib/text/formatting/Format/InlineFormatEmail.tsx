import EmailTheme from 'server/emails/theme';

import { Emphasis } from '../../regex';
import { applyEmphasisFormatting } from '../Emphasis';

const InlineFormatEmail: Record<Emphasis, RenderValue> = {
  [Emphasis.CUSTOM]: ([, text], key) => <span key={key}>{text}</span>,
  [Emphasis.BOLDITALIC]: ([, text], key) => (
    <span
      style={{
        fontWeight: 900,
        fontStyle: 'italic',
      }}
      key={key}>
      {applyEmphasisFormatting(text)}
    </span>
  ),
  [Emphasis.ITALIC]: ([, text], key) => (
    <i key={key}>{applyEmphasisFormatting(text)}</i>
  ),
  [Emphasis.BOLD]: ([, text], key) => (
    <b style={{ fontWeight: 900 }} key={key}>
      {applyEmphasisFormatting(text)}
    </b>
  ),
  [Emphasis.UNDERLINE]: ([, text], key) => (
    <u key={key}>{applyEmphasisFormatting(text)}</u>
  ),
  [Emphasis.STRIKETHROUGH]: ([, text], key) => (
    <del key={key}>{applyEmphasisFormatting(text)}</del>
  ),
  [Emphasis.HYPERLINK]: ([, text, link], key) => (
    <a
      href={link}
      rel={'noopener noreferrer'}
      target={'_blank'}
      style={{
        color: EmailTheme.Color.Light.Hyperlink,
      }}
      key={key}>
      {text}
    </a>
  ),
  [Emphasis.HIGHLIGHT]: ([, highlightColor, text], key) => (
    <mark
      style={{
        backgroundColor: highlightColor,
        borderRadius: '8px',
        padding: '4px',
      }}
      key={key}>
      {applyEmphasisFormatting(text)}
    </mark>
  ),
  [Emphasis.COLOR]: ([, color, text], key) => (
    <span style={{ color }} key={key}>
      {applyEmphasisFormatting(text)}
    </span>
  ),
  [Emphasis.SUPERSCRIPT]: ([, text], key) => <sup key={key}>{text}</sup>,
  [Emphasis.SUBSCRIPT]: ([, text], key) => <sub key={key}>{text}</sub>,
  [Emphasis.ESCAPE]: ([, text]) => text,
};

export default InlineFormatEmail;

type RenderValue = (match: RegExpMatchArray, index: number) => React.ReactNode;
