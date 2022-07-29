import React from 'react';
import { zDate } from 'zavid-modules';

import type { PostDAO } from 'classes';
import CloudImage, { AspectRatio } from 'src/components/image';
import { Flexer } from 'src/components/layout';
import { Paragraph, Title } from 'src/components/text';
import { Icon, Responsive } from 'src/lib/library';
import css from 'src/styles/pages/Home.module.scss';

export default ({ reverie }: LatestReverieProps) => {
  return (
    <div className={css['latest-reverie']}>
      <Responsive
        defaultView={
          <Flexer>
            <div>
              <LatestReverieHeader reverie={reverie} />
              <LatestReverieParagraph reverie={reverie} />
            </div>
            <LatestReverieImage image={reverie.image as string} />
          </Flexer>
        }
        desktopView={
          <>
            <LatestReverieHeader reverie={reverie} />
            <LatestReverieImage image={reverie.image as string} />
            <LatestReverieParagraph reverie={reverie} />
          </>
        }
      />
    </div>
  );
};

const LatestReverieHeader = ({ reverie }: LatestReverieProps) => {
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
};

const LatestReverieParagraph = ({ reverie }: LatestReverieProps) => {
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
};

const LatestReverieImage = ({ image }: LatestReverieImageProps) => {
  interface ReverieImage {
    aspectRatio: AspectRatio;
  }
  const ReverieImage = ({ aspectRatio }: ReverieImage) => {
    return (
      <CloudImage
        src={image}
        aspectRatio={aspectRatio}
        containerClassName={css['latest-reverie-image-container']}
        imageClassName={css['latest-reverie-image']}
      />
    );
  };
  return (
    <Responsive
      defaultView={<ReverieImage aspectRatio={AspectRatio.SQUARE} />}
      desktopView={<ReverieImage aspectRatio={AspectRatio.WIDE} />}
    />
  );
};

type LatestReverieProps = {
  reverie: PostDAO;
};

type LatestReverieImageProps = {
  image: string;
};
