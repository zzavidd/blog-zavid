import type { GetServerSideProps } from 'next';

import Layout from 'fragments/Layout';
import DiaryIndex from 'fragments/Pages/Diary/Index/DiaryIndex';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const DiaryIndexPage: NextPageWithLayout = () => {
  return <DiaryIndex />;
};

export const getServerSideProps: GetServerSideProps<AppPageProps> = async (
  ctx,
) => {
  const helpers = getServerSideHelpers(ctx);
  const page = await helpers.page.find.fetch({
    where: { slug: 'diary' },
  });

  return {
    props: {
      pathDefinition: {
        title: `Diary | ${Settings.SITE_TITLE}`,
        description: page?.excerpt,
        url: '/diary',
      },
      trpcState: helpers.dehydrate(),
    },
  };
};

DiaryIndexPage.getLayout = Layout.addPartials;
export default DiaryIndexPage;
