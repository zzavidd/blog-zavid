import { MjmlButton, MjmlDivider, MjmlText } from '@faire/mjml-react';
import React from 'react';

import EmailTheme from 'server/emails/theme';

import type { FormatTextOptions } from '../..';
import { Section } from '../../regex';
import { applyEmphasisFormatting } from '../Emphasis';

const FormatEmail: Record<Section, RenderValue> = {
  [Section.PARAGRAPH]: ([, text], key, options) => (
    <p style={{ marginBottom: 24, whiteSpace: 'pre-wrap' }} key={key}>
      {applyEmphasisFormatting(text, options)}
    </p>
  ),
  [Section.HEADING]: ([, text], key) => (
    <h2 style={{ fontFamily: EmailTheme.Font.Title }} key={key}>
      {text}
    </h2>
  ),
  [Section.SUBHEADING]: ([, text], key) => (
    <h3 style={{ fontFamily: EmailTheme.Font.Title }} key={key}>
      {text}
    </h3>
  ),
  [Section.IMAGE]: ([, alt, src], key) => (
    <img
      src={src}
      alt={alt}
      style={{
        borderRadius: 8,
        objectFit: 'contain',
        width: '100%',
      }}
      key={key}
    />
  ),
  [Section.BLOCKQUOTE]: ([, text], key) => (
    <blockquote
      key={key}
      style={{
        borderLeft: '6px solid rgba(0,0,0,0.6)',
        borderRight: '6px solid rgba(0,0,0,0.6)',
        borderRadius: 28,
        fontStyle: 'italic',
        fontWeight: 800,
        lineHeight: '28px',
        margin: '16px 0',
        padding: '16px 24px',
        textAlign: 'center',
      }}>
      {applyEmphasisFormatting(text)}
    </blockquote>
  ),
  [Section.DIVIDER]: (_, key) => <MjmlDivider padding={'12px 0'} key={key} />,
  [Section.BULLET_LIST]: ([, , list]) => (
    <MjmlText>
      <ul>
        {list
          .split('\n')
          .filter((e) => e)
          .map((item, key) => {
            const [, value] = item.match(/^\+\s*(.*)$/)!;
            return <li key={key}>{applyEmphasisFormatting(value)}</li>;
          })}
      </ul>
    </MjmlText>
  ),
  [Section.NUMBERED_LIST]: ([, , list]) => (
    <MjmlText>
      <ol>
        {list
          .split('\n')
          .filter((e) => e)
          .map((item, key) => {
            const [, value] = item.match(/^(?:[0-9]+[\.\)]|\+)\s*(.*)$/)!;
            return <li key={key}>{applyEmphasisFormatting(value)}</li>;
          })}
      </ol>
    </MjmlText>
  ),
  [Section.TWEET]: ([, tweetId]) => (
    <MjmlButton href={`https://twitter.com/web/status/${tweetId}`}>
      View tweet
    </MjmlButton>
  ),
  [Section.INSTAGRAM]: ([, igUrl]) => (
    // TODO: Chase getting Instagram embeds to work
    <MjmlButton href={`https://www.instagram.com/p/${igUrl}`}>
      View tweet
    </MjmlButton>
  ),
  [Section.SPOTIFY]: ([, url]) => (
    <MjmlButton href={url}>View Spotify Track</MjmlButton>
  ),
  [Section.AUDIO]: () => (
    <MjmlText>
      <p>Audio cannot be played in email.</p>
    </MjmlText>
  ),
};

export default FormatEmail;

type RenderValue = (
  match: RegExpMatchArray,
  index: number,
  options: FormatTextOptions,
) => React.ReactNode;
