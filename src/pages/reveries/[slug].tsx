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

const ReveriePage: NextPageWithLayout<PostSingleProps> = (props) => {
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
          type: PostType.REVERIE,
          status: {
            notIn: [PostStatus.DRAFT],
          },
        },
      },
    };

    const reverie = await helpers.post.find.fetch(params);
    invariant(reverie, 'No reverie found.');

    const session = await getServerSession(req, res, nextAuthOptions);
    const isAdmin =
      session && session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
    const isVisibleToAll =
      reverie.status === PostStatus.PRIVATE ||
      reverie.status === PostStatus.PUBLISHED;
    const isVisibleToAdmin = isAdmin && reverie.status === PostStatus.PROTECTED;
    invariant(isVisibleToAll || isVisibleToAdmin, 'No reverie found.');

    // TODO: More dynamic way to restrict posts at will
    if (reverie.title.toLowerCase().includes('appreciation')) {
      res.setHeader('X-Robots-Tag', 'noindex');
    }

    const previousParams = createPostNavigatorParams(reverie, 'lt', true);
    const nextParams = createPostNavigatorParams(reverie, 'gt', true);
    const indexParams: IndexInput = { id: reverie.id, type: reverie.type };

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
          title: `Reverie #${index}: ${reverie.title} | ${Settings.SITE_TITLE}`,
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
