import { Typography } from '@mui/material';

import { Link } from 'components/Link';

import { Emphasis } from '../../regex';
import { applyEmphasisFormatting } from '../Emphasis';

const InlineFormatSite: Record<Emphasis, RenderValue> = {
  [Emphasis.CUSTOM]: ([, text], key) => (
    <Typography key={key}>{text}</Typography>
  ),
  [Emphasis.BOLDITALIC]: ([, text], key) => (
    <Typography
      component={'span'}
      fontWeight={900}
      fontStyle={'italic'}
      display={'inline'}
      fontSize={'inherit'}
      key={key}>
      {applyEmphasisFormatting(text)}
    </Typography>
  ),
  [Emphasis.ITALIC]: ([, text], key) => (
    <Typography
      component={'span'}
      fontStyle={'italic'}
      display={'inline'}
      fontSize={'inherit'}
      key={key}>
      {applyEmphasisFormatting(text)}
    </Typography>
  ),
  [Emphasis.BOLD]: ([, text], key) => (
    <Typography
      component={'span'}
      fontWeight={900}
      display={'inline'}
      fontSize={'inherit'}
      key={key}>
      {applyEmphasisFormatting(text)}
    </Typography>
  ),
  [Emphasis.UNDERLINE]: ([, text], key) => (
    <Typography
      component={'span'}
      sx={{ textDecoration: 'underline' }}
      display={'inline'}
      fontSize={'inherit'}
      key={key}>
      {applyEmphasisFormatting(text)}
    </Typography>
  ),
  [Emphasis.STRIKETHROUGH]: ([, text], key) => (
    <Typography
      component={'span'}
      sx={{ textDecoration: 'line-through' }}
      display={'inline'}
      fontSize={'inherit'}
      key={key}>
      {applyEmphasisFormatting(text)}
    </Typography>
  ),
  [Emphasis.HYPERLINK]: ([, text, link], key) => (
    <Link
      href={link}
      fontWeight={800}
      fontSize={'inherit'}
      sx={{ textDecorationColor: 'inherit' }}
      key={key}>
      {applyEmphasisFormatting(text)}
    </Link>
  ),
  [Emphasis.COLOR]: ([, color, text], key) => (
    <Typography
      component={'span'}
      sx={{ color }}
      display={'inline'}
      fontWeight={'inherit'}
      fontSize={'inherit'}
      key={key}>
      {applyEmphasisFormatting(text)}
    </Typography>
  ),
  [Emphasis.HIGHLIGHT]: ([, highlightColor, text], key) => (
    <Typography
      component={'span'}
      sx={{
        backgroundColor: highlightColor,
        borderRadius: (t) => `${t.shape.borderRadius}px`,
        padding: (t) => t.spacing(1),
      }}
      display={'inline'}
      fontWeight={'inherit'}
      fontSize={'inherit'}
      key={key}>
      {applyEmphasisFormatting(text)}
    </Typography>
  ),
  [Emphasis.SUPERSCRIPT]: ([, text], key) => (
    <Typography
      component={'span'}
      sx={{ verticalAlign: 'super' }}
      display={'inline'}
      fontSize={'70%'}
      key={key}>
      {text}
    </Typography>
  ),
  [Emphasis.SUBSCRIPT]: ([, text], key) => (
    <Typography
      component={'span'}
      sx={{ verticalAlign: 'sub' }}
      display={'inline'}
      fontSize={'70%'}
      key={key}>
      {text}
    </Typography>
  ),
  [Emphasis.ESCAPE]: ([, text]) => text,
};

export default InlineFormatSite;

type RenderValue = (match: RegExpMatchArray, index: number) => React.ReactNode;
