import type { GetServerSideProps } from 'next';
import React from 'react';

import { NextImage } from 'components/Image';
import { IPostStatus, IPostType, QueryOrder } from 'constants/enums';
import Settings from 'constants/settings';
import Layout from 'fragments/Layout';
import PageAPI from 'private/api/pages';
import SSR from 'private/ssr';
import ES from 'styles/Pages/Epistles.styles';

const EPISTLES_HEADING = 'Epistles';

// eslint-disable-next-line react/function-component-definition
const EpistlesIndex: NextPageWithLayout<EpistlesIndexProps> = ({
  pageProps,
}) => {
  const { epistles, pageIntro } = pageProps;
  return (
    <ES.Container>
      <ES.Main>
        <ES.Header>
          <ES.PageHeading>{EPISTLES_HEADING}</ES.PageHeading>
          <ES.PageSummary>{pageIntro}</ES.PageSummary>
        </ES.Header>
        <ES.Grid>
          {epistles.map((epistle, key) => {
            return <Epistle epistle={epistle} key={key} />;
          })}
        </ES.Grid>
      </ES.Main>
    </ES.Container>
  );
};

const Epistle = React.memo<EpistleProps>(
  ({ epistle }) => {
    const href = `/epistles/${epistle.slug}`;
    return (
      <ES.Entry href={href}>
        <NextImage
          src={epistle.image as string}
          alt={epistle.title}
          loading={'lazy'}
          placeholder={'blur'}
          blurDataURL={epistle.imagePlaceholder}
        />
        <ES.EntryLabel>
          <ES.EntryHeading>
            #{epistle.typeId}: {epistle.title}
          </ES.EntryHeading>
          <ES.EntryContent truncate={15}>{epistle.content}</ES.EntryContent>
        </ES.EntryLabel>
      </ES.Entry>
    );
  },
  (a, b) => a.epistle.id === b.epistle.id,
);

export const getServerSideProps: GetServerSideProps<
  EpistlesIndexProps
> = async () => {
  const page = await PageAPI.getBySlug('epistles');
  const epistles = JSON.parse(
    await SSR.Posts.getAll({
      sort: {
        field: 'datePublished',
        order: QueryOrder.DESCENDING,
      },
      type: { include: [IPostType.EPISTLE] },
      status: { include: [IPostStatus.PUBLISHED] },
    }),
  );

  return {
    props: {
      pathDefinition: {
        title: `Epistles | ${Settings.SITE_TITLE}`,
        description: page.excerpt!,
        url: '/epistles',
      },
      pageProps: {
        epistles,
        pageIntro: page.content!,
      },
    },
  };
};

EpistlesIndex.getLayout = Layout.addPartials;
export default EpistlesIndex;

interface EpistlesIndexProps {
  pathDefinition: PathDefinition;
  pageProps: {
    epistles: PostDAO[];
    pageIntro: string;
  };
}

interface EpistleProps {
  epistle: PostDAO;
}
