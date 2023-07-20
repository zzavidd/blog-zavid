import { PostStatus, PostType } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import invariant from 'tiny-invariant';

import Layout from 'fragments/Layout';
import type { TributePageProps } from 'fragments/Pages/Posts/Tribute';
import Tribute from 'fragments/Pages/Posts/Tribute';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import Logger from 'utils/logger';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const TributePage: NextPageWithLayout<TributePageProps> = (props) => {
  return <Tribute {...props} />;
};

export const getServerSideProps: GetServerSideProps<TributePageProps> = async (
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
          type: PostType.ADDENDUM,
          status: { notIn: [PostStatus.DRAFT] },
        },
      },
    };

    const tribute = await helpers.post.find.fetch(params);
    invariant(tribute, 'No tribute found.');

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    const isAdmin =
      session && session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
    const isVisibleToAll = tribute.status === PostStatus.PRIVATE;
    const isVisibleToAdmin = isAdmin && tribute.status === PostStatus.PROTECTED;
    invariant(isVisibleToAll || isVisibleToAdmin, 'No tribute found.');

    res.setHeader('X-Robots-Tag', 'noindex');
    await helpers.post.find.prefetch(params);

    return {
      props: {
        params,
        slug,
        pathDefinition: {
          title: `${tribute.title} | ${Settings.SITE_TITLE}`,
          description: tribute.excerpt,
          url: `/addenda/${tribute.slug}`,
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

TributePage.getLayout = Layout.addPartials;
export default TributePage;
