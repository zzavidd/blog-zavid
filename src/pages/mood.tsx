import { type GetServerSideProps } from 'next';
import { useState } from 'react';

import Layout from 'fragments/Layout';
import MoodDashboard from 'fragments/Pages/Mood/MoodDashboard';
import {
  InitialMoodDashboardState,
  MoodDashboardContext,
} from 'fragments/Pages/Mood/MoodDashboard.context';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const MoodPage: NextPageWithLayout<MoodPageProps> = ({ params }) => {
  const context = useState(InitialMoodDashboardState);
  return (
    <MoodDashboardContext.Provider value={context}>
      <MoodDashboard params={params} />
    </MoodDashboardContext.Provider>
  );
};

export const getServerSideProps: GetServerSideProps<AppPageProps> = async (
  ctx,
) => {
  const params: MoodFindManyInput = { orderBy: { date: 'asc' } };

  const helpers = getServerSideHelpers(ctx);
  await helpers.mood.findMany.prefetch(params);

  ctx.res.setHeader('X-Robots-Tag', 'noindex');

  return {
    props: {
      pathDefinition: {
        title: `Mood Chart | ${Settings.SITE_TITLE}`,
        description: '',
        url: '/mood',
      },
      params,
    },
  };
};

MoodPage.getLayout = Layout.addPartials;
export default MoodPage;

interface MoodPageProps extends AppPageProps {
  params: MoodFindManyInput;
}
