import { useQuery } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { memo, useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { DiaryDAO, DiaryStatus, QueryOrder } from 'classes';
import { alert } from 'src/components/alert';
import { AdminButton } from 'src/components/button';
import { Spacer, Toolbar } from 'src/components/layout';
import { Paragraph, Title, VanillaLink } from 'src/components/text';
import { Fader } from 'src/components/transitioner';
import { isAuthenticated } from 'src/lib/cookies';
import { GET_DIARY_QUERY } from 'src/private/api/queries/diary.queries';
import css from 'src/styles/pages/Diary.module.scss';

const DIARY_HEADING = `Zavid's Diary`;

const DiaryIndex = ({ diaryIntro }: DiaryIndex) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  const { data, error: queryError, loading: queryLoading } = useQuery(
    GET_DIARY_QUERY,
    {
      variables: {
        sort: {
          field: 'date',
          order: QueryOrder.DESCENDING
        },
        status: { include: [DiaryStatus.PUBLISHED] }
      }
    }
  );

  useEffect(() => {
    if (queryLoading) return;
    if (queryError) alert.error(queryError);
    setDiaryEntries(data ? data.diaryEntries : []);
    setLoaded(true);
  }, [isLoaded, queryLoading]);

  return (
    <Spacer>
      <div className={css['diary-page']}>
        <Title className={css['page-heading']}>{DIARY_HEADING}</Title>
        <div className={css[`page-intro-${theme}`]}>
          <Paragraph cssOverrides={{ paragraph: css[`page-intro-paragraph`] }}>
            {diaryIntro}
          </Paragraph>
        </div>
        <DiaryGrid diaryEntries={diaryEntries} />
      </div>
      <Toolbar spaceItems={true}>
        {isAuthenticated() && (
          <AdminButton onClick={navigateToDiaryAdmin}>Diary Admin</AdminButton>
        )}
      </Toolbar>
    </Spacer>
  );
};

const navigateToDiaryAdmin = () => (location.href = '/admin/diary');

const DiaryGrid = ({ diaryEntries }: DiaryGrid) => {
  return (
    <div className={css['diary-grid']}>
      {diaryEntries.map((diaryEntry, key) => (
        <DiaryEntry diaryEntry={diaryEntry} idx={key} key={key} />
      ))}
    </div>
  );
};

const DiaryEntry = memo(({ diaryEntry, idx }: DiaryEntry) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  const date = zDate.formatDate(diaryEntry.date as string, {
    withWeekday: true
  });
  const link = `/diary/${diaryEntry.entryNumber}`;
  return (
    <VanillaLink href={link}>
      <Fader
        determinant={isLoaded}
        duration={750}
        delay={idx * 50 + 50}
        className={css[`diary-entry-${theme}`]}
        postTransitions={'background-color .4s ease'}>
        <div className={css['diary-entry-date']}>{date}</div>
        <Title className={css['diary-entry-title']}>
          Diary Entry #{diaryEntry.entryNumber}: {diaryEntry.title}
        </Title>
        <Paragraph
          cssOverrides={{
            paragraph: css['diary-entry-paragraph'],
            hyperlink: css['diary-entry-readmore']
          }}
          truncate={40}
          moreclass={css['diary-entry-readmore']}
          morelink={link}>
          {diaryEntry.content}
        </Paragraph>
      </Fader>
    </VanillaLink>
  );
});

DiaryIndex.getInitialProps = async ({ query }: NextPageContext) => {
  return { ...query };
};

export default DiaryIndex;

interface DiaryIndex {
  diaryIntro: string;
}

interface DiaryGrid {
  diaryEntries: DiaryDAO[];
}

interface DiaryEntry {
  diaryEntry: DiaryDAO;
  idx: number;
}
