import classnames from 'classnames';
import { NextPageContext } from 'next';
import React, { memo, useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { zDate, zText } from 'zavid-modules';

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

  const heading = searchTermExists
    ? `Results for '${searchTerm}'`
    : 'Search ZAVID';

  return (
    <Spacer>
      <div className={css['search-results-page']}>
        <Title className={css['search-heading']}>{heading}</Title>
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
        <ResultsGrid results={results} searchTerm={searchTerm} />
      </div>
    </Spacer>
  );
};

const ResultsGrid = ({ results, searchTerm }: SearchResultsProps) => {
  if (!results.length) {
    return (
      <div className={css['search-results-error']}>
        {searchTerm ? 'No results found' : 'Type in a search term...'}
      </div>
    );
  }
  return (
    <div className={css['search-results-list']}>
      {results.map((entity, key) => (
        <ResultEntity
          entity={entity}
          searchTerm={searchTerm}
          idx={key}
          key={key}
        />
      ))}
    </div>
  );
};

const ResultEntity = memo(({ entity, searchTerm, idx }: ResultEntityProps) => {
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
        <div className={css['search-results-index']}>#{entity.index}</div>
        <Title className={css['search-results-title']}>{entity.title}</Title>
        <div className={css['search-results-metadata']}>{date}</div>
        <MatchedContent entity={entity} searchTerm={searchTerm} />
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

const MatchedContent = ({ entity, searchTerm }: MatchedContentProps) => {
  const theme = useSelector((theme: RootStateOrAny) => theme);
  if (!entity.content) return null;

  if (!containsSearchTerm(entity.title, searchTerm)) {
    const content: string[] = entity.content.split(/\n/);
    const index: number = content.findIndex((paragraph) => {
      return containsSearchTerm(paragraph, searchTerm);
    });

    // if (index > -1) entity.content = content[index];
    if (index > -1) {
      const combinedEmphasisRegex = zText.getCombinedEmphasisRegex();

      entity.content = content
        .splice(index)
        .map((paragraph) => {
          paragraph = zText
            .deformatText(paragraph)
            .split(combinedEmphasisRegex)
            .filter((e) => e)
            .map((fragment) => {
              if (!containsSearchTerm(fragment, searchTerm)) return fragment;
              fragment = zText
                .deformatText(fragment)
                .split(' ')
                .map((word) => {
                  if (!containsSearchTerm(word, searchTerm)) return word;
                  return `%%${word}%%`;
                })
                .join(' ');
              return fragment;
            })
            .join(' ');

          return paragraph;
        })
        .join(' ');
    }
  }

  return (
    <Paragraph
      cssOverrides={{
        paragraph: css['search-results-content'],
        hyperlink: css['search-results-readmore'],
        custom: css[`search-results-highlight`]
      }}
      truncate={40}
      keepRichFormatOnTruncate={true}
      moreclass={css['search-results-readmore']}
      morelink={entity.slug}>
      {entity.content}
    </Paragraph>
  );
};

const containsSearchTerm = (string: string, searchTerm: string): boolean => {
  return string
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .includes(
      searchTerm
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    );
};

SearchResults.getInitialProps = async ({ query }: NextPageContext) => {
  const searchTerm = query.searchTerm as string;
  const results = DAOParse<ResultEntityDAO[]>(query.results as string);
  return { searchTerm, results };
};

export default SearchResults;

type SearchResultsProps = {
  results: ResultEntityDAO[];
  searchTerm: string;
};

type MatchedContentProps = {
  entity: ResultEntityDAO;
  searchTerm: string;
};

type ResultEntityProps = {
  entity: ResultEntityDAO;
  searchTerm: string;
  idx: number;
};

type ResultEntityImageProps = {
  entity: ResultEntityDAO;
};
