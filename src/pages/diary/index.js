import { useQuery } from '@apollo/client';
import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { Diary } from 'classes';
import { alert } from 'components/alert.js';
import { AdminButton } from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import { Paragraph, Title, VanillaLink } from 'components/text.js';
import { Fader } from 'components/transitioner.js';
import { ORDER } from 'constants/strings.js';
import { isAuthenticated } from 'lib/cookies';
import { GET_DIARY_QUERY } from 'private/api/queries/diary.queries';
import css from 'styles/pages/Diary.module.scss';

const DIARY_HEADING = `Zavid's Diary`;

const DiaryIndex = ({ diaryIntro }) => {
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

const DiaryGrid = ({ diaryEntries }) => {
  return (
    <div className={css['diary-grid']}>
      {diaryEntries.map((diaryEntry, key) => (
        <DiaryEntry diaryEntry={diaryEntry} idx={key} key={key} />
      ))}
    </div>
  );
};

const DiaryEntry = memo(({ diaryEntry, idx }) => {
  const theme = useSelector(({ theme }) => theme);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  const title = zDate.formatDate(parseInt(diaryEntry.date), true);
  const link = `/diary/${diaryEntry.slug}`;
  return (
    <VanillaLink href={link}>
      <Fader
        determinant={isLoaded}
        duration={750}
        delay={idx * 50 + 50}
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
      </Fader>
    </VanillaLink>
  );
});

DiaryIndex.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default DiaryIndex;
