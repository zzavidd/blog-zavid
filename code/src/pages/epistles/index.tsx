import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

import type { PostDAO } from 'classes/posts/PostDAO';
import { PostStatus, PostType } from 'classes/posts/PostDAO';
import { NextImage } from 'componentsv2/Image';
import Settings from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import { QueryOrder } from 'constants/types';
import Layout from 'fragments/Layout';
import PageAPI from 'private/api/pages';
import SSR from 'private/ssr';
import ES from 'stylesv2/Pages/Epistles.styles';

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
      <Link href={href} passHref={true}>
        <ES.Entry>
          <NextImage
            src={epistle.image as string}
            alt={epistle.title}
            layout={'fill'}
            objectFit={'cover'}
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
      </Link>
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
      type: { include: [PostType.EPISTLE] },
      status: { include: [PostStatus.PUBLISHED] },
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
