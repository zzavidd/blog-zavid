import { PostStatus, PostType } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import invariant from 'tiny-invariant';

import Layout from 'fragments/Layout';
import type { ReveriePageProps } from 'fragments/Pages/Posts/Reverie';
import Reverie from 'fragments/Pages/Posts/Reverie';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import Logger from 'utils/logger';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const ReveriePage: NextPageWithLayout<ReveriePageProps> = (props) => {
  return <Reverie {...props} />;
};

export const getServerSideProps: GetServerSideProps<ReveriePageProps> = async (
  ctx,
) => {
  try {
    const { query, req, res } = ctx;
    const slug = String(query.slug);

    const helpers = getServerSideHelpers(ctx);
    const params: PostFindInput = {
      params: {
        where: {
          slug,
          type: PostType.REVERIE,
          status: {
            notIn: [PostStatus.DRAFT],
          },
        },
      },
    };

    const reverie = await helpers.post.find.fetch(params);
    invariant(reverie, 'No reverie found.');

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    const isAdmin =
      session && session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
    const isVisibleToAll =
      reverie.status === PostStatus.PRIVATE ||
      reverie.status === PostStatus.PUBLISHED;
    const isVisibleToAdmin = isAdmin && reverie.status === PostStatus.PROTECTED;
    invariant(isVisibleToAll || isVisibleToAdmin, 'No reverie found.');

    res.setHeader('X-Robots-Tag', 'noindex');
    await helpers.post.find.prefetch(params);

    return {
      props: {
        params,
        slug,
        pathDefinition: {
          title: `${reverie.title} | ${Settings.SITE_TITLE}`,
          description: reverie.excerpt,
          url: `/reveries/${reverie.slug}`,
        },
        trpcState: helpers.dehydrate(),
      },
    };
  } catch (e) {
    Logger.error(e);
    return {
      notFound: true,
    };
  }
};

ReveriePage.getLayout = Layout.addPartials;
export default ReveriePage;
