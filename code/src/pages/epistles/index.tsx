import classnames from 'classnames';
import type { GetServerSideProps } from 'next';
import React, { memo, useState } from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { zDate } from 'zavid-modules';

import type { PostDAO } from 'classes';
import { PostStatus, PostType, QueryOrder } from 'classes';
import { AdminButton } from 'components/button';
import CloudImage from 'components/image';
import { Spacer, Toolbar } from 'components/layout';
import { LazyLoader, ScreenWidth } from 'components/library';
import { Divider, Paragraph, Title, VanillaLink } from 'components/text';
import type { PathDefinition } from 'constants/paths';
import { siteTitle } from 'constants/settings';
import AdminLock from 'fragments/AdminLock';
import PageMetadata from 'fragments/PageMetadata';
import css from 'styles/pages/Epistles.module.scss';

import { getPageBySlug } from '../api/pages';
import { getAllPostsSSR } from '../api/posts';

const EPISTLES_HEADING = 'Epistles';

function EpistlesIndex({ pathDefinition, pageProps }: EpistlesIndexProps) {
  const { epistles, pageIntro } = pageProps;
  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <Spacer>
        <EpistleGrid epistles={epistles} pageIntro={pageIntro} />
        <AdminLock>
          <Toolbar spaceItems={true}>
            <AdminButton onClick={() => (location.href = '/admin/posts')}>
              Posts Admin
            </AdminButton>
          </Toolbar>
        </AdminLock>
      </Spacer>
    </React.Fragment>
  );
}

function EpistleGrid({ epistles, pageIntro }: EpistlesProps) {
  return (
    <div className={css['epistles-index-page']}>
      <div>
        <Title className={css['epistles-heading']}>{EPISTLES_HEADING}</Title>
        <div className={css[`epistles-introduction`]}>
          <Paragraph
            cssOverrides={{
              paragraph: css[`epistles-introduction-paragraph`],
            }}>
            {pageIntro}
          </Paragraph>
        </div>
        <Divider className={css['epistles-heading-divider']} />
      </div>
      <div className={css['epistles-grid']}>
        <EpistleGridder
          epistles={epistles.map((epistle, key) => (
            <EpistleEntry epistle={epistle} key={key + 1} />
          ))}
        />
      </div>
    </div>
  );
}

function EpistleGridder({ epistles }: EpistleGridderProps) {
  const isMedium = useMediaQuery({ query: ScreenWidth.MEDIUM });
  const isLarge = useMediaQuery({ query: ScreenWidth.LARGE });
  const isXLarge = useMediaQuery({ query: ScreenWidth.XLARGE });

  const COLUMN_NUMBER = isMedium ? 2 : isLarge ? 3 : isXLarge ? 4 : 5;

  const array = [];

  for (let i = 0; i <= COLUMN_NUMBER; i++) {
    array.push(
      <div className={css['epistles-grid-column']} key={i}>
        {epistles.filter((_, key) => key % COLUMN_NUMBER === i)}
      </div>,
    );
  }

  return <React.Fragment>{array}</React.Fragment>;
}

const EpistleEntry = memo(({ epistle }: EpistleEntryProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [isInView, setInView] = useState(false);

  const datePublished = zDate.formatDate(epistle.datePublished as string, {
    withWeekday: true,
  });
  const link = `/epistles/${epistle.slug}`;
  const title = `#${epistle.typeId}: ${epistle.title}`;

  const classes = classnames(css[`epistles-unit-${theme}`], {
    [css[`epistles-unit--visible`]]: isInView,
  });
  return (
    <LazyLoader setInView={setInView}>
      <div className={classes}>
        <VanillaLink href={link}>
          <EpistleImage epistle={epistle} />
          <div className={css['epistles-unit-text']}>
            <Title className={css['epistles-title']}>{title}</Title>
            <div className={css['epistles-date']}>{datePublished}</div>
            <EpistleParagraph epistle={epistle} link={link} />
          </div>
        </VanillaLink>
      </div>
    </LazyLoader>
  );
});

function EpistleParagraph({ epistle, link }: EpistleParagraphProps) {
  const isSmall = useMediaQuery({ query: ScreenWidth.SMALL });

  return (
    <Paragraph
      cssOverrides={{
        paragraph: css['epistles-paragraph'],
        hyperlink: css['epistles-readmore'],
      }}
      truncate={isSmall ? 20 : 30}
      moreclass={css['epistles-readmore']}
      morelink={link}>
      {epistle.content}
    </Paragraph>
  );
}

function EpistleImage({ epistle }: EpistleEntryProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  if (!epistle.image) return null;
  return (
    <CloudImage
      src={epistle.image as string}
      alt={epistle.title}
      containerClassName={css[`epistles-image-${theme}`]}
    />
  );
}

export const getServerSideProps: GetServerSideProps<
  EpistlesIndexProps
> = async () => {
  const page = await getPageBySlug('epistles');
  const epistles = JSON.parse(
    await getAllPostsSSR({
      sort: {
        field: 'datePublished',
        order: QueryOrder.DESCENDING,
      },
      type: { include: [PostType.EPISTLE] },
      status: { include: [PostStatus.PUBLISHED] },
    }),
  );

  return {
    props: {
      pathDefinition: {
        title: `Epistles | ${siteTitle}`,
        description: page.excerpt!,
        url: `/epistles`,
      },
      pageProps: {
        epistles,
        pageIntro: page.content!,
      },
    },
  };
};

export default EpistlesIndex;

interface EpistlesIndexProps {
  pathDefinition: PathDefinition;
  pageProps: EpistlesProps;
}

interface EpistlesProps {
  epistles: PostDAO[];
  pageIntro: string;
}

interface EpistleEntryProps {
  epistle: PostDAO;
}

interface EpistleGridderProps {
  epistles: JSX.Element[];
}

interface EpistleParagraphProps {
  epistle: PostDAO;
  link: string;
}
