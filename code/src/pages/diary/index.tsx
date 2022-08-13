import classnames from 'classnames';
import type { GetServerSideProps, NextPage } from 'next';
import React, { memo, useEffect, useState } from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import type { DiaryDAO, ReactInputChangeEvent } from 'classes';
import { DiaryStatus, QueryOrder } from 'classes';
import { AdminButton, ConfirmButton } from 'src/components/button';
import { Checkbox, SearchBar } from 'src/components/form';
import { Spacer, Toolbar } from 'src/components/layout';
import { Paragraph, Title, VanillaLink } from 'src/components/text';
import type { PathDefinition } from 'src/constants/paths';
import { isAuthenticated } from 'src/lib/cookies';
import { Icon } from 'src/lib/library';
import TagBlock from 'src/lib/pages/diary/tags';
import PageMetadata from 'src/partials/meta';
import { siteTitle } from 'src/settings';
import css from 'src/styles/pages/Diary.module.scss';

import { getAllDiaryEntriesSSR } from '../api/diary';
import { getPageBySlug } from '../api/pages/[slug]';

const DIARY_HEADING = `Zavid's Diary`;
const PARAM_ONLY_FAVOURITES = 'onlyFavourites';

// eslint-disable-next-line react/function-component-definition
const DiaryIndex: NextPage<DiaryIndexProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { diaryEntries, onlyFavourites, pageIntro } = pageProps;
  const url = new URL(location.href);
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <Spacer>
        <div className={css['diary-page']}>
          <Title className={css['page-heading']}>{DIARY_HEADING}</Title>
          <div className={css[`page-intro-${theme}`]}>
            <Paragraph
              cssOverrides={{ paragraph: css[`page-intro-paragraph`] }}>
              {pageIntro}
            </Paragraph>
          </div>
          <DiarySearch url={url} onlyFavs={onlyFavourites} />
          <DiaryGrid diaryEntries={diaryEntries} />
        </div>
        <Toolbar spaceItems={true}>
          {isAuthenticated() && (
            <AdminButton onClick={navigateToDiaryAdmin}>
              Diary Admin
            </AdminButton>
          )}
        </Toolbar>
      </Spacer>
    </React.Fragment>
  );
};

function DiaryGrid({ diaryEntries }: DiaryGridProps) {
  const message = 'No diary entries found.';

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
}

const DiaryEntry = memo(({ diaryEntry, idx }: DiaryEntry) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  const date = zDate.formatDate(diaryEntry.date as string, {
    withWeekday: true,
  });
  const link = `/diary/${diaryEntry.entryNumber}`;
  const classes = classnames(css['diary-entry'], css[`diary-entry--${theme}`]);
  return (
    <div className={classes} style={{ animationDelay: `${idx * 75 + 50}ms` }}>
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
            hyperlink: css['diary-entry-readmore'],
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
    </div>
  );
});

function FavouriteStar({ diaryEntry }: FavouriteStarProps) {
  if (!diaryEntry.isFavourite) return null;
  return (
    <Icon
      name={'star'}
      withRightSpace={false}
      className={css['diary-entry-star']}
    />
  );
}

function DiarySearch({ url, onlyFavs }: DiarySearchProps) {
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
    <React.Fragment>
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
              JSON.stringify(isChecked),
            );
            location.href = url.toString();
          }}
        />
      </div>
    </React.Fragment>
  );
}

const launchSearch = (searchTerm: string) => {
  location.href = `/search?term=${searchTerm}&onlyDiary=true`;
};

const navigateToDiaryAdmin = () => (location.href = '/admin/diary');

export const getServerSideProps: GetServerSideProps<DiaryIndexProps> = async ({
  query,
}) => {
  const page = await getPageBySlug('diary');
  const onlyFavourites = query.onlyFavourites === 'true';
  const diaryEntries = JSON.parse(
    await getAllDiaryEntriesSSR({
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
        title: `Diary | ${siteTitle}`,
        description: page.excerpt,
        url: '/diary',
      },
      pageProps: {
        diaryEntries,
        pageIntro: page.content,
        onlyFavourites,
      },
    },
  };
};

export default DiaryIndex;

interface DiaryIndexProps {
  pathDefinition: PathDefinition;
  pageProps: {
    diaryEntries: DiaryDAO[];
    pageIntro: string;
    onlyFavourites: boolean;
  };
}

interface DiarySearchProps {
  url: URL;
  onlyFavs: boolean;
}

interface DiaryGridProps {
  diaryEntries: DiaryDAO[];
}

interface DiaryEntry {
  diaryEntry: DiaryDAO;
  idx: number;
}

interface FavouriteStarProps {
  diaryEntry: DiaryDAO;
}
