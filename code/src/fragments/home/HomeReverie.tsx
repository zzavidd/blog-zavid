import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { zDate } from 'zavid-modules';

import type { PostDAO } from 'classes/posts/PostDAO';
import CloudImage, { AspectRatio } from 'components/image';
import { Flexer } from 'components/layout';
import { Icon, Responsive } from 'components/library';
import { Paragraph, Title } from 'components/text';
import ZDate from 'lib/date';
import css from 'styles/pages/Home.module.scss';
import * as Style from 'stylesv2/Pages/Home.styles';

export default function HomeReverie({ reverie }: LatestReverieProps) {
  return (
    <Style.Latest.Article>
      <Style.Latest.Feather icon={faBookOpen} />
      <Style.Latest.Label>Latest Reverie:</Style.Latest.Label>
      <Style.Latest.Title>{reverie.title}</Style.Latest.Title>
      <Style.Latest.Date dateTime={ZDate.formatISO(reverie.datePublished)}>
        {ZDate.format(reverie.datePublished)}
      </Style.Latest.Date>
      <Style.Latest.Excerpt
        truncate={80}
        more={{
          text: 'Read my latest reverie...',
          href: `/reveries/${reverie.slug}`,
        }}>
        {reverie.content}
      </Style.Latest.Excerpt>
      <LatestReverieImage reverie={reverie} />
    </Style.Latest.Article>
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
