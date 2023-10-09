import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  alpha,
} from '@mui/material';
import type React from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
import { TwitterTweetEmbed } from 'react-twitter-embed';

import type { FormatTextOptions } from '../../functions';
import { Section } from '../../regex';
import { applyEmphasisFormatting } from '../Emphasis';

const FormatSite: Record<Section, RenderValue> = {
  [Section.PARAGRAPH]: ([, text], key, { dataTestId, TypographyProps }) => (
    <Typography
      data-testid={dataTestId ? `${dataTestId}.${key}` : undefined}
      data-text={text}
      borderRadius={1}
      mt={key ? 5 : 0}
      key={key}
      sx={{
        ...TypographyProps?.sx,
        transition: (t) =>
          t.transitions.create(['padding'], {
            duration: t.transitions.duration.shorter,
          }),
      }}
      {...TypographyProps}>
      {applyEmphasisFormatting(text)}
    </Typography>
  ),
  [Section.HEADING]: ([, text], key) => (
    <Typography variant={'h3'} my={5} key={key}>
      {text}
    </Typography>
  ),
  [Section.SUBHEADING]: ([, text], key) => (
    <Typography
      variant={'h4'}
      fontWeight={800}
      textTransform={'capitalize'}
      my={5}
      key={key}>
      {text}
    </Typography>
  ),
  [Section.IMAGE]: ([, alt, src], key, { theme }) => (
    <img
      src={src}
      alt={alt}
      loading={'lazy'}
      style={{
        borderRadius: `${theme?.shape.borderRadius}px`,
        marginTop: theme?.spacing(5),
        objectFit: 'contain',
        width: '100%',
      }}
      key={key}
    />
  ),
  [Section.DIVIDER]: (_, key) => (
    <Divider sx={{ borderWidth: '1px', my: 5 }} key={key} />
  ),
  [Section.BULLET_LIST]: ([, isSpacedBlock, list], key) => (
    <List
      sx={{ listStyle: 'disc', marginInlineStart: 5 }}
      disablePadding={!isSpacedBlock}
      key={key}>
      {list
        .split('\n')
        .filter((e) => e)
        .map((item, index) => {
          const [, value] = item.match(/^\+\s*(.*)$/)!;
          return (
            <ListItem
              disablePadding={!isSpacedBlock}
              sx={{
                display: 'list-item',
                paddingInlineStart: 2,
              }}
              key={index}>
              <ListItemText>{applyEmphasisFormatting(value)}</ListItemText>
            </ListItem>
          );
        })}
    </List>
  ),
  [Section.NUMBERED_LIST]: ([, isSpacedBlock, list], key) => (
    <List sx={{ listStyle: 'decimal', marginInlineStart: 6 }} key={key}>
      {list
        .split('\n')
        .filter((e) => e)
        .map((item, index) => {
          const [, value] = item.match(/^(?:[0-9]+[\.\)]|\+)\s*(.*)$/)!;
          return (
            <ListItem
              disablePadding={!isSpacedBlock}
              sx={{
                display: 'list-item',
                paddingInlineStart: 2,
              }}
              key={index}>
              <ListItemText>{applyEmphasisFormatting(value)}</ListItemText>
            </ListItem>
          );
        })}
    </List>
  ),
  [Section.BLOCKQUOTE]: ([, text], key, { TypographyProps }) => (
    <Typography
      component={'blockquote'}
      {...TypographyProps}
      sx={{
        backgroundColor: (t) =>
          alpha(t.palette.divider, t.palette.mode === 'light' ? 0.05 : 0.125),
        borderLeft: (t) => `5px solid ${t.palette.text.secondary}`,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        color: (t) => t.palette.text.secondary,
        fontSize: { xs: '85%', md: '90%' },
        my: { xs: 5, md: 6 },
        px: 4,
        pt: 4,
        pb: 4,
        ...TypographyProps?.sx,
      }}
      key={key}>
      {applyEmphasisFormatting(text)}
    </Typography>
  ),
  [Section.TWEET]: ([, tweetId], key) => (
    <TwitterTweetEmbed tweetId={tweetId} key={key} />
  ),
  [Section.INSTAGRAM]: ([, igUrl], key) => (
    <Box mt={3} key={key}>
      <InstagramEmbed url={igUrl} width={328} />
    </Box>
  ),
  [Section.SPOTIFY]: ([, url], key) => (
    <iframe
      src={url}
      height={url.includes('podcast') ? 240 : 400}
      style={{ border: 0, marginTop: '1em' }}
      width={'100%'}
      key={key}
    />
  ),
  [Section.AUDIO]: ([, alt, src], key) => (
    <Box
      component={'audio'}
      controls={true}
      sx={{
        'display': 'block',
        'marginBlock': (t) => t.spacing(3),
        'marginInline': 'auto',
        'maxWidth': (t) => t.spacing(13),
        'width': '100%',
        '&::-webkit-media-controls-enclosure': {
          backgroundColor: (t) => t.palette.action.active,
          borderRadius: (t) => `${t.shape.borderRadius}px`,
        },
        '&::-webkit-media-controls-current-time-display': {
          textShadow: 'none',
        },
        '&::-webkit-media-controls-time-remaining-display': {
          textShadow: 'none',
        },
      }}
      key={key}>
      <source src={src} type={'audio/mpeg'} />
      <source src={src} type={'audio/ogg'} />
      {alt}
    </Box>
  ),
};

export default FormatSite;

type RenderValue = (
  match: RegExpMatchArray,
  index: number,
  options: FormatTextOptions,
) => React.ReactNode;
