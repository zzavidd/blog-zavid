import classnames from 'classnames';
import type { GetServerSideProps, NextPage } from 'next';
import React, { memo, useState } from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import type { PostDAO } from 'classes';
import { PostStatus, PostType, QueryOrder } from 'classes';
import { AdminButton } from 'src/components/button';
import CloudImage from 'src/components/image';
import { Partitioner, Spacer, Toolbar } from 'src/components/layout';
import { Divider, Paragraph, Title } from 'src/components/text';
import type { PathDefinition } from 'src/constants/paths';
import { isAuthenticated } from 'src/lib/cookies';
import { LazyLoader, Responsive } from 'src/lib/library';
import { RightSidebar } from 'src/partials/sidebar';
import { siteTitle } from 'src/settings';
import css from 'src/styles/pages/Reveries.module.scss';

import { getPageBySlug } from '../api/pages/[slug]';
import { getAllPostsSSR } from '../api/posts';

const REVERIES_HEADING = 'Reveries';

const ReveriesIndex: NextPage<ReveriesIndexProps> = ({
  reveries,
  pageIntro,
}) => {
  return (
    <Spacer>
      <Partitioner>
        <Responsive
          defaultView={
            <React.Fragment>
              <ReverieList reveries={reveries} pageIntro={pageIntro} />
              <RightSidebar />
            </React.Fragment>
          }
          laptopView={<ReverieList reveries={reveries} pageIntro={pageIntro} />}
        />
      </Partitioner>
      <Toolbar spaceItems={true}>
        {isAuthenticated() && (
          <AdminButton onClick={navigateToPostAdmin}>Posts Admin</AdminButton>
        )}
      </Toolbar>
    </Spacer>
  );
};

function ReverieList({ reveries, pageIntro }: ReverieList) {
  return (
    <div className={css['reveries-list']}>
      <div>
        <Title className={css['reveries-heading']}>{REVERIES_HEADING}</Title>
        <div className={css[`reveries-introduction`]}>
          <Paragraph
            cssOverrides={{
              paragraph: css[`reveries-introduction-paragraph`],
            }}>
            {pageIntro}
          </Paragraph>
        </div>
        <Divider className={css['reveries-heading-divider']} />
      </div>
      {reveries.map((reverie, key) => (
        <Reverie reverie={reverie} key={key} />
      ))}
    </div>
  );
}

const Reverie = memo(({ reverie }: ReverieProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [isInView, setInView] = useState(false);

  const datePublished = zDate.formatDate(reverie.datePublished as string, {
    withWeekday: true,
  });
  const link = `/reveries/${reverie.slug}`;

  const classes = classnames(css[`reveries-unit-${theme}`], {
    [css[`reveries-unit--visible`]]: isInView,
  });
  return (
    <LazyLoader setInView={setInView}>
      <div className={classes}>
        <Title className={css['reveries-title']}>{reverie.title}</Title>
        <div className={css['reveries-date']}>{datePublished}</div>
        <a href={link}>
          <ReverieImage reverie={reverie} />
        </a>
        <Paragraph
          cssOverrides={{
            paragraph: css['reveries-paragraph'],
            hyperlink: css['reveries-readmore'],
          }}
          truncate={60}
          moreclass={css['reveries-readmore']}
          morelink={link}>
          {reverie.content}
        </Paragraph>
      </div>
    </LazyLoader>
  );
});

function ReverieImage({ reverie }: ReverieProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  if (!reverie.image) return null;
  return (
    <CloudImage
      src={reverie.image as string}
      alt={reverie.title}
      containerClassName={css[`reveries-image-${theme}`]}
    />
  );
}

function navigateToPostAdmin() {
  location.href = '/admin/posts';
}

export const getServerSideProps: GetServerSideProps<
  ReveriesIndexProps
> = async () => {
  const page = await getPageBySlug('reveries');
  const reveries = JSON.parse(
    await getAllPostsSSR({
      sort: {
        field: 'datePublished',
        order: QueryOrder.DESCENDING,
      },
      type: { include: [PostType.REVERIE] },
      status: { include: [PostStatus.PUBLISHED] },
    }),
  );

  return {
    props: {
      title: `Reveries | ${siteTitle}`,
      description: page.excerpt,
      url: `/reveries`,
      reveries,
      pageIntro: page.content,
    },
  };
};

export default ReveriesIndex;

interface ReverieProps {
  reverie: PostDAO;
}

type ReveriesIndexProps = PathDefinition & ReverieList;

interface ReverieList {
  reveries: PostDAO[];
  pageIntro: string;
}
