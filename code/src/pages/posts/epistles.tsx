import { useQuery } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { memo, useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { PostDAO, PostStatus, PostType, QueryOrder } from 'classes';
import { alert } from 'src/components/alert';
import { AdminButton } from 'src/components/button';
import CloudImage from 'src/components/image';
import { Spacer, Toolbar } from 'src/components/layout';
import { LazyLoader } from 'src/components/loader';
import { Divider, Paragraph, Title } from 'src/components/text';
import { Zoomer } from 'src/components/transitioner';
import { isAuthenticated } from 'src/lib/cookies';
import { GET_POSTS_QUERY } from 'src/private/api/queries/post.queries';
import css from 'src/styles/pages/Epistles.module.scss';

const EPISTLES_HEADING = 'Epistles';

const EpistlesIndex = ({ epistlesIntro }: EpistlesIndexProps) => {
  const [epistles, setEpistles] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  const { data, error: queryError, loading: queryLoading } = useQuery(
    GET_POSTS_QUERY,
    {
      variables: {
        sort: {
          field: 'datePublished',
          order: QueryOrder.DESCENDING
        },
        type: { include: [PostType.EPISTLE] },
        status: { include: [PostStatus.PUBLISHED] }
      }
    }
  );

  useEffect(() => {
    if (queryLoading) return;
    if (queryError) alert.error(queryError);
    setEpistles(data ? data.getAllPosts : []);
    setLoaded(true);
  }, [isLoaded, queryLoading]);

  return (
    <Spacer>
      <EpistleList epistles={epistles} epistlesIntro={epistlesIntro} />
      <Toolbar spaceItems={true}>
        {isAuthenticated() && (
          <AdminButton onClick={navigateToPostAdmin}>Posts Admin</AdminButton>
        )}
      </Toolbar>
    </Spacer>
  );
};

const navigateToPostAdmin = () => (location.href = '/admin/posts');

const EpistlesHeading = ({ epistlesIntro }: EpistlesIndexProps) => {
  return (
    <div>
      <Title className={css['epistles-heading']}>{EPISTLES_HEADING}</Title>
      <div className={css[`epistles-introduction`]}>
        <Paragraph
          cssOverrides={{ paragraph: css[`epistles-introduction-paragraph`] }}>
          {epistlesIntro}
        </Paragraph>
      </div>
      <Divider className={css['epistles-heading-divider']} />
    </div>
  );
};

const EpistleList = ({ epistles, epistlesIntro }: EpistleList) => {
  return (
    <>
      <div className={css['epistles-list']}>
        <EpistlesHeading epistlesIntro={epistlesIntro} />
        {epistles.map((epistle, key) => (
          <Epistle epistle={epistle} key={key} />
        ))}
      </div>
    </>
  );
};

const Epistle = memo(({ epistle }: EpistleProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [isInView, setInView] = useState(false);

  const datePublished = zDate.formatDate(epistle.datePublished as string, {
    withWeekday: true
  });
  const link = `/epistles/${epistle.slug}`;
  return (
    <LazyLoader setInView={setInView}>
      <Zoomer
        determinant={isInView}
        duration={400}
        className={css[`epistles-unit-${theme}`]}>
        <Title className={css['epistles-title']}>{epistle.title}</Title>
        <div className={css['epistles-date']}>{datePublished}</div>
        <a href={link}>
          <EpistleImage epistle={epistle} />
        </a>
        <Paragraph
          cssOverrides={{
            paragraph: css['epistles-paragraph'],
            hyperlink: css['epistles-readmore']
          }}
          truncate={60}
          moreclass={css['epistles-readmore']}
          morelink={link}>
          {epistle.content}
        </Paragraph>
      </Zoomer>
    </LazyLoader>
  );
});

const EpistleImage = ({ epistle }: EpistleProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  if (!epistle.image) return null;
  return (
    <CloudImage
      src={epistle.image as string}
      alt={epistle.title}
      containerClassName={css[`epistles-image-${theme}`]}
    />
  );
};

EpistlesIndex.getInitialProps = async ({ query }: NextPageContext) => {
  return { ...query };
};

export default EpistlesIndex;

interface EpistlesIndexProps {
  epistlesIntro: string;
}

interface EpistleList {
  epistles: PostDAO[];
  epistlesIntro: string;
}

interface EpistleProps {
  epistle: PostDAO;
}
