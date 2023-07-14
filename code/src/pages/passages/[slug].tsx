import { PostStatus, PostType } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import invariant from 'tiny-invariant';

import Layout from 'fragments/Layout';
import type { PassagePageProps } from 'fragments/Pages/Posts/Passage';
import Passage from 'fragments/Pages/Posts/Passage';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import type { RouterInput } from 'server/routers/_app.router';
import Logger from 'utils/logger';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const PassagePage: NextPageWithLayout<PassagePageProps> = (props) => {
  return <Passage {...props} />;
};

export const getServerSideProps: GetServerSideProps<PassagePageProps> = async (
  ctx,
) => {
  try {
    const { query, req, res } = ctx;
    const slug = String(query.slug);

    const helpers = getServerSideHelpers(ctx);
    const params: RouterInput['post']['find'] = {
      params: { where: { slug, type: PostType.PASSAGE } },
    };

    const passage = await helpers.post.find.fetch(params);
    invariant(passage, 'No passage found.');

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    const isAdmin =
      session && session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
    const isVisibleToAll = passage.status === PostStatus.PRIVATE;
    const isVisibleToAdmin = isAdmin && passage.status === PostStatus.PROTECTED;
    invariant(isVisibleToAll || isVisibleToAdmin, 'No passage found.');

    res.setHeader('X-Robots-Tag', 'noindex');
    await helpers.post.find.prefetch(params);

    return {
      props: {
        params,
        slug,
        pathDefinition: {
          title: `${passage.title} | ${Settings.SITE_TITLE}`,
          description: passage.excerpt,
          url: `/passages/${passage.slug}`,
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

PassagePage.getLayout = Layout.addPartials;
export default PassagePage;
