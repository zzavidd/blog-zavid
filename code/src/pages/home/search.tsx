import classnames from 'classnames';
import { NextPageContext } from 'next';
import React, { memo, useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { ResultEntityDAO } from 'classes';
import { SearchBar } from 'src/components/form';
import CloudImage, { AspectRatio } from 'src/components/image';
import { Spacer } from 'src/components/layout';
import { Paragraph, Title, VanillaLink } from 'src/components/text';
import { Fader } from 'src/components/transitioner';
import { DAOParse } from 'src/lib/parser';
import css from 'src/styles/pages/Home.module.scss';

const SearchResults = ({ searchTerm, results }: SearchResultsProps) => {
  const [term, setSearchTerm] = useState(searchTerm);
  const searchTermExists = !!searchTerm;

  const heading = searchTermExists ? `Results for '${searchTerm}'` : 'Search ZAVID';

  return (
    <Spacer>
      <div className={css['search-results-page']}>
        <Title className={css['search-heading']}>
          {heading}
        </Title>
        <SearchBar
          value={term}
          placeholder={'Search blog...'}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              location.href = `/search?term=${term}`;
            }
          }}
          className={css['search-results-input']}
          onClearInput={() => setSearchTerm('')}
        />
        <ResultsGrid results={results} searchTermExists={searchTermExists} />
      </div>
    </Spacer>
  );
};

const ResultsGrid = ({ results, searchTermExists }: ResultsGridProps) => {
  if (!results.length) {
    return (
      <div className={css['search-results-error']}>
        {searchTermExists ? 'No results found' : 'Type in a search term...'}
      </div>
    );
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
        <div className={css['search-results-metadata']}>
          {entity.type} • {date}
        </div>
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
        <ResultEntityImage entity={entity} />
      </Fader>
    </VanillaLink>
  );
});

const ResultEntityImage = ({ entity }: ResultEntityImageProps) => {
  if (!entity.image) return null;
  return (
    <CloudImage
      src={entity.image as string}
      alt={entity.title}
      aspectRatio={AspectRatio.WIDE}
      containerClassName={css[`search-results-image`]}
    />
  );
};

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
  searchTermExists: boolean
};

type ResultEntityProps = {
  entity: ResultEntityDAO;
  idx: number;
};

type ResultEntityImageProps = {
  entity: ResultEntityDAO;
};
