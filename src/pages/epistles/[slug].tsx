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

const EpistlePage: NextPageWithLayout<PostSingleProps> = (props) => {
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
          type: PostType.EPISTLE,
          status: {
            notIn: [PostStatus.DRAFT],
          },
        },
      },
    };

    const epistle = await helpers.post.find.fetch(params);
    invariant(epistle, 'No epistle found.');

    const session = await getServerSession(req, res, nextAuthOptions);
    const isAdmin =
      session && session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
    const isVisibleToAll =
      epistle.status === PostStatus.PRIVATE ||
      epistle.status === PostStatus.PUBLISHED;
    const isVisibleToAdmin = isAdmin && epistle.status === PostStatus.PROTECTED;
    invariant(isVisibleToAll || isVisibleToAdmin, 'No epistle found.');

    const previousParams = createPostNavigatorParams(epistle, 'lt', true);
    const nextParams = createPostNavigatorParams(epistle, 'gt', true);
    const indexParams: IndexInput = { id: epistle.id, type: epistle.type };

    await helpers.post.find.prefetch(previousParams);
    await helpers.post.find.prefetch(nextParams);
    const index = await helpers.post.index.fetch(indexParams);

    return {
      props: {
        params,
        previousParams,
        nextParams,
        indexParams,
        slug,
        pathDefinition: {
          title: `Epistle #${index}: ${epistle.title} | ${Settings.SITE_TITLE}`,
          description: epistle.excerpt,
          url: `/epistles/${epistle.slug}`,
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

EpistlePage.getLayout = Layout.addPartials;
export default EpistlePage;
