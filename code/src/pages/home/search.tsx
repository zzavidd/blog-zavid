import classnames from 'classnames';
import { NextPageContext } from 'next';
import React, { memo, useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { ResultEntityDAO } from 'classes';
import { SearchBar } from 'src/components/form';
import { Spacer } from 'src/components/layout';
import { Paragraph, Title, VanillaLink } from 'src/components/text';
import { Fader } from 'src/components/transitioner';
import { DAOParse } from 'src/lib/parser';
import css from 'src/styles/pages/Home.module.scss';

const SearchResults = ({ searchTerm, results }: SearchResultsProps) => {
  const [term, setSearchTerm] = useState(searchTerm);

  return (
    <Spacer>
      <div className={css['search-page']}>
        <Title className={css['search-heading']}>
          Results for {searchTerm}
        </Title>
        <SearchBar
          value={term}
          placeholder={'Search blog...'}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={css['search-bar']}
          onClearInput={() => setSearchTerm('')}
        />
        <ResultsGrid results={results} />
      </div>
    </Spacer>
  );
};

const ResultsGrid = ({ results }: ResultsGridProps) => {
  if (!results.length) {
    return <div className={css['search-results-error']}>No results found.</div>;
  }
  return (
    <div className={css['search-results-list']}>
      {results.map((entity, key) => (
        <ResultEntity entity={entity} idx={key} key={key} />
      ))}
    </div>
  );
};

const ResultEntity = memo(({ entity, idx }: ResultEntityProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  const date = zDate.formatDate(entity.date as string, {
    withWeekday: true
  });

  const classes = classnames(
    css[`search-results-entity`],
    css[`search-results-entity-${theme}`]
  );

  return (
    <VanillaLink href={entity.slug!}>
      <Fader
        determinant={isLoaded}
        duration={750}
        delay={idx * 50 + 50}
        className={classes}
        postTransitions={'background-color .4s ease'}>
        <Title className={css['search-results-title']}>{entity.title}</Title>
        <div className={css['search-results-metadata']}>{entity.type} • {date}</div>
        <Paragraph
          cssOverrides={{
            paragraph: css['search-results-content'],
            hyperlink: css['search-results-readmore']
          }}
          truncate={40}
          moreclass={css['search-results-readmore']}
          morelink={entity.slug}>
          {entity.content}
        </Paragraph>
      </Fader>
    </VanillaLink>
  );
});

SearchResults.getInitialProps = async ({ query }: NextPageContext) => {
  const searchTerm = query.searchTerm as string;
  const results = DAOParse<ResultEntityDAO[]>(query.results as string);
  return { searchTerm, results };
};

export default SearchResults;

type SearchResultsProps = {
  searchTerm: string;
  results: ResultEntityDAO[];
};

type ResultsGridProps = {
  results: ResultEntityDAO[];
};

type ResultEntityProps = {
  entity: ResultEntityDAO;
  idx: number;
};
