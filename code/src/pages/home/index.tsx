import classnames from 'classnames';
import { NextPageContext } from 'next';
import React from 'react';
import { ColProps } from 'react-bootstrap';

import { DiaryDAO, PostDAO, ReactComponent } from 'classes';
import { Field, FieldRow } from 'src/components/form';
import { DAOParse } from 'src/lib/parser';
import css from 'src/styles/pages/Home.module.scss';

import LatestDiaryEntry from './home.diary';
import Introduction from './home.intro';
import RandomPostsGrid from './home.posts';
import LatestReverie from './home.reverie';
import Search from './home.search';

const Home = ({
  homeText,
  latestDiaryEntry,
  latestReverie,
  randomPosts
}: HomeProps) => {
  return (
    <>
      <div className={css['home-page']}>
        <Introduction content={homeText} />
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

export const HomeRow = (props: ReactComponent) => {
  const classes = classnames(css['home-row'], props.className);
  return (
    <FieldRow {...props} className={classes}>
      {props.children}
    </FieldRow>
  );
};

export const HomeField = (props: ColProps) => {
  return (
    <Field {...props} className={css['home-field']}>
      {props.children}
    </Field>
  );
};

Home.getInitialProps = async ({ query }: NextPageContext) => {
  const homeText = query.homeText as string;
  const latestDiaryEntry = DAOParse<DiaryDAO>(query.latestDiaryEntry as string);
  const latestReverie = DAOParse<PostDAO>(query.latestReverie as string);
  const randomPosts = DAOParse<PostDAO[]>(query.randomPosts as string);
  return { homeText, latestDiaryEntry, latestReverie, randomPosts };
};

export default Home;

interface HomeProps {
  homeText: string;
  latestDiaryEntry: DiaryDAO;
  latestReverie: PostDAO;
  randomPosts: PostDAO[];
}
