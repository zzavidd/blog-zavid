import type { GetServerSideProps } from 'next';

import Layout from 'fragments/Layout';
import type { DiaryIndexProps } from 'fragments/Pages/Diary/Index/DiaryIndex';
import DiaryIndex from 'fragments/Pages/Diary/Index/DiaryIndex';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const DiaryIndexPage: NextPageWithLayout<DiaryIndexProps> = (props) => {
  return <DiaryIndex {...props} />;
};

export const getServerSideProps: GetServerSideProps<AppPageProps> = async (
  ctx,
) => {
  const helpers = getServerSideHelpers(ctx);
  const params = { where: { slug: 'diary' } };

  const page = await helpers.page.find.fetch(params);
  await helpers.page.find.prefetch(params);

  return {
    props: {
      params,
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
