import { MjmlButton, MjmlDivider, MjmlText } from '@faire/mjml-react';
import React from 'react';

import { Section } from '../../regex';
import { applyEmphasisFormatting } from '../Emphasis';

const FormatEmail: Record<Section, RenderValue> = {
  [Section.HEADING]: ([, text]) => (
    <MjmlText>
      <h2>{text}</h2>
    </MjmlText>
  ),
  [Section.SUBHEADING]: ([, text]) => (
    <MjmlText>
      <h3>{text}</h3>
    </MjmlText>
  ),
  [Section.IMAGE]: ([, alt, src]) => (
    <MjmlText>
      <img src={src} alt={alt} style={{ objectFit: 'cover', width: '100%' }} />
    </MjmlText>
  ),
  [Section.DIVIDER]: () => <MjmlDivider />,
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
  [Section.BLOCKQUOTE]: ([, text]) => (
    <MjmlText>
      <blockquote>{applyEmphasisFormatting(text)}</blockquote>
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

type RenderValue = (match: RegExpMatchArray) => React.ReactNode;
