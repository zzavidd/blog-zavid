import { DiaryStatus, type Prisma } from '@prisma/client';
import { type TRPCClientErrorLike } from '@trpc/client';
import { type UseTRPCQueryResult } from '@trpc/react-query/shared';
import { type inferRouterOutputs } from '@trpc/server';
import immutate from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';

import { DiaryFindManySchema } from 'schemas/schemas';
import { type AppRouter } from 'server/routers/_app.router';
import { useAppSelector } from 'utils/reducers';
import { trpc } from 'utils/trpc';

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

export function useDiaryEntries(
  searchTerm?: string,
): UseTRPCQueryResult<
  inferRouterOutputs<AppRouter>['diary']['findMany'],
  TRPCClientErrorLike<AppRouter>
> {
  const { enqueueSnackbar } = useSnackbar();
  const { filter, sort } = useAppSelector((state) => state.diary);

  let params = DiaryFindManySchema.parse({
    orderBy: sort,
    include: { categories: true },
    where: { ...filter, status: DiaryStatus.PUBLISHED },
  });

  if (searchTerm) {
    const query = `"${searchTerm}"`;
    params = immutate(params, {
      where: (where) => ({
        ...where,
        OR: [
          { title: { search: query } },
          { content: { search: query } },
          { footnote: { search: query } },
          { tags: { array_contains: searchTerm } },
        ],
      }),
    });
  }

  const result = trpc.diary.findMany.useQuery({
    params,
    options: {
      contentWordLimit: 20,
      searchTerm,
    },
  });

  useEffect(() => {
    if (result.error) {
      enqueueSnackbar(result.error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, result.error]);

  return result;
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
