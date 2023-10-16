import { capitalize } from '@mui/material';
import { PostStatus, type PostType } from '@prisma/client';
import {
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
} from 'next';
import { getServerSession } from 'next-auth';
import invariant from 'tiny-invariant';

import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import logger from 'utils/logger';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

import { DOMAINS, createPostNavigatorParams } from '.';

export async function getServerSidePostProps(
  ctx: GetServerSidePropsContext,
  type: PostType,
): Promise<GetServerSidePropsResult<PostSingleProps>> {
  try {
    const { query, req, res } = ctx;
    const slug = String(query.slug);

    const helpers = getServerSideHelpers(ctx);
    const params: PostFindInput = {
      params: {
        where: {
          slug,
          type,
          status: { notIn: [PostStatus.DRAFT] },
        },
      },
    };

    const { singular, collection } = DOMAINS[type];

    const post = await helpers.post.find.fetch(params);
    invariant(post, `No ${singular} found.`);

    const session = await getServerSession(req, res, nextAuthOptions);
    const isAdmin =
      session && session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
    const isVisibleToAll =
      post.status === PostStatus.PRIVATE ||
      post.status === PostStatus.PUBLISHED;
    const isVisibleToAdmin = isAdmin && post.status === PostStatus.PROTECTED;
    invariant(isVisibleToAll || isVisibleToAdmin, `No ${singular} found.`);

    // TODO: More dynamic way to restrict posts at will
    if (post.title.toLowerCase().includes('appreciation')) {
      res.setHeader('X-Robots-Tag', 'noindex');
    }

    const previousParams = createPostNavigatorParams(post, 'lt', true);
    const nextParams = createPostNavigatorParams(post, 'gt', true);
    const indexParams: IndexInput = { id: post.id, type: post.type };

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
          title: `${capitalize(singular)} #${index}: ${post.title} | ${
            Settings.SITE_TITLE
          }`,
          description: post.excerpt,
          url: `/${collection}/${post.slug}`,
        },
        // @ts-ignore
        trpcState: helpers.dehydrate(),
      },
    };
  } catch (e) {
    logger.error(e);
    return { notFound: true };
  }
}
