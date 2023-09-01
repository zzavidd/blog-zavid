import type { GetServerSideProps } from 'next';

import Layout from 'fragments/Layout';
import type { DiaryIndexProps } from 'fragments/Pages/Diary/Index/DiaryIndex';
import DiaryIndex from 'fragments/Pages/Diary/Index/DiaryIndex';
import { DiaryIndexContext } from 'fragments/Pages/Diary/Index/DiaryIndex.context';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const DiaryIndexPage: NextPageWithLayout<DiaryIndexProps> = (props) => {
  return (
    <DiaryIndexContext.Provider value={props}>
      <DiaryIndex />
    </DiaryIndexContext.Provider>
  );
};

export const getServerSideProps: GetServerSideProps<DiaryIndexProps> = async (
  ctx,
) => {
  const helpers = getServerSideHelpers(ctx);
  const params = { where: { slug: 'diary' } };

  const page = await helpers.page.find.fetch(params);
  await helpers.page.find.prefetch(params);

  return {
    props: {
      params,
      searchTerm: String(ctx.query.search) ?? '',
      pathDefinition: {
        title: `Diary | ${Settings.SITE_TITLE}`,
        description: page?.excerpt ?? '',
        url: '/diary',
      },
      trpcState: helpers.dehydrate(),
    },
  };
};

DiaryIndexPage.getLayout = Layout.addPartials;
export default DiaryIndexPage;
