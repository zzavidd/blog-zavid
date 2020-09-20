import { useQuery } from '@apollo/client';
import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { Diary } from 'classes';
import { alert } from 'components/alert.js';
import { AdminButton } from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import { LazyLoader } from 'components/loader.js';
import { Paragraph, Title, VanillaLink } from 'components/text.js';
import { Zoomer } from 'components/transitioner.js';
import { ORDER } from 'constants/strings.js';
import { isAuthenticated } from 'lib/cookies';
import { GET_DIARY_QUERY } from 'private/api/queries/diary.queries';
import css from 'styles/pages/Diary.module.scss';

const DIARY_HEADING = `Zavid's Diary`;
const DIARY_PREMISE = `Every day or two, I'll transparently scribe my thoughts and feelings. Maybe speak about a friend I miss, maybe highlight a stranger who's been on my mind.\n\nWill that help abate small talk now that people have the answer to "how have you been?" readily accessible? I could dream.`;

export default () => {
  const theme = useSelector(({ theme }) => theme);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  const { data, error: queryError, loading: queryLoading } = useQuery(
    GET_DIARY_QUERY,
    {
      variables: {
        sort: {
          field: 'date',
          order: ORDER.DESCENDING
        },
        status: { include: [Diary.STATUSES.PUBLISHED] }
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
        <div className={css[`page-intro-${theme}`]}>{DIARY_PREMISE}</div>
        <DiaryGrid diaryEntries={diaryEntries} />
      </div>
      <Toolbar spaceItems={true}>
        {isAuthenticated && (
          <AdminButton onClick={navigateToDiaryAdmin}>Diary Admin</AdminButton>
        )}
      </Toolbar>
    </Spacer>
  );
};

const navigateToDiaryAdmin = () => (location.href = '/admin/diary');

const DiaryGrid = ({ diaryEntries }) => {
  return (
    <div className={css['diary-grid']}>
      {diaryEntries.map((diaryEntry, key) => (
        <DiaryEntry diaryEntry={diaryEntry} key={key} />
      ))}
    </div>
  );
};

const DiaryEntry = memo(({ diaryEntry }) => {
  const theme = useSelector(({ theme }) => theme);
  const [isInView, setInView] = useState(false);

  const title = zDate.formatDate(parseInt(diaryEntry.date), true);
  const link = `/diary/${diaryEntry.slug}`;
  return (
    <LazyLoader setInView={setInView}>
      <VanillaLink href={link}>
        <Zoomer
          determinant={isInView}
          duration={400}
          className={css[`diary-entry-${theme}`]}
          postTransitions={'background-color .4s ease'}>
          <Title className={css['diary-entry-title']}>{title}</Title>
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
        </Zoomer>
      </VanillaLink>
    </LazyLoader>
  );
});
