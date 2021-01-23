import InstagramEmbed from '@aarnila/react-instagram-embed';
import classnames from 'classnames';
import React, { CSSProperties, ReactNode } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { zText } from 'zavid-modules';
import { FormatCSS } from 'zavid-modules/_dist/constants/text';

import { Icon } from 'src/lib/library';
import css from 'src/styles/components/Text.module.scss';

export const Title = ({ children, className }: Text) => {
  const classes = classnames(css['title'], className);
  return <div className={classes}>{children as string}</div>;
};

export const Paragraph = ({
  children,
  className,
  cssOverrides,
  moreclass,
  morelink,
  moretext,
  substitutions,
  truncate = 0,
  keepRichFormatOnTruncate = false,
  onLongPress
}: Paragraph) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(css['paragraph'], className);

  let text = truncate
    ? zText.truncateText(children as string, {
        limit: truncate as number,
        keepRichFormatting: keepRichFormatOnTruncate
      })
    : children;

  try {
    text = zText.applySubstitutions(
      text as string,
      substitutions as Record<string, string>
    );
  } catch (e) {
    // Don't apply substitutions.
  }

  text = zText.formatText(text as string, {
    css: {
      heading: css['paragraph-heading'],
      subheading: css['paragraph-subheading'],
      image: {
        full: css['paragraph-image-full']
      },
      blockquote: css['paragraph-blockquote'],
      paragraph: css['paragraph-body'],
      divider: css['paragraph-divider'],
      hyperlink: css[`paragraph-hyperlink-${theme}`],
      ...cssOverrides
    },
    socialWrappers: {
      Tweet: EmbeddedTweet,
      InstagramPost: EmbeddedInsta
    },
    onLongPress: {
      action: onLongPress,
      duration: 1000
    }
  });

  const ReadMoreLabel = () => {
    if (typeof children !== 'string') return null;
    if (children.length <= truncate) return null;
    if (!moretext || !morelink) return null;

    return <ReadMore className={moreclass} link={morelink} text={moretext} />;
  };

  return (
    <>
      <pre className={classes}>{text}</pre>
      <ReadMoreLabel />
    </>
  );
};

export const ReadMore = ({ link, text = 'Read more', className }: ReadMore) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(css[`paragraph-read-more-${theme}`], className);
  return (
    <VanillaLink href={link}>
      <div className={classes}>
        <Icon name={'paper-plane'} className={css['link-icon']} />
        {text}
      </div>
    </VanillaLink>
  );
};

export const VanillaLink = ({
  className,
  href,
  children,
  openNewTab = false,
  style
}: VanillaLinkProps) => {
  const classes = classnames(css['vanilla-link'], className);
  return (
    <a
      className={classes}
      href={href}
      style={style}
      {...(openNewTab && {
        target: '_blank',
        rel: 'noopener noreferrer'
      })}>
      {children}
    </a>
  );
};

export const Divider = ({ className }: Text) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(css[`divider-${theme}`], className);
  return <hr className={classes} />;
};

const EmbeddedTweet = ({ id }: EmbeddedTweet) => {
  return <TwitterTweetEmbed tweetId={id} />;
};

const EmbeddedInsta = ({ url }: EmbeddedInsta) => {
  const accessToken = `${process.env.NEXT_PUBLIC_FB_APP_ID}|${process.env.NEXT_PUBLIC_FB_APP_CLIENT}`;
  return (
    <InstagramEmbed
      url={url}
      accessToken={accessToken}
      maxWidth={500}
      hideCaption={false}
    />
  );
};

interface Text {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

interface Paragraph extends Text {
  cssOverrides?: FormatCSS;
  moreclass?: string;
  morelink?: string;
  moretext?: string;
  substitutions?: Record<string, unknown>;
  truncate?: number | boolean;
  keepRichFormatOnTruncate?: boolean;
  onLongPress?: (target: EventTarget & HTMLElement) => void;
}

interface ReadMore extends Text {
  link: string;
  text: string;
}

interface VanillaLinkProps extends Text {
  href: string;
  openNewTab?: boolean;
}

interface EmbeddedTweet {
  id: number;
}

interface EmbeddedInsta {
  url: string;
}
