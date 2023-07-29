import { PostStatus, PostType } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import invariant from 'tiny-invariant';

import Layout from 'fragments/Layout';
import type { MusingPageProps } from 'fragments/Pages/Posts/Musing';
import Musing from 'fragments/Pages/Posts/Musing';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import Logger from 'utils/logger';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const MusingPage: NextPageWithLayout<MusingPageProps> = (props) => {
  return <Musing {...props} />;
};

export const getServerSideProps: GetServerSideProps<MusingPageProps> = async (
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
          type: PostType.MUSING,
          status: {
            notIn: [PostStatus.DRAFT],
          },
        },
      },
    };

    const musing = await helpers.post.find.fetch(params);
    invariant(musing, 'No musing found.');

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    const isAdmin =
      session && session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
    const isVisibleToAll =
      musing.status === PostStatus.PRIVATE ||
      musing.status === PostStatus.PUBLISHED;
    const isVisibleToAdmin = isAdmin && musing.status === PostStatus.PROTECTED;
    invariant(isVisibleToAll || isVisibleToAdmin, 'No musing found.');

    await helpers.post.find.prefetch(params);

    return {
      props: {
        params,
        slug,
        pathDefinition: {
          title: `${musing.title} | ${Settings.SITE_TITLE}`,
          description: musing.excerpt,
          url: `/musings/${musing.slug}`,
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

MusingPage.getLayout = Layout.addPartials;
export default MusingPage;
