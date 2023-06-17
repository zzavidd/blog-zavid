import { Container, Skeleton, Stack, Typography } from '@mui/material';
import type { Grid2Props } from '@mui/material/Unstable_Grid2';
import Grid from '@mui/material/Unstable_Grid2';
import { DiaryStatus } from '@prisma/client';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

import Paragraph from 'components/Typography/Paragraph';
import { useAppSelector } from 'utils/reducers';
import { trpc } from 'utils/trpc';

import DiaryEachItem, { DiaryEachSkeleton } from '../DiaryEachItem';
import DiaryToolbar from './DiaryToolbar';

const DIARY_HEADING = "Zavid's Diary";

export default function DiaryIndex() {
  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      sx={{ overflow: 'hidden' }}>
      <Stack>
        <Container maxWidth={'sm'}>
          <Stack alignItems={'center'} spacing={3} px={3} py={5}>
            <Typography variant={'h2'} textTransform={'uppercase'}>
              {DIARY_HEADING}
            </Typography>
            <DiaryPagePreamble />
          </Stack>
        </Container>
        <DiaryToolbar />
        <Stack alignItems={'center'} spacing={3} px={3} py={5}>
          <DiaryCollection />
        </Stack>
      </Stack>
    </Container>
  );
}

/**
 * The list of diary entries displayed in a grid.
 */
export function DiaryCollection() {
  const { filter, sort } = useAppSelector((state) => state.diary);
  const {
    data: diaryEntries,
    error,
    isLoading,
  } = trpc.diary.findMany.useQuery({
    params: {
      orderBy: sort,
      include: { categories: true },
      where: { ...filter, status: DiaryStatus.PUBLISHED },
    },
    options: {
      contentWordLimit: 20,
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  const gridProps: Grid2Props = {
    columns: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    columnSpacing: { xs: 3, lg: 5 },
    container: true,
    rowSpacing: 3,
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

/**
 * The preamble for the diary page.
 */
export function DiaryPagePreamble() {
  const { data: page, isLoading } = trpc.page.find.useQuery({
    where: { slug: 'diary' },
  });

  if (isLoading) {
    return (
      <Stack alignItems={'center'} width={'100%'}>
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'80%'} />
      </Stack>
    );
  }

  if (!page) return null;
  return (
    <Paragraph variant={'preamble'} textAlign={'center'}>
      {page.content}
    </Paragraph>
  );
}
