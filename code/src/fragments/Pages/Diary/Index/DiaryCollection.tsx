import { Stack, Typography } from '@mui/material';
import type { Grid2Props } from '@mui/material/Unstable_Grid2';
import Grid from '@mui/material/Unstable_Grid2';
import { DiaryStatus } from '@prisma/client';
import immutate from 'immutability-helper';
import { useSnackbar } from 'notistack';
import { useContext, useEffect } from 'react';

import { DiaryFindManySchema } from 'schemas/schemas';
import { useAppSelector } from 'utils/reducers';
import { trpc } from 'utils/trpc';

import DiaryEachItem, { DiaryEachSkeleton } from '../DiaryEachItem';

import { DiaryIndexContext } from './DiaryIndex.context';

export default function DiaryCollection() {
  const { searchTerm } = useContext(DiaryIndexContext);
  const { data: diaryEntries, isLoading } = useDiaryEntries(searchTerm);

  const gridProps: Grid2Props = {
    columns: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    columnSpacing: { xs: 3, lg: 5 },
    container: true,
    rowSpacing: 3,
    width: '100%',
  };

  if (isLoading) {
    return (
      <Grid {...gridProps} width={'100%'}>
        {Array(10)
          .fill(null)
          .map((_, key) => (
            <DiaryEachSkeleton key={key} />
          ))}
      </Grid>
    );
  }

  if (!diaryEntries?.length) {
    return (
      <Stack py={9}>
        <Typography variant={'body1'} textAlign={'center'}>
          No diary entries found.
        </Typography>
      </Stack>
    );
  }

  return (
    <Grid {...gridProps}>
      {diaryEntries.map((entry) => (
        <DiaryEachItem entry={entry} key={entry.id} />
      ))}
    </Grid>
  );
}

function useDiaryEntries(searchTerm?: string) {
  const { enqueueSnackbar } = useSnackbar();
  const { filter, sort } = useAppSelector((state) => state.diary);

  let params = DiaryFindManySchema.parse({
    orderBy: sort,
    include: { categories: true },
    where: { ...filter, status: DiaryStatus.PUBLISHED },
  });

  if (searchTerm) {
    params = immutate(params, {
      orderBy: {
        $set: {
          _relevance: {
            fields: ['title', 'content', 'footnote'],
            search: searchTerm,
            sort: 'asc',
          },
        },
      },
      where: (where) => ({
        ...where,
        OR: [
          {
            title: { search: searchTerm },
          },
          { content: { search: searchTerm } },
          { footnote: { search: searchTerm } },
          { tags: { array_contains: searchTerm } },
        ],
      }),
    });
  }

  const { error, ...result } = trpc.diary.findMany.useQuery({
    params,
    options: {
      contentWordLimit: 20,
    },
  });

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  return result;
}
