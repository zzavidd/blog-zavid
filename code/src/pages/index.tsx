import type { GetServerSideProps } from 'next';
import React from 'react';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import type { PostDAO } from 'classes/posts/PostDAO';
import { SITE_TITLE } from 'constants/settings';
import type { AppPageProps, NextPageWithLayout } from 'constants/types';
import LatestDiaryEntry from 'fragments/home/HomeDiary';
import Introduction from 'fragments/home/HomeIntroduction';
import RandomPostsGrid from 'fragments/home/HomeRandomPosts';
import LatestReverie from 'fragments/home/HomeReverie';
import Search from 'fragments/home/HomeSearch';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import SSR from 'private/ssr';
import * as Styles from 'stylesv2/Pages/Home.styles';

// eslint-disable-next-line react/function-component-definition
const HomePage: NextPageWithLayout<HomeProps> = ({
  pageProps,
  pathDefinition,
}) => {
  const {
    homeText,
    latestDiaryEntry,
    latestReverie,
    randomPosts,
    emailSubCount,
  } = pageProps;
  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <Styles.HomeMain>
        <Introduction content={homeText} emailSubCount={emailSubCount} />
        <Search />
        <Styles.HomeRow>
          <Styles.HomeField flex={1}>
            <LatestDiaryEntry entry={latestDiaryEntry} />
          </Styles.HomeField>
          <Styles.HomeField flex={1}>
            <LatestReverie reverie={latestReverie} />
          </Styles.HomeField>
        </Styles.HomeRow>
      </Styles.HomeMain>
      <Styles.HomeRow>
        <RandomPostsGrid posts={randomPosts} />
      </Styles.HomeRow>
    </React.Fragment>
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
        title: `${SITE_TITLE}: A Galaxy Mind in a Universe World`,
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
