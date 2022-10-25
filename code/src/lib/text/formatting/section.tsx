/* eslint-disable @next/next/no-img-element */
import type { ReactElement } from 'react';
import React from 'react';
import InstagramEmbed from 'react-instagram-embed';
import { TwitterTweetEmbed } from 'react-twitter-embed';

import type { FormatTextOptions } from 'lib/text';
import {
  applyEmphasisFormatting,
  removeEmphasisFormatting,
} from 'lib/text/formatting/emphasis';
import { Section, sectionRegexMapping, strayRegexToOmit } from 'lib/text/regex';
import TS from 'styles/Components/Text.styles';

/**
 * Formats a paragraph of text.
 * @param paragraph The paragraph to be formatted.
 * @param key The paragraph index.
 * @param options The formatting options.
 */
export const formatParagraph = (
  paragraph: string,
  key: number,
  options: FormatTextOptions = {},
): ReactElement => {
  if (!paragraph) return <React.Fragment></React.Fragment>;

  const { inline = false } = options;

  const foundSection = Object.entries(sectionRegexMapping).find(([, regex]) =>
    regex.test(paragraph),
  );

  if (foundSection) {
    const [section, regex] = foundSection!;
    const [, text] = paragraph.match(regex)!;

    switch (section) {
      case Section.HEADING:
        return <h1 key={key}>{text}</h1>;
      case Section.SUBHEADING:
        return <h2 key={key}>{text}</h2>;
      case Section.IMAGE:
        const [, alt, src] = paragraph.match(regex)!;
        return (
          <TS.Section.BlockImage
            src={src}
            alt={alt}
            loading={'lazy'}
            key={key}
          />
        );
      case Section.DIVIDER:
        return (
          <hr
            style={{
              borderStyle: 'solid',
              borderWidth: '1px',
              margin: '2rem 0 1rem',
            }}
            key={key}
          />
        );
      case Section.BULLET_LIST:
        const [, isSpacedBulletBlock, bulletList] = paragraph.match(regex)!;
        const bulletListItems = bulletList
          .split('\n')
          .filter((e) => e)
          .map((item, key) => {
            const [, value] = item.match(/^\+\s*(.*)$/)!;
            return <li key={key}>{applyEmphasisFormatting(value)}</li>;
          });

        return (
          <TS.Section.UnorderedList
            spaced={!!isSpacedBulletBlock}
            style={{ paddingInlineStart: '1em' }}
            key={key}>
            {bulletListItems}
          </TS.Section.UnorderedList>
        );
      case Section.HYPHEN_LIST_ITEM:
        return (
          <div key={key}>
            <span>-</span>
            <span>{applyEmphasisFormatting(text)}</span>
          </div>
        );
      case Section.NUMBERED_LIST:
        const [, isSpacedNumberedBlock, numberedList] = paragraph.match(regex)!;
        const numberedListItems = numberedList
          .split('\n')
          .filter((e) => e)
          .map((item, key) => {
            const [, value] = item.match(/^(?:[0-9]+[\.\)]|\+)\s*(.*)$/)!;
            return <li key={key}>{applyEmphasisFormatting(value)}</li>;
          });

        return (
          <TS.Section.OrderedList spaced={!!isSpacedNumberedBlock} key={key}>
            {numberedListItems}
          </TS.Section.OrderedList>
        );
      case Section.BLOCKQUOTE:
        return (
          <TS.Section.Blockquote key={key}>
            {applyEmphasisFormatting(text)}
          </TS.Section.Blockquote>
        );
      case Section.TWEET: {
        const tweetId = paragraph.match(regex)![1];
        return <TwitterTweetEmbed tweetId={tweetId} key={key} />;
      }
      case Section.INSTAGRAM: {
        const igUrl = paragraph.match(regex)![1];
        const accessToken = `${process.env.NEXT_PUBLIC_FB_APP_ID}|${process.env.NEXT_PUBLIC_FB_APP_CLIENT}`;
        // TODO: Chase getting Instagram embeds to work
        return (
          <InstagramEmbed
            url={igUrl}
            clientAccessToken={accessToken}
            maxWidth={500}
            hideCaption={false}
            key={key}
          />
        );
      }

      case Section.SPOTIFY:
        const spotifyUrl = paragraph.match(regex)![1];
        const height = spotifyUrl.includes('podcast') ? '240' : 400;
        return (
          <iframe
            src={spotifyUrl}
            height={height}
            width={'100%'}
            frameBorder={'0'}
            allow={'encrypted-media'}
            key={key}
          />
        );
      case Section.SOUNDCLOUD:
        const soundcloudUrl = paragraph.match(regex)![1];
        return (
          <iframe
            width={'100%'}
            height={'300'}
            scrolling={'no'}
            frameBorder={'no'}
            src={
              `https://w.soundcloud.com/player/?url=${soundcloudUrl}&color=%23ff5500&` +
              'auto_play=false&hide_related=true&show_comments=false&show_user=true&' +
              'show_reposts=false&show_teaser=true&visual=true'
            }
            key={key}></iframe>
        );
      default:
        return <React.Fragment />;
    }
  } else {
    return inline ? (
      <span key={key}>{applyEmphasisFormatting(paragraph)}</span>
    ) : (
      <TS.Section.Paragraph key={key}>
        {applyEmphasisFormatting(paragraph)}
      </TS.Section.Paragraph>
    );
  }
};

/**
 * Deformats a paragraph of text.
 * @param paragraph The paragraph to be deformatted.
 * @param key The paragraph index.
 */
export const deformatParagraph = (paragraph: string, key: number): string => {
  if (!paragraph) return '';
  if (strayRegexToOmit.test(paragraph)) return '';

  // Replace plus symbols with bullet points
  paragraph = paragraph.replace(/\+\s/g, '• ');

  // Initialise with space separate paragraphs
  const init = key > 0 ? ' ' : '';
  let detransformedParagraph: string = init;

  const foundSection = Object.entries(sectionRegexMapping).find(([, regex]) => {
    return regex.test(paragraph);
  });

  if (foundSection) {
    const [section, regex] = foundSection;
    const [, text] = paragraph.match(regex)!;

    switch (section) {
      case Section.HEADING:
      case Section.SUBHEADING:
      case Section.BULLET_LIST:
      case Section.HYPHEN_LIST_ITEM:
      case Section.NUMBERED_LIST:
        detransformedParagraph += removeEmphasisFormatting(text);
        break;
      case Section.IMAGE:
      case Section.DIVIDER:
      case Section.TWEET:
      case Section.INSTAGRAM:
      case Section.SPOTIFY:
      case Section.SOUNDCLOUD:
        detransformedParagraph = '';
        break;
      case Section.BLOCKQUOTE:
        detransformedParagraph += `"${removeEmphasisFormatting(text)}"`;
        break;
      default:
        break;
    }
  } else {
    detransformedParagraph += removeEmphasisFormatting(paragraph);
  }

  return detransformedParagraph;
};
