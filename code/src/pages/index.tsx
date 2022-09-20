import type { GetServerSideProps } from 'next';
import React from 'react';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import type { PostDAO } from 'classes/posts/PostDAO';
import { SITE_TITLE } from 'constants/settings';
import type { AppPageProps, NextPageWithLayout } from 'constants/types';
import { HomeField, HomeRow } from 'fragments/home/Home.styles';
import LatestDiaryEntry from 'fragments/home/HomeDiary';
import Introduction from 'fragments/home/HomeIntroduction';
import RandomPostsGrid from 'fragments/home/HomeRandomPosts';
import LatestReverie from 'fragments/home/HomeReverie';
import Search from 'fragments/home/HomeSearch';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import SSR from 'private/ssr';
import css from 'styles/pages/Home.module.scss';

// eslint-disable-next-line react/function-component-definition
const Home: NextPageWithLayout<HomeProps> = ({ pageProps, pathDefinition }) => {
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
      <div className={css['home-page']}>
        <Introduction content={homeText} emailSubCount={emailSubCount} />
        <Search />
        <HomeRow>
          <HomeField xl={6}>
            <LatestDiaryEntry entry={latestDiaryEntry} />
          </HomeField>
          <HomeField xl={6}>
            <LatestReverie reverie={latestReverie} />
          </HomeField>
        </HomeRow>
      </div>
      <HomeRow>
        <RandomPostsGrid posts={randomPosts} />
      </HomeRow>
    </React.Fragment>
  );
};

Home.getLayout = Layout.addPartials;

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

export default Home;

interface HomeProps extends AppPageProps {
  pageProps: {
    homeText: string;
    latestDiaryEntry: DiaryDAO;
    latestReverie: PostDAO;
    randomPosts: PostDAO[];
    emailSubCount: number;
  };
}
