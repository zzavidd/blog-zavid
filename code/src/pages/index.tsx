import type { GetServerSideProps } from 'next';
import useSWR from 'swr';

import Settings from 'constants/settings';
import Utils from 'constants/utils';
import LatestDiaryEntry from 'fragments/home/HomeDiary';
import Introduction from 'fragments/home/HomeIntroduction';
import RandomPostsGrid from 'fragments/home/HomeRandomPosts';
import LatestReverie from 'fragments/home/HomeReverie';
import Layout from 'fragments/Layout';
import SSR from 'private/ssr';
import * as Styles from 'styles/Pages/Home.styles';

// eslint-disable-next-line react/function-component-definition
const HomePage: NextPageWithLayout<HomeProps> = ({ pageProps }) => {
  const { homeText, emailSubCount } = pageProps;

  const { data } = useSWR<HomePageContent>('/api/home', Utils.request, {
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
  });

  return (
    <Styles.HomePage>
      <Styles.HomeMain>
        <Introduction content={homeText} emailSubCount={emailSubCount} />
        <LatestDiaryEntry entry={data?.latestDiaryEntry} />
        <LatestReverie reverie={data?.latestReverie} />
      </Styles.HomeMain>
      <Styles.Aside.Container>
        <RandomPostsGrid posts={data?.randomPosts} />
      </Styles.Aside.Container>
    </Styles.HomePage>
  );
};

export const getServerSideProps: GetServerSideProps<
  Partial<HomeProps>
> = async () => {
  const { homeText, emailSubCount } = JSON.parse(
    await SSR.Home.getPreloadedProps(),
  );
  return {
    props: {
      pathDefinition: {
        title: `${Settings.SITE_TITLE}: A Galaxy Mind in a Universe World`,
        description: 'Explore the metaphysical manifestation of my mind.',
        url: '/',
      },
      pageProps: {
        homeText,
        emailSubCount,
      },
    },
  };
};

HomePage.getLayout = Layout.addPartials;
export default HomePage;

interface HomeProps extends AppPageProps {
  pageProps: HomePreloadProps;
}
