import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { memo } from 'react';

import type { PostDAO } from 'classes/posts/PostDAO';
import { PostStatus, PostType } from 'classes/posts/PostDAO';
import { NextImage } from 'componentsv2/Image';
import { SITE_TITLE } from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import { QueryOrder } from 'constants/types';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import ZDate from 'lib/date';
import PageAPI from 'private/api/pages';
import SSR from 'private/ssr';
import RS from 'stylesv2/Pages/Reveries.styles';

const REVERIES_HEADING = 'Reveries';

// eslint-disable-next-line react/function-component-definition
const ReveriesIndex: NextPageWithLayout<ReveriesIndexProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { pageIntro, reveries } = pageProps;
  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <RS.Container>
        <RS.Main>
          <RS.Header>
            <RS.PageHeading>{REVERIES_HEADING}</RS.PageHeading>
            <RS.PageSummary>{pageIntro}</RS.PageSummary>
          </RS.Header>
          <RS.Grid>
            {reveries.map((reverie, key) => (
              <Reverie reverie={reverie} key={key} />
            ))}
          </RS.Grid>
        </RS.Main>
      </RS.Container>
    </React.Fragment>
  );
};

const Reverie = memo(({ reverie }: ReverieProps) => {
  const href = `/reveries/${reverie.slug}`;

  return (
    <RS.Entry>
      <RS.EntryHeading>{reverie.title}</RS.EntryHeading>
      <RS.EntryDate dateTime={ZDate.formatISO(reverie.datePublished)}>
        {ZDate.format(reverie.datePublished)}
      </RS.EntryDate>
      <Link href={href} passHref={true}>
        <RS.ImageBox>
          <NextImage
            src={reverie.image as string}
            alt={reverie.title}
            layout={'fill'}
            objectFit={'cover'}
            loading={'lazy'}
            placeholder={'blur'}
            blurDataURL={reverie.imagePlaceholder}
          />
        </RS.ImageBox>
      </Link>
      <RS.EntryContent
        truncate={45}
        more={{
          href: href,
          text: `Read "${reverie.title}"`,
        }}>
        {reverie.content}
      </RS.EntryContent>
    </RS.Entry>
  );
});

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
        url: '/reveries',
      },
      pageProps: {
        reveries,
        pageIntro: page.content!,
      },
    },
  };
};

ReveriesIndex.getLayout = Layout.addPartials;
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
