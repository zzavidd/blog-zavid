import * as FA6 from '@fortawesome/free-solid-svg-icons';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useMemo } from 'react';

import Settings from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import { IDiaryStatus, QueryOrder } from 'constants/types';
import Layout from 'fragments/Layout';
import ZDate from 'lib/date';
import PageAPI from 'private/api/pages';
import SSR from 'private/ssr';
import ArticleStyle from 'styles/Pages/Article.styles';
import DiaryStyle from 'styles/Pages/Diary.styles';

const DIARY_HEADING = "Zavid's Diary";

// eslint-disable-next-line react/function-component-definition
const DiaryIndex: NextPageWithLayout<DiaryIndexProps> = ({ pageProps }) => {
  const { diaryEntries, pageIntro } = pageProps;

  return (
    <DiaryStyle.Container>
      <DiaryStyle.Main>
        <DiaryStyle.PageHeading>{DIARY_HEADING}</DiaryStyle.PageHeading>
        <DiaryStyle.PageSummary>{pageIntro}</DiaryStyle.PageSummary>
        {/* <DiarySearch url={url} onlyFavs={onlyFavourites} /> */}
        {diaryEntries.length ? (
          <DiaryStyle.Grid>
            {diaryEntries.map((diaryEntry, key) => {
              return <DiaryEntry entry={diaryEntry} key={key} />;
            })}
          </DiaryStyle.Grid>
        ) : (
          <DiaryStyle.NoContentMessage>
            No diary entries found.
          </DiaryStyle.NoContentMessage>
        )}
      </DiaryStyle.Main>
    </DiaryStyle.Container>
  );
};

const DiaryEntry = React.memo(
  ({ entry }: DiaryEntryProps) => {
    const href = `/diary/${entry.entryNumber}`;

    const tags = useMemo(() => {
      return (entry.tags as string[]).slice(0, 9).map((tag) => {
        return tag.replace(/\s/, '');
      });
    }, [entry.tags]);

    return (
      <DiaryStyle.Entry>
        {entry.isFavourite ? <DiaryStyle.EntryStar icon={FA6.faStar} /> : null}
        <Link href={href} passHref={true}>
          <DiaryStyle.EntryDetails>
            <DiaryStyle.EntryDate dateTime={ZDate.formatISO(entry.date)}>
              {ZDate.format(entry.date)}
            </DiaryStyle.EntryDate>
            <DiaryStyle.EntryTitle>
              Diary Entry #{entry.entryNumber}: {entry.title}
            </DiaryStyle.EntryTitle>
            <DiaryStyle.EntryExcerpt
              truncate={40}
              more={{
                href,
                text: `Read #${entry.entryNumber}: ${entry.title}`,
              }}>
              {entry.content}
            </DiaryStyle.EntryExcerpt>
          </DiaryStyle.EntryDetails>
        </Link>
        {tags.length ? (
          <ArticleStyle.TagBlock>
            {tags.map((tag: string, key: number) => {
              return (
                <ArticleStyle.Tag key={key}>
                  <Link href={`/search?term=${tag}&onlyDiary=true`}>
                    <a>#{tag}</a>
                  </Link>
                </ArticleStyle.Tag>
              );
            })}
          </ArticleStyle.TagBlock>
        ) : null}
      </DiaryStyle.Entry>
    );
  },
  (a, b) => a.entry.id === b.entry.id,
);

export const getServerSideProps: GetServerSideProps<DiaryIndexProps> = async ({
  query,
}) => {
  const page = await PageAPI.getBySlug('diary');
  const onlyFavourites = query.onlyFavourites === 'true';
  const diaryEntries = JSON.parse(
    await SSR.Diary.getAll({
      sort: {
        field: 'date',
        order: QueryOrder.DESCENDING,
      },
      status: { include: [IDiaryStatus.PUBLISHED] },
      onlyFavourites,
    }),
  );

  return {
    props: {
      pathDefinition: {
        title: `Diary | ${Settings.SITE_TITLE}`,
        description: page.excerpt!,
        url: '/diary',
      },
      pageProps: {
        diaryEntries,
        pageIntro: page.content!,
        onlyFavourites,
      },
    },
  };
};

DiaryIndex.getLayout = Layout.addPartials;
export default DiaryIndex;

interface DiaryIndexProps {
  pathDefinition: PathDefinition;
  pageProps: {
    diaryEntries: DiaryDAO[];
    pageIntro: string;
    onlyFavourites: boolean;
  };
}

interface DiaryEntryProps {
  entry: DiaryDAO;
}
