import { useQuery } from '@apollo/client';
import React, { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { Post } from 'classes';
import { alert } from 'components/alert.js';
import { AdminButton } from 'components/button';
import CloudImage from 'components/image.js';
import { Partitioner, Spacer, Toolbar, Responsive } from 'components/layout';
import { LazyLoader } from 'components/loader.js';
import { Title, Paragraph, Divider } from 'components/text.js';
import { Zoomer } from 'components/transitioner.js';
import { ORDER } from 'constants/strings.js';
import { isAuthenticated } from 'lib/cookies';
import { RightSidebar } from 'partials/sidebar';
import { GET_POSTS_QUERY } from 'private/api/queries/post.queries';
import css from 'styles/pages/Reveries.module.scss';

const REVERIES_HEADING = 'Reveries';

const ReveriesIndex = ({ reveriesIntro }) => {
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
        type: { include: [Post.TYPES.REVERIE.TITLE] },
        status: { include: [Post.STATUSES.PUBLISHED] }
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

const ReveriesHeading = ({ reveriesIntro }) => {
  return (
    <div>
      <Title className={css['reveries-heading']}>{REVERIES_HEADING}</Title>
      <div className={css[`reveries-introduction`]}>
        <Paragraph cssOverrides={{ paragraph: css[`reveries-introduction-paragraph`] }}>
          {reveriesIntro}
        </Paragraph>
      </div>
      <Divider className={css['reveries-heading-divider']} />
    </div>
  );
};

const ReverieList = ({ reveries, reveriesIntro }) => {
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

const Reverie = memo(({ reverie }) => {
  const theme = useSelector(({ theme }) => theme);
  const [isInView, setInView] = useState(false);

  const datePublished = zDate.formatDate(parseInt(reverie.datePublished), true);
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

const ReverieImage = ({ reverie }) => {
  const theme = useSelector(({ theme }) => theme);
  if (!reverie.image) return null;
  return (
    <CloudImage
      src={reverie.image}
      alt={reverie.title}
      containerClassName={css[`reveries-image-${theme}`]}
    />
  );
};

ReveriesIndex.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default ReveriesIndex;
