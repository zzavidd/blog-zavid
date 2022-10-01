import type { HTMLAttributes, ReactElement } from 'react';
import React from 'react';

import type { FormatTextOptions } from 'lib/text';
import {
  applyEmphasisFormatting,
  removeEmphasisFormatting,
} from 'lib/text/formatting/emphasis';
import type {
  CurrentEventTarget,
  onLongPress,
  Target,
} from 'lib/text/functions';
import type { FormatCSSImage } from 'lib/text/regex';
import { Section, sectionRegexMapping, strayRegexToOmit } from 'lib/text/regex';
import TextStyle from 'stylesv2/Components/Text.styles';

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

  const {
    css = {},
    inline = false,
    socialWrappers: { Tweet, InstagramPost } = {},
    onLongPress,
  } = options;

  const foundSection = Object.entries(sectionRegexMapping).find(([, regex]) =>
    regex.test(paragraph),
  );

  const LONG_PRESS_HANDLERS = createLongPressHandlers(onLongPress);

  if (foundSection) {
    const [section, regex] = foundSection!;
    const [, text] = paragraph.match(regex)!;

    switch (section) {
      case Section.HEADING:
        return (
          <h1 className={css['heading']} key={key}>
            {text}
          </h1>
        );
      case Section.SUBHEADING:
        return (
          <h2 className={css['subheading']} key={key}>
            {text}
          </h2>
        );
      case Section.IMAGE:
        const [, alt, src, isFloat] = paragraph.match(regex)!;
        const { float, full } = (css['image'] as FormatCSSImage) || {};
        const className = isFloat ? float : full;
        return (
          <div className={className} key={key}>
            <img src={src} alt={alt} />
          </div>
        );
      case Section.DIVIDER:
        return (
          <hr
            className={css['divider']}
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
            return (
              <li
                style={{
                  padding: isSpacedBulletBlock ? '.5em 0' : 0,
                  paddingLeft: '.5em',
                }}
                key={key}>
                {applyEmphasisFormatting(value, css)}
              </li>
            );
          });

        return (
          <ul style={{ paddingInlineStart: '1em' }} key={key}>
            {bulletListItems}
          </ul>
        );
      case Section.HYPHEN_LIST_ITEM:
        return (
          <div className={css['list-item']} key={key}>
            <span>-</span>
            <span>{applyEmphasisFormatting(text, css)}</span>
          </div>
        );
      case Section.NUMBERED_LIST:
        const [, isSpacedNumberedBlock, numberedList] = paragraph.match(regex)!;
        const numberedListItems = numberedList
          .split('\n')
          .filter((e) => e)
          .map((item, key) => {
            const [, value] = item.match(/^(?:[0-9]+[\.\)]|\+)\s*(.*)$/)!;
            return (
              <li
                style={{
                  padding: isSpacedNumberedBlock ? '.5em 0' : 0,
                  paddingLeft: '1em',
                }}
                key={key}>
                {applyEmphasisFormatting(value, css)}
              </li>
            );
          });

        return (
          <ol style={{ paddingInlineStart: '1.5em' }} key={key}>
            {numberedListItems}
          </ol>
        );
      case Section.BLOCKQUOTE:
        return (
          <div className={css['blockquote']} key={key} {...LONG_PRESS_HANDLERS}>
            {applyEmphasisFormatting(text, css)}
          </div>
        );
      case Section.TWEET:
        const tweetId = paragraph.match(regex)![1];
        if (Tweet) {
          return <Tweet id={tweetId} key={key} />;
        } else {
          const url = `https://www.twitter.com/zzavidd/status/${tweetId}`;
          return (
            <div className={css['twitter-button']} key={key}>
              <a href={url} rel={'noopener noreferrer'}>
                View Tweet
              </a>
            </div>
          );
        }
      case Section.INSTAGRAM:
        const igUrl = paragraph.match(regex)![1];
        if (InstagramPost) {
          return <InstagramPost url={igUrl} key={key} />;
        } else {
          return (
            <div className={css['instagram-button']} key={key}>
              <a href={igUrl} rel={'noopener noreferrer'}>
                View Instagram Post
              </a>
            </div>
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
        return <React.Fragment></React.Fragment>;
    }
  } else {
    return inline ? (
      <span className={css['paragraph']} key={key} {...LONG_PRESS_HANDLERS}>
        {applyEmphasisFormatting(paragraph, css)}
      </span>
    ) : (
      <TextStyle.Section.Paragraph {...LONG_PRESS_HANDLERS} key={key}>
        {applyEmphasisFormatting(paragraph, css)}
      </TextStyle.Section.Paragraph>
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

/**
 * Create handlers for long press events on elements.
 * @param onLongPress
 */
const createLongPressHandlers = (onLongPress?: onLongPress) => {
  if (!onLongPress || !onLongPress.action) return {};

  const { action, duration = 1000 } = onLongPress;
  let longPressTimeout: NodeJS.Timeout;

  function onPress<T extends React.UIEvent<HTMLElement>>(e: T): void {
    const target: Target = e.target;
    longPressTimeout = setTimeout(() => {
      action(target as CurrentEventTarget);
    }, duration);
  }

  function onRelease() {
    clearTimeout(longPressTimeout);
  }

  const longPressHandlers: HTMLAttributes<HTMLParagraphElement> = {
    onMouseDown: onPress,
    onMouseUp: onRelease,
    onTouchStart: onPress,
    onTouchEnd: onRelease,
  };

  return longPressHandlers;
};
