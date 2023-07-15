import { DiaryStatus } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import invariant from 'tiny-invariant';

import Layout from 'fragments/Layout';
import type { DiaryEntryPageProps } from 'fragments/Pages/Diary/DiarySingle';
import DiarySingle from 'fragments/Pages/Diary/DiarySingle';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import ZString from 'utils/lib/string';
import * as ZText from 'utils/lib/text';
import Logger from 'utils/logger';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const DiaryEntryPage: NextPageWithLayout<DiaryEntryPageProps> = (props) => {
  return <DiarySingle {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  DiaryEntryPageProps
> = async (ctx) => {
  try {
    const { query, req, res } = ctx;
    const entryNumber = Number(query.number);
    const params: DiaryFindInput = {
      params: { include: { categories: true }, where: { entryNumber } },
    };

    const helpers = getServerSideHelpers(ctx);

    const entry = await helpers.diary.find.fetch({
      params: { where: { entryNumber } },
    });
    invariant(entry, 'No diary entry found.');

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    const isAdmin =
      session && session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
    const isVisibleToAll =
      entry.status === DiaryStatus.PUBLISHED ||
      entry.status === DiaryStatus.PRIVATE;
    const isVisibleToAdmin = isAdmin && entry.status === DiaryStatus.PROTECTED;
    invariant(isVisibleToAll || isVisibleToAdmin, 'No diary entry found.');

    if (entry.status !== DiaryStatus.PUBLISHED) {
      res.setHeader('X-Robots-Tag', 'noindex');
    }

    await helpers.diary.find.prefetch(params);

    return {
      props: {
        params,
        pathDefinition: {
          title: `Diary Entry #${entry.entryNumber}: ${entry.title} | ${Settings.SITE_TITLE}`,
          description: ZText.extractExcerpt(entry.content),
          url: `/diary/${entry.entryNumber}`,
          article: {
            publishedTime: entry.date!.toDateString(),
            tags: ZString.convertCsvToArray(entry.tags as string[]),
          },
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

DiaryEntryPage.getLayout = Layout.addPartials;
export default DiaryEntryPage;
