import type { GetServerSideProps } from 'next';
import { memo } from 'react';

import { NextImage } from 'components/Image';
import { IPostStatus, IPostType, QueryOrder } from 'constants/enums';
import Settings from 'constants/settings';
import Layout from 'fragments/Layout';
import ZDate from 'lib/date';
import PageAPI from 'private/api/pages';
import SSR from 'private/ssr';
import RS from 'styles/Pages/Reveries.styles';

const REVERIES_HEADING = 'Reveries';

// eslint-disable-next-line react/function-component-definition
const ReveriesIndex: NextPageWithLayout<ReveriesIndexProps> = ({
  pageProps,
}) => {
  const { pageIntro, reveries } = pageProps;
  return (
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
  );
};

const Reverie = memo(
  ({ reverie }: ReverieProps) => {
    const href = `/reveries/${reverie.slug}`;

    return (
      <RS.Entry>
        <RS.EntryHeading>{reverie.title}</RS.EntryHeading>
        <RS.EntryDate dateTime={ZDate.formatISO(reverie.datePublished)}>
          {ZDate.format(reverie.datePublished)}
        </RS.EntryDate>
        <RS.ImageBox href={href}>
          <NextImage
            src={reverie.image as string}
            alt={reverie.title}
            loading={'lazy'}
            placeholder={'blur'}
            blurDataURL={reverie.imagePlaceholder}
          />
        </RS.ImageBox>
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
  },
  (a, b) => a.reverie.id === b.reverie.id,
);

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
      type: { include: [IPostType.REVERIE] },
      status: { include: [IPostStatus.PUBLISHED] },
    }),
  );

  return {
    props: {
      pathDefinition: {
        title: `Reveries | ${Settings.SITE_TITLE}`,
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
