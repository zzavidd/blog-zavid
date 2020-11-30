import { useQuery } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { memo, useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { PostDAO, PostStatus, PostType, QueryOrder } from 'classes';
import { alert } from 'src/components/alert';
import { AdminButton } from 'src/components/button';
import CloudImage from 'src/components/image';
import { ScreenWidth, Spacer, Toolbar } from 'src/components/layout';
import { LazyLoader } from 'src/components/loader';
import { Divider, Paragraph, Title, VanillaLink } from 'src/components/text';
import { Zoomer } from 'src/components/transitioner';
import { isAuthenticated } from 'src/lib/cookies';
import { GET_POSTS_QUERY } from 'src/private/api/queries/post.queries';
import css from 'src/styles/pages/Epistles.module.scss';
import { useMediaQuery } from 'react-responsive';

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
      <EpistleGrid epistles={epistles} epistlesIntro={epistlesIntro} />
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

const EpistleGrid = ({
  epistles,
  epistlesIntro
}: EpistleGridProps): JSX.Element => {
  return (
    <div className={css['epistles-index-page']}>
      <EpistlesHeading epistlesIntro={epistlesIntro} />
      <div className={css['epistles-grid']}>
        <EpistleGridder
          epistles={epistles.map((epistle, key) => (
            <Epistle epistle={epistle} key={key + 1} />
          ))}
        />
      </div>
    </div>
  );
};

const EpistleGridder = ({ epistles }: EpistleGridderProps) => {
  const isMedium = useMediaQuery({ query: ScreenWidth.MEDIUM });
  const isLarge = useMediaQuery({ query: ScreenWidth.LARGE });
  const isXLarge = useMediaQuery({ query: ScreenWidth.XLARGE });

  const COLUMN_NUMBER = isMedium ? 2 : isLarge ? 3 : isXLarge ? 4 : 5;

  const array = [];

  for (let i = 0; i <= COLUMN_NUMBER; i++) {
    array.push(
      <div className={css['epistles-grid-column']} key={i}>
        {epistles.filter((epistle: JSX.Element, key: number) => {
          return key % COLUMN_NUMBER === i;
        })}
      </div>
    );
  }

  return <>{array}</>;
};

const Epistle = memo(({ epistle }: EpistleProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [isInView, setInView] = useState(false);

  const datePublished = zDate.formatDate(epistle.datePublished as string, {
    withWeekday: true
  });
  const link = `/epistles/${epistle.slug}`;
  const title = `#${epistle.typeId}: ${epistle.title}`;

  return (
    <LazyLoader setInView={setInView}>
      <Zoomer
        determinant={isInView}
        duration={400}
        className={css[`epistles-unit-${theme}`]}>
        <VanillaLink href={link}>
          <EpistleImage epistle={epistle} />
          <div className={css['epistles-unit-text']}>
            <Title className={css['epistles-title']}>{title}</Title>
            <div className={css['epistles-date']}>{datePublished}</div>
            <EpistleParagraph epistle={epistle} link={link} />
          </div>
        </VanillaLink>
      </Zoomer>
    </LazyLoader>
  );
});

const EpistleParagraph = ({ epistle, link }: EpistleParagraphProps) => {
  const isSmall = useMediaQuery({ query: ScreenWidth.SMALL });

  return (
    <Paragraph
      cssOverrides={{
        paragraph: css['epistles-paragraph'],
        hyperlink: css['epistles-readmore']
      }}
      truncate={isSmall ? 20 : 30}
      moreclass={css['epistles-readmore']}
      morelink={link}>
      {epistle.content}
    </Paragraph>
  );
};

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

type EpistlesIndexProps = {
  epistlesIntro: string;
};

type EpistleGridProps = {
  epistles: PostDAO[];
  epistlesIntro: string;
};

type EpistleGridderProps = {
  epistles: JSX.Element[];
};

type EpistleProps = {
  epistle: PostDAO;
};

type EpistleParagraphProps = {
  epistle: PostDAO;
  link: string;
};
