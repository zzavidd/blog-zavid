import { PostStatus, PostType } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import invariant from 'tiny-invariant';

import Layout from 'fragments/Layout';
import PostSingle from 'fragments/Pages/Posts/PostSingle';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import { createPostNavigatorParams } from 'utils/functions';
import Logger from 'utils/logger';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const MusingPage: NextPageWithLayout<PostSingleProps> = (props) => {
  return <PostSingle {...props} />;
};

export const getServerSideProps: GetServerSideProps<PostSingleProps> = async (
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
          status: { notIn: [PostStatus.DRAFT] },
          type: PostType.MUSING,
        },
      },
    };

    const musing = await helpers.post.find.fetch(params);
    invariant(musing, 'No musing found.');

    const session = await getServerSession(req, res, nextAuthOptions);
    const isAdmin =
      session && session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
    const isVisibleToAll =
      musing.status === PostStatus.PRIVATE ||
      musing.status === PostStatus.PUBLISHED;
    const isVisibleToAdmin = isAdmin && musing.status === PostStatus.PROTECTED;
    invariant(isVisibleToAll || isVisibleToAdmin, 'No musing found.');

    const previousParams = createPostNavigatorParams(musing, 'lt', true);
    const nextParams = createPostNavigatorParams(musing, 'gt', true);
    const indexParams: IndexInput = { id: musing.id, type: musing.type };

    await helpers.post.find.prefetch(previousParams);
    await helpers.post.find.prefetch(nextParams);
    const index = await helpers.post.index.fetch(indexParams);

    if (musing.status !== PostStatus.PUBLISHED) {
      res.setHeader('X-Robots-Tag', 'noindex');
    }

    return {
      props: {
        params,
        previousParams,
        nextParams,
        indexParams,
        slug,
        pathDefinition: {
          title: `Musing #${index}: ${musing.title} | ${Settings.SITE_TITLE}`,
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
