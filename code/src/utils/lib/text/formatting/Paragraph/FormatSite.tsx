import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import InstagramEmbed from 'react-instagram-embed';
import { TwitterTweetEmbed } from 'react-twitter-embed';

import { NextImage } from 'components/Image';

import { Section } from '../../regex';
import { applyEmphasisFormatting } from '../Emphasis';

const FormatSite: Record<Section, RenderValue> = {
  [Section.HEADING]: ([, text]) => (
    <Typography variant={'h3'} my={5}>
      {text}
    </Typography>
  ),
  [Section.SUBHEADING]: ([, text]) => (
    <Typography variant={'h4'}>{text}</Typography>
  ),
  [Section.IMAGE]: ([, alt, src]) => (
    <NextImage src={src} alt={alt} loading={'lazy'} />
  ),
  [Section.DIVIDER]: () => <Divider />,
  [Section.BULLET_LIST]: ([, isSpacedBlock, list]) => (
    <List disablePadding={!isSpacedBlock}>
      {list
        .split('\n')
        .filter((e) => e)
        .map((item, key) => {
          const [, value] = item.match(/^\+\s*(.*)$/)!;
          return (
            <ListItem key={key}>
              <ListItemText>{applyEmphasisFormatting(value)}</ListItemText>
            </ListItem>
          );
        })}
    </List>
  ),
  [Section.NUMBERED_LIST]: ([, isSpacedBlock, list]) => (
    <List disablePadding={!isSpacedBlock}>
      {list
        .split('\n')
        .filter((e) => e)
        .map((item, key) => {
          const [, value] = item.match(/^(?:[0-9]+[\.\)]|\+)\s*(.*)$/)!;
          return (
            <ListItem key={key}>
              <ListItemText>{applyEmphasisFormatting(value)}</ListItemText>
            </ListItem>
          );
        })}
    </List>
  ),
  [Section.BLOCKQUOTE]: ([, text]) => (
    <Typography component={'blockquote'}>
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

type RenderValue = (match: RegExpMatchArray) => React.ReactNode;
