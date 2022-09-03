import classnames from 'classnames';
import type { GetServerSideProps, NextPage } from 'next';
import React, { memo, useState } from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import type { PostDAO } from 'classes';
import { PostStatus, PostType, QueryOrder } from 'classes';
import { AdminButton } from 'components/button';
import CloudImage from 'components/image';
import { Partitioner, Spacer, Toolbar } from 'components/layout';
import { LazyLoader, Responsive } from 'components/library';
import { Divider, Paragraph, Title } from 'components/text';
import { SITE_TITLE } from 'constants/settings';
import type { PathDefinition } from 'constants/types';
import AdminLock from 'fragments/AdminLock';
import PageMetadata from 'fragments/PageMetadata';
import { RightSidebar } from 'fragments/shared/RightSidebar';
import PageAPI from 'private/api/pages';
import SSR from 'private/ssr';
import css from 'styles/pages/Reveries.module.scss';

const REVERIES_HEADING = 'Reveries';

// eslint-disable-next-line react/function-component-definition
const ReveriesIndex: NextPage<ReveriesIndexProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { pageIntro, reveries } = pageProps;
  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <Spacer>
        <Partitioner>
          <Responsive
            defaultView={
              <React.Fragment>
                <ReverieList reveries={reveries} pageIntro={pageIntro} />
                <RightSidebar />
              </React.Fragment>
            }
            laptopView={
              <ReverieList reveries={reveries} pageIntro={pageIntro} />
            }
          />
        </Partitioner>
        <AdminLock>
          <Toolbar spaceItems={true}>
            <AdminButton onClick={navigateToPostAdmin}>Posts Admin</AdminButton>
          </Toolbar>
        </AdminLock>
      </Spacer>
    </React.Fragment>
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
  const page = await PageAPI.getBySlug('reveries');
  const reveries = JSON.parse(
    await SSR.Posts.getAll({
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
      pathDefinition: {
        title: `Reveries | ${SITE_TITLE}`,
        description: page.excerpt!,
        url: `/reveries`,
      },
      pageProps: {
        reveries,
        pageIntro: page.content!,
      },
    },
  };
};

export default ReveriesIndex;

interface ReverieProps {
  reverie: PostDAO;
}

interface ReveriesIndexProps {
  pathDefinition: PathDefinition;
  pageProps: ReverieList;
}

interface ReverieList {
  reveries: PostDAO[];
  pageIntro: string;
}
