import type { GetServerSideProps, NextPage } from 'next';

import type { DiaryDAO, PostDAO } from 'classes';
import { HomeField, HomeRow } from 'src/components/pages/home';
import LatestDiaryEntry from 'src/fragments/home/home.diary';
import Introduction from 'src/fragments/home/home.intro';
import RandomPostsGrid from 'src/fragments/home/home.posts';
import LatestReverie from 'src/fragments/home/home.reverie';
import Search from 'src/fragments/home/home.search';
import css from 'src/styles/pages/Home.module.scss';

import { getHomePageData } from './api';

const Home: NextPage<HomeProps> = ({
  homeText,
  latestDiaryEntry,
  latestReverie,
  randomPosts,
  emailSubCount
}) => {
  return (
    <>
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Partial<
  HomeProps
>> = async () => {
  const yo = JSON.parse(await getHomePageData());
  console.log(yo);
  const {
    homeText,
    latestDiaryEntry,
    latestReverie,
    randomPosts,
    emailSubCount
  } = yo;
  return {
    props: {
      homeText,
      latestDiaryEntry,
      latestReverie,
      randomPosts,
      emailSubCount
    }
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
