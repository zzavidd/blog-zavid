import type { GetServerSideProps } from 'next';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import type { PostDAO } from 'classes/posts/PostDAO';
import Settings from 'constants/settings';
import type { AppPageProps, NextPageWithLayout } from 'constants/types';
import LatestDiaryEntry from 'fragments/home/HomeDiary';
import Introduction from 'fragments/home/HomeIntroduction';
import RandomPostsGrid from 'fragments/home/HomeRandomPosts';
import LatestReverie from 'fragments/home/HomeReverie';
import Layout from 'fragments/Layout';
import SSR from 'private/ssr';
import * as Styles from 'styles/Pages/Home.styles';

// eslint-disable-next-line react/function-component-definition
const HomePage: NextPageWithLayout<HomeProps> = ({ pageProps }) => {
  const {
    homeText,
    latestDiaryEntry,
    latestReverie,
    randomPosts,
    emailSubCount,
  } = pageProps;
  return (
    <Styles.HomePage>
      <Styles.HomeMain>
        <Introduction content={homeText} emailSubCount={emailSubCount} />
        <LatestDiaryEntry entry={latestDiaryEntry} />
        <LatestReverie reverie={latestReverie} />
      </Styles.HomeMain>
      <Styles.Aside.Container>
        <RandomPostsGrid posts={randomPosts} />
      </Styles.Aside.Container>
    </Styles.HomePage>
  );
};

export const getServerSideProps: GetServerSideProps<
  Partial<HomeProps>
> = async () => {
  const {
    homeText,
    latestDiaryEntry,
    latestReverie,
    randomPosts,
    emailSubCount,
  } = JSON.parse(await SSR.Home.getPreloadedProps());

  return {
    props: {
      pathDefinition: {
        title: `${Settings.SITE_TITLE}: A Galaxy Mind in a Universe World`,
        description: 'Explore the metaphysical manifestation of my mind.',
        url: '/',
      },
      pageProps: {
        homeText,
        latestDiaryEntry,
        latestReverie,
        randomPosts,
        emailSubCount,
      },
    },
  };
};

HomePage.getLayout = Layout.addPartials;
export default HomePage;

interface HomeProps extends AppPageProps {
  pageProps: {
    homeText: string;
    latestDiaryEntry: DiaryDAO;
    latestReverie: PostDAO;
    randomPosts: PostDAO[];
    emailSubCount: number;
  };
}
