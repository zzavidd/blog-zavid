import type { GetServerSideProps, NextPage } from 'next';

import type { DiaryDAO, PostDAO } from 'classes';
import { HomeField, HomeRow } from 'src/components/pages/home';
import Paths from 'src/constants/paths';
import LatestDiaryEntry from 'src/fragments/home/home.diary';
import Introduction from 'src/fragments/home/home.intro';
import RandomPostsGrid from 'src/fragments/home/home.posts';
import LatestReverie from 'src/fragments/home/home.reverie';
import Search from 'src/fragments/home/home.search';
import PageMetadata from 'src/partials/meta';
import css from 'src/styles/pages/Home.module.scss';

import { getHomeProps } from './api/home';

const Home: NextPage<HomeProps> = ({
  homeText,
  latestDiaryEntry,
  latestReverie,
  randomPosts,
  emailSubCount,
}) => {
  return (
    <React.Fragment>
      <PageMetadata {...Paths.Home} />
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
      homeText,
      latestDiaryEntry,
      latestReverie,
      randomPosts,
      emailSubCount,
    },
  };
};

export default Home;

interface HomeProps {
  homeText: string;
  latestDiaryEntry: DiaryDAO;
  latestReverie: PostDAO;
  randomPosts: PostDAO[];
  emailSubCount: number;
}
