import { ExclusiveStatus } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import invariant from 'tiny-invariant';

import Layout from 'fragments/Layout';
import type { ExclusivePageProps } from 'fragments/Pages/Posts/Exclusive';
import Exclusive from 'fragments/Pages/Posts/Exclusive';
import { createExclusiveNavigatorParams } from 'utils/functions';
import Logger from 'utils/logger';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const ExclusivePage: NextPageWithLayout<ExclusivePageProps> = (props) => {
  return <Exclusive {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  ExclusivePageProps
> = async (ctx) => {
  try {
    const { query, res } = ctx;
    const slug = String(query.slug);

    const helpers = getServerSideHelpers(ctx);
    const params: ExclusiveFindInput = {
      where: { slug, status: ExclusiveStatus.PUBLISHED },
    };

    const exclusive = await helpers.exclusive.find.fetch(params);
    invariant(exclusive, 'No exclusive found.');

    const previousParams = createExclusiveNavigatorParams(
      exclusive,
      'lt',
      true,
    );
    const nextParams = createExclusiveNavigatorParams(exclusive, 'gt', true);

    res.setHeader('X-Robots-Tag', 'noindex');
    await helpers.exclusive.find.prefetch(params);
    await helpers.exclusive.find.prefetch(previousParams);
    await helpers.exclusive.find.prefetch(nextParams);
    await helpers.exclusive.index.prefetch(exclusive.id);

    return {
      props: {
        params,
        previousParams,
        nextParams,
        indexParams: exclusive.id,
        slug,
        pathDefinition: {
          title: `${exclusive.subject} | ${Settings.SITE_TITLE}`,
          description: exclusive.preview,
          url: `/exclusives/${exclusive.slug}`,
        },
        trpcState: helpers.dehydrate(),
      },
    };
  } catch (e) {
    Logger.error(e);
    return { notFound: true };
  }
};

ExclusivePage.getLayout = Layout.addPartials;
export default ExclusivePage;
