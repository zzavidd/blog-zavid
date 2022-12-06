import * as FA6 from '@fortawesome/free-solid-svg-icons';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import useSWR from 'swr';

import Loader from 'components/Loader';
import Settings from 'constants/settings';
import Utils from 'constants/utils';
import Layout from 'fragments/Layout';
import ZDate from 'lib/date';
import PageAPI from 'private/api/pages';
import ArticleStyle from 'styles/Pages/Article.styles';
import DiaryStyle from 'styles/Pages/Diary.styles';

const DIARY_HEADING = "Zavid's Diary";

// eslint-disable-next-line react/function-component-definition
const DiaryIndex: NextPageWithLayout<DiaryIndexProps> = ({ pageProps }) => {
  const { pageIntro } = pageProps;

  const router = useRouter();

  const { data: diaryEntries } = useSWR<DiaryDAO[]>(
    `/api/diary?favourites=${router.query.favourites}`,
    Utils.request,
    {
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
    },
  );

  return (
    <DiaryStyle.Container>
      <DiaryStyle.Main>
        <DiaryStyle.PageHeading>{DIARY_HEADING}</DiaryStyle.PageHeading>
        <DiaryStyle.PageSummary>{pageIntro}</DiaryStyle.PageSummary>
        {/* <DiarySearch url={url} onlyFavs={onlyFavourites} /> */}
        {!diaryEntries ? (
          <Placeholder />
        ) : diaryEntries.length ? (
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

function Placeholder() {
  return (
    <DiaryStyle.Grid>
      {Array(13)
        .fill(null)
        .map((_, key) => {
          return (
            <DiaryStyle.PlaceholderEntry key={key}>
              <Loader viewBox={'0 0 40 45'} key={key}>
                <rect x={0} y={0} rx={1} width={20} height={2} />
                <rect x={0} y={3} rx={2} width={35} height={4} />
                <rect x={0} y={8} rx={2} width={25} height={4} />
                <rect x={0} y={16} rx={1} width={36} height={2} />
                <rect x={0} y={19} rx={1} width={40} height={2} />
                <rect x={0} y={22} rx={1} width={40} height={2} />
                <rect x={0} y={25} rx={1} width={40} height={2} />
                <rect x={0} y={28} rx={1} width={40} height={2} />
                <rect x={0} y={31} rx={1} width={36} height={2} />
                <rect x={0} y={37} rx={1} width={20} height={2} />
                <rect x={0} y={42} rx={1} width={36} height={2} />
              </Loader>
            </DiaryStyle.PlaceholderEntry>
          );
        })}
    </DiaryStyle.Grid>
  );
}

export const getServerSideProps: GetServerSideProps<
  DiaryIndexProps
> = async () => {
  const page = await PageAPI.getBySlug('diary');
  return {
    props: {
      pathDefinition: {
        title: `Diary | ${Settings.SITE_TITLE}`,
        description: page.excerpt!,
        url: '/diary',
      },
      pageProps: {
        pageIntro: page.content!,
      },
    },
  };
};

DiaryIndex.getLayout = Layout.addPartials;
export default DiaryIndex;

interface DiaryIndexProps {
  pathDefinition: PathDefinition;
  pageProps: {
    pageIntro: string;
  };
}

interface DiaryEntryProps {
  entry: DiaryDAO;
}
