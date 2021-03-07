import classnames from 'classnames';
import { NextPageContext } from 'next';
import React, { memo, useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { zDate, zText } from 'zavid-modules';

import { ResultEntityDAO } from 'classes';
import { Checkbox, SearchBar } from 'src/components/form';
import CloudImage, { AspectRatio } from 'src/components/image';
import { Spacer } from 'src/components/layout';
import { Paragraph, Title, VanillaLink } from 'src/components/text';
import { DAOParse } from 'src/lib/parser';
import css from 'src/styles/pages/Search.module.scss';

const COMBINED_EMPHASIS_REGEX = zText.getCombinedEmphasisRegex();
const PARAM_ONLY_DIARY = 'onlyDiary';

const SearchResults = (props: SearchResultsProps) => {
  const { searchTerm, results } = props;
  const url = new URL(location.href);

  const [term, setSearchTerm] = useState(searchTerm);
  const [onlyDiary, setOnlyDiaryFlag] = useState(
    url.searchParams.get(PARAM_ONLY_DIARY) === 'true'
  );

  const heading = searchTerm ? `Results for '${searchTerm}'` : 'Search ZAVID';

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
    css[`search-results-entity--${theme}`]
  );

  return (
    <VanillaLink href={entity.slug!}>
      <div className={classes} style={{ animationDelay: `${idx * 75 + 50}ms` }}>
        <div className={css['search-results-index']}>#{entity.index}</div>
        <Title className={css['search-results-title']}>{entity.title}</Title>
        <div className={css['search-results-metadata']}>{date}</div>
        <MatchedContent entity={entity} searchTerm={searchTerm} />
        <ResultEntityImage entity={entity} />
      </div>
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
  if (!entity.content) return null;

  const content: string[] = entity.content.split(/[\.\?\!]\s|\n/);
  const index: number = content.findIndex((paragraph) => {
    return containsSearchTerm(paragraph, searchTerm);
  });

  if (index > -1) {
    entity.content = content
      .splice(index)
      .join('. ')
      .split(COMBINED_EMPHASIS_REGEX)
      .filter((e) => e)
      .map((fragment) => {
        if (!containsSearchTerm(fragment, searchTerm)) {
          return zText.deformatText(fragment);
        }

        if (COMBINED_EMPHASIS_REGEX.test(fragment)) {
          return `%%${zText.deformatText(fragment)}%%`;
        }

        fragment = zText
          .deformatText(fragment)
          .replace(new RegExp(searchTerm, 'i'), (match) => {
            return `%%${match}%%`;
          });

        return fragment;
      })
      .join(' ');
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
  return string.standardize().includes(searchTerm.standardize());
};

String.prototype.standardize = function (): string {
  return this.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
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
