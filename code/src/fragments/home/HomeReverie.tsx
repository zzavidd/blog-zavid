import React from 'react';
import { zDate } from 'zavid-modules';

import type { PostDAO } from 'classes';
import CloudImage, { AspectRatio } from 'components/image';
import { Flexer } from 'components/layout';
import { Icon, Responsive } from 'components/library';
import { Paragraph, Title } from 'components/text';
import css from 'styles/pages/Home.module.scss';

export default function HomeReverie({ reverie }: LatestReverieProps) {
  return (
    <div className={css['latest-reverie']}>
      <Responsive
        defaultView={
          <Flexer>
            <div>
              <LatestReverieHeader reverie={reverie} />
              <LatestReverieParagraph reverie={reverie} />
            </div>
            <LatestReverieImage reverie={reverie} />
          </Flexer>
        }
        desktopView={
          <React.Fragment>
            <LatestReverieHeader reverie={reverie} />
            <LatestReverieImage reverie={reverie} />
            <LatestReverieParagraph reverie={reverie} />
          </React.Fragment>
        }
      />
    </div>
  );
}

function LatestReverieHeader({ reverie }: LatestReverieProps) {
  const date = zDate.formatDate(reverie.datePublished!, { withWeekday: true });
  return (
    <Flexer>
      <Icon name={'book-open'} className={css['latest-reverie-icon']} />
      <div>
        <div className={css['latest-shared-heading']}>Latest Reverie:</div>
        <Title className={css['latest-reverie-title']}>{reverie.title}</Title>
        <div className={css['latest-reverie-date']}>{date}</div>
      </div>
    </Flexer>
  );
}

function LatestReverieParagraph({ reverie }: LatestReverieProps) {
  return (
    <Paragraph
      className={css['latest-reverie-content']}
      truncate={60}
      moreclass={css['latest-reverie-readmore']}
      moretext={'Read my latest reverie...'}
      morelink={`/reveries/${reverie.slug}`}>
      {reverie.content}
    </Paragraph>
  );
}

function LatestReverieImage({ reverie }: LatestReverieProps) {
  interface ReverieImage {
    aspectRatio: AspectRatio;
  }
  function ReverieImage({ aspectRatio }: ReverieImage) {
    return (
      <CloudImage
        src={reverie.image as string}
        aspectRatio={aspectRatio}
        containerClassName={css['latest-reverie-image-container']}
        imageClassName={css['latest-reverie-image']}
        alt={reverie.title}
      />
    );
  }
  return (
    <Responsive
      defaultView={<ReverieImage aspectRatio={AspectRatio.SQUARE} />}
      desktopView={<ReverieImage aspectRatio={AspectRatio.WIDE} />}
    />
  );
}

interface LatestReverieProps {
  reverie: PostDAO;
}
