import { useQuery } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { useState, useEffect, memo } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { PostDAO, PostStatic } from 'classes';
import { alert } from 'src/components/alert';
import { AdminButton } from 'src/components/button';
import CloudImage from 'src/components/image';
import {
  Partitioner,
  Spacer,
  Toolbar,
  Responsive
} from 'src/components/layout';
import { LazyLoader } from 'src/components/loader';
import { Title, Paragraph, Divider } from 'src/components/text';
import { Zoomer } from 'src/components/transitioner';
import { ORDER } from 'src/constants/strings';
import { isAuthenticated } from 'src/lib/cookies';
import { RightSidebar } from 'src/partials/sidebar';
import { GET_POSTS_QUERY } from 'src/private/api/queries/post.queries';
import css from 'styles/pages/Reveries.module.scss';

const REVERIES_HEADING = 'Reveries';

const ReveriesIndex = ({ reveriesIntro }: ReveriesIndexProps) => {
  const [reveries, setReveries] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  const { data, error: queryError, loading: queryLoading } = useQuery(
    GET_POSTS_QUERY,
    {
      variables: {
        sort: {
          field: 'datePublished',
          order: ORDER.DESCENDING
        },
        type: { include: [PostStatic.TYPE.REVERIE] },
        status: { include: [PostStatic.STATUS.PUBLISHED] }
      }
    }
  );

  useEffect(() => {
    if (queryLoading) return;
    if (queryError) alert.error(queryError);
    setReveries(data ? data.getAllPosts : []);
    setLoaded(true);
  }, [isLoaded, queryLoading]);

  return (
    <Spacer>
      <Partitioner>
        <Responsive
          defaultView={
            <>
              <ReverieList reveries={reveries} reveriesIntro={reveriesIntro} />
              <RightSidebar />
            </>
          }
          laptopView={
            <ReverieList reveries={reveries} reveriesIntro={reveriesIntro} />
          }
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

const navigateToPostAdmin = () => (location.href = '/admin/posts');

const ReveriesHeading = ({ reveriesIntro }: ReveriesIndexProps) => {
  return (
    <div>
      <Title className={css['reveries-heading']}>{REVERIES_HEADING}</Title>
      <div className={css[`reveries-introduction`]}>
        <Paragraph
          cssOverrides={{ paragraph: css[`reveries-introduction-paragraph`] }}>
          {reveriesIntro}
        </Paragraph>
      </div>
      <Divider className={css['reveries-heading-divider']} />
    </div>
  );
};

const ReverieList = ({ reveries, reveriesIntro }: ReverieList) => {
  return (
    <>
      <div className={css['reveries-list']}>
        <ReveriesHeading reveriesIntro={reveriesIntro} />
        {reveries.map((reverie, key) => (
          <Reverie reverie={reverie} key={key} />
        ))}
      </div>
    </>
  );
};

const Reverie = memo(({ reverie }: ReverieProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [isInView, setInView] = useState(false);

  const datePublished = zDate.formatDate(reverie.datePublished as string, {
    withWeekday: true
  });
  const link = `/reveries/${reverie.slug}`;
  return (
    <LazyLoader setInView={setInView}>
      <Zoomer
        determinant={isInView}
        duration={400}
        className={css[`reveries-unit-${theme}`]}>
        <Title className={css['reveries-title']}>{reverie.title}</Title>
        <div className={css['reveries-date']}>{datePublished}</div>
        <a href={link}>
          <ReverieImage reverie={reverie} />
        </a>
        <Paragraph
          cssOverrides={{
            paragraph: css['reveries-paragraph'],
            hyperlink: css['reveries-readmore']
          }}
          truncate={60}
          moreclass={css['reveries-readmore']}
          morelink={link}>
          {reverie.content}
        </Paragraph>
      </Zoomer>
    </LazyLoader>
  );
});

const ReverieImage = ({ reverie }: ReverieProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  if (!reverie.image) return null;
  return (
    <CloudImage
      src={reverie.image as string}
      alt={reverie.title}
      containerClassName={css[`reveries-image-${theme}`]}
    />
  );
};

ReveriesIndex.getInitialProps = async ({ query }: NextPageContext) => {
  return { ...query };
};

interface ReveriesIndexProps {
  reveriesIntro: string;
}

interface ReverieList {
  reveries: PostDAO[];
  reveriesIntro: string;
}

interface ReverieProps {
  reverie: PostDAO
}

