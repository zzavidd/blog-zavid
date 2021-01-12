import { useQuery } from '@apollo/client';
import classnames from 'classnames';
import { NextPageContext } from 'next';
import React, { memo, useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import {
  DiaryDAO,
  DiaryStatus,
  QueryOrder,
  ReactInputChangeEvent
} from 'classes';
import { alert } from 'src/components/alert';
import { AdminButton, ConfirmButton } from 'src/components/button';
import { Checkbox, SearchBar } from 'src/components/form';
import { Icon } from 'src/lib/library';
import { Spacer, Toolbar } from 'src/components/layout';
import { Paragraph, Title, VanillaLink } from 'src/components/text';
import { Fader } from 'src/lib/library';
import { isAuthenticated } from 'src/lib/cookies';
import TagBlock from 'src/lib/pages/diary/tags';
import { GET_DIARY_QUERY } from 'src/private/api/queries/diary.queries';
import css from 'src/styles/pages/Diary.module.scss';

const DIARY_HEADING = `Zavid's Diary`;
const PARAM_ONLY_FAVOURITES = 'onlyFavourites';

const DiaryIndex = ({ diaryIntro }: DiaryIndex) => {
  const url = new URL(location.href);
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

  const [diaryEntries, setDiaryEntries] = useState<DiaryDAO[]>([]);
  const [isLoaded, setLoaded] = useState(false);

  const onlyFavs = url.searchParams.get(PARAM_ONLY_FAVOURITES) === 'true';

  const { data, error: queryError, loading: queryLoading } = useQuery(
    GET_DIARY_QUERY,
    {
      variables: {
        sort: {
          field: 'date',
          order: QueryOrder.DESCENDING
        },
        status: { include: [DiaryStatus.PUBLISHED] },
        onlyFavourites: onlyFavs
      }
    }
  );

  useEffect(() => {
    if (queryLoading) return;
    if (queryError) alert.error(queryError);

    const entries = data?.diaryEntries;
    setDiaryEntries(entries);
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
        <DiarySearch url={url} onlyFavs={onlyFavs} />
        <DiaryGrid diaryEntries={diaryEntries} isLoading={!isLoaded} />
      </div>
      <Toolbar spaceItems={true}>
        {isAuthenticated() && (
          <AdminButton onClick={navigateToDiaryAdmin}>Diary Admin</AdminButton>
        )}
      </Toolbar>
    </Spacer>
  );
};

const DiaryGrid = ({ diaryEntries, isLoading }: DiaryGridProps) => {
  const message = isLoading
    ? 'Loading diary entries...'
    : 'No diary entries found.';

  if (!diaryEntries.length) {
    return <div className={css['diary-index-error']}>{message}</div>;
  }
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
    <Fader
      determinant={isLoaded}
      duration={750}
      delay={idx * 50 + 50}
      className={classnames(css['diary-entry'], css[`diary-entry-${theme}`])}
      postTransitions={'background-color .4s ease'}>
      <VanillaLink href={link}>
        <div className={css['diary-entry-header']}>
          <div>
            <div className={css['diary-entry-date']}>{date}</div>
            <Title className={css['diary-entry-title']}>
              Diary Entry #{diaryEntry.entryNumber}: {diaryEntry.title}
            </Title>
          </div>
          <FavouriteStar diaryEntry={diaryEntry} />
        </div>
        <Paragraph
          cssOverrides={{
            paragraph: css['diary-entry-paragraph'],
            hyperlink: css['diary-entry-readmore']
          }}
          truncate={40}
          moreclass={css['diary-entry-readmore']}
          morelink={link}
          moretext={`Read #${diaryEntry.entryNumber}: ${diaryEntry.title}`}>
          {diaryEntry.content}
        </Paragraph>
      </VanillaLink>
      <TagBlock
        className={css['diary-index-tags']}
        tags={diaryEntry.tags!}
        limit={9}
      />
    </Fader>
  );
});

const FavouriteStar = ({ diaryEntry }: DiaryCommonProps) => {
  if (!diaryEntry.isFavourite) return null;
  return (
    <Icon
      name={'star'}
      withRightSpace={false}
      className={css['diary-entry-star']}
    />
  );
};

const DiarySearch = ({ url, onlyFavs }: DiarySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Searches diary entries using entered search term.
   * @param e The input DOM element.
   */
  const searchDiaryEntries = (e?: ReactInputChangeEvent): void => {
    const term = e?.target.value || '';
    setSearchTerm(term);
  };

  /** Clear the search input. */
  const clearInput = () => {
    setSearchTerm('');
    searchDiaryEntries();
  };

  return (
    <>
      <div className={css['diary-search']}>
        <SearchBar
          value={searchTerm}
          placeholder={'Search diary entries...'}
          onChange={searchDiaryEntries}
          className={css['diary-search-bar']}
          onClearInput={clearInput}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              launchSearch(searchTerm);
            }
          }}
          withRightSpace={false}
        />
        <ConfirmButton
          className={css['diary-search-button']}
          onClick={() => launchSearch(searchTerm)}>
          Search
        </ConfirmButton>
      </div>
      <div className={css['diary-filters']}>
        <Checkbox
          className={css['diary-check-favs']}
          boxClassName={css['diary-check-favs-box']}
          label={'Only favourites'}
          checked={onlyFavs}
          onChange={(e) => {
            const isChecked = e.target.checked;
            url.searchParams.set(
              PARAM_ONLY_FAVOURITES,
              JSON.stringify(isChecked)
            );
            location.href = url.toString();
          }}
        />
      </div>
    </>
  );
};

const launchSearch = (searchTerm: string) => {
  location.href = `/search?term=${searchTerm}&onlyDiary=true`;
};

const navigateToDiaryAdmin = () => (location.href = '/admin/diary');

DiaryIndex.getInitialProps = async ({ query }: NextPageContext) => {
  return { ...query };
};

export default DiaryIndex;

type DiaryIndex = {
  diaryIntro: string;
};

type DiarySearchProps = {
  url: URL;
  onlyFavs: boolean;
};

type DiaryGridProps = {
  diaryEntries: DiaryDAO[];
  isLoading: boolean;
};

type DiaryEntry = {
  diaryEntry: DiaryDAO;
  idx: number;
};

type DiaryCommonProps = { diaryEntry: DiaryDAO };
