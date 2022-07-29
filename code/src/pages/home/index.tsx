import classnames from 'classnames';
import type { NextPageContext } from 'next';
import React from 'react';
import type { ColProps } from 'react-bootstrap';

import type { DiaryDAO, PostDAO, ReactComponent } from 'classes';
import { Field, FieldRow } from 'src/components/form';
import { DAOParse } from 'src/lib/parser';
import css from 'src/styles/pages/Home.module.scss';

import LatestDiaryEntry from './fragments/home.diary';
import Introduction from './fragments/home.intro';
import RandomPostsGrid from './fragments/home.posts';
import LatestReverie from './fragments/home.reverie';
import Search from './fragments/home.search';

const Home = ({
  homeText,
  latestDiaryEntry,
  latestReverie,
  randomPosts,
  emailSubCount,
  tgSubCount,
}: HomeProps) => {
  return (
    <>
      <div className={css['home-page']}>
        <Introduction
          content={homeText}
          emailSubCount={emailSubCount}
          tgSubCount={tgSubCount}
        />
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
  const emailSubCount = DAOParse<number>(query.emailSubCount);
  const tgSubCount = DAOParse<number>(query.tgSubCount);
  return {
    homeText,
    latestDiaryEntry,
    latestReverie,
    randomPosts,
    emailSubCount,
    tgSubCount,
  };
};

export default Home;

type HomeProps = {
  homeText: string;
  latestDiaryEntry: DiaryDAO;
  latestReverie: PostDAO;
  randomPosts: PostDAO[];
  emailSubCount: number;
  tgSubCount: number;
};
