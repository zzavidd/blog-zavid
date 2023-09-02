import type { Prisma } from '@prisma/client';
import React from 'react';

import { useAppSelector } from 'utils/reducers';

import type { DiaryIndexProps } from './DiaryIndex';

export const DiaryIndexContext = React.createContext<DiaryIndexProps>({
  params: {},
  searchTerm: '',
});

export enum SortOption {
  RELEVANT,
  NEWEST,
  OLDEST,
}

export function useSortMenuOptions(
  searchTerm: string,
): Record<SortOption, SortMenuOption> {
  const { sort } = useAppSelector((state) => state.diary);

  return {
    [SortOption.RELEVANT]: {
      label: 'Most relevant',
      value: {
        _relevance: {
          fields: ['title', 'content', 'footnote'],
          search: searchTerm,
          sort: 'desc',
        },
      },
      selected: !!sort._relevance,
      hideOption: !searchTerm,
    },
    [SortOption.NEWEST]: {
      label: 'Newest first',
      value: { entryNumber: 'desc' },
      selected: sort.entryNumber === 'desc',
    },
    [SortOption.OLDEST]: {
      label: 'Oldest first',
      value: { entryNumber: 'asc' },
      selected: sort.entryNumber === 'asc',
    },
  };
}

interface SortMenuOption {
  label: string;
  value: Prisma.DiaryOrderByWithRelationAndSearchRelevanceInput;
  selected: boolean;
  hideOption?: boolean;
}
