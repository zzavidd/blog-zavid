import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import type { DiaryDAO, PostDAO } from 'classes';
import { HomeField, HomeRow } from 'components/pages/home';
import { SITE_TITLE } from 'constants/settings';
import type { AppPageProps } from 'constants/types';
import LatestDiaryEntry from 'fragments/home/home.diary';
import Introduction from 'fragments/home/home.intro';
import RandomPostsGrid from 'fragments/home/home.posts';
import LatestReverie from 'fragments/home/home.reverie';
import Search from 'fragments/home/home.search';
import PageMetadata from 'fragments/PageMetadata';
import css from 'styles/pages/Home.module.scss';

import { getHomeProps } from './api/home';

// eslint-disable-next-line react/function-component-definition
const Home: NextPage<HomeProps> = ({
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

export const getServerSideProps: GetServerSideProps<
  Partial<HomeProps>
> = async () => {
  const {
    homeText,
    latestDiaryEntry,
    latestReverie,
    randomPosts,
    emailSubCount,
  } = JSON.parse(await getHomeProps());
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
