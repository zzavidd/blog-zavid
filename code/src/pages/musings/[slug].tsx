import type { Prisma } from '@prisma/client';
import { PostStatus, PostType } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import invariant from 'tiny-invariant';

import Layout from 'fragments/Layout';
import type { MusingPageProps } from 'fragments/Pages/Posts/Musing';
import Musing from 'fragments/Pages/Posts/Musing';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import ZDate from 'utils/lib/date';
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
          status: { notIn: [PostStatus.DRAFT] },
          type: PostType.MUSING,
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

    const createNavigatorParams = (
      op: keyof Prisma.DateTimeNullableFilter,
    ): PostFindInput => ({
      params: {
        select: { title: true, typeId: true, slug: true },
        orderBy: {
          datePublished: op === 'gt' ? 'asc' : 'desc',
        },
        where: {
          datePublished: { [op]: ZDate.formatISO(musing.datePublished) },
          status: { in: [PostStatus.PRIVATE, PostStatus.PUBLISHED] },
          type: PostType.MUSING,
        },
      },
    });
    const previousParams = createNavigatorParams('lt');
    const nextParams = createNavigatorParams('gt');
    const indexParams: IndexInput = { id: musing.id, type: musing.type };

    await helpers.post.find.prefetch(params);
    await helpers.post.find.prefetch(previousParams);
    await helpers.post.find.prefetch(nextParams);
    await helpers.post.index.prefetch({ id: musing.id, type: musing.type });

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
