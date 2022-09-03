import type { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';

import type { SearchResultEntityDAO } from 'classes/entity';
import { Checkbox, SearchBar } from 'components/form';
import { Spacer } from 'components/layout';
import { Title } from 'components/text';
import { SITE_TITLE } from 'constants/settings';
import type { PathDefinition } from 'constants/types';
import PageMetadata from 'fragments/PageMetadata';
import { ResultsGrid } from 'fragments/search/SearchResultsGrid';
import SSR from 'private/ssr';
import css from 'styles/pages/Search.module.scss';

const PARAM_ONLY_DIARY = 'onlyDiary';

// eslint-disable-next-line react/function-component-definition
const SearchResults: NextPage<SearchResultsProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { searchTerm, results } = pageProps;
  const url = new URL(location.href);

  const [term, setSearchTerm] = useState(searchTerm);
  const [onlyDiary, setOnlyDiaryFlag] = useState(
    url.searchParams.get(PARAM_ONLY_DIARY) === 'true',
  );

  const heading = searchTerm ? `Results for '${searchTerm}'` : 'Search ZAVID';

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <Spacer>
        <div className={css['search-results-page']}>
          <Title className={css['search-heading']}>{heading}</Title>
          <SearchBar
            value={term}
            placeholder={'Search blog...'}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                url.searchParams.set('term', term);
                location.href = url.toString();
              }
            }}
            className={css['search-results-input']}
            onClearInput={() => setSearchTerm('')}
          />
          <Checkbox
            className={css['search-check-diary']}
            boxClassName={css['search-check-diary-box']}
            label={'Only diary entries'}
            checked={onlyDiary}
            onChange={(e) => {
              const isChecked = e.target.checked;
              url.searchParams.set(PARAM_ONLY_DIARY, JSON.stringify(isChecked));
              setOnlyDiaryFlag(isChecked);
              location.href = url.toString();
            }}
          />
          <ResultsGrid results={results} searchTerm={searchTerm} />
        </div>
      </Spacer>
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<
  SearchResultsProps
> = async ({ query }) => {
  const { term: searchTerm, onlyDiary } = query;
  if (!searchTerm || Array.isArray(searchTerm)) {
    return {
      props: {
        pathDefinition: {
          title: `Search | ${SITE_TITLE}`,
        },
        pageProps: {
          results: [],
          searchTerm: '',
        },
      },
    };
  }

  const results = JSON.parse(
    await SSR.Search.getResults(searchTerm as string, onlyDiary === 'true'),
  );
  return {
    props: {
      pathDefinition: { title: `Results for '${searchTerm}' | ${SITE_TITLE}` },
      pageProps: { results, searchTerm },
    },
  };
};

export default SearchResults;

interface SearchResultsProps {
  pathDefinition: PathDefinition;
  pageProps: {
    results: SearchResultEntityDAO[];
    searchTerm: string;
  };
}
