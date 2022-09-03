import React from 'react';
import { zText } from 'zavid-modules';

import type { SearchResultEntityDAO } from 'classes/entity';
import { Paragraph } from 'components/text';
import css from 'styles/pages/Search.module.scss';

const COMBINED_EMPHASIS_REGEX = zText.getCombinedEmphasisRegex();

export function MatchedContent({ entity, searchTerm }: MatchedContentProps) {
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
        custom: css[`search-results-highlight`],
      }}
      truncate={40}
      keepRichFormatOnTruncate={true}
      moreclass={css['search-results-readmore']}
      morelink={entity.slug}>
      {entity.content}
    </Paragraph>
  );
}

export const containsSearchTerm = (
  string: string,
  searchTerm: string,
): boolean => {
  return string.standardize().includes(searchTerm.standardize());
};

String.prototype.standardize = function (): string {
  return this.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

interface MatchedContentProps {
  entity: SearchResultEntityDAO;
  searchTerm: string;
}
