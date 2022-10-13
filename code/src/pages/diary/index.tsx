import * as FA6 from '@fortawesome/free-solid-svg-icons';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useMemo } from 'react';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import { DiaryStatus } from 'classes/diary/DiaryDAO';
import { SITE_TITLE } from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import { QueryOrder } from 'constants/types';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import ZDate from 'lib/date';
import PageAPI from 'private/api/pages';
import SSR from 'private/ssr';
import DiaryStyle from 'stylesv2/Pages/Diary/DiaryIndex.styles';

const DIARY_HEADING = "Zavid's Diary";

// eslint-disable-next-line react/function-component-definition
const DiaryIndex: NextPageWithLayout<DiaryIndexProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { diaryEntries, pageIntro } = pageProps;

  return (
    <DiaryStyle.Container>
      <PageMetadata {...pathDefinition} />
      <DiaryStyle.Main>
        <DiaryStyle.Heading>{DIARY_HEADING}</DiaryStyle.Heading>
        <DiaryStyle.Summary>{pageIntro}</DiaryStyle.Summary>
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
                href: href,
                text: `Read #${entry.entryNumber}: ${entry.title}`,
              }}>
              {entry.content}
            </DiaryStyle.EntryExcerpt>
          </DiaryStyle.EntryDetails>
        </Link>
        <DiaryStyle.EntryTagBlock>
          {tags.map((tag: string, key: number) => {
            return (
              <DiaryStyle.EntryTag key={key}>
                <Link href={`/search?term=${tag}&onlyDiary=true`}>
                  <a>#{tag}</a>
                </Link>
              </DiaryStyle.EntryTag>
            );
          })}
        </DiaryStyle.EntryTagBlock>
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
      status: { include: [DiaryStatus.PUBLISHED] },
      onlyFavourites,
    }),
  );

  return {
    props: {
      pathDefinition: {
        title: `Diary | ${SITE_TITLE}`,
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
