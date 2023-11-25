import { MjmlButton, MjmlText } from '@faire/mjml-react';
import type React from 'react';

import EmailTheme from 'server/emails/theme';

import type { FormatTextOptions } from '../..';
import { Section } from '../../regex';
import { applyEmphasisFormatting } from '../Emphasis';

const IMAGE_DIM_KEYS: DimensionKeyMap = {
  h: 'height',
  w: 'width',
  mh: 'maxHeight',
  mw: 'maxWidth',
};

const FormatEmail: Record<Section, RenderValue> = {
  [Section.PARAGRAPH]: ([, text], key, options) => (
    <p
      style={{
        lineHeight: 1.9,
        marginBottom: 28,
        whiteSpace: 'pre-wrap',
      }}
      key={key}>
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
  [Section.IMAGE]: ([, alt, src, dimensions], key) => {
    const styles: React.CSSProperties = {};

    if (dimensions) {
      const params = new URLSearchParams(dimensions);
      params.forEach((value, key) => {
        const property = IMAGE_DIM_KEYS[key];
        styles[property] = value;
      });
    } else {
      styles.width = '100%';
    }

    return (
      <img
        src={src}
        alt={alt}
        style={{
          borderRadius: 8,
          objectFit: 'contain',
          marginTop: -13,
          ...styles,
        }}
        key={key}
      />
    );
  },

  [Section.BLOCKQUOTE]: ([, text], key) => (
    <blockquote
      key={key}
      style={{
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderLeft: '6px solid rgba(0,0,0,0.4)',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        fontSize: '90%',
        lineHeight: '28px',
        margin: '16px 0',
        padding: '16px 20px 18px',
        whiteSpace: 'pre-wrap',
      }}>
      {applyEmphasisFormatting(text)}
    </blockquote>
  ),
  [Section.DIVIDER]: (_, key) => (
    <hr
      style={{ border: '1px solid rgba(0,0,0,0.4)', margin: '1.4em 0' }}
      key={key}
    />
  ),
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

type DimensionKeyMap = Record<
  string,
  'height' | 'width' | 'maxHeight' | 'maxWidth'
>;
