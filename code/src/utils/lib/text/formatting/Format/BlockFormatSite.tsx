import type { TypographyProps } from '@mui/material';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import type React from 'react';
import InstagramEmbed from 'react-instagram-embed';
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
  [Section.DIVIDER]: (_, key) => <Divider sx={{ my: 5 }} key={key} />,
  [Section.BULLET_LIST]: ([, isSpacedBlock, list], key) => (
    <List
      sx={{ listStyle: 'disc', marginInlineStart: 5 }}
      disablePadding={!isSpacedBlock}
      key={key}>
      {list
        .split('\n')
        .filter((e) => e)
        .map((item, key) => {
          const [, value] = item.match(/^\+\s*(.*)$/)!;
          return (
            <ListItem
              disablePadding={!isSpacedBlock}
              sx={{
                display: 'list-item',
                paddingInlineStart: 2,
              }}
              key={key}>
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
        .map((item, key) => {
          const [, value] = item.match(/^(?:[0-9]+[\.\)]|\+)\s*(.*)$/)!;
          return (
            <ListItem
              disablePadding={!isSpacedBlock}
              sx={{
                display: 'list-item',
                paddingInlineStart: 2,
              }}
              key={key}>
              <ListItemText>{applyEmphasisFormatting(value)}</ListItemText>
            </ListItem>
          );
        })}
    </List>
  ),
  [Section.BLOCKQUOTE]: ([, text], key, { TypographyProps }) => (
    <Typography
      component={'blockquote'}
      sx={{
        borderInline: (t) =>
          `${t.spacing(1)} solid ${t.palette.text.secondary}`,
        borderRadius: 2,
        fontStyle: 'italic',
        fontWeight: 800,
        my: 5,
        px: 5,
        py: 4,
        textAlign: 'center',
      }}
      key={key}
      {...(TypographyProps as TypographyProps<'blockquote'>)}>
      {applyEmphasisFormatting(text)}
    </Typography>
  ),
  [Section.TWEET]: ([, tweetId]) => <TwitterTweetEmbed tweetId={tweetId} />,
  [Section.INSTAGRAM]: ([, igUrl]) => (
    // TODO: Chase getting Instagram embeds to work
    <InstagramEmbed
      url={igUrl}
      clientAccessToken={`${process.env.NEXT_PUBLIC_FB_APP_ID}|${process.env.NEXT_PUBLIC_FB_APP_CLIENT}`}
      maxWidth={500}
      hideCaption={false}
    />
  ),
  [Section.SPOTIFY]: ([, url]) => (
    <iframe
      src={url}
      height={url.includes('podcast') ? 240 : 400}
      style={{ marginTop: '1em' }}
      width={'100%'}
    />
  ),
  [Section.AUDIO]: ([, alt, src]) => (
    <Box
      component={'audio'}
      controls={true}
      sx={{
        'display': 'block',
        'marginBlock': (t) => t.spacing(3),
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
      }}>
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
